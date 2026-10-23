import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI();

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
        console.warn(`Netlify: Model ${model} failed:`, err?.message);
      }
    }

    if (!reply) {
      reply = "Olá! Agradecemos pelo contato. Como podemos ajudar? Se preferir falar diretamente com um atendente humano sobre pedidos ou orçamentos, clique no botão do WhatsApp abaixo!";
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };
  } catch (error: any) {
    console.error("Netlify Function Error:", error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply: "Olá! Nosso atendente virtual está temporariamente indisponível. Por favor, clique no botão do WhatsApp abaixo para falar conosco diretamente!",
        isFallback: true,
      }),
    };
  }
};
