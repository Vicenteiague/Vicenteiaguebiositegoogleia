import { conectacardData, type BiositeData } from "./conectacard";

export const allClients: Record<string, BiositeData> = {
  // 1. Modelo Oficial BiositesAI / Teste Geral
  "biositesai": conectacardData,
  "biosite": conectacardData,
  "teste": conectacardData,
  "start-mkt-local": conectacardData,
  "demo": conectacardData,

  // 2. Modelo Pizzaria & Gastronomia
  "pizzaria": {
    slug: "pizzaria",
    banner: {
      src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
      alt: "Pizzaria Forneria Artesanal"
    },
    avatar: {
      src: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=300&q=80",
      alt: "Logo Forno di Napoli"
    },
    name: "Forno di Napoli Pizzaria",
    bio: "🍕 PIZZAS ARTESANAIS NO FORNO A LENHA COM MASSA DE FERMENTAÇÃO NATURAL! COMBOS FAMÍLIA, REFRIGERANTE GRÁTIS E ENTREGA RÁPIDA E QUENTINHA NA SUA PORTA. FAÇA SEU PEDIDO PELO WHATSAPP! 🛵💨",
    video: {
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Como preparamos a autêntica pizza napolitana",
      poster: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80"
    },
    produtos: {
      title: "🍕 COMBOS EM PROMOÇÃO HOJE",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80",
      url: "https://wa.me/5567993174612?text=Olá!%20Quero%20fazer%20o%20pedido%20do%20Combo%20Família!"
    },
    catalogo: {
      title: "Cardápio Destaque",
      items: [
        {
          id: "p1",
          title: "Pizza Margherita Especial",
          price: "R$ 49,90",
          image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=80",
          description: "Molho de tomate pelado, mussarela de búfala, manjericão fresco e azeite trufado."
        },
        {
          id: "p2",
          title: "Calabresa com Cebola Roxa",
          price: "R$ 44,90",
          image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=500&q=80",
          description: "Calabresa defumada artesanal, cebola roxa caramelizada e azeitonas pretas chilenas."
        },
        {
          id: "p3",
          title: "Quatro Queijos Nobres",
          price: "R$ 54,90",
          image: "https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=500&q=80",
          description: "Mussarela, provolone defumado, gorgonzola italiano e requeijão cremoso."
        },
        {
          id: "p4",
          title: "Pizza Doce Nutella com Morango",
          price: "R$ 39,90",
          image: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=500&q=80",
          description: "Generosa camada de Nutella original com morangos frescos e raspas de chocolate belga."
        }
      ]
    },
    linksTitulo: "Fazer Pedido & Redes",
    links: [
      {
        id: "l-wa",
        title: "Pedir pelo WhatsApp",
        url: "https://wa.me/5567993174612?text=Olá,%20gostaria%20de%20ver%20o%20cardápio%20e%20fazer%20um%20pedido!",
        image: "/assets/whatsapp-refined-CgyhsBcW.jpg"
      },
      {
        id: "l-mapa",
        title: "Nossa Localização",
        url: "https://maps.google.com/?q=Ponta+Pora+MS",
        image: "/assets/location-refined-DWPeLfoT.jpg"
      },
      {
        id: "l-insta",
        title: "Instagram da Pizzaria",
        url: "https://instagram.com",
        image: "/assets/instagram-refined-BsHeVKuq.jpg"
      },
      {
        id: "l-google",
        title: "Avalie no Google (5 Estrelas)",
        url: "https://maps.google.com",
        image: "/assets/review-refined-BTSPoTYD.jpg"
      }
    ],
    atendimento: {
      saudacao: "Olá! Como posso ajudar você hoje com pedidos e cardápio da Pizzaria Forno di Napoli?",
      conhecimento: `Forno di Napoli Pizzaria em Ponta Porã MS.
Horário de atendimento: Quarta a Domingo das 18h às 23h30.
Pizzas grandes de 8 fatias a partir de R$ 44,90.
Combo Família: 1 Pizza Grande + 1 Pizza Broto Doce + 1 Coca-Cola 2L por apenas R$ 79,90.
Entrega em toda Ponta Porã e Pedro Juan Caballero com tempo médio de 35 a 45 minutos.
Formas de pagamento: Pix, Cartão de Crédito/Débito e Dinheiro.`,
      empresa: [
        {
          id: "pe1",
          pergunta: "Qual o horário de funcionamento?",
          resposta: "Abrimos de quarta a domingo das 18h00 às 23h30 para entregas e retirada no balcão!"
        },
        {
          id: "pe2",
          pergunta: "Vocês entregam em Pedro Juan Caballero?",
          resposta: "Sim! Fazemos entregas tanto em Ponta Porã quanto em Pedro Juan Caballero com entrega rápida de 35 a 45 minutos."
        },
        {
          id: "pe3",
          pergunta: "Quais as formas de pagamento?",
          resposta: "Aceitamos Pix, cartões de crédito e débito de todas as bandeiras e dinheiro."
        }
      ],
      produtos: [
        {
          id: "pp1",
          pergunta: "Tem combo com refrigerante hoje?",
          resposta: "Sim! Nosso Combo Família inclui 1 Pizza Grande Salgada + 1 Broto Doce + 1 Coca-Cola 2L por apenas R$ 79,90!"
        },
        {
          id: "pp2",
          pergunta: "A massa é fina ou grossa?",
          resposta: "Nossa massa é artesanal de fermentação lenta (48h), leve, crocante na borda e macia no centro, assada no forno a lenha."
        }
      ]
    },
    mapa: {
      title: "Forno di Napoli Pizzaria - Ponta Porã MS",
      embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14603.22014073386!2d-55.7275062!3d-22.5358055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9462709e9f9c735b%3A0xc344799e030b490f!2sPonta%20Por%C3%A3%2C%20MS!5e0!3m2!1spt-BR!2sbr!4v1711200000000!5m2!1spt-BR!2sbr",
      link: "https://maps.google.com/?q=Ponta+Pora+MS"
    },
    contato: {
      local: "Av. Brasil - Centro, Ponta Porã MS",
      telefone: "67993174612",
      email: "pedidos@fornodinapoli.com.br"
    },
    footer: "Forno di Napoli Pizzaria · Conectacard NFC"
  },

  // 3. Modelo Farmácia & Drogaria
  "farmacia": {
    slug: "farmacia",
    banner: {
      src: "https://images.unsplash.com/photo-1586015555751-63c299908cf0?auto=format&fit=crop&w=1200&q=80",
      alt: "Drogaria Mais Saúde"
    },
    avatar: {
      src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=300&q=80",
      alt: "Logo Drogaria Mais Saúde"
    },
    name: "Drogaria Mais Saúde",
    bio: "💊 FARMÁCIA COMPLETA COM MEDICAMENTOS, DERMOCOSMÉTICOS, SUPLEMENTOS E PERFUMARIA. PLANTÃO ATÉ AS 23H COM ENTREGA EXPRESSA EM ATÉ 30 MINUTOS NA SUA CASA! ENVIE SUA RECEITA PELO WHATSAPP! 🩺📲",
    produtos: {
      title: "🩺 ENVIE SUA RECEITA MÉDICA",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80",
      url: "https://wa.me/5567993174612?text=Olá!%20Gostaria%20de%20enviar%20uma%20receita%20médica%20para%20cotação!"
    },
    catalogo: {
      title: "Ofertas da Semana",
      items: [
        {
          id: "f1",
          title: "Kit Vitamina C + Zinco (60 caps)",
          price: "R$ 29,90",
          image: "https://images.unsplash.com/photo-1550572017-edb20117094b?auto=format&fit=crop&w=500&q=80",
          description: "Auxilia na imunidade diária e ação antioxidante para toda a família."
        },
        {
          id: "f2",
          title: "Protetor Solar FPS 70 Facial",
          price: "R$ 49,90",
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",
          description: "Toque seco anti-oleosidade, alta proteção UVA/UVB resistente à água."
        },
        {
          id: "f3",
          title: "Ômega 3 Puro Concentrado (120 caps)",
          price: "R$ 59,90",
          image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=500&q=80",
          description: "Auxilia na saúde cardiovascular, cerebral e articulações."
        },
        {
          id: "f4",
          title: "Fralda Descartável Mega Pack",
          price: "R$ 64,90",
          image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=500&q=80",
          description: "Até 12 horas de proteção sequinha dia e noite para bebês."
        }
      ]
    },
    linksTitulo: "Atendimento & Farmácia",
    links: [
      {
        id: "f-wa",
        title: "Enviar Receita no WhatsApp",
        url: "https://wa.me/5567993174612?text=Olá!%20Gostaria%20de%20saber%20o%20preço%20de%20um%20medicamento.",
        image: "/assets/whatsapp-refined-CgyhsBcW.jpg"
      },
      {
        id: "f-mapa",
        title: "Nossa Farmácia no Mapa",
        url: "https://maps.google.com/?q=Ponta+Pora+MS",
        image: "/assets/location-refined-DWPeLfoT.jpg"
      },
      {
        id: "f-insta",
        title: "Dicas de Saúde no Instagram",
        url: "https://instagram.com",
        image: "/assets/instagram-refined-BsHeVKuq.jpg"
      },
      {
        id: "f-google",
        title: "Avalie Nosso Atendimento",
        url: "https://maps.google.com",
        image: "/assets/review-refined-BTSPoTYD.jpg"
      }
    ],
    atendimento: {
      saudacao: "Olá! Como posso ajudar você hoje com medicamentos e dúvidas da Drogaria Mais Saúde?",
      conhecimento: `Drogaria Mais Saúde em Ponta Porã MS.
Horário de atendimento: Aberto todos os dias das 07h00 às 23h00 (incluindo domingos e feriados).
Serviços disponíveis: Aplicação de injetáveis, medição de pressão arterial gratuita, teste de glicemia e entrega expressa de remédios.
Entrega de medicamentos em Ponta Porã em até 30 minutos.
Trabalhamos com genéricos com até 70% de desconto.`,
      empresa: [
        {
          id: "fe1",
          pergunta: "Vocês funcionam aos domingos e feriados?",
          resposta: "Sim! Abrimos todos os dias, de domingo a domingo e feriados, das 07h00 às 23h00 ininterruptamente."
        },
        {
          id: "fe2",
          pergunta: "Como faço para cotar uma receita médica?",
          resposta: "Basta tirar uma foto da sua receita e nos enviar pelo WhatsApp! Nossa equipe de farmacêuticos responde em menos de 2 minutos com os valores e opções de genéricos."
        },
        {
          id: "fe3",
          pergunta: "Fazem entrega rápida?",
          resposta: "Sim! Nosso motoboy entrega em qualquer bairro de Ponta Porã em média em 20 a 30 minutos."
        }
      ],
      produtos: [
        {
          id: "fp1",
          pergunta: "Vocês medem pressão e fazem teste de glicemia?",
          resposta: "Sim, realizamos aferição de pressão arterial gratuita e teste de glicemia no balcão com nossos farmacêuticos."
        },
        {
          id: "fp2",
          pergunta: "Têm descontos em genéricos?",
          resposta: "Sim! Temos descontos de até 70% na linha de medicamentos genéricos e similares."
        }
      ]
    },
    mapa: {
      title: "Drogaria Mais Saúde - Ponta Porã MS",
      embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14603.22014073386!2d-55.7275062!3d-22.5358055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9462709e9f9c735b%3A0xc344799e030b490f!2sPonta%20Por%C3%A3%2C%20MS!5e0!3m2!1spt-BR!2sbr!4v1711200000000!5m2!1spt-BR!2sbr",
      link: "https://maps.google.com/?q=Ponta+Pora+MS"
    },
    contato: {
      local: "Centro, Ponta Porã MS",
      telefone: "67993174612",
      email: "contato@drogariamaissaude.com.br"
    },
    footer: "Drogaria Mais Saúde · Conectacard NFC"
  },

  // 4. Modelo Distribuidora / Loja Superlimpo
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
    footer: "Superlimpo Produtos de Limpeza · Conectacard NFC"
  }
};

export function getClientData(slug?: string | null): BiositeData {
  if (slug && allClients[slug]) {
    return allClients[slug];
  }
  return conectacardData;
}
