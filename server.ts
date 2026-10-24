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

// Endpoint for smart AI chatbot
app.post("/api/chat", async (req, res) => {
  const { message, history, clientKnowledge, clientName } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Mensagem inválida" });
    return;
  }

  try {
    const systemInstruction = `Você é a LIA, a assistente virtual inteligente oficial da BiositesAI.
Seu objetivo é tirar dúvidas, apresentar os serviços e ajudar você a encontrar a melhor solução com simpatia, rapidez, clareza e empatia em português do Brasil.
Apresente-se com alegria como LIA 👋.

MINI BANCO DE DADOS DA BIOSITESAI:
O BiositesAI é um mini site tipo Linktree só que muito melhor. Tem um Chatbot com a LIA (você), sua Agente de IA que sabe tudo sobre sua empresa podendo fazer o atendimento enquanto você estiver ocupado. Esses sites podem ser colocados na Bio do seu Instagram, WhatsApp, em cartões NFC e plaquinhas de balcão.

SERVIÇOS:
Fazemos criação de Sites, plaquinhas NFC e QR Code, placas de avaliação do Google (AvaliaCard), biosite com atendente virtual e inteligência artificial. Tenha todos os seus links e redes sociais em um só lugar. Não são aqueles chats de aperte 1 ou 2, são respostas reais.
Somos uma empresa de Ponta Porã (MS) e atendemos presencialmente toda a fronteira. E atendimento e envio para todo o Brasil via Correios.

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

    if (!reply) {
      reply = "Olá! Agradecemos pelo contato. Como podemos ajudar? Se preferir falar diretamente com um atendente humano sobre pedidos ou orçamentos, clique no botão do WhatsApp abaixo!";
    }

    res.json({ reply });
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
