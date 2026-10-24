import { GoogleGenAI } from "@google/genai";

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

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `Você é a LIA, a assistente virtual inteligente oficial da BiositesAI.
Seu objetivo é tirar dúvidas, apresentar os serviços e ajudar você a encontrar a melhor solução com simpatia, rapidez, clareza e empatia em português do Brasil.
Apresente-se com alegria como LIA 👋.

MINI BANCO DE DADOS DA BIOSITESAI:
O BiositesAI é um mini site tipo Linktree só que muito melhor. Tem um Chatbot com a LIA (você), sua Agente de IA que sabe tudo sobre sua empresa podendo fazer o atendimento enquanto você estiver ocupado. Esses sites podem ser colocados na Bio do seu Instagram, WhatsApp, em cartões NFC e plaquinhas de balcão.

SERVIÇOS:
Fazemos criação de Sites, plaquinhas NFC e QR Code, placas de avaliação do Google (AvaliaCard), biosite com atendente virtual e inteligência artificial. Tenha todos os seus links e redes sociais em um só lugar. Não são aqueles chats de aperte 1 ou 2, são respostas reais.
Somos uma empresa de Ponta Porã (MS) e atendemos presencialmente toda a fronteira. E atendimento e envio a todo Brasil via Correios.

NOSSOS PREÇOS:
1. Biosites sem Chatbot (somente o link): Preço promocional R$ 99,00
2. Biosites com Chatbot e atendente Virtual + Plaquinha NFC ou Cartão NFC: R$ 147,00 + manutenção do Chatbot Atendente virtual IA a partir de R$ 49,90/mês.

O QUE É E COMO FUNCIONA UM CARTÃO NFC:
Um cartão NFC é um cartão inteligente que, ao ser aproximado de um celular, permite abrir um site, compartilhar contatos, acessar redes sociais ou até iniciar uma conversa no WhatsApp — sem precisar digitar nada. É uma tecnologia muito usada em cartões de visita digitais e pagamentos por aproximação.

Diretrizes:
- Responda de forma direta, acolhedora e concisa (1 a 3 parágrafos curtos).
- Se a pergunta for sobre preços, informe os valores exatos: R$ 99 (sem chatbot) ou R$ 147 (com chatbot + NFC) + manutenção a partir de R$ 49,90/mês.
- Se o cliente quiser falar com alguém humano ou fechar pedido, convide com carinho a clicar no botão do WhatsApp.
- Seja sempre cortês, moderna e prestativa.`;

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
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ reply }),
        };
      }
    } catch (error: any) {
      console.error("Netlify Function Error:", error);
    }
  }

  // Fallback if no API key is configured on Netlify
  const q = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  let reply = "Olá! Eu sou a LIA 👋 O BiositesAI é um mini site tipo Linktree só que muito melhor, com Chatbot de IA, cartões NFC e plaquinhas com QR Code. Fale conosco pelo botão do WhatsApp para orçamentos e pedidos!";

  if (q.includes("como funciona") || q.includes("nfc") || q.includes("aproximac") || q.includes("cartao nfc") || q.includes("funciona o cartao")) {
    reply = "Um cartão NFC é um cartão inteligente que, ao ser aproximado de um celular, permite abrir um site, compartilhar contatos, acessar redes sociais ou até iniciar uma conversa no WhatsApp — sem precisar digitar nada. É uma tecnologia muito usada em cartões de visita digitais e pagamentos por aproximação.";
  } else if (q.includes("servico") || q.includes("o que voces fazem") || q.includes("linktree") || q.includes("o que e")) {
    reply = "O BiositesAI é um mini site tipo Linktree só que muito melhor! Tem um Chatbot com a LIA, sua Agente de IA que sabe tudo sobre sua empresa podendo fazer o atendimento enquanto você estiver ocupado. Fazemos criação de Sites, plaquinhas NFC e QR Code, placas de avaliação do Google e biosite com atendente virtual e inteligência artificial.";
  } else if (q.includes("preco") || q.includes("quanto custa") || q.includes("valor") || q.includes("tabela") || q.includes("promocao")) {
    reply = "Nossos Preços BiositesAI:\n1️⃣ Biosites sem Chatbot (somente o link): Preço promocional R$ 99,00\n2️⃣ Biosites com Chatbot e atendente Virtual + Plaquinha NFC ou Cartão NFC: R$ 147,00 + manutenção do Chatbot Atendente virtual IA a partir de R$ 49,90/mês.";
  } else if (q.includes("entrega") || q.includes("onde") || q.includes("endereco") || q.includes("cidade") || q.includes("ponta pora") || q.includes("fronteira")) {
    reply = "Somos uma empresa de Ponta Porã (MS) e atendemos presencialmente toda a fronteira. Também enviamos nossos cartões e placas NFC para todo o Brasil via Correios!";
  } else if (q.includes("contato") || q.includes("whatsapp") || q.includes("telefone") || q.includes("falar") || q.includes("humano")) {
    reply = "Você pode falar diretamente com nossa equipe no WhatsApp (67) 99317-4612. Toque no botão do WhatsApp abaixo para começar!";
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ reply }),
  };
};
