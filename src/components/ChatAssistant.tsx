import { useState, useRef, useEffect, ReactNode } from "react";
import { MessageCircle, CornerDownLeft, RotateCcw, ExternalLink } from "lucide-react";
import type { BiositeData } from "../data/conectacard";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
}

interface ChatAssistantProps {
  data: BiositeData;
}

/**
 * Parses plain text containing URLs or Markdown links and renders them as clickable <a> tags.
 */
function renderFormattedText(text: string, isUser: boolean): ReactNode[] {
  // Regex to match markdown links [label](url) or standalone URLs (http:// or https://)
  const regex = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
  const elements: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      elements.push(text.substring(lastIndex, matchIndex));
    }

    if (match[1]) {
      // Markdown link: [Label](url)
      const label = match[2];
      const url = match[3];
      elements.push(
        <a
          key={`md-${matchIndex}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={
            isUser
              ? "underline font-bold text-black hover:opacity-80 inline-flex items-center gap-0.5 break-all"
              : "text-[#38bdf8] hover:text-[#7dd3fc] font-semibold underline underline-offset-2 inline-flex items-center gap-1 break-all transition-colors cursor-pointer"
          }
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0 opacity-80" />
        </a>
      );
    } else if (match[4]) {
      // Standalone URL: https://...
      const url = match[4];
      const isWhatsApp = url.includes("whatsapp.com") || url.includes("wa.me");
      elements.push(
        <a
          key={`url-${matchIndex}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={
            isUser
              ? "underline font-bold text-black hover:opacity-80 inline-flex items-center gap-0.5 break-all"
              : isWhatsApp
              ? "text-[#22c55e] hover:text-[#4ade80] font-semibold underline underline-offset-2 inline-flex items-center gap-1 break-all transition-colors cursor-pointer"
              : "text-[#38bdf8] hover:text-[#7dd3fc] font-semibold underline underline-offset-2 inline-flex items-center gap-1 break-all transition-colors cursor-pointer"
          }
        >
          <span>{url}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0 opacity-80" />
        </a>
      );
    }

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
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
  const clientCache = useRef<Map<string, string>>(new Map());

  const sugestoes = [
    "Quais são os serviços?",
    "Quanto custa?",
    "Qual o site da Superlimpo?",
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

    // Superlimpo specific rules
    if (q.includes("horario") || q.includes("que horas") || q.includes("sabado") || (q.includes("entrega") && (q.includes("hora") || q.includes("quando")))) {
      return "As entregas da Superlimpo são feitas até às 16 horas. Aos sábados somente às 7:00 horas e às 15:30 horas em toda Ponta Porã e Pedro Juan Caballero.";
    }

    if (q.includes("nota") || q.includes("fiscal") || q.includes("recibo") || q.includes("comprovante")) {
      return "Não temos Nota Fiscal, apenas Recibo.";
    }

    if (q.includes("taxa") || q.includes("frete") || (q.includes("quanto") && q.includes("entrega"))) {
      return "Dependendo da distância e do pedido existe uma pequena taxa de entrega. Mas a maioria das entregas não tem custo!";
    }

    if (q.includes("loja") || q.includes("fisica") || q.includes("onde fica a loja")) {
      return "Não temos loja física. Trabalhamos exclusivamente com entregas em toda a região de Ponta Porã e Pedro Juan Caballero!";
    }

    if (q.includes("site") || q.includes("link do site") || q.includes("pagina") || q.includes("catalogo online")) {
      if (q.includes("superlimpo") || q.includes("limpeza") || q.includes("produto")) {
        return "O site oficial da Superlimpo é: https://superlimpoprodutosdelimpeza.lovable.app/\n\nLá você confere nosso catálogo completo de produtos direto de fábrica e pode pedir com entrega rápida em Ponta Porã e Pedro Juan Caballero!";
      }
      return "Nosso site oficial da Start Mkt Local / Conectacard é: https://www.startmktlocal.com.br/\nE o site da Superlimpo é: https://superlimpoprodutosdelimpeza.lovable.app/";
    }

    if (q.includes("superlimpo") || q.includes("limpeza") || q.includes("sabao") || q.includes("desinfetante") || q.includes("cloro") || q.includes("amaciante") || q.includes("kit")) {
      return "Somos a Superlimpo vendemos produtos de limpeza!\n\nNosso Site: https://superlimpoprodutosdelimpeza.lovable.app/\nWhatsApp: https://api.whatsapp.com/send?phone=5567998342469\n\nTabela Linha dona de casa:\n• Kit com (Água sanitária 5L, Desinfetante 5L e Sabão de álcool 5L) os 3 por R$ 38,00\n• Água sanitária 5L: R$ 12,00\n• Cloro Ativo 12% 5L: R$ 45,00\n• Desinfetante Perfumado 5L: R$ 15,00\n• Sabão de álcool (óleo novo) 5L: R$ 15,00\n• Sabão Lava Roupas Azul: R$ 35,00\n• Amaciante de roupa 5L: R$ 25,00\n• Alvejante sem cloro 5L (Tipo Vanish): R$ 30,00\n• Lava louças 5L: R$ 25,00\n• Limpa Pedras 5L: R$ 30,00\n• Limpa Porcelanato & Cerâmica 5L: R$ 30,00\n\nLinha empresas (5L por R$ 30,00 cada):\n• Limpa Chapas, Brilho Alumínio, Shampoo Automotivo, Desengraxante Automotivo e Ativado 5L.";
    }

    if (q.includes("servico") || q.includes("quais sao os servicos") || q.includes("o que a empresa oferece") || q.includes("o que voces fazem")) {
      return "A Start Mkt Local e a Conectacard oferecem:\n\n• Cartões NFC Infinitos e Plaquinhas QR Code personalizadas\n• Criação de Sites profissionais e Landing Pages\n• Otimização de Perfil de Empresas no Google (Google Meu Negócio)\n• AvaliaCard: Placa NFC para avaliações 5 estrelas no Google\n• Gestão de Tráfego Pago (anúncios no Google e Meta)\n• Linha Superlimpo de produtos de limpeza direto de fábrica em Ponta Porã!";
    }

    if (q.includes("preco do cartao") || q.includes("valor do cartao") || q.includes("quanto custa o cartao")) {
      return "O Cartão NFC Conectacard individual sai a partir de R$ 149 (pagamento único, sem mensalidade obrigatória). Para modelos personalizados com sua logo, fale conosco no WhatsApp!";
    }

    if (q.includes("como funciona") || q.includes("nfc") || q.includes("aproximac") || q.includes("funciona o cartao")) {
      return "O Cartão NFC Conectacard possui tecnologia por aproximação. Basta encostar o cartão na parte traseira de qualquer celular moderno com NFC (iPhone ou Android) e o seu biosite abre na hora com seus contatos, catálogo e redes sociais, sem precisar instalar nenhum aplicativo!";
    }

    if (q.includes("falar com alguem") || q.includes("humano") || q.includes("atendente") || q.includes("whatsapp") || q.includes("contato") || q.includes("telefone")) {
      return "Com certeza! Para falar sobre produtos de limpeza Superlimpo: https://api.whatsapp.com/send?phone=5567998342469 (67) 99834-2469. Para Cartões NFC e serviços: WhatsApp (67) 99317-4612!";
    }

    if (q.includes("entrega") || q.includes("frete") || q.includes("onde entrega") || q.includes("fronteira") || q.includes("correios")) {
      return "Produtos de limpeza Superlimpo: entregas até às 16h (sábados às 7h e 15:30h) em Ponta Porã e Pedro Juan Caballero. Cartões NFC: envio para todo o Brasil via Correios!";
    }

    if (q.includes("onde") || q.includes("endereco") || q.includes("localizacao") || q.includes("cidade") || q.includes("fica")) {
      return "Estamos localizados em Ponta Porã, MS (Start Mkt Local). Atendemos presencialmente toda a região de fronteira e o Brasil inteiro de forma digital!";
    }

    if (q.includes("personaliz") || q.includes("logo") || q.includes("arte") || q.includes("minha marca")) {
      return "Sim! Nossos cartões e plaquinhas são 100% personalizados com o logotipo, cores e identidade visual da sua marca com acabamento premium.";
    }

    // Regra obrigatória: não inventar, não alucinar. Se não souber, passar para humano com link
    return "Vou passar para o atendimento humano: https://api.whatsapp.com/send?phone=5567998342469";
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
    const normKey = norm.replace(/[?!.,;]/g, "");

    // 1. Instant client-side cache check (0ms network latency for repeated questions)
    if (clientCache.current.has(normKey)) {
      const cachedReply = clientCache.current.get(normKey)!;
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: "a-" + Date.now(), role: "assistant", text: cachedReply },
        ]);
        setIsTyping(false);
      }, 180);
      return;
    }

    const greetings = ["oi", "ola", "bom dia", "boa tarde", "boa noite", "opa", "e ai", "tudo bem", "ola tudo bem"];
    if (greetings.includes(norm)) {
      setTimeout(() => {
        const greetingReply = `Olá! Eu sou a LIA 👋 Como posso ajudar você hoje? Fique à vontade para perguntar sobre nossos cartões NFC, preços, serviços de marketing ou produtos Superlimpo!`;
        clientCache.current.set(normKey, greetingReply);
        setMessages((prev) => [
          ...prev,
          {
            id: "a-" + Date.now(),
            role: "assistant",
            text: greetingReply,
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
          clientCache.current.set(normKey, json.reply);
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
      clientCache.current.set(normKey, responseText);
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
                <div className="whitespace-pre-wrap">{renderFormattedText(msg.text, true)}</div>
              </div>
            ) : (
              <div className="bg-[#242424] border border-[#383838] p-3 rounded-2xl rounded-tl-xs text-[#f5f5f5] text-xs sm:text-sm leading-relaxed max-w-[85%] shadow-xs">
                <div className="whitespace-pre-wrap">{renderFormattedText(msg.text, false)}</div>
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
