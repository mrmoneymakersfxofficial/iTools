"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Home, ShoppingBag, MessageCircle, User, ChevronLeft, ChevronRight,
  X, Send, Wrench, Search, Sparkles, ArrowLeft, Zap, Shield, Trees,
  Settings, Package, HardHat, Ruler, Layers, BatteryCharging,
} from "lucide-react";
import { getProductsByBrandSlug, categories, brands } from "@/lib/data";
import { officialCategories } from "@/lib/official-categories";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import { useAiChatStore } from "@/stores/ai-chat-store";
import { useGlobalSettings } from "@/stores/global-settings-context";

const brandLinks = [
  { name: "Milwaukee", slug: "milwaukee", color: "#DB001A", textColor: "#FFF" },
  { name: "DeWalt", slug: "dewalt", color: "#FEBD17", textColor: "#1A1A1A" },
  { name: "Bosch", slug: "bosch", color: "#002A54", textColor: "#FFF" },
  { name: "Makita", slug: "makita", color: "#0077C8", textColor: "#FFF" },
  { name: "Truper", slug: "truper", color: "#F37021", textColor: "#FFF" },
  { name: "Total", slug: "total", color: "#00828A", textColor: "#FFF" },
  { name: "Ingco", slug: "ingco", color: "#F39200", textColor: "#FFF" },
  { name: "Stanley", slug: "stanley", color: "#FFC20F", textColor: "#1A1A1A" },
  { name: "DCA", slug: "dca", color: "#008554", textColor: "#FFF" },
  { name: "Dong Cheng", slug: "dong-cheng", color: "#0055A4", textColor: "#FFF" },
  { name: "Kaili", slug: "kaili", color: "#0059D6", textColor: "#FFF" },
  { name: "Kamasa", slug: "kamasa", color: "#FFE000", textColor: "#1A1A1A" },
  { name: "SATA", slug: "sata", color: "#006747", textColor: "#FFF" },
  { name: "Toptul", slug: "toptul", color: "#E31837", textColor: "#FFF" },
  { name: "Bahco", slug: "bahco", color: "#F57B20", textColor: "#FFF" },
  { name: "EmtOP", slug: "emtop", color: "#E1001A", textColor: "#FFF" },
  { name: "Tramontina", slug: "tramontina", color: "#001689", textColor: "#FFF" },
  { name: "Wagner", slug: "wagner", color: "#FFCE00", textColor: "#1A1A1A" },
  { name: "Würth", slug: "wurth", color: "#CC0000", textColor: "#FFF" },
  { name: "3M", slug: "3m", color: "#E60000", textColor: "#FFF" },
  { name: "Honda", slug: "honda", color: "#E4002B", textColor: "#FFF" },
  { name: "Klein Tools", slug: "klein-tools", color: "#F58220", textColor: "#1A1A1A" },
  { name: "Toro", slug: "toro", color: "#C8102E", textColor: "#FFF" },
  { name: "EGO", slug: "ego", color: "#00843D", textColor: "#FFF" },
  { name: "Metabo HPT", slug: "metabo-hpt", color: "#007A3D", textColor: "#FFF" },
  { name: "FLEX", slug: "flex", color: "#D32F2F", textColor: "#FFF" },
  { name: "STIHL", slug: "stihl", color: "#F37021", textColor: "#FFF" },
  { name: "FEIN", slug: "fein", color: "#C8102E", textColor: "#FFF" },
  { name: "SKIL", slug: "skil", color: "#D71920", textColor: "#FFF" },
  { name: "Festool", slug: "festool", color: "#004F34", textColor: "#FFF" },
  { name: "JET", slug: "jet", color: "#C8102E", textColor: "#FFF" },
  { name: "Knaack", slug: "knaack", color: "#8B5A2B", textColor: "#FFF" },
];

const categoryIcons: Record<string, React.ReactNode> = {
  "Zap": <Zap className="h-5 w-5" />,
  "BatteryCharging": <BatteryCharging className="h-5 w-5" />,
  "Wrench": <Wrench className="h-5 w-5" />,
  "Settings": <Settings className="h-5 w-5" />,
  "Package": <Package className="h-5 w-5" />,
  "Shield": <Shield className="h-5 w-5" />,
  "Layers": <Layers className="h-5 w-5" />,
  "HardHat": <HardHat className="h-5 w-5" />,
};

export function BottomNav() {
  const { uiConfig } = useGlobalSettings();
  const assistantTitle = uiConfig?.aiAssistantTitle || "Asistente IA";
  const assistantIconUrl = uiConfig?.aiAssistantIconUrl;
  const pathname = usePathname();
  const router = useRouter();
  const [showBrands, setShowBrands] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const brandsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowBrands(false);
    setShowCategories(false);
  }, [pathname]);

  const isBrandPage = pathname?.startsWith("/marca/") ?? false;
  const isCategoryPage = pathname?.startsWith("/categoria/") ?? false;

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
      {/* â”€â”€ Bottom Bar â€” MOBILE ONLY â”€â”€ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/98 backdrop-blur-xl border-t border-[#1A1A1A]">
        {/* Main nav buttons */}
        <div className="flex items-center justify-around px-1 pb-[env(safe-area-inset-bottom)]">
          <Link
            href="/"
            className={`flex flex-col items-center gap-0.5 py-2 px-2.5 rounded-xl transition-all ${
              pathname === "/" ? "text-[#D1001C]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Inicio</span>
            {pathname === "/" && <div className="w-4 h-0.5 rounded-full bg-[#E35205]" />}
          </Link>

          <button
            onClick={() => { setShowBrands(false); setShowCategories(!showCategories); }}
            className={`flex flex-col items-center gap-0.5 py-2 px-2.5 rounded-xl transition-all ${
              isCategoryPage || showCategories ? "text-[#D1001C]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Categorías</span>
            {(isCategoryPage || showCategories) && <div className="w-4 h-0.5 rounded-full bg-[#E35205]" />}
          </button>

          {/* Chatbot button — elevated center */}
          <button
            onClick={() => { setShowCategories(false); setShowBrands(false); useAiChatStore.getState().toggleChat(); }}
            className="relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all -mt-5"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #D1001C, #990000)",
                boxShadow: "0 4px 16px rgba(209, 0, 28, 0.35)",
              }}
            >
              {assistantIconUrl ? (
                <img
                  src={assistantIconUrl}
                  alt={assistantTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <MessageCircle className="h-5 w-5 text-white" />
                  <Sparkles className="h-3 w-3 text-white/80 absolute -top-0.5 -right-0.5" />
                </>
              )}
            </div>
            <span className="text-[7px] font-black uppercase tracking-widest text-[#D1001C]">{assistantTitle}</span>
          </button>

          <button
            onClick={() => { setShowCategories(false); setShowBrands(!showBrands); }}
            className={`flex flex-col items-center gap-0.5 py-2 px-2.5 rounded-xl transition-all ${
              isBrandPage || showBrands ? "text-[#D1001C]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Marcas</span>
            {(isBrandPage || showBrands) && <div className="w-4 h-0.5 rounded-full bg-[#E35205]" />}
          </button>

          <Link
            href="/packout-builder"
            className={`flex flex-col items-center gap-0.5 py-2 px-2.5 rounded-xl transition-all ${
              pathname === "/packout-builder" ? "text-[#D1001C]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Layers className="h-5 w-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">PACKOUT</span>
            {pathname === "/packout-builder" && <div className="w-4 h-0.5 rounded-full bg-[#E35205]" />}
          </Link>

          <Link
            href="/login"
            className="flex flex-col items-center gap-0.5 py-2 px-2.5 rounded-xl text-gray-400 hover:text-gray-200 transition-all"
          >
            <User className="h-5 w-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Cuenta</span>
          </Link>
        </div>
      </nav>

      {/* â”€â”€ BRANDS MODAL â”€â”€ */}
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

            {/* Brand cards grid — full logo in brand color, without redundant bottom text */}
            <div className="px-3 pb-6 grid grid-cols-2 gap-2 overflow-y-auto max-h-[45vh] no-scrollbar">
              {brandLinks.map((brand) => (
                <button
                  key={`gc-${brand.slug}`}
                  onClick={() => { setShowBrands(false); router.push(`/marca/${brand.slug}`); }}
                  className="relative h-[64px] rounded-xl flex items-center justify-center p-3 transition-all active:scale-[0.96] shadow-sm hover:brightness-105 border border-white/10"
                  style={{ backgroundColor: brand.color }}
                  title={brand.name}
                >
                  <img
                    src={`/brands/transparent/${brand.slug}.svg`}
                    alt={brand.name}
                    className="max-h-[34px] max-w-[85%] w-auto object-contain drop-shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes(".webp")) {
                        target.src = `/brands/${brand.slug}.webp`;
                      } else if (!target.src.endsWith(`/${brand.slug}.svg`)) {
                        target.src = `/brands/${brand.slug}.svg`;
                      }
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ CATEGORIES MODAL â”€â”€ */}
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

            {/* Category list with subcategories view matching NUEVA WEB - CAMBIOS 3 Point 2 */}
            <div className="overflow-y-auto max-h-[68vh] pb-6 no-scrollbar">
              {selectedCategory ? (
                <>
                  {/* Back button and category title */}
                  <div className="px-4 pb-3 flex items-center justify-between border-b border-[#1A1A1A]">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="flex items-center gap-1.5 text-xs text-[#0056D2] dark:text-[#4B90FF] font-semibold hover:underline"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Todas las Categorías
                    </button>
                    {(() => {
                      const currentCat = officialCategories.find(c => c.slug === selectedCategory);
                      return currentCat ? (
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          {currentCat.name}
                        </span>
                      ) : null;
                    })()}
                  </div>

                  {(() => {
                    const currentCat = officialCategories.find(c => c.slug === selectedCategory);
                    if (!currentCat) return null;
                    return (
                      <div className="px-4 py-3">
                        <div className="mb-3">
                          <p className="text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-2.5">
                            Secciones y Subcategorías ({currentCat.subcategories.length})
                          </p>
                          <div className="space-y-1.5 max-h-[48vh] overflow-y-auto no-scrollbar pr-0.5">
                            {currentCat.subcategories.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => { setShowCategories(false); setSelectedCategory(null); }}
                                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-white/5 transition-all text-left group"
                              >
                                <span className="text-xs font-medium text-[#DDD] group-hover:text-white">
                                  {sub.name}
                                </span>
                                <ChevronRight className="h-3.5 w-3.5 text-[#555] group-hover:text-[#4B90FF] transition-colors" />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Link to full category */}
                        <div className="mt-3 pt-2 border-t border-[#1A1A1A]">
                          <Link
                            href={`/categoria/${currentCat.slug}`}
                            onClick={() => { setShowCategories(false); setSelectedCategory(null); }}
                            className="block w-full text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#0056D2] hover:bg-[#0047B3] transition-all active:scale-[0.98]"
                          >
                            Ver Toda la Categoría {currentCat.name}
                          </Link>
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : (
                /* Main category grid — 8 official categories */
                <div className="px-3 grid grid-cols-2 gap-2">
                  {officialCategories.map(cat => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className="relative overflow-hidden rounded-xl border border-[#1A1A1A] bg-[#111] p-3.5 text-left transition-all active:scale-[0.97] hover:border-[#0056D2]/60 hover:bg-[#161616]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#0056D2]/15 flex items-center justify-center text-[#4B90FF] mb-2.5">
                        {categoryIcons[cat.icon] || <Wrench className="h-4 w-4" />}
                      </div>
                      <p className="text-xs font-bold text-white leading-tight uppercase tracking-wide">{cat.name}</p>
                      <p className="text-[9px] text-[#666] mt-1">{cat.subcategories.length} secciones</p>
                      <ChevronRight className="absolute top-3.5 right-3 h-3.5 w-3.5 text-[#444]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


