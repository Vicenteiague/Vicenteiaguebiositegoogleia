import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI();

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message, history, clientKnowledge, clientName } = req.body || {};

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Mensagem obrigatória" });
    return;
  }

  try {
    const systemInstruction = `Você é o assistente virtual oficial e humanizado de "${clientName || "Conectacard Cartão NFC"}".
Seu objetivo é responder dúvidas com rapidez, educação, clareza e empatia em português do Brasil.
Use prioritariamente a base de conhecimento abaixo para responder:

BASE DE CONHECIMENTO DA EMPRESA:
${clientKnowledge || "Atendimento rápido, cartões NFC personalizados e suporte pelo WhatsApp."}

Diretrizes:
- Responda de forma direta e concisa (1 a 3 parágrafos curtos).
- Se a pergunta for sobre preços, serviços ou produtos específicos descritos na base, forneça os detalhes exatos.
- Se a pergunta solicitar orçamento sob medida ou dúvidas não listadas, convide gentilmente a pessoa a clicar no botão do WhatsApp.
- Seja sempre cortês e prestativo.`;

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
        console.warn(`Model ${model} failed on Vercel:`, err?.message);
      }
    }

    if (!reply) {
      reply = "Olá! Agradecemos pelo contato. Como podemos ajudar? Se preferir falar diretamente com um atendente humano sobre pedidos ou orçamentos, clique no botão do WhatsApp abaixo!";
    }

    res.status(200).json({ reply });
  } catch (error: any) {
    console.error("Vercel Chat Error:", error);
    res.status(200).json({
      reply: "Olá! Nosso atendente virtual está temporariamente indisponível. Por favor, clique no botão do WhatsApp abaixo para falar conosco diretamente!",
      isFallback: true,
    });
  }
}
