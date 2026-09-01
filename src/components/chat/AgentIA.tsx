"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { generateHeuristicResponse, type AIProduct } from "@/lib/ai/heuristic-engine";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAiChatStore } from "@/stores/ai-chat-store";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  type: "text" | "products";
  text: string;
  products?: AIProduct[];
}

export function AgentIA() {
  const { isOpen, openChat, closeChat } = useAiChatStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        setMessages([
          {
            id: "welcome",
            sender: "ai",
            type: "text",
            text: "¡Hola! 👋 Soy el Asistente IA de iTools. ¿En qué puedo ayudarte hoy?"
          }
        ]);
      }
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      type: "text",
      text: input.trim()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    
    setTimeout(async () => {
      const response = await generateHeuristicResponse(userMsg.text);
      setMessages(prev => [
        ...prev, 
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          type: response.type,
          text: response.text,
          products: response.products
        }
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button for PC / Laptop (Desktop) */}
      <button
        onClick={openChat}
        className={cn(
          "hidden md:flex fixed bottom-6 right-6 z-[60] h-14 px-5 rounded-full bg-[#D1001C] text-white shadow-2xl items-center gap-2.5 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20",
          isOpen && "opacity-0 pointer-events-none scale-0"
        )}
        aria-label="Abrir Asistente IA"
      >
        <Sparkles className="w-5 h-5 animate-pulse text-white" />
        <span className="text-xs font-bold tracking-wide uppercase">Asistente IA</span>
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed z-[999] bg-white shadow-2xl flex flex-col transition-all duration-300 overflow-hidden border border-neutral-200",
          // Mobile styling (full screen or attached to bottom nav)
          "bottom-[70px] right-2 left-2 sm:bottom-6 sm:left-auto sm:right-6 rounded-2xl h-[450px] sm:h-[550px] sm:w-[380px]",
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 pointer-events-none translate-y-4"
        )}
      >
        {/* Header */}
        <div className="bg-[#111] p-4 flex items-center justify-between text-white shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D1001C] to-red-900 flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Asistente IA</h3>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> En línea
              </p>
            </div>
          </div>
          <button 
            onClick={closeChat}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex w-full", msg.sender === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                msg.sender === "user" 
                  ? "bg-[#D1001C] text-white rounded-br-sm" 
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
              )}>
                <div className="whitespace-pre-wrap text-sm">{msg.text}</div>
                
                {msg.type === "products" && msg.products && (
                  <div className="mt-3 flex flex-col gap-2">
                    {msg.products.map(p => (
                      <Link href={`/producto/${p.slug}`} key={p._id} onClick={closeChat} className="flex gap-3 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 group">
                        <div className="w-12 h-12 rounded-lg bg-white shrink-0 overflow-hidden border border-gray-200 flex items-center justify-center">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <div className="w-full h-full bg-gray-100" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="text-[11px] font-bold text-gray-900 truncate leading-tight group-hover:text-[#D1001C]">{p.name}</p>
                          <p className="text-xs font-black text-gray-900 mt-0.5">{formatPrice(p.salePrice || p.price)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100 shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntame algo..."
              className="flex-1 h-10 rounded-full border border-gray-200 bg-gray-50 px-4 text-sm focus:outline-none focus:border-[#D1001C] focus:ring-1 focus:ring-[#D1001C] text-gray-800"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 shrink-0 rounded-full bg-[#111] text-white flex items-center justify-center hover:bg-[#D1001C] disabled:opacity-50 disabled:hover:bg-[#111] transition-colors"
            >
              <Send className="w-4 h-4 ml-[-2px]" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[9px] text-gray-400 font-medium">Búsqueda neuronal por iTools IA</span>
          </div>
        </div>
      </div>
    </>
  );
}

