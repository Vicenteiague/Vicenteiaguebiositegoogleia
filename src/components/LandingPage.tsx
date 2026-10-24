import { useState } from "react";
import {
  Smartphone,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Layers,
  ChevronDown,
  Pizza,
  Pill,
  Sparkle
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const niches = [
    {
      id: "teste",
      path: "/teste",
      tag: "OFICIAL",
      title: "Conectacard Oficial",
      category: "Empresas & Negócios",
      description: "Modelo completo com catálogo de produtos, vídeo institucional, botões de ação e chatbot com IA.",
      icon: "🚀",
      accent: "#bef226"
    },
    {
      id: "pizzaria",
      path: "/pizzaria",
      tag: "GASTRONOMIA",
      title: "Pizzaria Forno di Napoli",
      category: "Restaurantes & Lanchonetes",
      description: "Cardápio com fotos, combos em promoção, pedidos no WhatsApp e atendente virtual tirando dúvidas.",
      icon: "🍕",
      accent: "#ff6b35"
    },
    {
      id: "farmacia",
      path: "/farmacia",
      tag: "SAÚDE",
      title: "Drogaria Mais Saúde",
      category: "Farmácias & Clínicas",
      description: "Envio de receitas médicas pelo WhatsApp, catálogo de ofertas, localização e horários de plantão.",
      icon: "💊",
      accent: "#22c55e"
    },
    {
      id: "superlimpo",
      path: "/superlimpo",
      tag: "COMÉRCIO",
      title: "Superlimpo Produtos",
      category: "Lojas & Distribuidoras",
      description: "Venda direta de fábrica, kits econômicos, frete grátis na fronteira e tabela de preços online.",
      icon: "🧼",
      accent: "#38bdf8"
    }
  ];

  const faqs = [
    {
      q: "Como funciona o Cartão NFC Conectacard?",
      a: "O cartão possui um chip interno inteligente de tecnologia NFC. Basta encostar o cartão na traseira de qualquer celular moderno (iPhone ou Android) e o seu biosite abre instantaneamente na tela, sem precisar baixar nenhum aplicativo!"
    },
    {
      q: "E se o celular do cliente não tiver NFC?",
      a: "Todos os cartões Conectacard acompanham um QR Code gravado no verso. O cliente só precisa apontar a câmera do celular para acessar os mesmos links e catálogo."
    },
    {
      q: "Posso ter vários clientes no mesmo domínio?",
      a: "Sim! Com o seu domínio próprio (ex: www.conectacard.com.br), cada cliente que você atender ganha o seu próprio link (ex: /pizzaria, /farmacia, /dr-silva). É esse link que você grava no cartão NFC físico!"
    },
    {
      q: "Como funciona o Atendente Virtual com Inteligência Artificial?",
      a: "Nós configuramos a IA com os dados exatos do seu negócio: tabela de preços, serviços, horários e dúvidas frequentes. Quando o cliente entra no biosite, a IA do Gemini responde com rapidez e cordialidade 24 horas por dia."
    },
    {
      q: "O cartão é personalizado com o meu logotipo?",
      a: "Sim! Desenvolvemos a arte 100% personalizada com a identidade visual da sua empresa, logotipo, cores e acabamento fosco premium de alta durabilidade."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f5f5f5] selection:bg-[#bef226] selection:text-[#121212]">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 bg-[#0e0e0e]/85 backdrop-blur-md border-b border-[#222]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("/")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#bef226] to-[#7be014] flex items-center justify-center text-[#121212] font-black text-lg shadow-lg shadow-[#bef226]/20">
              C
            </div>
            <span className="font-extrabold text-lg tracking-tight font-sans">
              CONECTA<span className="text-[#bef226]">CARD</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#a3a3a3]">
            <a href="#demonstracao" className="hover:text-white transition-colors">Modelos & Testes</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#vantagens" className="hover:text-white transition-colors">Vantagens</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <a href="#faq" className="hover:text-white transition-colors">Dúvidas</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate("/teste")}
              className="text-xs font-bold px-3.5 py-2 rounded-lg bg-[#bef226] text-[#121212] hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md shadow-[#bef226]/20"
            >
              <span>Faça seu teste agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#bef226]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1c1c] border border-[#333] text-xs font-semibold text-[#bef226] mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tecnologia NFC Infinito + Atendente com Inteligência Artificial</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.12] mb-6 font-sans">
            O Cartão de Visitas Inteligente que <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bef226] via-[#9fe820] to-[#5ec900]">conecta e vende</span> com 1 toque
          </h1>

          <p className="text-base sm:text-lg text-[#a3a3a3] max-w-2xl mx-auto leading-relaxed mb-10">
            Apresente sua empresa no seu domínio próprio. Compartilhe contatos, catálogo, localização e redes sociais por aproximação NFC, com um <strong>Atendente Virtual com IA do Google</strong> que tira dúvidas dos seus clientes 24 horas por dia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate("/teste")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#bef226] text-[#121212] font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#bef226]/25 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Faça seu teste agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://wa.me/5567993174612?text=Olá!%20Vim%20pelo%20site%20da%20Conectacard%20e%20quero%20solicitar%20meu%20cartão%20NFC%20personalizado!"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1e1e1e] hover:bg-[#282828] border border-[#333] text-[#f5f5f5] font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#bef226]" />
              <span>Pedir Cartão no WhatsApp</span>
            </a>
          </div>

          {/* Realistic NFC Card Visual */}
          <div className="mt-14 max-w-sm mx-auto relative group">
            <div className="aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#0a0a0a] border border-[#333] p-6 shadow-2xl relative overflow-hidden transition-transform duration-500 group-hover:-translate-y-2 group-hover:border-[#bef226]/50">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#bef226] flex items-center justify-center text-[#121212] font-black text-sm">
                    C
                  </div>
                  <span className="font-bold tracking-wider text-xs">CONECTACARD</span>
                </div>
                <div className="flex items-center gap-1 text-[#bef226]">
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">NFC</span>
                </div>
              </div>

              <div className="w-10 h-7 rounded bg-gradient-to-tr from-[#d4af37] to-[#ffd700] mb-6 opacity-85 shadow-sm border border-black/20" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-[#737373] uppercase tracking-wider mb-0.5">Cartão NFC Infinito</p>
                  <p className="font-bold text-sm tracking-wide text-white">SUA MARCA AQUI</p>
                </div>
                <span className="text-[10px] font-mono text-[#bef226] bg-[#bef226]/10 px-2 py-0.5 rounded border border-[#bef226]/20">
                  APROXIME
                </span>
              </div>
            </div>
            <p className="text-xs text-[#737373] mt-3">
              ✨ Cartão físico em PVC fosco de alta durabilidade com chip interno NFC.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Seção de Modelos / Sublinks (/pizzaria, /farmacia, etc.) */}
      <section id="demonstracao" className="py-20 px-4 bg-[#121212] border-t border-[#1f1f1f]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#bef226] uppercase tracking-widest">Demonstrações Interativas</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2">Escolha um Modelo para Testar Agora</h2>
            <p className="text-sm text-[#a3a3a3] max-w-xl mx-auto mt-2">
              Clique em qualquer um dos modelos abaixo para abrir o biosite como se estivesse encostando o cartão NFC no celular:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {niches.map((niche) => (
              <div
                key={niche.id}
                onClick={() => onNavigate(niche.path)}
                className="p-6 rounded-2xl bg-[#181818] border border-[#282828] hover:border-[#bef226] transition-all cursor-pointer group flex flex-col justify-between hover:shadow-xl hover:shadow-[#bef226]/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{niche.icon}</span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#242424] text-[#bef226] border border-[#383838]">
                      {niche.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#bef226] transition-colors mb-1">
                    {niche.title}
                  </h3>
                  <p className="text-xs text-[#737373] mb-3 font-medium">{niche.category}</p>
                  <p className="text-xs text-[#a3a3a3] leading-relaxed mb-6">
                    {niche.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#262626] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#bef226]">{niche.path}</span>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#bef226] transition-colors">
                    <span>Testar este modelo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Como Funciona */}
      <section id="como-funciona" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#bef226] uppercase tracking-widest">Tecnologia Simples</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2">Como Funciona em 3 Passos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#141414] border border-[#242424] p-7 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#bef226]/10 text-[#bef226] flex items-center justify-center font-black text-xl mb-5">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Aproxime o Cartão</h3>
              <p className="text-xs text-[#a3a3a3] leading-relaxed">
                Encoste o Conectacard na traseira de qualquer celular iPhone ou Android. Não necessita de bateria nem de app.
              </p>
            </div>

            <div className="bg-[#141414] border border-[#242424] p-7 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#bef226]/10 text-[#bef226] flex items-center justify-center font-black text-xl mb-5">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">Abre o Seu Sublink</h3>
              <p className="text-xs text-[#a3a3a3] leading-relaxed">
                O biosite abre instantaneamente no navegador com suas fotos, catálogo, redes sociais e botão de salvar contato.
              </p>
            </div>

            <div className="bg-[#141414] border border-[#242424] p-7 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#bef226]/10 text-[#bef226] flex items-center justify-center font-black text-xl mb-5">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">IA Atende 24 Horas</h3>
              <p className="text-xs text-[#a3a3a3] leading-relaxed">
                O atendente virtual por IA tira dúvidas sobre valores, horários e produtos e convida o cliente a fechar pelo WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Vantagens */}
      <section id="vantagens" className="py-20 px-4 bg-[#121212] border-t border-[#1f1f1f]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#bef226] uppercase tracking-widest">Diferenciais</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2">Por que o Conectacard Vende Mais?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#161616] border border-[#262626]">
              <Zap className="w-6 h-6 text-[#bef226] mb-4" />
              <h3 className="font-bold text-base mb-1.5">NFC Infinito e Sustentável</h3>
              <p className="text-xs text-[#a3a3a3] leading-relaxed">
                Chega de cartões de papel que vão parar no lixo. Um único cartão dura anos e pode ser atualizado a qualquer momento.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#161616] border border-[#262626]">
              <Smartphone className="w-6 h-6 text-[#bef226] mb-4" />
              <h3 className="font-bold text-base mb-1.5">Salva Direto na Agenda</h3>
              <p className="text-xs text-[#a3a3a3] leading-relaxed">
                O cliente clica em "Salvar Contato" e seu número, e-mail e site vão direto para a lista telefônica dele.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#161616] border border-[#262626]">
              <Sparkles className="w-6 h-6 text-[#bef226] mb-4" />
              <h3 className="font-bold text-base mb-1.5">Atendente com IA Integrada</h3>
              <p className="text-xs text-[#a3a3a3] leading-relaxed">
                Tire dúvidas de orçamentos, cardápio e entregas na velocidade da luz com a inteligência artificial do Google.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#161616] border border-[#262626]">
              <TrendingUp className="w-6 h-6 text-[#bef226] mb-4" />
              <h3 className="font-bold text-base mb-1.5">Avaliações 5 Estrelas</h3>
              <p className="text-xs text-[#a3a3a3] leading-relaxed">
                Botão direto para os clientes deixarem avaliações no seu perfil do Google Meu Negócio em apenas 3 segundos.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#161616] border border-[#262626]">
              <Layers className="w-6 h-6 text-[#bef226] mb-4" />
              <h3 className="font-bold text-base mb-1.5">Plaquinhas de Balcão</h3>
              <p className="text-xs text-[#a3a3a3] leading-relaxed">
                Além do cartão de bolso, oferecemos displays em acrílico com QR Code e NFC para colocar no balcão da sua loja.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#161616] border border-[#262626]">
              <ShieldCheck className="w-6 h-6 text-[#bef226] mb-4" />
              <h3 className="font-bold text-base mb-1.5">Domínio Próprio Seguro</h3>
              <p className="text-xs text-[#a3a3a3] leading-relaxed">
                Todos os seus clientes no seu próprio domínio .com.br com certificado SSL (https) e carregamento instantâneo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Planos e Preços */}
      <section id="planos" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#bef226] uppercase tracking-widest">Preços Transparentes</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2">Escolha o Melhor Formato para Seu Negócio</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#161616] border border-[#262626] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">Cartão Individual</h3>
                <p className="text-xs text-[#a3a3a3] mb-6">Para profissionais autônomos e representantes.</p>
                <div className="text-3xl font-black text-[#bef226] mb-6">
                  R$ 149<span className="text-xs text-[#a3a3a3] font-normal"> /taxa única</span>
                </div>
                <ul className="space-y-3 text-xs text-[#ddd] mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#bef226] shrink-0" />
                    <span>1 Cartão NFC Personalizado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#bef226] shrink-0" />
                    <span>QR Code gravado no verso</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#bef226] shrink-0" />
                    <span>Sublink exclusivo (/seu-nome)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#bef226] shrink-0" />
                    <span>Botão Salvar Contato</span>
                  </li>
                </ul>
              </div>
              <a
                href="https://wa.me/5567993174612?text=Olá!%20Gostaria%20de%20pedir%20o%20Cartão%20NFC%20Individual!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-lg border border-[#444] text-center font-bold text-xs hover:border-[#bef226] hover:text-[#bef226] transition-colors"
              >
                Pedir no WhatsApp
              </a>
            </div>

            <div className="p-8 rounded-2xl bg-[#1c1c1c] border-2 border-[#bef226] relative flex flex-col justify-between shadow-xl shadow-[#bef226]/10">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#bef226] text-[#121212] text-[10px] font-black uppercase rounded-full">
                MAIS PEDIDO
              </span>
              <div>
                <h3 className="font-bold text-lg mb-1">Empresarial + IA Ativa</h3>
                <p className="text-xs text-[#a3a3a3] mb-6">Para lojas, restaurantes, clínicas e farmácias.</p>
                <div className="text-3xl font-black text-[#bef226] mb-6">
                  R$ 289<span className="text-xs text-[#a3a3a3] font-normal"> + plano IA</span>
                </div>
                <ul className="space-y-3 text-xs text-[#ddd] mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#bef226] shrink-0" />
                    <span>1 Cartão NFC + 1 Plaquinha de Balcão</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#bef226] shrink-0" />
                    <span>Biolink Completo com Catálogo de Produtos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#bef226] shrink-0" />
                    <span>Atendente com IA Ativo 24h</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#bef226] shrink-0" />
                    <span>Módulo de Avaliações 5 Estrelas no Google</span>
                  </li>
                </ul>
              </div>
              <a
                href="https://wa.me/5567993174612?text=Olá!%20Gostaria%20de%20pedir%20o%20Plano%20Empresarial%20com%20IA!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-lg bg-[#bef226] text-[#121212] text-center font-bold text-xs hover:opacity-90 transition-opacity"
              >
                Pedir Plano Empresarial
              </a>
            </div>

            <div className="p-8 rounded-2xl bg-[#161616] border border-[#262626] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">Equipe / Franquias</h3>
                <p className="text-xs text-[#a3a3a3] mb-6">Para times de vendas e redes de lojas.</p>
                <div className="text-3xl font-black text-[#bef226] mb-6">
                  Sob Medida
                </div>
                <ul className="space-y-3 text-xs text-[#ddd] mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#bef226] shrink-0" />
                    <span>Múltiplos cartões NFC personalizados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#bef226] shrink-0" />
                    <span>Sublinks para cada vendedor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#bef226] shrink-0" />
                    <span>Treinamento da IA com catálogo extenso</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#bef226] shrink-0" />
                    <span>Consultoria de SEO e Tráfego Pago</span>
                  </li>
                </ul>
              </div>
              <a
                href="https://wa.me/5567993174612?text=Olá!%20Gostaria%20de%20um%20orçamento%20para%20equipe%20comercial!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-lg border border-[#444] text-center font-bold text-xs hover:border-[#bef226] hover:text-[#bef226] transition-colors"
              >
                Falar com Consultor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="py-20 px-4 bg-[#121212] border-t border-[#1f1f1f]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#bef226] uppercase tracking-widest">Tire Suas Dúvidas</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2">Perguntas Frequentes</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#2b2b2b] bg-[#161616] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-medium text-sm text-[#f5f5f5] hover:text-[#bef226] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#737373] transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-[#bef226]" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-[#a3a3a3] leading-relaxed border-t border-[#1f1f1f]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA Final */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Pronto para ter o seu Cartão NFC Inteligente?
          </h2>
          <p className="text-sm text-[#a3a3a3] mb-8">
            Peça agora com entrega rápida em Ponta Porã, Pedro Juan Caballero e envio para todo o Brasil.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate("/teste")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#bef226] text-[#121212] font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#bef226]/30 flex items-center justify-center gap-2"
            >
              <span>Faça seu teste agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/5567993174612?text=Olá!%20Quero%20fazer%20meu%20pedido%20do%20Conectacard%20NFC!"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1e1e1e] border border-[#333] text-white font-bold text-sm hover:bg-[#252525] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#bef226]" />
              <span>Pedir no WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="py-8 border-t border-[#1f1f1f] text-center text-xs text-[#737373]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Conectacard Cartão NFC · Start Mkt Local Ponta Porã MS</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate("/teste")} className="hover:text-white transition-colors">
              Faça seu teste agora
            </button>
            <a href="https://wa.me/5567993174612" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Contato (67) 99317-4612
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
