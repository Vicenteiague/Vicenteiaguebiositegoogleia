import { GoogleGenAI } from "@google/genai";

interface CacheEntry {
  reply: string;
  timestamp: number;
}

const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours TTL
const MAX_CACHE_SIZE = 500;

function getCacheKey(msg: string, clientName?: string): string {
  const normalized = msg
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[?!.,;]/g, "");
  return `${clientName || "default"}:${normalized}`;
}

export const handler = async (event: any) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let body: any = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "JSON inválido" }),
    };
  }

  const { message, history, clientKnowledge, clientName } = body;

  if (!message || typeof message !== "string") {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Mensagem obrigatória" }),
    };
  }

  // 0. Cache lookup for fast repeated queries
  const cacheKey = getCacheKey(message, clientName);
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      statusCode: 200,
      headers: { ...headers, "X-Cache": "HIT" },
      body: JSON.stringify({ reply: cached.reply, cached: true }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `Você é a LIA, a assistente virtual inteligente oficial.
Seu objetivo é tirar dúvidas, apresentar os serviços e produtos e ajudar os clientes a encontrar a melhor solução com simpatia, rapidez e clareza em português do Brasil.
Apresente-se com alegria como LIA 👋.

BANCO DE DADOS 1 - CONECTACARD, BIOSITEAI & START MKT LOCAL:
O BiositeAi é um mini site inteligente com biosite interativo, atendente virtual LIA com IA, cartões NFC e plaquinhas com QR Code.
Serviços: Criação de Sites profissionais, Cartão NFC Infinito personalizado, Plaquinhas NFC e QR Code, Placas de avaliação do Google (AvaliaCard), Biosite com atendente virtual e IA, Gestão de Perfil Google Meu Negócio, SEO e Tráfego Pago.
Empresa localizada em Ponta Porã (MS), atendendo presencialmente toda a fronteira e enviando cartões para todo o Brasil via Correios.
Contato Conectacard: WhatsApp (67) 99317-4612, Site: https://www.startmktlocal.com.br/

NOSSOS PREÇOS BIOSITEAI:
1. Biosites sem Chatbot somente o link: Preço promocional R$ 99,00
2. Biosites com Chatbot e atendente Virtual + Plaquinha NFC ou Cartão NFC: R$ 147,00 + manutenção do Chatbot Atendente virtual IA a partir de R$ 49,90 Mês.
Sempre que perguntarem sobre preços, valores, planos ou quanto custa o biosite/cartão, informe esses dois planos com os valores exatos!

BANCO DE DADOS 2 - SUPERLIMPO PRODUTOS DE LIMPEZA:
Somos a Superlimpo vendemos produtos de limpeza.
WhatsApp: (67) 99834-2469
Link WhatsApp: https://api.whatsapp.com/send?phone=5567998342469
Nosso Site: https://superlimpoprodutosdelimpeza.lovable.app/
Não tem loja física. Apenas entrega em toda região de Ponta Porã e Pedro Juan Caballero.
Horários de entrega: As entregas são feitas até às 16 horas. Aos sábados somente às 7:00 horas e às 15:30 horas.
Nota Fiscal: Não temos Nota Fiscal apenas Recibo.
Taxa de entrega: Dependendo da distância e do pedido existe uma pequena taxa de entrega. Mas a maioria das entregas não tem custo.

Tabela de produtos Superlimpo:
Linha dona de casa:
- Kit de Produto com (Água sanitária 5L, Desinfetante 5L e Sabão de álcool 5L) todos os 3 por R$ 38,00
- Água sanitária 5 litros: R$ 12,00
- Cloro Ativo 12% 5 litros: R$ 45,00
- Desinfetante Perfumado 5 litros: R$ 15,00
- Sabão de álcool (Feito com óleo novo) 5 litros: R$ 15,00
- Sabão Lava Roupas Azul: R$ 35,00
- Amaciante de roupa 5 litros: R$ 25,00
- Alvejante sem cloro 5 litros (Tipo Vanish): R$ 30,00
- Lava louças 5 litros: R$ 25,00
- Limpa Pedras 5 litros: R$ 30,00
- Limpa Porcelanato & Cerâmica 5 litros: R$ 30,00

Linha empresas:
- Limpa Chapas 5 litros: R$ 30,00
- Brilho alumínio 5 litros: R$ 30,00
- Shampoo Automotivo 5 litros: R$ 30,00
- Desengraxante Automotivo 5 litros: R$ 30,00
- Ativado 5L: R$ 30,00

DIRETRIZES CRÍTICAS:
- NÃO INVENTAR. NÃO ALUCINAR.
- SE NÃO SOUBER a resposta com certeza absoluta, diga exatamente: "Vou passar para o atendimento humano: https://api.whatsapp.com/send?phone=5567998342469".
- Seja sempre educada, prestativa e concisa.`;

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const h of history.slice(-6)) {
          if (h.text && (h.role === "user" || h.role === "assistant")) {
            contents.push({
              role: h.role === "user" ? "user" : "model",
              parts: [{ text: h.text }],
            });
          }
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
      let reply = "";

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.3,
              maxOutputTokens: 200,
            },
          });
          if (response.text) {
            reply = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`Netlify: Model ${model} failed:`, err?.message);
        }
      }

      if (reply) {
        if (responseCache.size >= MAX_CACHE_SIZE) {
          const firstKey = responseCache.keys().next().value;
          if (firstKey) responseCache.delete(firstKey);
        }
        responseCache.set(cacheKey, { reply, timestamp: Date.now() });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ reply, cached: false }),
        };
      }
    } catch (error: any) {
      console.error("Netlify Function Error:", error);
    }
  }

  // Fallback matching if no API key is configured on Netlify
  const q = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  let reply = 'Vou passar para o atendimento humano: https://api.whatsapp.com/send?phone=5567998342469';

  if (q.includes("horario") || q.includes("que horas") || q.includes("sabado") || (q.includes("entrega") && (q.includes("hora") || q.includes("quando")))) {
    reply = "As entregas da Superlimpo são feitas até às 16 horas. Aos sábados somente às 7:00 horas e às 15:30 horas em Ponta Porã e Pedro Juan Caballero.";
  } else if (q.includes("nota") || q.includes("fiscal") || q.includes("recibo") || q.includes("comprovante")) {
    reply = "Não temos Nota Fiscal, apenas Recibo.";
  } else if (q.includes("taxa") || q.includes("frete") || (q.includes("quanto") && q.includes("entrega"))) {
    reply = "Dependendo da distância e do pedido existe uma pequena taxa de entrega. Mas a maioria das entregas não tem custo!";
  } else if (q.includes("loja") || q.includes("fisica") || q.includes("onde comprar")) {
    reply = "Não temos loja física. Trabalhamos apenas com entregas em toda região de Ponta Porã e Pedro Juan Caballero.";
  } else if (q.includes("superlimpo") || q.includes("limpeza") || q.includes("sabao") || q.includes("desinfetante") || q.includes("cloro") || q.includes("amaciante")) {
    reply = "Tabela Superlimpo — Linha dona de casa: Kit com 3 galões 5L (Água sanitária + Desinfetante + Sabão de álcool) por R$ 38,00! Avulsos 5L: Água sanitária R$ 12, Cloro 12% R$ 45, Desinfetante R$ 15, Sabão de álcool R$ 15, Sabão Lava Roupas R$ 35, Amaciante R$ 25, Alvejante sem cloro R$ 30, Lava louças R$ 25, Limpa Pedras R$ 30, Limpa Porcelanato R$ 30. Linha empresas (5L por R$ 30): Limpa Chapas, Brilho Alumínio, Shampoo Automotivo, Desengraxante e Ativado. WhatsApp Superlimpo: https://api.whatsapp.com/send?phone=5567998342469";
  } else if (q.includes("como funciona") || q.includes("nfc") || q.includes("aproximac") || q.includes("cartao nfc") || q.includes("funciona o cartao")) {
    reply = "O Cartão NFC Conectacard possui chip por aproximação. Basta encostar o cartão na parte traseira de qualquer celular moderno com NFC (iPhone ou Android) e o seu biosite abre na hora com seus contatos, catálogo e redes sociais, sem precisar instalar nenhum aplicativo!";
  } else if (q.includes("servico") || q.includes("o que a empresa oferece") || q.includes("o que voces fazem")) {
    reply = "A Start Mkt Local e Conectacard oferecem: Criação de Sites profissionais, Cartão NFC Infinito personalizado, Plaquinhas QR Code/NFC, AvaliaCard (avaliações 5 estrelas no Google), Gestão de Perfil Google, SEO e Tráfego Pago. Além disso, temos a distribuidora Superlimpo de produtos de limpeza direto de fábrica!";
  } else if (q.includes("quanto custa") || q.includes("preco") || q.includes("valor") || q.includes("tabela") || q.includes("orcamento") || q.includes("plano") || q.includes("promocao") || q.includes("quanto e")) {
    reply = "Nossos Preços:\n\n1️⃣ Biosites sem Chatbot somente o link: Preço promocional R$ 99,00\n\n2️⃣ Biosites com Chatbot e atendente Virtual + Plaquinha NFC ou Cartão NFC: R$ 147,00 + manutenção do Chatbot Atendente virtual IA a partir de R$ 49,90 Mês.\n\nPeça o seu pelo WhatsApp: https://wa.me/5567993174612";
  } else if (q.includes("biosite") || q.includes("biositeai") || q.includes("mini site")) {
    reply = "O BiositeAi é um mini site inteligente completo com atendente virtual LIA com inteligência artificial, cartões NFC e plaquinhas com QR Code!\n\nNossos Preços:\n1️⃣ Biosites sem Chatbot somente o link: Preço promocional R$ 99,00\n2️⃣ Biosites com Chatbot e atendente Virtual + Plaquinha NFC ou Cartão NFC: R$ 147,00 + manutenção do Chatbot Atendente virtual IA a partir de R$ 49,90 Mês.\n\nPeça o seu pelo WhatsApp: https://wa.me/5567993174612";
  } else if (q.includes("contato") || q.includes("whatsapp") || q.includes("telefone") || q.includes("falar") || q.includes("humano")) {
    reply = "Para atendimento de produtos de limpeza Superlimpo: WhatsApp https://api.whatsapp.com/send?phone=5567998342469 (67) 99834-2469. Para Cartões NFC e serviços de marketing: WhatsApp (67) 99317-4612.";
  }

  if (responseCache.size >= MAX_CACHE_SIZE) {
    const firstKey = responseCache.keys().next().value;
    if (firstKey) responseCache.delete(firstKey);
  }
  responseCache.set(cacheKey, { reply, timestamp: Date.now() });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ reply, cached: false }),
  };
};
