import { useState, useRef, useEffect } from "react";
import { MessageCircle, CornerDownLeft, RotateCcw } from "lucide-react";
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
  const liaAvatar = "/assets/lia-avatar.png";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-lia",
      role: "assistant",
      text: "Olá! Eu sou a LIA, assistente virtual inteligente da Conectacard. Estou aqui para tirar suas dúvidas, apresentar nossos serviços e ajudar você a encontrar a melhor solução. Pode perguntar!",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sugestoes = [
    "Quais são os serviços?",
    "Quanto custa?",
    "Quero falar com alguém",
    "Como funciona o cartão NFC?",
    "Produtos Superlimpo",
  ];

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const findSmartResponse = (query: string): string => {
    const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (q.includes("servico") || q.includes("quais sao os servicos") || q.includes("o que a empresa oferece") || q.includes("o que voces fazem")) {
      return "A Start Mkt Local e a Conectacard oferecem:\n\n• Cartões NFC Infinitos e Plaquinhas QR Code personalizadas\n• Criação de Sites profissionais e Landing Pages\n• Otimização de Perfil de Empresas no Google (Google Meu Negócio)\n• AvaliaCard: Placa NFC para avaliações 5 estrelas no Google\n• Gestão de Tráfego Pago (anúncios no Google e Meta)\n• Linha Superlimpo de produtos de limpeza direto de fábrica em Ponta Porã!";
    }

    if (q.includes("quanto custa") || q.includes("preco") || q.includes("valor") || q.includes("tabela") || q.includes("orcamento")) {
      return "Tabela de Valores:\n\n• Cartão NFC Conectacard: a partir de R$ 149 (pagamento único, sem mensalidade obrigatória).\n• Kit Dona de Casa Superlimpo (3 galões de 5L): apenas R$ 38,00!\n• Galões avulsos 5L: Água Sanitária R$ 12 | Desinfetante R$ 15 | Sabão de Álcool R$ 15 | Amaciante R$ 25.\n\nPara projetos de sites, tráfego pago ou orçamentos sob medida, fale conosco no WhatsApp!";
    }

    if (q.includes("falar com alguem") || q.includes("humano") || q.includes("atendente") || q.includes("whatsapp") || q.includes("contato") || q.includes("telefone")) {
      return "Com certeza! Nossa equipe de atendimento humano está à disposição no WhatsApp (67) 99317-4612. Basta tocar no botão 'Falar pelo WhatsApp' logo abaixo para iniciar a conversa!";
    }

    if (q.includes("como funciona") || q.includes("nfc") || q.includes("aproximac") || q.includes("funciona o cartao")) {
      return "O Cartão NFC Conectacard possui tecnologia por aproximação. Basta encostar o cartão na parte traseira de qualquer celular moderno com NFC (iPhone ou Android) e o seu biosite abre na hora com seus contatos, catálogo e redes sociais, sem precisar instalar nenhum aplicativo!";
    }

    if (q.includes("superlimpo") || q.includes("limpeza") || q.includes("sabao") || q.includes("desinfetante")) {
      return "A Superlimpo é nossa linha de produtos de limpeza direto de fábrica em Ponta Porã! Temos galões de 5L de alta concentração: Água Sanitária, Desinfetante, Sabão de Álcool, Amaciante, Cloro 12%, Lava Roupas e Desincrustante. Entregamos em toda Ponta Porã e Pedro Juan Caballero!";
    }

    if (q.includes("entrega") || q.includes("frete") || q.includes("onde entrega") || q.includes("fronteira") || q.includes("correios")) {
      return "Fazemos entrega de produtos de limpeza em toda Ponta Porã e Pedro Juan Caballero (a maioria sem custo de entrega). E enviamos os Cartões NFC Conectacard para todo o Brasil via Correios com código de rastreamento!";
    }

    if (q.includes("onde") || q.includes("endereco") || q.includes("localizacao") || q.includes("cidade") || q.includes("fica")) {
      return "Estamos localizados em Ponta Porã, MS (Start Mkt Local). Atendemos presencialmente toda a região de fronteira e o Brasil inteiro de forma digital!";
    }

    if (q.includes("personaliz") || q.includes("logo") || q.includes("arte") || q.includes("minha marca")) {
      return "Sim! Nossos cartões e plaquinhas são 100% personalizados com o logotipo, cores e identidade visual da sua marca com acabamento premium.";
    }

    return "Obrigada pelo contato! Como assistente virtual inteligente LIA, estou aqui para apresentar nossos serviços, cartões NFC e produtos. Se quiser tirar dúvidas específicas com nosso time, toque no botão 'Falar pelo WhatsApp' abaixo!";
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

    // Fast-path: Common greetings
    const norm = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const greetings = ["oi", "ola", "bom dia", "boa tarde", "boa noite", "opa", "e ai", "tudo bem", "ola tudo bem"];
    if (greetings.includes(norm)) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "a-" + Date.now(),
            role: "assistant",
            text: `Olá! Eu sou a LIA 👋 Como posso ajudar você hoje? Fique à vontade para perguntar sobre nossos cartões NFC, preços, serviços de marketing ou produtos Superlimpo!`,
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
        text: "Olá! Eu sou a LIA, assistente virtual inteligente da Conectacard. Estou aqui para tirar suas dúvidas, apresentar nossos serviços e ajudar você a encontrar a melhor solução. Pode perguntar!",
      },
    ]);
  };

  return (
    <section className="cliente-chat" aria-label="Atendimento com LIA">
      {/* 1. LIA Model Card (Conforme o layout exato do anexo) */}
      <div className="bg-white text-[#121212] rounded-2xl p-4 sm:p-5 shadow-lg border border-[#e2e8f0] mb-3 text-left">
        {/* Header: Avatar + Title + Online Badge */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <img
              src={liaAvatar}
              alt="LIA - Assistente virtual inteligente"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-[#cbd5e1] shadow-sm"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#0f172a] flex items-center gap-1.5 font-sans">
                <span>Olá! Eu sou a LIA</span>
                <span className="text-base">👋</span>
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-[#64748b] mt-0.5">
              Assistente virtual inteligente
            </p>
          </div>
        </div>

        {/* Descrição oficial solicitada */}
        <p className="text-xs sm:text-sm text-[#334155] leading-relaxed mt-3.5 font-normal">
          Estou aqui para tirar suas dúvidas, apresentar nossos serviços e ajudar você a encontrar a melhor solução. Pode perguntar!
        </p>

        {/* Caixa: Sugestões de perguntas */}
        <div className="mt-3.5 bg-[#f1f5f9] border border-[#e2e8f0] rounded-xl p-3">
          <p className="text-[11px] font-semibold text-[#64748b] mb-2">
            Sugestões de perguntas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sugestoes.map((sugestao, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isTyping}
                onClick={() => handleSend(sugestao)}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-white hover:bg-[#2563eb] hover:text-white text-[#334155] border border-[#cbd5e1] hover:border-[#2563eb] transition-all shadow-xs active:scale-95 disabled:opacity-50"
              >
                {sugestao}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Área de Mensagens da Conversa */}
      <div className="flex items-center justify-between px-1 mb-1.5">
        <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider flex items-center gap-1">
          <MessageCircle className="w-3.5 h-3.5 text-[#bef226]" />
          <span>Conversa com LIA</span>
        </span>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-[#a3a3a3] hover:text-white inline-flex items-center gap-1 px-2 py-0.5 rounded transition-colors"
          title="Reiniciar conversa"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reiniciar</span>
        </button>
      </div>

      <div
        ref={scrollRef}
        className="cliente-chat-transcript bg-[#161616] rounded-xl p-3 border border-[#2b2b2b] max-h-72 overflow-y-auto space-y-2.5"
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
                className="w-6 h-6 rounded-full object-cover shrink-0 border border-blue-500/50 mt-0.5 shadow-xs"
              />
            )}
            {msg.role === "user" ? (
              <div className="cliente-chat-question bg-[#bef226] text-[#121212] font-semibold text-xs sm:text-sm py-2 px-3.5 rounded-2xl rounded-tr-xs max-w-[85%] shadow-xs">
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            ) : (
              <div className="bg-[#242424] border border-[#383838] p-3 rounded-2xl rounded-tl-xs text-[#f5f5f5] text-xs sm:text-sm leading-relaxed max-w-[85%] shadow-xs">
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#a3a3a3] bg-[#222] px-3 py-1.5 rounded-xl border border-[#333] w-fit">
            <img
              src={liaAvatar}
              alt="LIA"
              className="w-4 h-4 rounded-full object-cover shrink-0"
            />
            <span className="w-1.5 h-1.5 rounded-full bg-[#bef226] animate-ping" />
            <span className="italic">LIA está digitando...</span>
          </div>
        )}
      </div>

      {/* 3. Input de Texto */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative my-2.5"
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
            className="w-full bg-transparent border-0 resize-none outline-none text-xs sm:text-sm text-[#f5f5f5] placeholder-[#737373] min-h-[38px] max-h-24 py-1.5 px-2.5"
            rows={1}
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="size-8 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white shrink-0 transition-all shadow-sm ml-1 active:scale-95"
            title="Enviar para LIA"
            aria-label="Enviar mensagem"
          >
            <CornerDownLeft className="size-4" />
          </button>
        </div>
      </form>

      {/* 4. Botão de Contato WhatsApp */}
      <a
        href={`https://wa.me/55${data.contato.telefone}?text=Olá!%20Estava%20conversando%20com%20a%20LIA%20no%20site%20e%20gostaria%20de%20atendimento%20humano.`}
        target="_blank"
        rel="noopener noreferrer"
        className="cliente-chat-contact shadow-lg bg-gradient-to-r from-[#ff6b35] to-[#f97316] hover:brightness-110 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Falar pelo WhatsApp</span>
      </a>
    </section>
  );
}
