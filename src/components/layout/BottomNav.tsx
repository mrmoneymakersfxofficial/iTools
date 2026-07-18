"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Home, ShoppingBag, MessageCircle, User, ChevronLeft, ChevronRight,
  X, Send, Wrench, Search, Sparkles, ArrowLeft, Zap, Shield, Trees,
  Settings, Package, HardHat, Ruler,
} from "lucide-react";
import { getProductsByBrandSlug, categories, brands } from "@/lib/data";
import type { Product } from "@/types";

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

const categoryIcons: Record<string, React.ReactNode> = {
  "Zap": <Zap className="h-5 w-5" />,
  "Wrench": <Wrench className="h-5 w-5" />,
  "Trees": <Trees className="h-5 w-5" />,
  "Shield": <Shield className="h-5 w-5" />,
  "Settings": <Settings className="h-5 w-5" />,
  "Package": <Package className="h-5 w-5" />,
  "HardHat": <HardHat className="h-5 w-5" />,
  "Ruler": <Ruler className="h-5 w-5" />,
};

function formatPrice(price: number): string {
  return `S/ ${price.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showBrands, setShowBrands] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "¡Hola! Soy iTools Pro, tu asistente de herramientas. ¿En qué puedo ayudarte?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const brandsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatMessages]);

  useEffect(() => {
    setShowBrands(false);
    setShowCategories(false);
  }, [pathname]);

  const isBrandPage = pathname.startsWith("/marca/");
  const isCategoryPage = pathname.startsWith("/categoria/");

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { role: "bot", text: "Gracias por tu mensaje. Un especialista iTools te contactará pronto. Mientras tanto, explora nuestras marcas y categorías en el menú inferior." },
      ]);
    }, 1000);
  };

  const scrollBrands = (dir: "left" | "right") => {
    if (brandsScrollRef.current) {
      brandsScrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
    }
  };

  // Get products for a selected category (with children)
  const getCategoryProducts = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return [];
    if (cat.children?.length) {
      const childIds = cat.children.map(c => c.id);
      return allProducts.filter(p => p.categoryId && childIds.includes(p.categoryId)).slice(0, 4);
    }
    return allProducts.filter(p => p.categoryId === catId).slice(0, 4);
  };

  // Simple static subset for the modal (imported from data)
  const allProducts = brands.flatMap(b => getProductsByBrandSlug(b.slug));

  return (
    <>
      {/* ── Bottom Bar — MOBILE ONLY ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/98 backdrop-blur-xl border-t border-[#1A1A1A]">
        {/* Main nav buttons */}
        <div className="flex items-center justify-around px-1 pb-[env(safe-area-inset-bottom)]">
          <Link
            href="/"
            className={`flex flex-col items-center gap-0.5 py-2 px-2.5 rounded-xl transition-all ${
              pathname === "/" ? "text-[#E35205]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Inicio</span>
            {pathname === "/" && <div className="w-4 h-0.5 rounded-full bg-[#E35205]" />}
          </Link>

          <button
            onClick={() => { setShowChat(false); setShowBrands(false); setShowCategories(!showCategories); }}
            className={`flex flex-col items-center gap-0.5 py-2 px-2.5 rounded-xl transition-all ${
              isCategoryPage || showCategories ? "text-[#E35205]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Categorías</span>
            {(isCategoryPage || showCategories) && <div className="w-4 h-0.5 rounded-full bg-[#E35205]" />}
          </button>

          {/* Chatbot button — elevated center */}
          <button
            onClick={() => { setShowCategories(false); setShowBrands(false); setShowChat(!showChat); }}
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
            <span className="text-[7px] font-black uppercase tracking-widest text-[#E35205]">iTools Pro</span>
          </button>

          <button
            onClick={() => { setShowChat(false); setShowCategories(false); setShowBrands(!showBrands); }}
            className={`flex flex-col items-center gap-0.5 py-2 px-2.5 rounded-xl transition-all ${
              isBrandPage || showBrands ? "text-[#E35205]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Marcas</span>
            {(isBrandPage || showBrands) && <div className="w-4 h-0.5 rounded-full bg-[#E35205]" />}
          </button>

          <Link
            href="/login"
            className="flex flex-col items-center gap-0.5 py-2 px-2.5 rounded-xl text-gray-400 hover:text-gray-200 transition-all"
          >
            <User className="h-5 w-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Cuenta</span>
          </Link>
        </div>
      </nav>

      {/* ── BRANDS MODAL ── */}
      {showBrands && (
        <div className="lg:hidden fixed inset-0 z-[60]" onClick={() => setShowBrands(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-[#0A0A0A] rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#333]" />
            </div>
            {/* Header */}
            <div className="px-4 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wide">18 Marcas Oficiales</h3>
                <p className="text-[10px] text-[#666] mt-0.5">Selecciona una marca para ver sus productos</p>
              </div>
              <button onClick={() => setShowBrands(false)} className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                <X className="h-4 w-4 text-[#888]" />
              </button>
            </div>

            {/* Horizontal brand scroll */}
            <div className="relative px-2">
              <div className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #0A0A0A, transparent)" }} />
              <div className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #0A0A0A, transparent)" }} />
              <button onClick={() => scrollBrands("left")} className="absolute left-0.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#888]">
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button onClick={() => scrollBrands("right")} className="absolute right-0.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#888]">
                <ChevronRight className="h-3 w-3" />
              </button>
              <div
                ref={brandsScrollRef}
                className="flex gap-2 px-8 py-3 overflow-x-auto no-scrollbar"
              >
                {brandLinks.map((brand) => {
                  const isActive = pathname === `/marca/${brand.slug}`;
                  return (
                    <button
                      key={brand.slug}
                      onClick={() => { setShowBrands(false); router.push(`/marca/${brand.slug}`); }}
                      className={`shrink-0 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 border ${
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
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand cards grid */}
            <div className="px-3 pb-6 grid grid-cols-2 gap-2 overflow-y-auto max-h-[45vh] no-scrollbar">
              {brandLinks.map((brand) => (
                <button
                  key={brand.slug}
                  onClick={() => { setShowBrands(false); router.push(`/marca/${brand.slug}`); }}
                  className="relative overflow-hidden rounded-xl border border-[#1A1A1A] transition-all active:scale-[0.97] text-left"
                >
                  <div className="px-3 pt-3 pb-2.5" style={{ backgroundColor: brand.color }}>
                    <p className="text-xs font-black uppercase tracking-wider" style={{ color: brand.textColor || "#FFF" }}>
                      {brand.name}
                    </p>
                    <p className="text-[9px] mt-0.5 font-medium opacity-70" style={{ color: brand.textColor || "#FFF" }}>
                      Ver tienda →
                    </p>
                  </div>
                  <div className="bg-[#111] px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Wrench className="h-3 w-3 text-[#555]" />
                      <span className="text-[9px] text-[#666]">Productos</span>
                    </div>
                    <ChevronRight className="h-3 w-3 text-[#444]" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CATEGORIES MODAL ── */}
      {showCategories && (
        <div className="lg:hidden fixed inset-0 z-[60]" onClick={() => setShowCategories(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-[#0A0A0A] rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#333]" />
            </div>
            {/* Header */}
            <div className="px-4 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wide">Categorías</h3>
                <p className="text-[10px] text-[#666] mt-0.5">Explora por tipo de herramienta</p>
              </div>
              <button onClick={() => setShowCategories(false)} className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                <X className="h-4 w-4 text-[#888]" />
              </button>
            </div>

            {/* Category list with product previews */}
            <div className="overflow-y-auto max-h-[65vh] pb-6 no-scrollbar">
              {selectedCategory ? (
                <>
                  {/* Back button */}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="mx-4 mb-3 flex items-center gap-1.5 text-[11px] text-[#E35205] font-semibold"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Todas las Categorías
                  </button>
                  {/* Subcategories and products */}
                  {(() => {
                    const cat = categories.find(c => c.id === selectedCategory);
                    if (!cat) return null;
                    const products = getCategoryProducts(selectedCategory);
                    return (
                      <div>
                        {/* Subcategory horizontal scroll */}
                        {cat.children && cat.children.length > 0 && (
                          <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
                            {cat.children.map(child => (
                              <Link
                                key={child.id}
                                href={`/categoria/${child.slug}`}
                                onClick={() => setShowCategories(false)}
                                className="shrink-0 px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#222] text-[10px] font-bold text-[#CCC] uppercase tracking-wider hover:border-[#E35205] hover:text-[#E35205] transition-all"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                        {/* Product previews */}
                        {products.length > 0 ? (
                          <div className="px-4 grid grid-cols-2 gap-2">
                            {products.map(product => (
                              <Link
                                key={product.id}
                                href={`/producto/${product.slug}`}
                                onClick={() => setShowCategories(false)}
                                className="bg-[#111] rounded-xl border border-[#1A1A1A] overflow-hidden"
                              >
                                <div className="h-24 bg-[#1A1A1A] flex items-center justify-center">
                                  <Wrench className="h-8 w-8 text-[#333]" />
                                </div>
                                <div className="p-2.5">
                                  <p className="text-[10px] text-[#CCC] line-clamp-2 leading-snug mb-1.5">{product.name}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#E35205]">{formatPrice(product.price)}</span>
                                    {product.comparePrice && (
                                      <span className="text-[9px] text-[#555] line-through">{formatPrice(product.comparePrice)}</span>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <p className="text-[#555] text-xs">Próximamente más productos en esta categoría.</p>
                          </div>
                        )}
                        {/* Link to full category */}
                        <div className="px-4 mt-3">
                          <Link
                            href={`/categoria/${cat.slug}`}
                            onClick={() => setShowCategories(false)}
                            className="block w-full text-center py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all active:scale-[0.98]"
                            style={{ background: "linear-gradient(135deg, #E35205, #CC3300)" }}
                          >
                            Ver Toda la Categoría
                          </Link>
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : (
                /* Main category grid */
                <div className="px-3 grid grid-cols-2 gap-2">
                  {categories.map(cat => {
                    const prodCount = getCategoryProducts(cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className="relative overflow-hidden rounded-xl border border-[#1A1A1A] bg-[#111] p-4 text-left transition-all active:scale-[0.97] hover:border-[#E35205]/40"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#E35205]/10 flex items-center justify-center text-[#E35205] mb-3">
                          {categoryIcons[cat.icon || ""] || <Wrench className="h-5 w-5" />}
                        </div>
                        <p className="text-xs font-bold text-white leading-tight">{cat.name}</p>
                        <p className="text-[9px] text-[#666] mt-1">{prodCount} productos</p>
                        <ChevronRight className="absolute top-4 right-3 h-3.5 w-3.5 text-[#444]" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CHATBOT PANEL ── */}
      {showChat && (
        <div className="lg:hidden fixed bottom-20 left-2 right-2 z-[60] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div
            className="bg-[#111] rounded-2xl border border-[#222] overflow-hidden"
            style={{ boxShadow: "0 0 40px rgba(227, 82, 5, 0.1), 0 20px 60px rgba(0,0,0,0.5)" }}
          >
            {/* Chat header */}
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #E35205, #CC3300)" }}>
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
                <button onClick={() => setShowChat(false)} className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                  <X className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>
            {/* Chat messages */}
            <div ref={scrollRef} className="h-48 overflow-y-auto p-3 space-y-2.5 no-scrollbar" style={{ background: "linear-gradient(180deg, #0D0D0D, #111)" }}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user" ? "rounded-br-md text-white" : "rounded-bl-md text-[#DDD] bg-[#1A1A1A] border border-[#222]"
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
                      setChatMessages((prev) => [...prev, { role: "bot", text: `Te ayudo con ${action.toLowerCase()}. Explora nuestra web o contacta WhatsApp principal.` }]);
                    }, 800);
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold border border-[#333] text-[#999] hover:text-white hover:border-[#E35205] transition-all"
                >
                  {action}
                </button>
              ))}
            </div>
            {/* Input */}
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
                className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-90"
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