"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Home, ShoppingBag, MessageCircle, User, ChevronLeft, ChevronRight,
  X, Send, Wrench, Search, Sparkles,
} from "lucide-react";

const brandLinks = [
  { name: "Milwaukee", slug: "milwaukee", color: "#D1001C" },
  { name: "DeWalt", slug: "dewalt", color: "#FFD700", textColor: "#1A1A1A" },
  { name: "Bosch", slug: "bosch", color: "#005691" },
  { name: "Makita", slug: "makita", color: "#0077C8" },
  { name: "Stanley", slug: "stanley", color: "#E35205" },
  { name: "3M", slug: "3m", color: "#CC3300" },
  { name: "Honda", slug: "honda", color: "#CC0000" },
  { name: "Klein Tools", slug: "klein-tools", color: "#FFC220", textColor: "#1A1A1A" },
  { name: "Toro", slug: "toro", color: "#1A1A1A", textColor: "#CC0000" },
  { name: "EGO", slug: "ego", color: "#0d5c4a" },
  { name: "Metabo HPT", slug: "metabo-hpt", color: "#1b7a3a" },
  { name: "FLEX", slug: "flex", color: "#1A1A1A" },
  { name: "STIHL", slug: "stihl", color: "#E35205" },
  { name: "FEIN", slug: "fein", color: "#666666" },
  { name: "SKIL", slug: "skil", color: "#CC0000" },
  { name: "Festool", slug: "festool", color: "#1A1A1A", textColor: "#00A651" },
  { name: "JET", slug: "jet", color: "#CC0000" },
  { name: "Knaack", slug: "knaack", color: "#8B6914" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [showBrands, setShowBrands] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "¡Hola! Soy iTools Pro, tu asistente de herramientas. ¿En qué puedo ayudarte?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const brandsScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Hide brands panel on navigation
  useEffect(() => {
    setShowBrands(false);
  }, [pathname]);

  const isBrandPage = pathname.startsWith("/marca/");

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    // Simulate bot response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Gracias por tu mensaje. Un especialista iTools te contactará pronto. Mientras tanto, puedes explorar nuestras marcas en el menú inferior.",
        },
      ]);
    }, 1000);
  };

  const scrollBrands = (dir: "left" | "right") => {
    if (brandsScrollRef.current) {
      const scrollAmount = 200;
      brandsScrollRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* ── Main Bottom Bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/98 backdrop-blur-xl border-t border-[#1A1A1A]">
        {/* Brands ticker — expandable */}
        <div className="relative">
          {showBrands && (
            <div className="absolute bottom-full left-0 right-0 bg-[#0A0A0A]/98 backdrop-blur-xl border-b border-[#1A1A1A]">
              {/* Brand scroll area */}
              <div className="relative">
                {/* Left fade */}
                <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
                  style={{ background: "linear-gradient(to right, #0A0A0A, transparent)" }}
                />
                {/* Right fade */}
                <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
                  style={{ background: "linear-gradient(to left, #0A0A0A, transparent)" }}
                />
                {/* Scroll buttons */}
                <button
                  onClick={() => scrollBrands("left")}
                  className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#888] hover:text-white hover:border-[#555] transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollBrands("right")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#888] hover:text-white hover:border-[#555] transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div
                  ref={brandsScrollRef}
                  className="flex gap-1.5 px-6 py-3 overflow-x-auto no-scrollbar"
                >
                  {brandLinks.map((brand) => {
                    const isActive = pathname === `/marca/${brand.slug}`;
                    return (
                      <Link
                        key={brand.slug}
                        href={`/marca/${brand.slug}`}
                        className={`shrink-0 px-3 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-[0.97] border ${
                          isActive ? "ring-1 ring-white/20" : ""
                        }`}
                        style={{
                          backgroundColor: isActive ? brand.color : `${brand.color}22`,
                          color: (brand.textColor || "#FFF"),
                          borderColor: isActive ? brand.color : `${brand.color}44`,
                          boxShadow: isActive ? `0 0 12px ${brand.color}44` : "none",
                        }}
                      >
                        {brand.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
              {/* Label */}
              <div className="px-4 pb-2 flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#333] to-transparent" />
                <span className="text-[9px] text-[#555] uppercase tracking-[0.15em] font-medium">
                  18 Marcas Oficiales
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#333] to-transparent" />
              </div>
            </div>
          )}

          {/* Brand toggle strip */}
          <button
            onClick={() => setShowBrands(!showBrands)}
            className="w-full flex items-center justify-center gap-2 py-1.5 text-[10px] text-[#666] hover:text-[#AAA] transition-colors uppercase tracking-[0.12em] font-medium"
          >
            <div className="flex -space-x-1">
              {brandLinks.slice(0, 6).map((b) => (
                <div
                  key={b.slug}
                  className="w-2 h-2 rounded-full border border-[#333]"
                  style={{ backgroundColor: b.color }}
                />
              ))}
            </div>
            <span>{showBrands ? "Ocultar Marcas" : "Ver Todas las Marcas"}</span>
            <ChevronRight
              className={`h-3 w-3 transition-transform ${showBrands ? "rotate-90" : ""}`}
            />
          </button>
        </div>

        {/* Main nav buttons */}
        <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          <Link
            href="/"
            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all ${
              pathname === "/" ? "text-[#E35205]" : "text-[#666] hover:text-[#AAA]"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[9px] font-semibold uppercase tracking-wide">Inicio</span>
            {pathname === "/" && <div className="w-4 h-0.5 rounded-full bg-[#E35205]" />}
          </Link>

          <Link
            href="/categoria/herramientas-electricas"
            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all ${
              pathname.startsWith("/categoria") ? "text-[#E35205]" : "text-[#666] hover:text-[#AAA]"
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="text-[9px] font-semibold uppercase tracking-wide">Categorías</span>
            {pathname.startsWith("/categoria") && <div className="w-4 h-0.5 rounded-full bg-[#E35205]" />}
          </Link>

          {/* Chatbot button — special elevated */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all -mt-5"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90"
              style={{
                background: "linear-gradient(135deg, #E35205, #CC3300)",
                boxShadow: showChat
                  ? "0 0 20px rgba(227, 82, 5, 0.5), 0 4px 12px rgba(227, 82, 5, 0.3)"
                  : "0 4px 16px rgba(227, 82, 5, 0.35)",
              }}
            >
              <MessageCircle className="h-5 w-5 text-white" />
              <Sparkles className="h-3 w-3 text-white/80 absolute -top-0.5 -right-0.5" />
            </div>
            <span className="text-[8px] font-bold uppercase tracking-widest text-[#E35205]">
              iTools Pro
            </span>
          </button>

          <Link
            href="/marca/milwaukee"
            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all ${
              isBrandPage ? "text-[#E35205]" : "text-[#666] hover:text-[#AAA]"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[9px] font-semibold uppercase tracking-wide">Marcas</span>
            {isBrandPage && <div className="w-4 h-0.5 rounded-full bg-[#E35205]" />}
          </Link>

          <Link
            href="#"
            className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl text-[#666] hover:text-[#AAA] transition-all"
          >
            <User className="h-5 w-5" />
            <span className="text-[9px] font-semibold uppercase tracking-wide">Cuenta</span>
          </Link>
        </div>
      </nav>

      {/* ── Chatbot Floating Panel ── */}
      {showChat && (
        <div className="fixed bottom-24 left-2 right-2 sm:left-auto sm:right-4 sm:w-[380px] z-[60] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-[#111] rounded-2xl border border-[#222] overflow-hidden shadow-2xl shadow-black/50"
            style={{ boxShadow: "0 0 40px rgba(227, 82, 5, 0.1), 0 20px 60px rgba(0,0,0,0.5)" }}
          >
            {/* Chat header */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, #E35205, #CC3300)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Wrench className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">iTools Pro</p>
                  <p className="text-[10px] text-white/70">Asistente de herramientas</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/15">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[9px] text-white/80 font-medium">En línea</span>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Chat messages */}
            <div
              ref={scrollRef}
              className="h-64 overflow-y-auto p-3 space-y-2.5 no-scrollbar"
              style={{ background: "linear-gradient(180deg, #0D0D0D, #111)" }}
            >
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-md text-white"
                        : "rounded-bl-md text-[#DDD] bg-[#1A1A1A] border border-[#222]"
                    }`}
                    style={msg.role === "user" ? { background: "linear-gradient(135deg, #E35205, #CC3300)" } : {}}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-[#1A1A1A]">
              {["Ver ofertas", "Marcas", "Envío", "Garantía"].map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    setChatMessages((prev) => [...prev, { role: "user", text: action }]);
                    setTimeout(() => {
                      setChatMessages((prev) => [
                        ...prev,
                        {
                          role: "bot",
                          text: `Perfecto, te ayudo con ${action.toLowerCase()}. Puedes explorar nuestra sección completa en la web o contactarnos al WhatsApp principal.`,
                        },
                      ]);
                    }, 800);
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold border border-[#333] text-[#999] hover:text-white hover:border-[#E35205] hover:bg-[#E35205]/10 transition-all"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Chat input */}
            <div className="px-3 py-3 flex gap-2 border-t border-[#1A1A1A]">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Escribe tu consulta..."
                className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#E35205] transition-colors"
              />
              <button
                onClick={sendChat}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90"
                style={{ background: "linear-gradient(135deg, #E35205, #CC3300)" }}
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}