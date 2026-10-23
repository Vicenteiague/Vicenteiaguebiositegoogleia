import { conectacardData, type BiositeData } from "./conectacard";

export const allClients: Record<string, BiositeData> = {
  "start-mkt-local": conectacardData,
  "superlimpo": {
    ...conectacardData,
    slug: "superlimpo",
    name: "Superlimpo Produtos de Limpeza",
    bio: "FÁBRICA E DISTRIBUIÇÃO DE PRODUTOS DE LIMPEZA EM PONTA PORÃ E PEDRO JUAN CABALLERO. ENTREGAS RÁPIDAS DIRETAS NA SUA CASA OU EMPRESA. KITS ECONÔMICOS, DESINFETANTES, SABÃO DE ÁLCOOL E LINHA PROFISSIONAL! 🧼✨",
    avatar: {
      src: "/assets/produtos-superlimpo-2KK8JWDt.png",
      alt: "Logo Superlimpo"
    },
    linksTitulo: "Fale com a Superlimpo",
    contato: {
      local: "Ponta Porã MS e Pedro Juan Caballero",
      telefone: "67998342469",
      email: "superlimpoprodutos@gmail.com"
    },
    footer: "Superlimpo Produtos de Limpeza"
  }
};

export function getClientData(slug?: string | null): BiositeData {
  if (slug && allClients[slug]) {
    return allClients[slug];
  }
  return conectacardData;
}
