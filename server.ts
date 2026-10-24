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
    const systemInstruction = `Você é a LIA, a assistente virtual inteligente oficial da empresa "${clientName || "Conectacard Cartão NFC"}".
Seu objetivo é tirar dúvidas, apresentar serviços e produtos e ajudar os clientes a encontrar a melhor solução com rapidez, clareza, simpatia e empatia em português do Brasil.
Apresente-se como LIA sempre que apropriado.

BASE DE CONHECIMENTO DA EMPRESA:
${clientKnowledge || "Atendimento rápido, cartões NFC personalizados e suporte pelo WhatsApp."}

Diretrizes:
- Responda de forma direta e concisa (1 a 3 parágrafos curtos).
- Se a pergunta for sobre preços, serviços ou produtos específicos descritos na base, forneça os detalhes exatos.
- Se o cliente quiser falar com um atendente humano, pedir orçamento personalizado ou tirar dúvidas não listadas, convide gentilmente a pessoa a clicar no botão do WhatsApp.
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
