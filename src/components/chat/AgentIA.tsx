"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { generateHeuristicResponse, type AIProduct } from "@/lib/ai/heuristic-engine";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAiChatStore } from "@/stores/ai-chat-store";

import { useGlobalSettings } from "@/stores/global-settings-context";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  type: "text" | "products";
  text: string;
  products?: AIProduct[];
}

export function AgentIA() {
  const { headerConfig, uiConfig } = useGlobalSettings();
  const { isOpen, openChat, closeChat } = useAiChatStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const whatsappUrl = uiConfig?.marqueeBtn5Link || "https://wa.me/51936085056";
  const messengerUrl = "https://m.me/itoolsperu";

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
      {/* Floating Action Buttons (WhatsApp, Messenger, Asistente IA - Imagen 5) */}
      <aside
        aria-label="Canales de contacto y Asistente IA"
        className={cn(
          "fixed bottom-6 right-6 z-[60] flex flex-col items-center gap-3 transition-all duration-300",
          isOpen && "opacity-0 pointer-events-none scale-0"
        )}
      >
        {/* 1. WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
          title="Chatear por WhatsApp"
          aria-label="Chatear por WhatsApp"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.73C7 10.97 7.9 12.16 8.03 12.33C8.15 12.5 9.78 15.01 12.28 16.09C12.87 16.35 13.33 16.5 13.69 16.62C14.29 16.81 14.83 16.78 15.26 16.72C15.74 16.65 16.74 16.11 16.95 15.52C17.15 14.93 17.15 14.43 17.09 14.33C17.03 14.22 16.87 14.16 16.62 14.04C16.37 13.91 15.15 13.31 14.92 13.23C14.7 13.14 14.54 13.1 14.38 13.35C14.22 13.59 13.75 14.16 13.6 14.33C13.46 14.5 13.31 14.52 13.06 14.4C12.81 14.27 11.75 13.92 10.49 12.8C9.51 11.93 8.85 10.85 8.73 10.64C8.61 10.43 8.71 10.32 8.84 10.19C8.95 10.08 9.09 9.9 9.21 9.76C9.33 9.61 9.38 9.51 9.46 9.35C9.54 9.18 9.5 9.04 9.44 8.91C9.38 8.79 8.91 7.64 8.71 7.16C8.52 6.69 8.32 6.75 8.17 6.74C8.03 6.74 7.87 6.73 7.71 6.73L8.53 7.33Z"/>
          </svg>
        </a>

        {/* 2. Messenger Button */}
        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#0084FF] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
          title="Chatear por Messenger"
          aria-label="Chatear por Messenger"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.07 2 11.1c0 2.87 1.44 5.43 3.69 7.08V22l3.65-2c.86.24 1.76.37 2.66.37 5.52 0 10-4.07 10-9.1S17.52 2 12 2zm1.09 12.24l-2.76-2.95-5.38 2.95 5.91-6.27 2.83 2.95 5.31-2.95-5.91 6.27z"/>
          </svg>
        </a>

        {/* 3. Asistente IA Pill Button */}
        <button
          onClick={openChat}
          className="hidden md:flex h-12 px-5 rounded-full bg-[#D1001C] text-white shadow-2xl items-center gap-2 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20"
          aria-label="Abrir Asistente IA"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-white" />
          <span className="text-xs font-black tracking-wide uppercase">Asistente IA</span>
        </button>
      </aside>

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

