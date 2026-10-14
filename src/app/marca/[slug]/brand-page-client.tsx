"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, CircleArrowRight, Wrench, Star, TrendingUp, Plus, Search,
  Home, ArrowLeft, MessageCircle, ShoppingCart, User, SlidersHorizontal,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { useQuickViewStore } from "@/stores/quickview-store";
import { useCartStore } from "@/stores/cart-store";
import type { Product, Brand } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface BrandTheme {
  color: string;
  textColor: string;
  secondColor: string;
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

function SectionFade({ color }: { color: string }) {
  return null;
}

function getBrandPromoImages(slug: string, products: Product[]) {
  if (slug === "milwaukee") {
    return {
      top: "/banners/brands/milwaukee-promo-top.webp",
      card1: "/banners/brands/milwaukee-promo-card-1.webp",
      card2: "/banners/brands/milwaukee-promo-card-2.webp",
    };
  }

  if (slug === "dewalt") {
    return {
      top: "/banners/sections/dewalt-xr-powerpack.webp",
      card1: "/banners/sections/dewalt-promo-33.webp",
      card2: "/banners/sections/dewalt-powerstack.webp",
    };
  }

  if (slug === "makita") {
    return {
      top: "/banners/sections/makita-teal-deals.webp",
      card1: "/banners/sections/makita-promo-33.webp",
      card2: "/banners/sections/makita-potencia-sistema.webp",
    };
  }

  const p0 = products[0]?.images?.[0] || (products[0] as any)?.image?.asset?.url || "/logo.png";
  const p1 = products[1]?.images?.[0] || (products[1] as any)?.image?.asset?.url || "/logo.png";
  const p2 = products[2]?.images?.[0] || (products[2] as any)?.image?.asset?.url || "/logo.png";

  return {
    top: p0,
    card1: p1,
    card2: p2,
  };
}

/* ── Clean Full-Width Brand Header Banner (Image 2 Specification) ── */
function BrandHeaderBanner({
  brand,
  brandColor,
  textColor,
}: {
  brand: Brand;
  brandColor: string;
  textColor: string;
}) {
  const slug = brand.slug.toLowerCase();
  const isYellowBrand = ["dewalt", "kamasa", "wagner", "stanley", "klein-tools"].includes(slug);
  const isDark = !isYellowBrand && (textColor === "#FFF" || textColor === "#00A651");

  const customWhiteLogos: Record<string, string> = {
    milwaukee: "/brands/milwaukee-white-transparent.svg",
  };

  const defaultSvg = customWhiteLogos[slug] || `/brands/transparent/${slug}.svg`;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-lg flex items-center justify-center py-10 sm:py-14 md:py-20 px-4 sm:px-6 mb-4 transition-all"
      style={{ backgroundColor: brandColor }}
    >
      {/* Subtle top/bottom sheen */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/15 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center w-full max-w-[700px]">
        <img
          src={defaultSvg}
          alt={brand.name}
          className={cn(
            "h-16 sm:h-24 md:h-32 lg:h-36 w-auto max-w-full object-contain drop-shadow-md transition-transform duration-300 hover:scale-105",
            isDark && slug !== "milwaukee" && "brightness-0 invert"
          )}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.includes("/brands/transparent/")) {
              target.src = `/brands/${slug}.svg`;
            } else if (!target.src.endsWith(".webp")) {
              target.src = `/brands/${slug}.webp`;
            } else {
              target.style.display = "none";
              const textFallback = target.nextElementSibling as HTMLElement;
              if (textFallback) textFallback.style.display = "block";
            }
          }}
        />
        <span
          style={{ display: "none", color: textColor }}
          className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-widest text-center"
        >
          {brand.name}
        </span>
      </div>
    </div>
  );
}

/* ── Wide Promo Banner Component (Image 2 Specification) ── */
function BrandWidePromoBanner({
  brand,
  brandColor,
  textColor,
  hasPromoBanner,
}: {
  brand: Brand;
  brandColor: string;
  textColor: string;
  hasPromoBanner: boolean;
}) {
  const isYellowBrand = ["dewalt", "kamasa", "wagner", "stanley", "klein-tools"].includes(brand.slug.toLowerCase());
  const isDark = !isYellowBrand && (textColor === "#FFF" || textColor === "#00A651");
  const bannerPath = `/banners/brands/${brand.slug}.webp`;

  const buttonBg = isDark ? "#FFFFFF" : "#1A1A1A";
  const buttonTextColor = isDark ? (brandColor === "#1A1A1A" ? "#FFD700" : brandColor) : "#FFD700";

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
      {hasPromoBanner ? (
        <div className="relative w-full min-h-[160px] sm:min-h-[200px] md:min-h-[250px] lg:min-h-[280px]">
          {/* Panoramic image */}
          <img
            src={bannerPath}
            alt={`Ofertas ${brand.name}`}
            className="w-full h-full object-cover object-center absolute inset-0"
          />

          {/* Left gradient overlay to ensure text contrast */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 sm:via-transparent to-transparent pointer-events-none"
          />

          {/* Overlay text on left */}
          <div className="relative z-10 p-5 sm:p-7 md:p-10 max-w-md lg:max-w-lg flex flex-col justify-center h-full min-h-[160px] sm:min-h-[200px] md:min-h-[250px] lg:min-h-[280px]">
            <div className="inline-flex items-center gap-2 mb-2">
              <span
                className="text-[10px] sm:text-xs font-black px-2.5 py-1 rounded bg-white text-black tracking-widest uppercase shadow-sm"
              >
                OFERTA ESPECIAL
              </span>
            </div>

            <h3
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase text-white tracking-tight leading-none mb-2 drop-shadow-md"
            >
              MÁS {brand.name.toUpperCase()}, MÁS AHORROS
            </h3>

            <p className="text-xs sm:text-sm text-white/90 mb-4 line-clamp-2 drop-shadow">
              Ofertas exclusivas en herramientas {brand.name}. Envío a todo Perú.
            </p>

            <div>
              <Link
                href={`/marca/${brand.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wide transition-all hover:scale-105 shadow-lg active:scale-95"
                style={{
                  backgroundColor: buttonBg,
                  color: buttonTextColor,
                }}
              >
                COMPRAR AHORA
                <CircleArrowRight className="h-4 w-4" style={{ color: buttonTextColor }} />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Fallback branded wide banner for brands without custom banner image */
        <div
          className="relative w-full py-10 px-6 sm:px-10 flex flex-col md:flex-row items-center justify-between overflow-hidden"
          style={{ backgroundColor: brandColor }}
        >
          {/* Subtle diagonal background stripes */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 20px, ${textColor} 20px, ${textColor} 21px)`,
            }}
          />

          <div className="relative z-10 max-w-xl space-y-2 text-center md:text-left">
            <span
              className="inline-block text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-1"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
                color: textColor,
              }}
            >
              HERRAMIENTAS PROFESIONALES
            </span>
            <h3
              className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-none"
              style={{ color: textColor }}
            >
              MÁS {brand.name.toUpperCase()}, MÁS AHORROS
            </h3>
            <p className="text-xs sm:text-sm opacity-90" style={{ color: textColor }}>
              Encuentra el catálogo completo con garantía oficial y entrega rápida en Lima y provincias.
            </p>
          </div>

          <div className="relative z-10 mt-6 md:mt-0 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href={`/marca/${brand.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all hover:scale-105 shadow-lg active:scale-95"
              style={{
                backgroundColor: buttonBg,
                color: buttonTextColor,
              }}
            >
              COMPRAR AHORA
              <CircleArrowRight className="h-4 w-4" style={{ color: buttonTextColor }} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const openQuickView = useQuickViewStore((s) => s.openQuickView);
  const addItem = useCartStore((s) => s.addItem);
  const cats = brandCategories[brand.slug.toLowerCase()] || defaultBrandCategories;
  const brandColor = theme.color;
  const secondColor = theme.secondColor;
  const textCol = theme.textColor;
  const isYellowBrand = ["dewalt", "kamasa", "wagner", "stanley", "klein-tools"].includes(brand.slug.toLowerCase());
  const isDark = !isYellowBrand && (textCol === "#FFF" || textCol === "#00A651");
  const buttonBg = isDark ? "#FFFFFF" : "#1A1A1A";
  const buttonTextColor = isDark ? (brandColor === "#1A1A1A" ? "#FFD700" : brandColor) : "#FFD700";
  const safeProducts = Array.isArray(products) ? products : [];
  const promoImgs = getBrandPromoImages(brand.slug.toLowerCase(), safeProducts);
  const hasPromoBanner = ["bosch", "dewalt", "dong-cheng", "kaili", "makita", "milwaukee"].includes(brand.slug.toLowerCase());

  const fallbackPipelineProducts: Product[] = [
    {
      id: "pipe-1",
      sku: "2904-20",
      name: `LLAVE DE IMPACTO COMPACTA ${brand.name.toUpperCase()} FUEL™`,
      price: 1799.9,
      comparePrice: 1999.9,
      rating: 5,
      reviewCount: 45,
      stock: 10,
      images: [brand.slug === "milwaukee" ? "/products/milwaukee-combo-thumb.webp" : (promoImgs.card1 || "/products/milwaukee-combo-thumb.webp")],
      slug: "llave-impacto",
    } as any,
    {
      id: "pipe-2",
      sku: "2902-20",
      name: `TALADRO PERCUTOR COMPACTO ${brand.name.toUpperCase()} 1/2"`,
      price: 890.9,
      comparePrice: 990.0,
      rating: 5,
      reviewCount: 45,
      stock: 12,
      images: [brand.slug === "milwaukee" ? "/products/milwaukee-combo-thumb.webp" : (promoImgs.card2 || "/products/milwaukee-combo-thumb.webp")],
      slug: "taladro-percutor",
    } as any,
    {
      id: "pipe-3",
      sku: "2563-22",
      name: `TRINQUETE DE TORQUE DIGITAL ${brand.name.toUpperCase()} 1/2"`,
      price: 5999.9,
      comparePrice: 6499.9,
      rating: 5,
      reviewCount: 45,
      stock: 5,
      images: [brand.slug === "milwaukee" ? "/products/milwaukee-combo-thumb.webp" : (promoImgs.top || "/products/milwaukee-combo-thumb.webp")],
      slug: "trinquete-torque",
    } as any,
    {
      id: "pipe-4",
      sku: "2804-20",
      name: `ROTOMARTILLO SDS-PLUS ${brand.name.toUpperCase()} 1"`,
      price: 1499.9,
      comparePrice: 1699.9,
      rating: 5,
      reviewCount: 45,
      stock: 8,
      images: [brand.slug === "milwaukee" ? "/products/milwaukee-combo-thumb.webp" : (promoImgs.card1 || "/products/milwaukee-combo-thumb.webp")],
      slug: "rotomartillo-sds",
    } as any,
  ];

  const pipelineProducts = safeProducts.length >= 4 ? safeProducts.slice(0, 4) : fallbackPipelineProducts;

  // ── Bsale-style Filtering & Sorting (CAMBIOS M.pdf Item 3) ──
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");

  // Extract available categories for this brand
  const rawProductCategories = Array.from(
    new Set(
      safeProducts
        .map((p) => p.category?.name || (p as any).categoryName || "")
        .filter(Boolean)
    )
  );
  const availableCategories = Array.from(
    new Set([
      ...rawProductCategories,
      ...cats.map((c) => c.name),
    ])
  );

  // Filter products by selected category
  const filteredProducts = safeProducts.filter((product) => {
    if (selectedCategory === "all") return true;
    const target = selectedCategory.toLowerCase().trim();
    const pCat = (product.category?.name || (product as any).categoryName || "").toLowerCase().trim();
    if (pCat && (pCat.includes(target) || target.includes(pCat))) return true;
    const pName = (product.name || "").toLowerCase();
    const keywords = target.split(" ").filter((w) => w.length > 3);
    if (keywords.length > 0 && keywords.some((kw) => pName.includes(kw))) return true;
    return false;
  });

  // Sort products with exact Bsale options from CAMBIOS M.pdf
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.salePrice || a.price || 0;
    const priceB = b.salePrice || b.price || 0;
    if (sortBy === "price-asc") return priceA - priceB;
    if (sortBy === "price-desc") return priceB - priceA;
    if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
    if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "");
    if (sortBy === "newest") return ((b as any)._createdAt || b.id || "").localeCompare((a as any)._createdAt || a.id || "");
    if (sortBy === "oldest") return ((a as any)._createdAt || a.id || "").localeCompare((b as any)._createdAt || b.id || "");
    return 0; // relevance / default
  });

  // Thematic gradient: brand color → dark → brand color → dark, direct transitions
  const pageBgStyle = {
    background: `
      linear-gradient(
        180deg,
        ${brandColor} 0%,
        ${brandColor} 12%,
        ${secondColor} 12%,
        ${secondColor} 68%,
        ${brandColor} 68%,
        ${brandColor} 88%,
        ${secondColor} 88%,
        ${secondColor} 100%
      )
    `,
    minHeight: "100vh",
  };

  return (
    <main style={pageBgStyle} className="relative">
      {/* Top ambient glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${brandColor}, transparent)`,
          opacity: 0.6,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-2.5 lg:px-4 py-4 pb-28">
        {/* ── Brand Header Banner (Clean, Full-Width with Official Brand Logo — Image 2) ── */}
        <BrandHeaderBanner
          brand={brand}
          brandColor={brandColor}
          textColor={textCol}
        />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-[#999] mb-4 flex-wrap">
          <Link
            href="/"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Home className="h-3.5 w-3.5" />
            Inicio
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#555]" />
          <span className="font-semibold text-white">
            Herramientas {brand.name}
          </span>
        </nav>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-20 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all active:scale-95"
          style={{
            backgroundColor: isYellowBrand ? "#1A1A1A" : brandColor,
            color: isYellowBrand ? "#FFD700" : textCol,
            border: isYellowBrand ? "1px solid #FFD70044" : "none",
            boxShadow: isYellowBrand ? "0 4px 20px rgba(0,0,0,0.8)" : `0 4px 20px ${brandColor}66`,
          }}
        >
          <Wrench className="h-4 w-4" style={{ color: isYellowBrand ? "#FFD700" : textCol }} />
          Categorías
        </button>

        {/* Mobile sidebar overlay — formatted with generous padding matching "Asi deberia quedar" */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
            <div
              className="absolute left-0 top-0 bottom-0 w-[320px] sm:w-[350px] max-w-[88vw] overflow-y-auto bg-[#0F0F0F] rounded-r-3xl flex flex-col shadow-2xl border-r border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="px-5 py-4 flex items-center justify-between shrink-0 border-b border-white/10"
                style={{ backgroundColor: brandColor }}
              >
                <div className="flex items-center gap-2.5">
                  <Wrench className="h-5 w-5" style={{ color: textCol }} />
                  <h2
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: textCol }}
                  >
                    {brand.name} Categorías
                  </h2>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-full hover:bg-black/20 transition-colors"
                  style={{ color: textCol }}
                  aria-label="Cerrar"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Category list with generous padding so it doesn't touch the borders */}
              <div className="flex-1 overflow-y-auto px-4 py-3 no-scrollbar">
                <ul className="space-y-1.5">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory("all");
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                        selectedCategory === "all"
                          ? "bg-white/10 border-white/20 text-white font-bold"
                          : "bg-[#161616] hover:bg-[#1C1C1C] border-white/5 text-[#BBB]"
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">
                        Todas las Categorías
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#555]" />
                    </button>
                  </li>
                  {cats.map((cat, i) => {
                    const isSelected = selectedCategory === cat.name;
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(selectedCategory === cat.name ? "all" : cat.name);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                            isSelected
                              ? "bg-white/10 border-white/25 text-white font-bold shadow-sm"
                              : "bg-[#161616] hover:bg-[#1E1E1E] border-white/5 text-[#CCC]"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <span style={{ color: brandColor }} className="shrink-0">
                              <BrandCategoryIcon
                                type={cat.icon}
                                color={brandColor}
                              />
                            </span>
                            <span className="text-xs sm:text-sm truncate">
                              {cat.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-1">
                            <span className="text-[10px] text-[#777] bg-[#222] px-2 py-0.5 rounded-full font-mono">
                              {cat.count}
                            </span>
                            <ChevronRight className="h-3.5 w-3.5 text-[#555]" />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── 3-Column Layout (desktop) — Symmetrical Heights (CAMBIOS M.pdf Item 1) ── */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          {/* LEFT SIDEBAR — Black bg + brand color accents */}
          <aside className="hidden lg:flex flex-col w-[240px] xl:w-[260px] shrink-0">
            <div className="h-full bg-[#0A0A0A]/95 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#1A1A1A] flex flex-col justify-between shadow-xl">
              {/* Header with brand color */}
              <div
                className="px-4 py-3 flex items-center gap-2 shrink-0"
                style={{ backgroundColor: brandColor, color: textCol }}
              >
                <Wrench className="h-4 w-4" />
                <h2 className="text-sm font-bold uppercase tracking-wide">
                  {brand.name} Tools
                </h2>
              </div>
              {/* Category list — exactly 10 items aligned symmetrically */}
              <ul className="flex-1 flex flex-col justify-between divide-y divide-[#1A1A1A] py-1">
                {cats.slice(0, 10).map((cat, i) => (
                  <li key={i} className="flex-1 flex items-center">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(selectedCategory === cat.name ? "all" : cat.name)}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-[#151515] transition-colors group text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span style={{ color: brandColor }} className="shrink-0">
                          <BrandCategoryIcon
                            type={cat.icon}
                            color={brandColor}
                          />
                        </span>
                        <span className={`text-xs xl:text-sm transition-colors truncate ${selectedCategory === cat.name ? "text-white font-bold" : "text-[#BBB] group-hover:text-white"}`}>
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-1">
                        <span className="text-[10px] xl:text-xs text-[#666] bg-[#181818] px-1.5 py-0.5 rounded-full">
                          {cat.count}
                        </span>
                        <ChevronRight className="h-3 w-3 text-[#444] group-hover:text-white transition-colors" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* CENTER COLUMN — Symmetrical Height */}
          <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
            {/* Mobile horizontal scrolling category pills */}
            <div className="lg:hidden mb-2">
              <nav
                className="flex gap-2 overflow-x-auto pb-1 -mx-2.5 px-2.5 no-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer"
                  style={{
                    backgroundColor: selectedCategory === "all" ? brandColor : "#111",
                    color: selectedCategory === "all" ? textCol : "#CCC",
                    borderColor: selectedCategory === "all" ? brandColor : "#333",
                  }}
                >
                  Todos
                </button>
                {cats.slice(0, 10).map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCategory(selectedCategory === cat.name ? "all" : cat.name)}
                    className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[10px] font-semibold uppercase tracking-wider border transition-all cursor-pointer"
                    style={{
                      backgroundColor: selectedCategory === cat.name ? brandColor : "#111",
                      color: selectedCategory === cat.name ? textCol : "#CCC",
                      borderColor: selectedCategory === cat.name ? brandColor : "#333",
                    }}
                  >
                    <span style={{ color: selectedCategory === cat.name ? textCol : brandColor }}>
                      <BrandCategoryIcon
                        type={cat.icon}
                        color={selectedCategory === cat.name ? textCol : brandColor}
                      />
                    </span>
                    <span>{cat.name}</span>
                    <span className="opacity-70 ml-0.5">{cat.count}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* ── Top Promo Card ── */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-lg border border-white/10 flex flex-col md:flex-row items-stretch flex-1 min-h-[220px] md:min-h-[250px]"
              style={{ backgroundColor: brandColor }}
            >
              {/* Left text & CTA */}
              <div className="relative z-10 flex-1 p-6 md:p-8 flex flex-col justify-center space-y-3 min-w-[260px]">
                <h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-none drop-shadow-sm"
                  style={{ color: textCol }}
                >
                  MÁS {brand.name.toUpperCase()},<br className="hidden sm:inline" /> MÁS AHORROS
                </h2>
                <p
                  className="text-xs sm:text-sm leading-relaxed max-w-sm drop-shadow-sm"
                  style={{ color: textCol, opacity: 0.9 }}
                >
                  Ofertas exclusivas en herramientas {brand.name}. Envío a todo Perú.
                </p>
                <div>
                  <Link
                    href={`/marca/${brand.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all hover:scale-105 shadow-md active:scale-95"
                    style={{
                      backgroundColor: buttonBg,
                      color: buttonTextColor,
                    }}
                  >
                    COMPRAR AHORA
                    <CircleArrowRight className="h-4 w-4" style={{ color: buttonTextColor }} />
                  </Link>
                </div>
              </div>

              {/* Right promo image */}
              <div className="relative w-full md:w-[50%] h-[180px] md:h-full overflow-hidden shrink-0">
                <img
                  src={promoImgs.top}
                  alt={`Promoción ${brand.name}`}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Horizontal gradient blend */}
                <div
                  className="hidden md:block absolute inset-y-0 left-0 w-24 pointer-events-none"
                  style={{
                    background: `linear-gradient(to right, ${brandColor}, transparent)`,
                  }}
                />
                {/* Vertical blend for mobile */}
                <div
                  className="md:hidden absolute inset-x-0 top-0 h-14 pointer-events-none"
                  style={{
                    background: `linear-gradient(to bottom, ${brandColor}, transparent)`,
                  }}
                />
              </div>
            </div>

            {/* ── Two Promo Cards (50% / 50%) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[190px] sm:h-[200px] shrink-0">
              {/* Card 1: PRODUCTO GRATUITO A ELECCIÓN */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-md border border-white/10 flex flex-col justify-between h-full p-4 xl:p-5 group"
                style={{ backgroundColor: brandColor }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none overflow-hidden">
                  <img
                    src={promoImgs.card1}
                    alt={`Oferta ${brand.name}`}
                    className="w-full h-full object-contain object-right"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 w-16 pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, ${brandColor}, transparent)`,
                    }}
                  />
                </div>

                <div className="relative z-10">
                  <span
                    className="text-[10px] font-black tracking-widest uppercase block mb-0.5"
                    style={{ color: textCol, opacity: 0.85 }}
                  >
                    {brand.name.toUpperCase()}
                  </span>
                </div>

                <div className="relative z-10 max-w-[65%] space-y-1">
                  <h3
                    className="text-xs sm:text-sm font-black uppercase leading-tight"
                    style={{ color: textCol }}
                  >
                    PRODUCTO GRATUITO A ELECCIÓN
                  </h3>
                  <p
                    className="text-[10px] sm:text-[11px] leading-tight"
                    style={{ color: textCol, opacity: 0.85 }}
                  >
                    Con un paquete de 2 baterías seleccionado.
                  </p>
                  <div className="pt-1.5">
                    <Link
                      href={`/marca/${brand.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 shadow-sm active:scale-95"
                      style={{
                        backgroundColor: buttonBg,
                        color: buttonTextColor,
                      }}
                    >
                      COMPRAR AHORA
                      <CircleArrowRight className="h-3 w-3" style={{ color: buttonTextColor }} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 2: OFERTA DE BONIFICACIÓN POR BATERÍA */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-md border border-white/10 flex flex-col justify-between h-full p-4 xl:p-5 group"
                style={{ backgroundColor: brandColor }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none overflow-hidden">
                  <img
                    src={promoImgs.card2}
                    alt={`Oferta ${brand.name}`}
                    className="w-full h-full object-contain object-right"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 w-16 pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, ${brandColor}, transparent)`,
                    }}
                  />
                </div>

                <div className="relative z-10">
                  <span
                    className="text-[10px] font-black tracking-widest uppercase block mb-0.5"
                    style={{ color: textCol, opacity: 0.85 }}
                  >
                    {brand.name.toUpperCase()}
                  </span>
                </div>

                <div className="relative z-10 max-w-[65%] space-y-1">
                  <h3
                    className="text-xs sm:text-sm font-black uppercase leading-tight"
                    style={{ color: textCol }}
                  >
                    OFERTA DE BONIFICACIÓN POR BATERÍA
                  </h3>
                  <p
                    className="text-[10px] sm:text-[11px] leading-tight"
                    style={{ color: textCol, opacity: 0.85 }}
                  >
                    Elige un artículo GRATIS con tu compra.
                  </p>
                  <div className="pt-1.5">
                    <Link
                      href={`/marca/${brand.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 shadow-sm active:scale-95"
                      style={{
                        backgroundColor: buttonBg,
                        color: buttonTextColor,
                      }}
                    >
                      COMPRAR AHORA
                      <CircleArrowRight className="h-3 w-3" style={{ color: buttonTextColor }} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR — PIPELINE (Symmetrical Height) */}
          <aside className="hidden lg:flex flex-col w-[280px] xl:w-[320px] shrink-0">
            <div className="h-full bg-[#0A0A0A]/95 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#1A1A1A] flex flex-col justify-between shadow-xl">
              {/* Header */}
              <div
                className="px-4 py-3 flex items-center justify-between shrink-0"
                style={{ backgroundColor: brandColor, color: textCol }}
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <h2 className="text-sm font-black uppercase tracking-wider">
                    PIPELINE
                  </h2>
                </div>
                <Link
                  href={`/marca/${brand.slug}`}
                  className="text-xs underline opacity-85 hover:opacity-100 transition-opacity font-semibold"
                >
                  Ver más
                </Link>
              </div>

              {/* Product list — 4 products distributed symmetrically */}
              <div className="flex-1 flex flex-col justify-between divide-y divide-[#1A1A1A]">
                {pipelineProducts.slice(0, 4).map((product) => {
                  const prodImg =
                    product.images?.[0] ||
                    (product as any).image?.asset?.url ||
                    (brand.slug === "milwaukee"
                      ? "/products/milwaukee-combo-thumb.webp"
                      : promoImgs.card1 || "/products/milwaukee-combo-thumb.webp");

                  return (
                    <div
                      key={product.id}
                      onClick={() => openQuickView(product, brandColor)}
                      className="flex-1 flex items-center gap-3 px-3 py-2 hover:bg-[#151515] transition-colors cursor-pointer"
                    >
                      {/* White rounded square thumbnail */}
                      <div className="shrink-0 w-14 h-14 xl:w-16 xl:h-16 rounded-xl bg-white p-1.5 flex items-center justify-center border border-white/20 shadow-sm overflow-hidden">
                        <img
                          src={prodImg}
                          alt={product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes("milwaukee-combo-thumb")) {
                              target.src = "/products/milwaukee-combo-thumb.webp";
                            } else {
                              target.style.display = "none";
                            }
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold leading-snug text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-0.5">
                          {product.name}
                        </p>

                        <div className="flex items-center gap-1 mb-0.5">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-2.5 w-2.5 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-[#777]">
                            ({product.reviewCount || 45})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {product.comparePrice && (
                            <span className="text-[10px] text-[#666] line-through">
                              {formatPrice(product.comparePrice)}
                            </span>
                          )}
                          <span
                            className="text-xs sm:text-sm font-black"
                            style={{ color: isYellowBrand ? "#FFD700" : (brandColor === "#0A0A0A" ? "#FFF" : brandColor) }}
                          >
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>

                      {/* Circular + action button */}
                      <div className="shrink-0 flex items-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addItem(product, 1);
                          }}
                          className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 border cursor-pointer"
                          style={{
                            backgroundColor: isYellowBrand ? "#FFD70022" : `${brandColor}22`,
                            borderColor: isYellowBrand ? "#FFD700" : `${brandColor}66`,
                            color: isYellowBrand ? "#FFD700" : (brandColor === "#0A0A0A" ? "#FFF" : brandColor),
                          }}
                          title="Agregar al carrito"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* ── Wide Promo Banner (Below 3 Columns) ── */}
        <div className="mt-4 mb-6">
          <BrandWidePromoBanner
            brand={brand}
            brandColor={brandColor}
            textColor={textCol}
            hasPromoBanner={hasPromoBanner}
          />
        </div>

        {/* ── Bsale-style Filter & Sort Bar (CAMBIOS M.pdf Item 3) ── */}
        <div className="bg-white dark:bg-[#151515] rounded-xl border border-gray-200 dark:border-[#222] px-4 py-3 shadow-sm mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Left: results counter */}
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-semibold">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <span>Mostrando {sortedProducts.length} resultado{sortedProducts.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Right: filter & sort controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            {/* Filter by Category */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">Filtrar por :</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white dark:bg-[#222] border border-gray-300 dark:border-[#444] text-gray-900 dark:text-white rounded-lg px-2.5 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-red-500 font-medium cursor-pointer"
              >
                <option value="all">Todas las categorías</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Sort by (exact Bsale options from CAMBIOS M.pdf) */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-[#222] border border-gray-300 dark:border-[#444] text-gray-900 dark:text-white rounded-lg px-2.5 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-red-500 font-medium cursor-pointer"
              >
                <option value="relevance">Más relevantes</option>
                <option value="name-asc">Nombres de A a Z</option>
                <option value="name-desc">Nombres de Z a A</option>
                <option value="price-asc">Precios de menor a mayor</option>
                <option value="price-desc">Precios de mayor a menor</option>
                <option value="newest">Nuevos productos</option>
                <option value="oldest">Antiguos productos</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Full Products Catalog Grid — Borderless Cards (CAMBIOS M.pdf Item 2) ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4" style={{ color: isYellowBrand ? "#FFD700" : brandColor }} />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Productos {brand.name}
            </h2>
            <span className="text-xs text-[#666]">
              ({sortedProducts.length})
            </span>
          </div>

          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {sortedProducts.map((product, i) => (
                <div
                  key={product.id || `prod-${i}`}
                  className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <ProductCard product={product} index={i} quickView quickViewColor={brandColor} borderless />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl border border-[#1A1A1A] p-8 text-center">
              <p className="text-[#666] text-sm">
                No hay productos de {brand.name} que coincidan con los filtros seleccionados.
              </p>
              <button
                type="button"
                onClick={() => { setSelectedCategory("all"); setSortBy("relevance"); }}
                className="inline-block mt-3 text-sm font-semibold hover:underline cursor-pointer"
                style={{ color: isYellowBrand ? "#FFD700" : brandColor }}
              >
                Restablecer filtros
              </button>
            </div>
          )}
        </div>

        {/* ── Bottom Tabs ── */}
        {theme?.tabs && Array.isArray(theme.tabs) && theme.tabs.length > 0 && (
          <div
            className="mt-6 flex gap-0 overflow-x-auto rounded-xl border border-[#222]"
            style={{ scrollbarWidth: "none" }}
          >
            {theme.tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  setActiveTab(activeTab === tab ? null : tab)
                }
                className="shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-wide transition-all border-r border-[#222] last:border-r-0"
                style={{
                  backgroundColor:
                    activeTab === tab ? brandColor : "#0A0A0A",
                  color:
                    activeTab === tab
                      ? textCol
                      : isYellowBrand
                        ? "#FFD700"
                        : brandColor === "#1A1A1A"
                          ? "#FFF"
                          : brandColor,
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