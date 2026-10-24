import { useState, useRef, useEffect } from "react";
import { MessageCircle, CornerDownLeft, RotateCcw, Sparkles } from "lucide-react";
import type { BiositeData } from "../data/conectacard";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
}

interface ChatAssistantProps {
  data: BiositeData;
}

export function ChatAssistant({ data }: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-lia",
      role: "assistant",
      text: "Olá! Eu sou a LIA, assistente virtual inteligente da Conectacard. Estou pronta para tirar suas dúvidas, apresentar nossos cartões NFC e serviços, ou ajudar você com orçamentos. Pode perguntar!",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const liaAvatar = "/assets/lia-avatar.png";

  const questionSuggestions = [
    "Quais são os serviços?",
    "Quanto custa?",
    "Quero falar com alguém",
    "Como funciona o cartão NFC?",
    "Tabela Superlimpo",
    "Onde vocês estão?",
  ];

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const findSmartResponse = (query: string): string => {
    const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (q.includes("servico") || q.includes("o que a empresa oferece") || q.includes("o que voces fazem")) {
      return "A Conectacard e a Start Mkt Local oferecem:\n• Cartões NFC Infinitos personalizados\n• Biolinks e Biosites profissionais\n• Plaquinhas de Balcão e AvaliaCard (5 estrelas no Google)\n• Criação de Sites, SEO e Tráfego Pago (anúncios no Google e Meta)\n• Linha Superlimpo de produtos de limpeza direto de fábrica em Ponta Porã!";
    }

    if (q.includes("quanto custa") || q.includes("preco") || q.includes("valor") || q.includes("tabela") || q.includes("orcamento")) {
      return "Valores Conectacard:\n• Cartão NFC Individual: a partir de R$ 149 (pagamento único, sem mensalidade obrigatória).\n• Plano Empresarial + IA + Placa de Balcão: sob consulta rápida.\n• Kit Dona de Casa Superlimpo: 3 galões de 5L por apenas R$ 38,00!\nSe quiser um orçamento sob medida para sua empresa, clique no botão do WhatsApp abaixo!";
    }

    if (q.includes("falar com alguem") || q.includes("humano") || q.includes("atendente") || q.includes("whatsapp") || q.includes("contato") || q.includes("telefone")) {
      return `Com certeza! Nossa equipe de atendimento humano está pronta para falar com você no WhatsApp (67) 99317-4612. Basta tocar no botão laranja 'Falar pelo WhatsApp' logo abaixo!`;
    }

    if (q.includes("como funciona") || q.includes("nfc") || q.includes("aproximac") || q.includes("funciona o cartao")) {
      return "O Cartão NFC Conectacard possui um chip inteligente interno. Basta encostar o cartão na traseira de qualquer celular moderno (iPhone ou Android) e o seu biosite abre instantaneamente com todos os seus links, catálogo e contatos, sem precisar baixar nenhum aplicativo!";
    }

    if (q.includes("superlimpo") || q.includes("limpeza") || q.includes("sabao") || q.includes("desinfetante")) {
      return "Na Superlimpo temos direto de fábrica: Kit 3 galões 5L por R$ 38,00! Avulsos de 5L: Água Sanitária R$ 12, Desinfetante R$ 15, Sabão de Álcool R$ 15, Amaciante R$ 25 e Cloro 12% R$ 45. Entregamos em toda Ponta Porã e Pedro Juan Caballero!";
    }

    if (q.includes("entrega") || q.includes("frete") || q.includes("onde entrega") || q.includes("correios") || q.includes("fronteira")) {
      return "Entregamos produtos de limpeza em toda Ponta Porã (MS) e Pedro Juan Caballero. E enviamos os Cartões NFC personalizados para todo o Brasil com código de rastreamento via Correios!";
    }

    if (q.includes("onde") || q.includes("endereco") || q.includes("localizacao") || q.includes("cidade") || q.includes("fica")) {
      return "Estamos localizados em Ponta Porã, MS (Start Mkt Local). Atendemos presencialmente toda a região de fronteira e clientes do Brasil inteiro de forma digital!";
    }

    if (q.includes("personaliz") || q.includes("logo") || q.includes("arte") || q.includes("minha marca")) {
      return "Sim! Desenvolvemos a arte 100% personalizada com o logotipo, cores e identidade visual da sua marca com acabamento premium de alta durabilidade.";
    }

    return `Obrigada pela mensagem! Como assistente virtual LIA, posso apresentar nossos cartões NFC, catálogo ou serviços de marketing. Se preferir tirar dúvidas personalizadas diretamente com nossa equipe, toque no botão 'Falar pelo WhatsApp' abaixo!`;
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      role: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal("");
    setIsTyping(true);

    // Fast-path: Common greetings (0ms wait)
    const norm = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const greetings = ["oi", "ola", "bom dia", "boa tarde", "boa noite", "opa", "e ai", "tudo bem", "ola tudo bem"];
    if (greetings.includes(norm)) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "a-" + Date.now(),
            role: "assistant",
            text: `Olá! Eu sou a LIA 👋 Como posso ajudar você hoje? Fique à vontade para perguntar sobre nossos cartões NFC inteligentes, preços, produtos Superlimpo ou serviços de marketing!`,
          },
        ]);
        setIsTyping(false);
      }, 250);
      return;
    }

    // Try calling server AI endpoint
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          clientName: data.name,
          clientKnowledge: `Assistente: LIA.\n${data.atendimento.conhecimento}\n\nPerguntas Frequentes:\n${[
            ...data.atendimento.empresa,
            ...data.atendimento.produtos,
          ]
            .map((i) => `P: ${i.pergunta}\nR: ${i.resposta}`)
            .join("\n")}`,
          history: messages,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.reply && !json.isFallback) {
          setMessages((prev) => [
            ...prev,
            { id: "a-" + Date.now(), role: "assistant", text: json.reply },
          ]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Offline fallback
    }

    // Fallback to local intelligent matching
    setTimeout(() => {
      const responseText = findSmartResponse(query);
      setMessages((prev) => [
        ...prev,
        { id: "a-" + Date.now(), role: "assistant", text: responseText },
      ]);
      setIsTyping(false);
    }, 350);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "init-lia-" + Date.now(),
        role: "assistant",
        text: "Olá! Eu sou a LIA, assistente virtual inteligente da Conectacard. Estou pronta para tirar suas dúvidas, apresentar nossos serviços ou ajudar com orçamentos. Pode perguntar!",
      },
    ]);
  };

  return (
    <section className="cliente-chat" aria-label="Atendimento com LIA">
      {/* 1. LIA Model Card Showcase (Inspired by the provided reference model) */}
      <div className="bg-[#ffffff] text-[#121212] rounded-2xl p-4 sm:p-5 shadow-xl border border-[#e5e5e5] mb-4 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#2563eb]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header row: Avatar + Name + Online badge */}
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#1d4ed8] to-[#60a5fa] p-0.5 shadow-md shadow-blue-500/20">
              <img
                src={liaAvatar}
                alt="LIA - Assistente Virtual Inteligente"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            {/* Green glowing status dot on avatar */}
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-ping opacity-75" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0f172a] flex items-center gap-1.5 font-sans">
                <span>Olá! Eu sou a LIA</span>
                <span className="text-base">👋</span>
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Online</span>
              </span>
            </div>

            <p className="text-xs font-semibold text-[#64748b] mt-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#2563eb]" />
              <span>Assistente virtual inteligente</span>
            </p>
          </div>
        </div>

        {/* Intro text */}
        <p className="text-xs sm:text-sm text-[#334155] leading-relaxed mt-3.5 font-medium">
          Estou aqui para tirar suas dúvidas, apresentar nossos serviços e ajudar você a encontrar a melhor solução. Pode perguntar!
        </p>

        {/* Sugestões de perguntas box */}
        <div className="mt-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] mb-2 flex items-center gap-1">
            <span>Sugestões de perguntas</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {questionSuggestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isTyping}
                onClick={() => handleSend(q)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#2563eb] hover:text-white text-[#1e293b] border border-[#cbd5e1] hover:border-[#2563eb] transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Chat Transcript Area */}
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-xs font-bold text-[#a3a3a3] uppercase tracking-wider flex items-center gap-1">
          <MessageCircle className="w-3.5 h-3.5 text-[#bef226]" />
          <span>Conversa com LIA</span>
        </span>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-[#a3a3a3] hover:text-white inline-flex items-center gap-1 px-2 py-1 rounded transition-colors"
          title="Reiniciar conversa"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reiniciar chat</span>
        </button>
      </div>

      <div
        ref={scrollRef}
        className="cliente-chat-transcript bg-[#161616] rounded-xl p-3 border border-[#2b2b2b] max-h-80 overflow-y-auto space-y-3"
        role="log"
        aria-live="polite"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start gap-2"}`}
          >
            {msg.role === "assistant" && (
              <img
                src={liaAvatar}
                alt="LIA"
                className="w-7 h-7 rounded-full object-cover shrink-0 border border-blue-500/40 mt-0.5 shadow-sm"
              />
            )}
            {msg.role === "user" ? (
              <div className="cliente-chat-question bg-[#bef226] text-[#121212] font-semibold text-xs sm:text-sm py-2 px-3.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            ) : (
              <div className="bg-[#242424] border border-[#383838] p-3 rounded-2xl rounded-tl-sm text-[#f5f5f5] text-xs sm:text-sm leading-relaxed max-w-[85%] shadow-sm">
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#a3a3a3] bg-[#222] px-3 py-2 rounded-xl border border-[#333] w-fit">
            <img
              src={liaAvatar}
              alt="LIA"
              className="w-5 h-5 rounded-full object-cover shrink-0"
            />
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-ping" />
            <span className="italic">LIA está digitando...</span>
          </div>
        )}
      </div>

      {/* 3. Text Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative my-3"
      >
        <div className="flex items-center bg-[#1e1e1e] border border-[#383838] focus-within:border-[#2563eb] focus-within:ring-1 focus-within:ring-[#2563eb] rounded-xl p-1.5 transition-all">
          <textarea
            ref={inputRef}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Pergunte qualquer coisa para a LIA…"
            aria-label="Sua pergunta para a LIA"
            className="w-full bg-transparent border-0 resize-none outline-none text-xs sm:text-sm text-[#f5f5f5] placeholder-[#737373] min-h-[40px] max-h-28 py-2 px-2.5"
            rows={1}
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="size-9 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white shrink-0 transition-all shadow-md ml-1 active:scale-95"
            title="Enviar para LIA"
            aria-label="Enviar mensagem"
          >
            <CornerDownLeft className="size-4" />
          </button>
        </div>
      </form>

      {/* 4. WhatsApp Human CTA Button */}
      <a
        href={`https://wa.me/55${data.contato.telefone}?text=Olá!%20Estava%20conversando%20com%20a%20LIA%20no%20site%20e%20gostaria%20de%20atendimento%20humano.`}
        target="_blank"
        rel="noopener noreferrer"
        className="cliente-chat-contact shadow-lg bg-gradient-to-r from-[#ff6b35] to-[#f97316] hover:brightness-110 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Falar com Atendente no WhatsApp</span>
      </a>
    </section>
  );
}
