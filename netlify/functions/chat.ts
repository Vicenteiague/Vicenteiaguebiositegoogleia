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
      const systemInstruction = `Você é a LIA, a assistente virtual inteligente oficial da empresa "${clientName || "Conectacard Cartão NFC"}".
Seu objetivo é tirar dúvidas, apresentar os serviços e produtos e ajudar os clientes a encontrar a melhor solução com simpatia, rapidez, clareza e empatia em português do Brasil.
Apresente-se com alegria como LIA sempre que apropriado.

BASE DE CONHECIMENTO DA EMPRESA:
${clientKnowledge || "Atendimento rápido, cartões NFC personalizados e suporte pelo WhatsApp."}

Diretrizes:
- Responda de forma direta e concisa (1 a 3 parágrafos curtos).
- Se a pergunta for sobre preços, serviços ou produtos específicos descritos na base, forneça os detalhes exatos.
- Se o cliente quiser falar com um atendente humano, pedir orçamento personalizado ou tirar dúvidas não listadas, convide gentilmente a pessoa a clicar no botão do WhatsApp.
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
  let reply = "Agradecemos o contato! A Conectacard oferece cartões NFC personalizados, biolinks inteligentes e soluções de marketing digital em Ponta Porã e para todo o Brasil. Para orçamentos rápidos e pedidos, fale conosco pelo botão do WhatsApp abaixo!";

  if (q.includes("como funciona") || q.includes("nfc") || q.includes("aproximac") || q.includes("funciona o cartao")) {
    reply = "Com um simples toque do cartão Conectacard em qualquer celular moderno com NFC (iPhone ou Android), seus links, WhatsApp, catálogo e redes sociais abrem instantaneamente na tela, sem necessidade de aplicativo!";
  } else if (q.includes("personaliz") || q.includes("logo") || q.includes("arte") || q.includes("minha marca")) {
    reply = "Sim! Nossos cartões e plaquinhas são 100% personalizados com o logotipo e identidade visual da sua marca ou empresa. Basta nos chamar no WhatsApp para definir o design.";
  } else if (q.includes("preco") || q.includes("quanto custa") || q.includes("valor") || q.includes("tabela") || q.includes("kit")) {
    reply = "Temos o Kit Dona de Casa Superlimpo (Água sanitária 5L, Desinfetante 5L e Sabão de álcool 5L) por apenas R$ 38,00! Para valores dos cartões NFC personalizados e placas para balcão, consulte nossa equipe no WhatsApp (67) 99317-4612!";
  } else if (q.includes("entrega") || q.includes("frete") || q.includes("pedro juan") || q.includes("ponta pora")) {
    reply = "Fazemos entrega de produtos de limpeza em toda Ponta Porã e Pedro Juan Caballero (a maioria sem custo de entrega). E enviamos os Cartões NFC Conectacard para todo o Brasil via Correios com código de rastreio!";
  } else if (q.includes("contato") || q.includes("whatsapp") || q.includes("telefone") || q.includes("falar")) {
    reply = "Você pode falar conosco diretamente pelo WhatsApp (67) 99317-4612 ou pelo e-mail startmktlocal@gmail.com. Estamos prontos para atender você!";
  } else if (q.includes("site") || q.includes("google") || q.includes("seo") || q.includes("trafego") || q.includes("marketing")) {
    reply = "A Start Mkt Local é especializada em Criação de Sites profissionais, Perfil de Empresas no Google Meu Negócio, Otimização de SEO e Tráfego Pago (anúncios no Google e Meta) para alavancar suas vendas.";
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ reply }),
  };
};
