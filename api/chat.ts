import { GoogleGenAI } from "@google/genai";

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

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  // 1. If API key is configured on Vercel, use Gemini AI
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
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
          console.warn(`Model ${model} failed:`, err?.message);
        }
      }

      if (reply) {
        res.status(200).json({ reply });
        return;
      }
    } catch (error: any) {
      console.error("Gemini API call error:", error?.message || error);
    }
  }

  // 2. Intelligent fallback if API key is not yet added in Vercel settings
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

  res.status(200).json({ reply });
}
