"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight, CircleArrowRight, Wrench, Star, TrendingUp, Plus, Search,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product, Brand, Category } from "@/types";

interface BrandTheme {
  color: string;
  textColor: string;
  tabs?: string[];
}

/* ── Per-brand category definitions ── */
const brandCategories: Record<string, { name: string; count: string; icon: string }[]> = {
  milwaukee: [
    { name: "Herramientas eléctricas M18", count: "28.1K", icon: "drill" },
    { name: "Herramientas manuales", count: "18.7K", icon: "wrench" },
    { name: "Herramientas eléctricas M12", count: "17.7K", icon: "drill" },
    { name: "Packout", count: "13.1K", icon: "box" },
    { name: "Baterías y cargadores", count: "7.2K", icon: "battery" },
    { name: "Tubería", count: "4.7K", icon: "wrench" },
    { name: "Taladros de percusión", count: "4.6K", icon: "drill" },
    { name: "Kits combinados", count: "4.6K", icon: "box" },
    { name: "Llaves de impacto", count: "4.5K", icon: "wrench" },
    { name: "EPI y seguridad", count: "4.3K", icon: "shield" },
    { name: "Sierras", count: "2.3K", icon: "saw" },
  ],
  dewalt: [
    { name: "Herramientas 20V MAX XR", count: "22.4K", icon: "drill" },
    { name: "Herramientas 12V MAX", count: "9.8K", icon: "drill" },
    { name: "Herramientas FLEXVOLT 60V", count: "8.2K", icon: "drill" },
    { name: "ATOMIC Compact Series", count: "6.5K", icon: "drill" },
    { name: "Baterías y cargadores", count: "11.3K", icon: "battery" },
    { name: "Taladros", count: "7.1K", icon: "drill" },
    { name: "Impactos", count: "5.9K", icon: "wrench" },
    { name: "Sierras", count: "4.8K", icon: "saw" },
    { name: "Esmeriladoras", count: "3.2K", icon: "saw" },
    { name: "Kits combinados", count: "5.4K", icon: "box" },
  ],
  bosch: [
    { name: "Herramientas 18V Professional", count: "19.6K", icon: "drill" },
    { name: "Herramientas 12V", count: "8.4K", icon: "drill" },
    { name: "Herramientas Green", count: "5.2K", icon: "drill" },
    { name: "Taladros y atornilladores", count: "9.7K", icon: "drill" },
    { name: "Sierras", count: "4.1K", icon: "saw" },
    { name: "Esmeriladoras", count: "3.8K", icon: "saw" },
    { name: "Medición láser", count: "2.9K", icon: "ruler" },
    { name: "Baterías ProCore", count: "6.3K", icon: "battery" },
    { name: "Detectores y sensores", count: "1.8K", icon: "shield" },
  ],
  makita: [
    { name: "Herramientas 18V LXT", count: "24.5K", icon: "drill" },
    { name: "Herramientas 12V CXT", count: "10.2K", icon: "drill" },
    { name: "Herramientas 40V X2", count: "5.8K", icon: "drill" },
    { name: "Taladros", count: "8.6K", icon: "drill" },
    { name: "Impactos", count: "6.4K", icon: "wrench" },
    { name: "Sierras", count: "5.1K", icon: "saw" },
    { name: "Rotomartillos", count: "3.9K", icon: "drill" },
    { name: "Baterías y cargadores", count: "9.8K", icon: "battery" },
    { name: "Radios y altavoces", count: "2.1K", icon: "box" },
    { name: "Jardín", count: "4.3K", icon: "saw" },
  ],
  stanley: [
    { name: "Herramientas manuales FATMAX", count: "15.8K", icon: "wrench" },
    { name: "Llaves", count: "8.2K", icon: "wrench" },
    { name: "Destornilladores", count: "7.4K", icon: "wrench" },
    { name: "Cintas métricas", count: "9.1K", icon: "ruler" },
    { name: "Niveles", count: "4.6K", icon: "ruler" },
    { name: "Cajas de herramientas", count: "5.3K", icon: "box" },
    { name: "Martillos", count: "3.7K", icon: "wrench" },
    { name: "Pinzas y alicates", count: "4.2K", icon: "wrench" },
    { name: "STANLEY PRO", count: "6.8K", icon: "wrench" },
  ],
  "3m": [
    { name: "Protección auditiva", count: "4.8K", icon: "shield" },
    { name: "Protección ocular", count: "6.2K", icon: "shield" },
    { name: "Protección respiratoria", count: "5.7K", icon: "shield" },
    { name: "Cintas adhesivas", count: "12.4K", icon: "box" },
    { name: "Discos abrasivos", count: "8.9K", icon: "saw" },
    { name: "Líquidos y limpieza", count: "3.4K", icon: "box" },
    { name: "Selladores y espumas", count: "4.1K", icon: "box" },
    { name: "EPP industrial", count: "7.3K", icon: "shield" },
  ],
  honda: [
    { name: "Generadores inverter", count: "3.2K", icon: "drill" },
    { name: "Generadores industriales", count: "2.8K", icon: "drill" },
    { name: "Motobombas de agua", count: "4.1K", icon: "box" },
    { name: "Motores stationary", count: "5.6K", icon: "drill" },
    { name: "Cortacéspedes", count: "2.4K", icon: "saw" },
    { name: "Motocompresores", count: "1.8K", icon: "drill" },
    { name: "Repuestos y accesorios", count: "8.9K", icon: "box" },
  ],
  "klein-tools": [
    { name: "Herramientas eléctricas", count: "14.2K", icon: "drill" },
    { name: "Multímetros y medición", count: "8.7K", icon: "ruler" },
    { name: "Pinzas y alicates", count: "6.3K", icon: "wrench" },
    { name: "Destornilladores", count: "5.8K", icon: "wrench" },
    { name: "Cintas métricas", count: "7.1K", icon: "ruler" },
    { name: "Niveles", count: "3.9K", icon: "ruler" },
    { name: "Pelacables y conectores", count: "4.5K", icon: "wrench" },
    { name: "Bolsas y organizadores", count: "3.2K", icon: "box" },
  ],
  toro: [
    { name: "Cortacéspedes", count: "5.4K", icon: "saw" },
    { name: "Sopladores de hojas", count: "3.8K", icon: "drill" },
    { name: "Podadoras de setos", count: "2.9K", icon: "saw" },
    { name: "Limpiadoras a presión", count: "2.1K", icon: "drill" },
    { name: "Sopladores inalámbricos", count: "1.6K", icon: "drill" },
    { name: "Cortadoras de césped", count: "3.2K", icon: "saw" },
    { name: "Repuestos", count: "4.8K", icon: "box" },
  ],
  ego: [
    { name: "Sopladores POWER+", count: "4.2K", icon: "drill" },
    { name: "Cortacéspedes", count: "3.1K", icon: "saw" },
    { name: "Sierras de cadena", count: "2.4K", icon: "saw" },
    { name: "Taladros", count: "1.8K", icon: "drill" },
    { name: "Recortabordes", count: "2.6K", icon: "saw" },
    { name: "Baterías 56V ARC Lithium", count: "5.7K", icon: "battery" },
    { name: "Cargadores", count: "3.4K", icon: "battery" },
    { name: "Accesorios de jardín", count: "4.1K", icon: "box" },
  ],
  "metabo-hpt": [
    { name: "Clavadoras neumáticas", count: "6.8K", icon: "drill" },
    { name: "Herramientas 18V", count: "9.4K", icon: "drill" },
    { name: "Herramientas 36V Multivolt", count: "4.2K", icon: "drill" },
    { name: "Taladros", count: "5.1K", icon: "drill" },
    { name: "Sierras circulares", count: "3.7K", icon: "saw" },
    { name: "Esmeriladoras", count: "3.2K", icon: "saw" },
    { name: "Aire comprimido", count: "4.8K", icon: "box" },
  ],
  flex: [
    { name: "Herramientas 24V", count: "12.6K", icon: "drill" },
    { name: "Herramientas 40V MAX", count: "5.8K", icon: "drill" },
    { name: "Taladros", count: "4.1K", icon: "drill" },
    { name: "Impactos", count: "3.8K", icon: "wrench" },
    { name: "Sierras circulares", count: "3.2K", icon: "saw" },
    { name: "Esmeriladoras", count: "2.9K", icon: "saw" },
    { name: "Rotomartillos", count: "2.4K", icon: "drill" },
    { name: "Baterías y cargadores", count: "6.7K", icon: "battery" },
  ],
  stihl: [
    { name: "Motosierras", count: "8.4K", icon: "saw" },
    { name: "Sopladores de hojas", count: "6.2K", icon: "drill" },
    { name: "Desbrozadoras", count: "5.1K", icon: "saw" },
    { name: "Hidrolimpiadoras", count: "3.4K", icon: "drill" },
    { name: "Motobombas", count: "2.8K", icon: "box" },
    { name: "Herramientas a batería", count: "4.5K", icon: "battery" },
    { name: "Cortacéspedes", count: "2.1K", icon: "saw" },
    { name: "Accesorios y repuestos", count: "7.3K", icon: "box" },
  ],
  fein: [
    { name: "Multiherramientas MultiMaster", count: "4.8K", icon: "drill" },
    { name: "Sierras de calar", count: "2.9K", icon: "saw" },
    { name: "Pulidoras", count: "2.4K", icon: "saw" },
    { name: "Taladros de columna", count: "1.6K", icon: "drill" },
    { name: "Aspiradoras industriales", count: "3.2K", icon: "box" },
    { name: "Accesorios MultiMaster", count: "5.7K", icon: "box" },
  ],
  skil: [
    { name: "Herramientas 20V", count: "8.4K", icon: "drill" },
    { name: "Herramientas 12V", count: "5.2K", icon: "drill" },
    { name: "Taladros", count: "3.8K", icon: "drill" },
    { name: "Sierras circulares", count: "3.1K", icon: "saw" },
    { name: "Esmeriladoras", count: "2.7K", icon: "saw" },
    { name: "Impactos", count: "2.9K", icon: "wrench" },
    { name: "Sierras caladoras", count: "2.4K", icon: "saw" },
    { name: "Kits combinados", count: "4.6K", icon: "box" },
  ],
  festool: [
    { name: "Sierras de corte", count: "4.2K", icon: "saw" },
    { name: "Sierras circulares", count: "3.8K", icon: "saw" },
    { name: "Aspiradoras CT", count: "3.4K", icon: "box" },
    { name: "Taladros", count: "2.9K", icon: "drill" },
    { name: "Enrutadores", count: "2.4K", icon: "drill" },
    { name: "Lijadoras", count: "3.1K", icon: "saw" },
    { name: "Sistema Systainer", count: "5.6K", icon: "box" },
    { name: "Accesorios y discos", count: "8.2K", icon: "box" },
  ],
  jet: [
    { name: "Sierras de cinta", count: "2.8K", icon: "saw" },
    { name: "Sierras de mesa", count: "2.4K", icon: "saw" },
    { name: "Tornos de banco", count: "1.9K", icon: "drill" },
    { name: "Taladros de columna", count: "2.1K", icon: "drill" },
    { name: "Esmeriladores de banco", count: "1.6K", icon: "saw" },
    { name: "Martillos neumáticos", count: "2.3K", icon: "wrench" },
    { name: "Prensas y sujetadores", count: "1.8K", icon: "box" },
  ],
  knaack: [
    { name: "Cajas de herramientas", count: "4.2K", icon: "box" },
    { name: "Bancos de trabajo", count: "2.8K", icon: "box" },
    { name: "Cestas y soportes", count: "3.1K", icon: "box" },
    { name: "Estantes de almacenamiento", count: "2.4K", icon: "box" },
    { name: "Carritos utilitarios", count: "1.9K", icon: "box" },
    { name: "Organizadores modulares", count: "2.6K", icon: "box" },
  ],
};

const defaultBrandCategories = [
  { name: "Herramientas eléctricas", count: "15.2K", icon: "drill" },
  { name: "Herramientas manuales", count: "12.1K", icon: "wrench" },
  { name: "Baterías y cargadores", count: "8.4K", icon: "battery" },
  { name: "Kits combinados", count: "5.8K", icon: "box" },
  { name: "Accesorios", count: "9.3K", icon: "settings" },
  { name: "Almacenamiento", count: "6.1K", icon: "box" },
  { name: "Sierras", count: "3.7K", icon: "saw" },
  { name: "EPI y seguridad", count: "4.0K", icon: "shield" },
];

function BrandCategoryIcon({ type, color }: { type: string; color: string }) {
  const cls = "h-4 w-4";
  switch (type) {
    case "drill":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121" />
        </svg>
      );
    case "battery":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="6" y="4" width="12" height="18" rx="2" /><path d="M9 2h6" /><path d="M10 9h4M10 13h4M10 17h4" />
        </svg>
      );
    case "shield":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "ruler":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
          <path d="m14.5 12.5 2-2" /><path d="m11.5 9.5 2-2" /><path d="m8.5 6.5 2-2" /><path d="m17.5 15.5 2-2" />
        </svg>
      );
    case "saw":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="6" cy="6" r="3" /><path d="M8.12 8.12 12 12" /><path d="M20 4 8.12 15.88" /><path d="M14.47 14.48 20 20" /><path d="M16 8 20 12" /><path d="M8 12 12 8" />
        </svg>
      );
    default:
      return <Wrench className={cls} />;
  }
}

function formatPrice(price: number): string {
  return `S/ ${price.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function BrandPageClient({
  brand,
  products,
  theme,
}: {
  brand: Brand;
  products: Product[];
  theme: BrandTheme;
}) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const cats = brandCategories[brand.slug] || defaultBrandCategories;
  const brandColor = theme.color;
  const textCol = theme.textColor;
  const isDark = textCol === "#FFF" || textCol === "#00A651";

  return (
    <main className="min-h-screen bg-[#F5F6F8]">
      <div className="mx-auto max-w-[1440px] px-2.5 lg:px-4 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[#666] mb-4 flex-wrap">
          <Link href="/" className="hover:text-[#E35205] transition-colors">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-[#1A1A1A]">Herramientas {brand.name}</span>
        </nav>

        {/* ── 3-Column Layout (desktop) ── */}
        <div className="flex gap-3">
          {/* LEFT SIDEBAR — Acme style: black bg + brand color accents */}
          <aside className="hidden lg:block w-[240px] xl:w-[260px] shrink-0">
            <div className="sticky top-[120px] bg-[#1A1A1A] rounded-lg overflow-hidden">
              {/* Header with brand color */}
              <div
                className="px-4 py-3 flex items-center gap-2"
                style={{ backgroundColor: brandColor, color: textCol }}
              >
                <Wrench className="h-4 w-4" />
                <h2 className="text-sm font-bold uppercase tracking-wide">
                  {brand.name} Tools
                </h2>
              </div>
              {/* Category list - dark background */}
              <ul className="divide-y divide-[#333]">
                {cats.map((cat, i) => (
                  <li key={i}>
                    <Link
                      href={`/marca/${brand.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-[#2A2A2A] transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span style={{ color: brandColor }}>
                          <BrandCategoryIcon type={cat.icon} color={brandColor} />
                        </span>
                        <span className="text-sm text-[#CCC] group-hover:text-white transition-colors truncate">
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-[#888] bg-[#333] px-1.5 py-0.5 rounded-full">
                          {cat.count}
                        </span>
                        <ChevronRight className="h-3 w-3 text-[#555] group-hover:text-white transition-colors" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* CENTER COLUMN */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Main brand promo banner */}
            <Link
              href={`/marca/${brand.slug}`}
              className="block relative overflow-hidden rounded-lg"
            >
              <div className="absolute inset-0" style={{ backgroundColor: brandColor }} />
              <div
                className="absolute inset-0"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(0,0,0,0.35) 100%)"
                    : "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.15) 100%)",
                }}
              />
              <div className="relative z-10 flex items-center justify-between px-6 py-8 md:py-12">
                <div className="max-w-md space-y-2">
                  <span className="font-impact text-2xl md:text-3xl lg:text-4xl" style={{ color: textCol }}>
                    MÁS {brand.name.toUpperCase()}, MÁS AHORROS
                  </span>
                  <p className="text-sm md:text-base" style={{ color: textCol, opacity: 0.9 }}>
                    Ofertas exclusivas en herramientas {brand.name}. Envío a todo Perú.
                  </p>
                  <span
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wide transition-all hover:scale-105"
                    style={{
                      backgroundColor: isDark ? "white" : "#1A1A1A",
                      color: isDark ? brandColor : textCol,
                    }}
                  >
                    COMPRAR AHORA
                    <CircleArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Two smaller promo banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <Link href={`/marca/${brand.slug}`} className="block relative overflow-hidden rounded-lg">
                <div className="absolute inset-0" style={{ backgroundColor: brandColor }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.5) 100%)" }} />
                <div className="relative z-10 flex flex-col justify-between h-[160px] md:h-[200px] p-4">
                  <span className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: textCol, opacity: 0.85 }}>
                    {brand.name.toUpperCase()}
                  </span>
                  <div>
                    <p className="font-impact text-sm leading-tight mb-1" style={{ color: textCol }}>
                      PRODUCTO GRATUITO A ELECCIÓN
                    </p>
                    <p className="text-[10px] leading-relaxed mb-2" style={{ color: textCol, opacity: 0.8 }}>
                      Con un paquete de 2 baterías seleccionado.
                    </p>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded text-[11px] font-bold" style={{ backgroundColor: isDark ? "white" : "#1A1A1A", color: isDark ? brandColor : textCol }}>
                      COMPRAR AHORA <CircleArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
              <Link href={`/marca/${brand.slug}`} className="block relative overflow-hidden rounded-lg">
                <div className="absolute inset-0" style={{ backgroundColor: brandColor, filter: "brightness(0.85)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 100%)" }} />
                <div className="relative z-10 flex flex-col justify-between h-[160px] md:h-[200px] p-4">
                  <span className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: textCol, opacity: 0.85 }}>
                    {brand.name.toUpperCase()}
                  </span>
                  <div>
                    <p className="font-impact text-sm leading-tight mb-1" style={{ color: textCol }}>
                      OFERTA DE BONIFICACIÓN POR BATERÍA
                    </p>
                    <p className="text-[10px] leading-relaxed mb-2" style={{ color: textCol, opacity: 0.8 }}>
                      Elige un artículo GRATIS con tu compra.
                    </p>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded text-[11px] font-bold" style={{ backgroundColor: isDark ? "white" : "#1A1A1A", color: isDark ? brandColor : textCol }}>
                      COMPRAR AHORA <CircleArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Products grid */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4" style={{ color: brandColor }} />
                <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
                  Productos {brand.name}
                </h2>
                <span className="text-xs text-[#999]">({products.length})</span>
              </div>
              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-8 text-center">
                  <p className="text-[#999] text-sm">
                    No hay productos de {brand.name} disponibles aún.
                  </p>
                  <Link
                    href="/"
                    className="inline-block mt-3 text-sm font-semibold hover:underline"
                    style={{ color: brandColor }}
                  >
                    Volver al inicio
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR — Pipeline (Acme style: dark bg) */}
          <aside className="hidden lg:block w-[280px] xl:w-[300px] shrink-0">
            <div className="sticky top-[120px] bg-[#1A1A1A] rounded-lg overflow-hidden">
              {/* Header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: brandColor, color: textCol }}
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <h2 className="text-sm font-bold uppercase tracking-wide">
                    PIPELINE
                  </h2>
                </div>
                <Link href={`/marca/${brand.slug}`} className="text-xs underline opacity-80 hover:opacity-100">
                  Ver más
                </Link>
              </div>
              {/* Product list */}
              <div>
                {(products.slice(0, 8)).map((product) => {
                  const discount = product.comparePrice
                    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                    : 0;
                  return (
                    <Link
                      key={product.id}
                      href={`/producto/${product.slug}`}
                      className="group flex gap-3 p-3 hover:bg-[#2A2A2A] transition-colors border-b border-[#333] last:border-b-0"
                    >
                      <div className="shrink-0 w-16 h-16 rounded bg-[#2A2A2A] flex items-center justify-center border border-[#444]">
                        <Wrench className="h-7 w-7 text-[#555]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {discount > 0 && (
                          <span
                            className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded text-white mb-1"
                            style={{ backgroundColor: brandColor }}
                          >
                            -{discount}%
                          </span>
                        )}
                        <p className="text-xs leading-snug text-[#CCC] group-hover:text-white transition-colors line-clamp-2 mb-1">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-1 mb-0.5">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-2.5 w-2.5 ${
                                  star <= Math.round(product.rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-[#444] text-[#444]"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-[#777]">({product.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {product.comparePrice && (
                            <span className="text-[11px] text-[#777] line-through">
                              {formatPrice(product.comparePrice)}
                            </span>
                          )}
                          <span className="text-sm font-bold" style={{ color: brandColor }}>
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* ── Bottom Tabs ── */}
        {theme.tabs && theme.tabs.length > 0 && (
          <div className="mt-4 flex gap-0 overflow-x-auto rounded-lg border border-[#E0E0E0]" style={{ scrollbarWidth: "none" }}>
            {theme.tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(activeTab === tab ? null : tab)}
                className="shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-wide transition-all border-r border-[#E0E0E0] last:border-r-0"
                style={{
                  backgroundColor: activeTab === tab ? brandColor : isDark ? "#1A1A1A" : "#F5F6F8",
                  color: activeTab === tab ? textCol : isDark ? (brandColor === "#1A1A1A" ? "#FFF" : brandColor) : brandColor,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}