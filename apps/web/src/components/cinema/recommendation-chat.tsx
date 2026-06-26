"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Film, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface MovieRecommendation {
  title: string;
  reason: string;
}

const welcomeMessage: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Olá! 🎬 Diga o que você está com vontade de assistir (gênero, humor, filme favorito…) e vou recomendar filmes incríveis pra você!",
};

const movieDb: MovieRecommendation[] = [
  { title: "Duna: Parte Dois", reason: "continuação épica que expande o universo de Arrakis com visuais deslumbrantes" },
  { title: "Oppenheimer", reason: "drama histórico intenso sobre o criador da bomba atômica" },
  { title: "Pobres Criaturas", reason: "ficção científica excêntrica e visualmente impressionante" },
  { title: "Interestelar", reason: "viagem espacial emocionante que mistura ciência e emoção familiar" },
  { title: "Clube da Luta", reason: "clássico provocador que questiona identidade e consumo" },
  { title: "O Senhor dos Anéis: O Retorno do Rei", reason: "fantasia épica com batalhas grandiosas e desfecho emocionante" },
  { title: "Coringa", reason: "estudo psicológico sombrio sobre os limites da sanidade" },
  { title: "Parasita", reason: "sátira social premiada que mistura suspense e crítica de classe" },
  { title: "Tudo em Todo Lugar ao Mesmo Tempo", reason: "multiverso criativo e emocionante sobre escolhas e família" },
  { title: "Whiplash", reason: "drama musical intenso sobre ambição e perfeccionismo" },
  { title: "A Chegada", reason: "ficção científica reflexiva sobre linguagem e tempo" },
  { title: "Mad Max: Estrada da Fúria", reason: "ação alucinante em um mundo pós-apocalíptico" },
];

function generateRecommendations(userInput: string): string {
  const lowerInput = userInput.toLowerCase();
  let matched = movieDb.filter(
    (m) =>
      m.title.toLowerCase().includes(lowerInput) ||
      m.reason.toLowerCase().includes(lowerInput),
  );

  if (matched.length === 0) {
    matched = [...movieDb].sort(() => Math.random() - 0.5).slice(0, 3);
  } else {
    matched = matched.slice(0, 3);
  }

  if (matched.length === 0) {
    return "Não encontrei filmes com essas características, mas que tal conferir nossa página inicial para ver os lançamentos? 😊";
  }

  const lines = matched.map(
    (m, i) => `${i + 1}. **${m.title}** — ${m.reason}.`,
  );

  return `Recomendo esses filmes:\n\n${lines.join("\n")}\n\nGostou de alguma sugestão? Posso te dar mais detalhes! 🍿`;
}

function simulateTyping(content: string): Promise<string> {
  return new Promise((resolve) => {
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => resolve(content), delay);
  });
}

export const RecommendationChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const reduceMotion = useReducedMotion();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const response = generateRecommendations(trimmed);
    const assistantContent = await simulateTyping(response);

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: assistantContent,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  }, [input, isLoading]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-fab"
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent-red-500 text-white shadow-[0_8px_24px_rgba(229,57,53,0.35)] hover:bg-accent-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red-500/60"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
            whileHover={reduceMotion ? {} : { scale: 1.08 }}
            whileTap={reduceMotion ? {} : { scale: 0.94 }}
            aria-label="Abrir chat de recomendações"
          >
            <MessageCircle size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
            className="fixed bottom-6 right-6 z-50 flex w-[calc(100vw-2rem)] max-w-[400px] flex-col rounded-[var(--radius-lg)] border border-border/90 bg-background-elevated/96 shadow-[0_16px_48px_rgba(0,0,0,0.3)] backdrop-blur-xl"
            style={{ maxHeight: "min(600px, calc(100vh - 4rem))" }}
          >
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-accent-red-500" />
                <h2 className="text-sm font-semibold text-foreground">
                  Recomendação de Filmes
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-foreground-muted hover:bg-background-strong hover:text-foreground focus-visible:outline-none"
                aria-label="Fechar chat"
              >
                <X size={16} />
              </button>
            </div>

            <div
              className="flex-1 space-y-4 overflow-y-auto px-5 py-4"
              style={{ minHeight: 0 }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-[var(--radius-md)] px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-accent-red-500 text-white"
                        : "glass-panel border border-border/60 text-foreground",
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="glass-panel flex items-center gap-2 rounded-[var(--radius-md)] border border-border/60 px-4 py-3">
                    <Film size={14} className="text-accent-red-500" />
                    <span className="text-sm text-foreground-muted">
                      Pensando nas melhores recomendações...
                    </span>
                    <span className="flex gap-0.5">
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-red-500"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-red-500"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-red-500"
                        style={{ animationDelay: "300ms" }}
                      />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border/60 px-5 py-4">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ex: ação, suspense, drama..."
                  disabled={isLoading}
                  className="h-11 flex-1 rounded-[var(--radius-md)] border border-border/90 bg-surface px-4 text-sm text-foreground placeholder:text-foreground-muted/80 hover:border-border focus-visible:border-accent-red-500/55 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent-red-500/45 disabled:opacity-60"
                  aria-label="Digite sua mensagem"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent-red-500 text-white hover:bg-accent-red-600 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red-500/60"
                  aria-label="Enviar mensagem"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface RecommendationChatFloatingButtonProps {
  onClick: () => void;
}

export const RecommendationChatFloatingButton = ({
  onClick,
}: RecommendationChatFloatingButtonProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent-red-500 text-white shadow-[0_8px_24px_rgba(229,57,53,0.35)] hover:bg-accent-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red-500/60"
      whileHover={reduceMotion ? {} : { scale: 1.08 }}
      whileTap={reduceMotion ? {} : { scale: 0.94 }}
      aria-label="Abrir chat de recomendações"
    >
      <MessageCircle size={22} />
    </motion.button>
  );
};
