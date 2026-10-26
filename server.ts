import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Gemini API client (automatically picks up GEMINI_API_KEY from environment)
const ai = new GoogleGenAI();

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

// Endpoint for smart AI chatbot
app.post("/api/chat", async (req, res) => {
  const { message, history, clientKnowledge, clientName } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Mensagem inválida" });
    return;
  }

  // 0. Cache lookup for fast repeated queries
  const cacheKey = getCacheKey(message, clientName);
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    res.setHeader("X-Cache", "HIT");
    res.json({ reply: cached.reply, cached: true });
    return;
  }

  res.setHeader("X-Cache", "MISS");

  try {
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

    // Add recent history if available
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

    const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let reply = "";

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        if (response.text) {
          reply = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} attempt failed:`, err?.message || err);
      }
    }

    if (reply) {
      if (responseCache.size >= MAX_CACHE_SIZE) {
        const firstKey = responseCache.keys().next().value;
        if (firstKey) responseCache.delete(firstKey);
      }
      responseCache.set(cacheKey, { reply, timestamp: Date.now() });
    }

    res.json({ reply, cached: false });
  } catch (error: any) {
    console.error("Gemini API Error:", error?.message || error);
    // Return graceful fallback message
    res.json({
      reply: "No momento nosso sistema de IA está passando por instabilidade momentânea. Por favor, clique no botão abaixo para falar diretamente no WhatsApp!",
      isFallback: true,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
