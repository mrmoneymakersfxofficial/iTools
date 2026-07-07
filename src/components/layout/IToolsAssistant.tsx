"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  Minimize2,
  Sparkles,
  ShoppingCart,
  Search,
  Wrench,
  Truck,
  RotateCcw,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brands, searchProducts } from "@/lib/data";
import type { Product } from "@/types";

/* ──────────────────── Types ──────────────────── */

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
  products?: Product[];
  timestamp: Date;
}

/* ──────────────────── Knowledge base (simulated AI) ──────────────────── */

const QUICK_ACTIONS = [
  { icon: Search, label: "Buscar producto", query: "¿Qué producto necesitas?" },
  { icon: ShoppingCart, label: "Ver ofertas", query: "Muéstrame las mejores ofertas" },
  { icon: Truck, label: "Envíos", query: "¿Cómo funcionan los envíos?" },
  { icon: RotateCcw, label: "Devoluciones", query: "¿Cuál es la política de devoluciones?" },
  { icon: CreditCard, label: "Métodos de pago", query: "¿Qué métodos de pago aceptan?" },
  { icon: Wrench, label: "Marcas", query: "¿Qué marcas distribuyen?" },
];

function generateBotResponse(userMsg: string): { text: string; products?: Product[] } {
  const msg = userMsg.toLowerCase().trim();

  // Greeting
  if (/^(hola|buenas|hey|buenos días|buenas tardes|buenas noches|hi|hello)/i.test(msg)) {
    return {
      text: "¡Hola! 👋 Soy el asistente virtual de **iTools Perú**. Estoy aquí para ayudarte a encontrar las mejores herramientas profesionales. ¿En qué puedo ayudarte hoy?",
    };
  }

  // Shipping
  if (/envío|envio|despacho|delivery|llega|tiempo de entrega|ship/i.test(msg)) {
    return {
      text: "📦 **Envíos a todo el Perú**\n\n• **Lima Metropolitana**: Entrega en 24-48 horas (S/ 15.90)\n• **Provincias**: 2-5 días hábiles (tarifa según ubigeo)\n• **Envío GRATIS** en compras mayores a S/ 500\n• Trabajamos con Olva Courier y Shalom Express\n\n¿Necesitas calcular el envío a tu dirección?",
    };
  }

  // Returns
  if (/devoluci|cambio|garantía|garantia|return/i.test(msg)) {
    return {
      text: "🔄 **Política de Devoluciones**\n\n• Tienes **30 días** para devolver productos sin uso\n• El producto debe estar en su empaque original\n• Los gastos de envío de devolución corren por cuenta del cliente\n• **Garantía de fábrica**: 1-3 años según marca (Milwaukee, DeWalt, Bosch)\n• Contamos con **Servicio Técnico Oficial Milwaukee**\n\n¿Tienes un problema con un producto específico?",
    };
  }

  // Payment
  if (/pago|pagar|tarjeta|cuotas|efectivo|yape|plin|transferencia|payment/i.test(msg)) {
    return {
      text: "💳 **Métodos de Pago**\n\n• **Tarjetas**: Visa, Mastercard, American Express (hasta 12 cuotas sin interés)\n• **Transferencia bancaria**: BCP, Interbank, BBVA, Scotiabank, Pichincha\n• **Yape / Plin**: Pago inmediato con confirmación\n• **Efectivo**: En tienda física (Av. Industrial 1234, Ate)\n\nTodas las transacciones están protegidas con encriptación SSL.",
    };
  }

  // Brands
  if (/marcas|brand|distribuyen|fabricantes|tiendas/i.test(msg)) {
    const brandList = brands.map((b) => b.name).join(", ");
    return {
      text: `🔧 **Marcas que distribuimos**\n\n${brandList}\n\nTodas son **100% originales** con garantía de fábrica oficial. ¿Te interesa alguna marca en particular?`,
    };
  }

  // Offers/deals
  if (/oferta|descuento|promo|rebaja|ofertas|barato|sale|deal/i.test(msg)) {
    const results = searchProducts("").filter((p) => p.comparePrice && p.comparePrice > p.price).slice(0, 4);
    return {
      text: "🔥 **¡Ofertas disponibles!**\n\nEstos son algunos de nuestros mejores descuentos actuales:",
      products: results,
    };
  }

  // Search for products
  const searchResults = searchProducts(userMsg);
  if (searchResults.length > 0) {
    return {
      text: `Encontré **${searchResults.length} producto(s)** relacionado(s) con "${userMsg}":`,
      products: searchResults.slice(0, 5),
    };
  }

  // Contact
  if (/contacto|teléfono|telefono|whatsapp|ubicación|ubicacion|dirección|direccion|horario|atención/i.test(msg)) {
    return {
      text: "📞 **Contacto iTools Perú**\n\n• **Teléfono**: 01 234 5678\n• **WhatsApp**: +51 912 345 678\n• **Email**: ventas@itoolsperu.com\n• **Dirección**: Av. Industrial 1234, Ate, Lima\n• **Horario**: Lunes a Sábado 8:00 AM - 6:00 PM\n\n¿En qué más puedo ayudarte?",
    };
  }

  // Default
  return {
    text: "Gracias por tu pregunta. Puedo ayudarte con:\n\n• 🔍 **Buscar productos** por nombre, marca o categoría\n• 📦 **Información de envíos** a todo el Perú\n• 💳 **Métodos de pago** y cuotas\n• 🔄 **Devoluciones y garantías**\n• 🔧 **Marcas** que distribuimos\n\n¿Qué necesitas saber?",
  };
}

/* ──────────────────── Component ──────────────────── */

export function IToolsAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      text: "¡Hola! Soy **iTools Pro** 🤖, tu asistente de ventas virtual. Conozco todo nuestro catálogo de herramientas profesionales. ¿En qué puedo ayudarte?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateBotResponse(text);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "bot",
        text: response.text,
        products: response.products,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (query: string) => {
    sendMessage(query);
  };

  return (
    <>
      {/* ── Floating Button (desktop only) ── */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="hidden lg:flex fixed bottom-6 right-6 z-50 h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-itools-blue to-indigo-600 text-white shadow-[0_4px_24px_rgba(0,102,255,0.4)] hover:shadow-[0_4px_32px_rgba(0,102,255,0.6)] hover:scale-105 transition-all duration-300 group"
          aria-label="Abrir asistente iTools Pro"
        >
          <Bot className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />

          {/* Pulse ring animation */}
          <span className="absolute inset-0 rounded-full bg-itools-blue/30 animate-ping" />

          {/* Label tooltip */}
          <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-itools-dark text-white text-xs font-medium px-3 py-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            iTools Pro — Asistente Virtual
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 h-2 w-2 bg-itools-dark rotate-45" />
          </span>
        </button>
      )}

      {/* ── Chat Panel (desktop only) ── */}
      {isOpen && !isMinimized && (
        <div className="hidden lg:flex fixed bottom-6 right-6 z-50 flex-col w-[400px] h-[560px] rounded-2xl bg-white dark:bg-[#111111] border border-[#e5e7eb] dark:border-[#2a2a2a] shadow-[0_8px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-bottom-4 fade-in-0 duration-300">
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-itools-blue to-indigo-600 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm">
                <Bot className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight">iTools Pro</h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-white/80">En línea — Asistente Virtual</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Minimizar"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50/50 dark:bg-[#0a0a0a]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "bot" && (
                  <div className="flex items-start gap-2.5 max-w-[85%]">
                    <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-itools-blue to-indigo-600 text-white shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5" strokeWidth={2} />
                    </div>
                    <div className="space-y-2">
                      <div className="rounded-2xl rounded-tl-sm bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 shadow-sm">
                        {msg.text.split("**").map((part, i) =>
                          i % 2 === 1 ? (
                            <strong key={i} className="font-semibold text-itools-blue dark:text-itools-blue-light">
                              {part}
                            </strong>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </div>
                      {/* Product cards */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="space-y-2">
                          {msg.products.map((p) => (
                            <a
                              key={p.id}
                              href={`/producto/${p.slug}`}
                              className="flex items-center gap-3 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] px-3 py-2.5 shadow-sm hover:shadow-md hover:border-itools-blue/30 transition-all duration-200"
                            >
                              <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-[#222] flex items-center justify-center shrink-0 overflow-hidden">
                                <img
                                  src={p.images?.[0] || "/placeholder-product.svg"}
                                  alt={p.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                                  {p.name}
                                </p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                                  {p.brand?.name}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xs font-bold text-itools-red">
                                  S/ {p.price.toFixed(2)}
                                </p>
                                {p.comparePrice && (
                                  <p className="text-[10px] text-gray-400 line-through">
                                    S/ {p.comparePrice.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {msg.role === "user" && (
                  <div className="max-w-[75%]">
                    <div className="rounded-2xl rounded-tr-sm bg-itools-blue text-white px-4 py-2.5 text-sm shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-2.5">
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-itools-blue to-indigo-600 text-white shrink-0">
                  <Bot className="h-3.5 w-3.5" strokeWidth={2} />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* ── Quick Actions (only when few messages) ── */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-white dark:bg-[#111111] border-t border-gray-100 dark:border-[#1a1a1a]">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => handleQuickAction(action.query)}
                    className="flex items-center gap-1.5 shrink-0 rounded-full border border-gray-200 dark:border-[#333] px-3 py-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:bg-itools-blue/5 hover:border-itools-blue/30 hover:text-itools-blue transition-all duration-200"
                  >
                    <action.icon className="h-3 w-3" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Input ── */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-[#111111] border-t border-gray-100 dark:border-[#1a1a1a] shrink-0"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 h-10 bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#333] text-sm focus-visible:ring-itools-blue/30"
              aria-label="Mensaje para el asistente"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              className="h-10 w-10 shrink-0 bg-gradient-to-r from-itools-blue to-indigo-600 hover:from-itools-blue-dark hover:to-indigo-700 text-white shadow-sm disabled:opacity-40"
              aria-label="Enviar mensaje"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      {/* ── Minimized pill (desktop only) ── */}
      {isOpen && isMinimized && (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="hidden lg:flex fixed bottom-6 right-6 z-50 items-center gap-2.5 pl-4 pr-5 py-3 rounded-full bg-gradient-to-r from-itools-blue to-indigo-600 text-white shadow-[0_4px_24px_rgba(0,102,255,0.4)] hover:shadow-[0_4px_32px_rgba(0,102,255,0.6)] hover:scale-105 transition-all duration-300"
          aria-label="Abrir chat iTools Pro"
        >
          <div className="relative">
            <Bot className="h-5 w-5" strokeWidth={1.5} />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-itools-blue" />
          </div>
          <span className="text-sm font-medium">iTools Pro</span>
          <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
        </button>
      )}
    </>
  );
}