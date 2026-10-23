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
  const [tab, setTab] = useState<"empresa" | "produtos">("empresa");
  const [messagesEmpresa, setMessagesEmpresa] = useState<ChatMessage[]>([
    { id: "init-empresa", role: "assistant", text: data.atendimento?.saudacao || "Olá! Qual é a sua dúvida sobre nossa empresa e serviços?" }
  ]);
  const [messagesProdutos, setMessagesProdutos] = useState<ChatMessage[]>([
    { id: "init-produtos", role: "assistant", text: data.atendimento?.saudacao || "Olá! Qual é a sua dúvida sobre cartões NFC ou produtos Superlimpo?" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeMessages = tab === "empresa" ? messagesEmpresa : messagesProdutos;
  const setCurMessages = tab === "empresa" ? setMessagesEmpresa : setMessagesProdutos;
  const presetQuestions = tab === "empresa" ? data.atendimento.empresa : data.atendimento.produtos;

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages, isTyping]);

  const findSmartResponse = (query: string, currentTab: "empresa" | "produtos"): string => {
    const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Check preset matches
    const pool = currentTab === "empresa" ? data.atendimento.empresa : data.atendimento.produtos;
    for (const item of pool) {
      const p = item.pergunta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (q.includes(p) || p.includes(q)) {
        return item.resposta;
      }
    }

    // Keyword matching based on ConectaCard & Superlimpo knowledge base
    if (q.includes("como funciona") || q.includes("nfc") || q.includes("aproximac") || q.includes("funciona o cartao")) {
      return "Com um simples toque do cartão Conectacard em qualquer celular moderno com NFC (iPhone ou Android), seus links, WhatsApp, catálogo e redes sociais abrem instantaneamente na tela, sem necessidade de aplicativo!";
    }

    if (q.includes("personaliz") || q.includes("logo") || q.includes("arte") || q.includes("minha marca")) {
      return "Sim! Nossos cartões e plaquinhas são 100% personalizados com o logotipo e identidade visual da sua marca ou empresa. Basta nos chamar no WhatsApp para definir o design.";
    }

    if (q.includes("preco") || q.includes("quanto custa") || q.includes("valor") || q.includes("orcamento") || q.includes("tabela")) {
      if (currentTab === "produtos" || q.includes("superlimpo") || q.includes("limpeza") || q.includes("sabao")) {
        return "Na Superlimpo temos: Kit com 3 galões de 5L (Água Sanitária + Desinfetante + Sabão de Álcool) por apenas R$ 38,00! Galão avulso de 5L: Água Sanitária R$ 12,00; Desinfetante R$ 15,00; Sabão de Álcool R$ 15,00; Amaciante 5L R$ 25,00; Cloro 12% R$ 45,00. Entrega em toda Ponta Porã e Pedro Juan Caballero!";
      }
      return "Para consultar os valores de cartões NFC infinitos, placas de avaliação Google e planos de marketing digital, fale com nossa equipe pelo WhatsApp (67) 99317-4612!";
    }

    if (q.includes("entrega") || q.includes("frete") || q.includes("onde entrega") || q.includes("fronteira")) {
      return "Fazemos entrega de produtos de limpeza em toda Ponta Porã e Pedro Juan Caballero (a maioria sem custo de entrega). E enviamos os Cartões NFC Conectacard para todo o Brasil via Correios!";
    }

    if (q.includes("onde") || q.includes("endereco") || q.includes("localizacao") || q.includes("cidade") || q.includes("fica")) {
      return "Estamos localizados em Ponta Porã, MS (Start Mkt Local). Atendemos presencialmente toda a região de fronteira e o Brasil inteiro de forma digital!";
    }

    if (q.includes("contato") || q.includes("whatsapp") || q.includes("telefone") || q.includes("email") || q.includes("falar")) {
      return "Você pode entrar em contato direto pelo WhatsApp (67) 99317-4612 ou pelo e-mail startmktlocal@gmail.com. Estamos à disposição!";
    }

    if (q.includes("site") || q.includes("google") || q.includes("seo") || q.includes("trafego") || q.includes("marketing")) {
      return "A Start Mkt Local é agência especializada em Criação de Sites profissionais, Perfil de Empresas no Google Meu Negócio, Otimização de SEO e Tráfego Pago (anúncios no Google e Meta) para alavancar suas vendas.";
    }

    // Default intelligent fallback
    return `Obrigado pela mensagem! A Conectacard e a Start Mkt Local oferecem cartões NFC inteligentes, biolinks, plaquinhas com QR Code e soluções de marketing digital em Ponta Porã e região. Além disso, temos a linha Superlimpo de produtos de limpeza direto de fábrica. Se quiser tirar dúvidas específicas com nosso atendente humano, clique no botão 'Falar pelo WhatsApp' abaixo!`;
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      role: "user",
      text: query,
    };

    setCurMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal("");
    setIsTyping(true);

    // Fast-path: If it is an exact preset chip, answer immediately
    const preset = presetQuestions.find(
      (p) => p.pergunta.toLowerCase() === query.toLowerCase()
    );
    if (preset) {
      setTimeout(() => {
        setCurMessages((prev) => [
          ...prev,
          { id: "a-" + Date.now(), role: "assistant", text: preset.resposta },
        ]);
        setIsTyping(false);
      }, 250);
      return;
    }

    // Fast-path: Common greetings (0ms wait)
    const norm = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const greetings = ["oi", "ola", "bom dia", "boa tarde", "boa noite", "opa", "e ai", "tudo bem", "ola tudo bem"];
    if (greetings.includes(norm)) {
      setTimeout(() => {
        setCurMessages((prev) => [
          ...prev,
          {
            id: "a-" + Date.now(),
            role: "assistant",
            text: `Olá! Como posso ajudar você hoje com a ${data.name}? Fique à vontade para perguntar sobre o cartão NFC, tabela de preços, entregas ou serviços da agência!`,
          },
        ]);
        setIsTyping(false);
      }, 300);
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
          clientKnowledge: `${data.atendimento.conhecimento}\n\nPerguntas Frequentes:\n${[
            ...data.atendimento.empresa,
            ...data.atendimento.produtos,
          ]
            .map((i) => `P: ${i.pergunta}\nR: ${i.resposta}`)
            .join("\n")}`,
          history: activeMessages,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.reply && !json.isFallback) {
          setCurMessages((prev) => [
            ...prev,
            { id: "a-" + Date.now(), role: "assistant", text: json.reply },
          ]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Server error or offline, fallback to local matching below
    }

    // Fallback to local intelligent matching
    setTimeout(() => {
      const responseText = findSmartResponse(query, tab);
      setCurMessages((prev) => [
        ...prev,
        { id: "a-" + Date.now(), role: "assistant", text: responseText },
      ]);
      setIsTyping(false);
    }, 450);
  };

  const handleClear = () => {
    const greeting: ChatMessage = {
      id: "init-" + tab + "-" + Date.now(),
      role: "assistant",
      text: tab === "empresa" 
        ? "Olá! Qual é a sua dúvida sobre nossa empresa e serviços?" 
        : "Olá! Qual é a sua dúvida sobre cartões NFC ou produtos Superlimpo?",
    };
    setCurMessages([greeting]);
  };

  return (
    <section className="cliente-chat" aria-label={`Atendimento de ${data.name}`}>
      {/* Header */}
      <div className="cliente-chat-heading">
        <h2>
          <MessageCircle aria-hidden="true" />
          <span>Atendimento</span>
        </h2>
        <span className="cliente-chat-status">
          <span className="cliente-chat-dot" aria-hidden="true" />
          <span>Online</span>
        </span>
      </div>

      {/* Identity */}
      <div className="cliente-chat-identity">
        <img src={data.avatar.src} alt="" />
        <strong>{data.name}</strong>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#1a1a1a] p-1 rounded-lg border border-[#333] mb-3">
        <button
          type="button"
          onClick={() => {
            setTab("empresa");
            setInputVal("");
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            tab === "empresa"
              ? "bg-[#bef226] text-[#121212] shadow-sm"
              : "text-[#a3a3a3] hover:text-white"
          }`}
        >
          Empresa & Serviços
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("produtos");
            setInputVal("");
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            tab === "produtos"
              ? "bg-[#bef226] text-[#121212] shadow-sm"
              : "text-[#a3a3a3] hover:text-white"
          }`}
        >
          Produtos & Cartão NFC
        </button>
      </div>

      {/* Clear conversation button */}
      <div className="flex justify-end mb-1">
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-[#a3a3a3] hover:text-white inline-flex items-center gap-1 px-2 py-1 rounded transition-colors"
          title="Limpar esta conversa"
          aria-label="Limpar esta conversa"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar chat</span>
        </button>
      </div>

      {/* Chat messages viewport */}
      <div
        ref={scrollRef}
        className="cliente-chat-transcript bg-[#161616]/60 rounded-lg p-3 border border-[#2b2b2b]"
        role="log"
        aria-live="polite"
      >
        {activeMessages.map((msg) => (
          <div
            key={msg.id}
            className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "user" ? (
              <div className="cliente-chat-question">
                <p>{msg.text}</p>
              </div>
            ) : (
              <div className="cliente-chat-answer bg-[#262626] border border-[#383838] p-3 rounded-lg text-[#f5f5f5]">
                <p>{msg.text}</p>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#a3a3a3] italic bg-[#262626]/80 px-3 py-2 rounded-lg border border-[#333] w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bef226] animate-pulse" />
            <span>Consultando informações e preparando resposta…</span>
          </div>
        )}
      </div>

      {/* Textarea input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative my-3"
      >
        <div className="flex items-end bg-[#1e1e1e] border border-[#383838] focus-within:border-[#ff6b35] focus-within:ring-1 focus-within:ring-[#ff6b35] rounded-lg p-2 transition-all">
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
            placeholder="Escreva sua mensagem ou pergunta…"
            aria-label="Sua mensagem"
            className="w-full bg-transparent border-0 resize-none outline-none text-sm text-[#f5f5f5] placeholder-[#737373] min-h-[44px] max-h-32 py-1 px-1"
            rows={1}
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="size-8 rounded-md bg-[#ff6b35] hover:bg-[#ff7e4d] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white shrink-0 transition-colors ml-2"
            title="Enviar mensagem"
            aria-label="Enviar mensagem"
          >
            <CornerDownLeft className="size-4" />
          </button>
        </div>
      </form>

      {/* Preset options */}
      <div className="cliente-chat-options">
        {presetQuestions.map((q) => (
          <button
            key={q.id}
            type="button"
            disabled={isTyping}
            onClick={() => handleSend(q.pergunta)}
          >
            {q.pergunta}
          </button>
        ))}
      </div>

      {/* WhatsApp CTA */}
      <a
        href={`https://wa.me/55${data.contato.telefone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="cliente-chat-contact shadow-lg"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Falar pelo WhatsApp</span>
      </a>
    </section>
  );
}
