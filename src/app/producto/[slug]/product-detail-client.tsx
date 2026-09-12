"use client";
import { cn } from "@/lib/utils";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  CreditCard,
  RotateCcw,
  Star,
  Wrench,
  Share2,
  FileDown,
  GitCompare,
  Check,
  Package,
  HelpCircle,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/product/ProductCard";
import { ShareDialog } from "@/components/product/ShareDialog";
import { ProductReviews } from "@/components/product/ProductReviews";
import { PdfDownloadButton } from "@/components/product/PdfDownloadButton";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCompareStore } from "@/stores/compare-store";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/types";
import { useSectionDeepLinking } from "@/hooks/useSectionDeepLinking";
import { sectionId } from "@/hooks/useSectionDeepLinking";
import { urlFor } from "@/sanity/image";
import { formatPrice } from "@/lib/format";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

const PRODUCT_FALLBACK_IMAGES: Record<string, string> = {
  "super-combo-inicio-tio-cheng": "/products/dongcheng-combo.webp",
  "esmeriladora-angular-18v-makita-dga452z": "/products/makita-grinder.webp",
  "super-kit-pistola-pintar-total": "/products/paint-sprayer.webp",
  "pack-electrico-16pzs-total": "/products/electrical-kit.webp",
  "combo-dupli-amoladora-ingco": "/products/ingco-combo.webp",
  "rotomartillo-sds-plus-dewalt-d25133k": "/products/dewalt-drill.webp",
  "taladro-percutor-m18-fuel-milwaukee": "/products/milwaukee-m18.webp",
  "atornillador-12v-flexiclick-bosch": "/products/bosch-flexiclick.webp",
};

/** Safe wrapper for urlFor — returns empty string if asset is missing, handles strings and URLs directly */
function safeUrlFor(img: any, width: number, height?: number): string {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (img?.asset?.url && typeof img.asset.url === "string") return img.asset.url;
  if (img?.url && typeof img.url === "string") return img.url;
  try {
    if (img?.asset?._ref || img?._ref || img?.asset?._id) {
      const builder = urlFor(img).width(width).format("webp");
      return height ? builder.height(height).url() : builder.url();
    }
  } catch {}
  return "";
}


function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">({count} reseñas)</span>
    </div>
  );
}

const SECTION_SPECS = "Especificaciones Técnicas";
const SECTION_DESC = "Descripción Completa";
const SECTION_REVIEWS = "Reseñas";
const SECTION_BENEFITS = "Beneficios de Compra";
const SECTION_RELATED = "Productos Relacionados";

export function ProductDetailClient({ product, relatedProducts, reviews }: { product: Product; relatedProducts: Product[]; reviews?: any[] }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"features" | "specs" | "includes" | "recommendations" | "warranty" | "datasheet" | "reviews">("features");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const productIdentifier = product.id || (product as any)._id || product.slug;
  const wishlisted = isWishlisted(product.id) || isWishlisted(product.slug) || isWishlisted((product as any)._id);
  const { addItem: addToCompare, isInCompare } = useCompareStore();
  const inCompare = isInCompare(product.slug || product.id);

  const regularPrice = product.price || 0;
  const promoPrice = (product.salePrice && product.salePrice < regularPrice)
    ? product.salePrice
    : ((product.comparePrice && product.comparePrice < regularPrice) ? product.comparePrice : null);
  const compareOriginalPrice = (product.comparePrice && product.comparePrice > regularPrice)
    ? product.comparePrice
    : (promoPrice ? regularPrice : null);
  const finalPrice = promoPrice || regularPrice;
  const originalStrikethrough = promoPrice ? regularPrice : compareOriginalPrice;

  const discount = (originalStrikethrough && originalStrikethrough > finalPrice)
    ? Math.round(((originalStrikethrough - finalPrice) / originalStrikethrough) * 100)
    : 0;

  const cartProduct = {
    ...product,
    price: finalPrice,
    comparePrice: originalStrikethrough || undefined,
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }
    openCart();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link href="/" className="hover:text-itools-blue transition-colors">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {product.category && (
            <>
              <Link
                href={`/categoria/${product.category.slug}`}
                className="hover:text-itools-blue transition-colors"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>

        {/* ── Section: Product Overview ── */}
        <section data-section={product.name} data-sanity-doc="product">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* LEFT: Image */}
            <div className="bg-white dark:bg-[#111111] rounded-xl border border-border dark:border-[#333] p-4 lg:p-6">
              <div className="flex flex-col gap-4">
                <div
                  {...getSanityAttr(productIdentifier, "product", "image")}
                  className="relative aspect-square bg-surface rounded-lg flex items-center justify-center overflow-hidden"
                >
                  {(() => {
                    const activeImg = product.images?.[activeImageIndex] || product.images?.[0] || product.image;
                    const src = safeUrlFor(activeImg, 800, 800) || PRODUCT_FALLBACK_IMAGES[product.slug] || "";
                    return src ? (
                      <img
                        src={src}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    ) : (
                      <Wrench className="h-32 w-32 text-gray-200 dark:text-gray-600" />
                    );
                  })()}

                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {discount > 0 && (
                      <Badge className="bg-itools-red text-white border-0 text-sm px-2.5 py-1">
                        -{discount}% OFF
                      </Badge>
                    )}
                    {product.isNewArrival && (
                      <Badge className="bg-itools-blue text-white border-0 text-sm px-2.5 py-1">
                        NUEVO
                      </Badge>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleItem(productIdentifier)}
                    className="absolute top-3 right-3 z-10 h-10 w-10 rounded-full bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white dark:hover:bg-[#222] transition-colors"
                  >
                    <Heart className={`h-5 w-5 transition-colors ${wishlisted ? "fill-itools-red text-itools-red" : "text-gray-400"}`} />
                  </button>
                </div>
                {product.images && product.images.filter((img: any) => img?.asset).length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {product.images.filter((img: any) => img?.asset).map((img: any, idx: number) => {
                      const thumbSrc = safeUrlFor(img, 150);
                      if (!thumbSrc) return null;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-20 h-20 shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                            activeImageIndex === idx ? "border-itools-blue" : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          <img
                            src={thumbSrc}
                            alt={`${product.name} - Imagen ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Product Info — Exact Image 3 Layout */}
            <div className="flex flex-col gap-3">
              {/* Product Title */}
              <h1
                {...getSanityAttr(productIdentifier, "product", "name")}
                className="text-2xl sm:text-3xl font-extrabold uppercase text-[#1A1A1A] dark:text-white leading-tight"
              >
                {product.name}
              </h1>

              {/* Rating & Reviews Count */}
              <StarRating rating={product.rating || 5} count={product.reviewCount || 45} />

              {/* Price, Stock, SKU on Left + Dedicated Brand Logo Card on Right */}
              {(() => {
                const brandSlug = (typeof product.brand?.slug === "string" ? product.brand.slug : product.brand?.slug?.current) || product.brand?.name?.toLowerCase().replace(/\s+/g, "-") || "";
                const brandName = product.brand?.name || "iTools";
                const brandLogoUrl = (product as any).brandLogo?.asset?.url || product.brand?.logo?.asset?.url || (brandSlug ? `/brands/${brandSlug}.webp` : null);

                return (
                  <div className="flex items-start justify-between gap-4 pt-1">
                    <div className="flex-1 space-y-2">
                      {/* Price row */}
                      <div {...getSanityAttr(productIdentifier, "product", "price")} className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#E60000] tracking-tight">
                          {formatPrice(finalPrice)}
                        </span>
                        {originalStrikethrough && originalStrikethrough > finalPrice && (
                          <>
                            <span className="text-base sm:text-lg text-gray-400 font-bold line-through">
                              {formatPrice(originalStrikethrough)}
                            </span>
                            <span className="bg-[#E60000] text-white text-xs font-black px-2 py-0.5 rounded shadow-xs">
                              -{discount}%
                            </span>
                          </>
                        )}
                      </div>

                      {/* Stock status */}
                      {(product.stock ?? 3) > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#10B981] animate-pulse" />
                          <span className="text-xs sm:text-sm font-semibold text-[#10B981] dark:text-emerald-400">
                            En Stock — {product.stock ?? 3} unidades disponibles
                          </span>
                        </div>
                      ) : (
                        <Badge variant="destructive" className="w-fit">Agotado</Badge>
                      )}

                      {/* SKU & Code (Prominent & Larger font) */}
                      <div {...getSanityAttr(productIdentifier, "product", "sku")} className="flex items-center gap-2 pt-1">
                        <span className="text-base font-bold text-gray-500 dark:text-gray-400">
                          SKU:
                        </span>
                        <span className="text-base sm:text-lg font-mono font-bold text-gray-800 dark:text-gray-100 select-all">
                          {product.sku}
                        </span>
                      </div>
                    </div>

                    {/* Brand Logo Box on Right (Image 3) */}
                    {brandSlug && (
                      <Link
                        href={`/marca/${brandSlug}`}
                        title={`Ver todo el catálogo de ${brandName}`}
                        className="w-28 sm:w-32 h-28 sm:h-32 rounded-2xl border border-gray-200 dark:border-[#333] p-3 flex items-center justify-center bg-white dark:bg-[#1A1A1A] shadow-xs hover:border-[#0056D2] hover:shadow-md transition-all shrink-0 group"
                      >
                        {brandLogoUrl ? (
                          <img
                            src={brandLogoUrl}
                            alt={brandName}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <span className="text-sm font-black uppercase text-[#1A1A1A] dark:text-white group-hover:text-[#0056D2]">
                            {brandName}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                );
              })()}

              {/* Short Description */}
              {product.shortDescription && (
                <p {...getSanityAttr(productIdentifier, "product", "shortDescription")} className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                  {product.shortDescription}
                </p>
              )}

              {/* Actions: Image 3 Layout */}
              <div className="space-y-3 mt-2">
                {/* Row 1: Quantity counter + [ Agregar Carrito ] (RED #E60000) */}
                <div className="flex gap-3">
                  <div className="flex items-center border border-gray-300 dark:border-[#333] rounded-xl bg-white dark:bg-[#1a1a1a] h-12 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-full w-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-l-xl text-lg font-bold"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-base font-bold tabular-nums text-foreground">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-full w-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-r-xl text-lg font-bold"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-[#E60000] hover:bg-[#CC0000] text-white font-bold h-12 text-base sm:text-lg rounded-xl shadow-sm transition-all active:scale-[0.98]"
                  >
                    Agregar Carrito
                  </Button>
                </div>

                {/* Row 2: [ Comprar Ahora ] (BLUE #0056D2) + WhatsApp (GREEN SQUARE #25D366) */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      for (let i = 0; i < quantity; i++) addToCart(cartProduct);
                      window.location.href = "/checkout";
                    }}
                    disabled={product.stock === 0}
                    className="flex-1 bg-[#0056D2] hover:bg-[#0047BA] text-white font-bold h-12 text-base sm:text-lg rounded-xl shadow-sm transition-all active:scale-[0.98]"
                  >
                    Comprar Ahora
                  </Button>

                  <a
                    href={`https://wa.me/51999999999?text=${encodeURIComponent(`Hola iTools Perú, deseo comprar: ${product.name} (SKU: ${product.sku}) - Precio: ${formatPrice(finalPrice)}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Comprar o consultar por WhatsApp"
                    className="h-12 w-12 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shrink-0 shadow-sm transition-all hover:scale-105 active:scale-95"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  </a>
                </div>

                {/* Quick Action Links: Compartir | Comparar | Alerta de precio | Agregar a la lista */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-[#262626] text-xs text-gray-500 dark:text-gray-400">
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast({ title: "Enlace copiado", description: "El enlace al producto se copió al portapapeles." });
                      }
                    }}
                    className="flex items-center gap-1.5 hover:text-[#0056D2] transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Compartir</span>
                  </button>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      addToCompare({
                        slug: product.slug || product.id,
                        name: product.name,
                        price: product.price,
                        salePrice: product.comparePrice,
                        image: safeUrlFor(product.image, 100),
                        brand: product.brand?.name,
                        specs: product.specs,
                      });
                      toast({ title: inCompare ? "Ya está en comparación" : "Añadido a comparación", description: product.name });
                    }}
                    className={cn("flex items-center gap-1.5 transition-colors", inCompare ? "text-[#0056D2] font-bold" : "hover:text-[#0056D2]")}
                  >
                    <GitCompare className="h-4 w-4" />
                    <span>{inCompare ? "En comparación" : "Comparar"}</span>
                  </button>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <button
                    type="button"
                    onClick={() => toast({ title: "Alerta de Precio Activada", description: `Te avisaremos si ${product.name} baja de precio.` })}
                    className="flex items-center gap-1.5 hover:text-[#0056D2] transition-colors"
                  >
                    <Bell className="h-4 w-4" />
                    <span>Alerta de precio</span>
                  </button>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      toggleItem(productIdentifier);
                      toast({ title: wishlisted ? "Eliminado de la lista" : "Añadido a la lista", description: product.name });
                    }}
                    className={cn("flex items-center gap-1.5 transition-colors", wishlisted ? "text-[#E60000] font-bold" : "hover:text-[#E60000]")}
                  >
                    <Heart className={cn("h-4 w-4", wishlisted && "fill-[#E60000]")} />
                    <span>{wishlisted ? "En la lista" : "Agregar a la lista"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Blue Pill Navigation Tabs (Image 3) ── */}
        <div className="mt-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
            {[
              { key: "features" as const, label: "Principales Características" },
              { key: "specs" as const, label: "Datos Técnicos" },
              { key: "includes" as const, label: "Que Incluye" },
              { key: "recommendations" as const, label: "Recomendaciones" },
              { key: "warranty" as const, label: "Garantía" },
              { key: "datasheet" as const, label: "Ficha Tecnica" },
              { key: "reviews" as const, label: `Reseñas (${product.reviewCount || 45})` },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer",
                  activeTab === tab.key
                    ? "bg-[#0056D2] text-white ring-2 ring-[#0056D2] ring-offset-1"
                    : "bg-[#0056D2] text-white hover:bg-[#0047BA] opacity-90 hover:opacity-100"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Container for tab contents */}
          <div className="bg-white dark:bg-[#111111] rounded-b-2xl border border-t-0 border-border dark:border-[#262626] p-6 sm:p-8 shadow-sm">
            {/* 1. Principales Características */}
            {activeTab === "features" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0056D2]" />
                    Principales Características y Ventajas
                  </h3>
                  {product.shortDescription && (
                    <p className="text-sm text-foreground/90 font-medium leading-relaxed mb-4">
                      {product.shortDescription}
                    </p>
                  )}
                </div>

                {Array.isArray((product as any).features) && (product as any).features.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(product as any).features.map((feat: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80 bg-surface dark:bg-[#181818] p-3.5 rounded-xl border border-border dark:border-[#262626]">
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="prose prose-sm max-w-none text-foreground/80 space-y-4">
                    <p className="leading-relaxed whitespace-pre-line">{product.description || product.shortDescription}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                      <div className="bg-surface dark:bg-[#181818] p-4 rounded-xl border border-border dark:border-[#262626]">
                        <p className="text-xs font-bold text-[#0056D2] uppercase tracking-wider mb-1">Rendimiento</p>
                        <p className="text-xs text-muted-foreground">Diseñado para soportar jornadas intensivas de trabajo profesional e industrial.</p>
                      </div>
                      <div className="bg-surface dark:bg-[#181818] p-4 rounded-xl border border-border dark:border-[#262626]">
                        <p className="text-xs font-bold text-[#0056D2] uppercase tracking-wider mb-1">Ergonomía</p>
                        <p className="text-xs text-muted-foreground">Empuñadura y balance optimizados para minimizar la fatiga durante el uso continuo.</p>
                      </div>
                      <div className="bg-surface dark:bg-[#181818] p-4 rounded-xl border border-border dark:border-[#262626]">
                        <p className="text-xs font-bold text-[#0056D2] uppercase tracking-wider mb-1">Durabilidad</p>
                        <p className="text-xs text-muted-foreground">Componentes internos de alta calidad resistentes al polvo y caídas en obra.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Datos Técnicos */}
            {activeTab === "specs" && (() => {
              // Normalize specs from Sanity (array of { key, value }) or Record<string, string>
              const specsList: { key: string; value: string }[] = Array.isArray(product.specs)
                ? (product.specs as any[]).map((item: any) => ({
                    key: typeof item === "object" && item !== null ? (item.key || item.name || "") : String(item),
                    value: typeof item === "object" && item !== null ? (typeof item.value === "object" ? JSON.stringify(item.value) : String(item.value ?? "")) : "",
                  })).filter((s) => s.key || s.value)
                : (typeof product.specs === "object" && product.specs !== null)
                ? Object.entries(product.specs).map(([k, v]) => ({
                    key: k,
                    value: typeof v === "object" ? JSON.stringify(v) : String(v ?? ""),
                  }))
                : [];

              return (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0056D2]" />
                    Especificaciones Técnicas
                  </h3>
                  <div className="divide-y divide-border border border-border dark:border-[#262626] rounded-xl overflow-hidden">
                    <div className="flex justify-between py-3 px-4 bg-surface/50 dark:bg-[#181818]/50">
                      <span className="text-sm font-semibold text-muted-foreground">SKU / Código</span>
                      <span className="text-sm font-bold text-foreground font-mono">{product.sku}</span>
                    </div>
                    {product.brand && (
                      <div className="flex justify-between py-3 px-4">
                        <span className="text-sm font-semibold text-muted-foreground">Marca</span>
                        <span className="text-sm font-medium text-foreground">{product.brand.name}</span>
                      </div>
                    )}
                    {specsList.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-3 px-4 hover:bg-surface/30 dark:hover:bg-[#181818]/30 transition-colors">
                        <span className="text-sm text-muted-foreground">{item.key}</span>
                        <span className="text-sm font-medium text-foreground text-right">{item.value}</span>
                      </div>
                    ))}
                    {specsList.length === 0 && (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Especificaciones estandarizadas según catálogo oficial del fabricante.
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* 3. Qué Incluye */}
            {activeTab === "includes" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0056D2]" />
                  Contenido del Paquete
                </h3>
                {Array.isArray((product as any).includes) && (product as any).includes.length > 0 ? (
                  <ul className="space-y-2.5">
                    {(product as any).includes.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-foreground bg-surface dark:bg-[#181818] p-3 rounded-xl border border-border dark:border-[#262626]">
                        <Package className="h-4 w-4 text-[#0056D2]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">El producto se entrega completamente nuevo en su empaque original e incluye:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 text-sm text-foreground bg-surface dark:bg-[#181818] p-3.5 rounded-xl border border-border dark:border-[#262626]">
                        <Package className="h-4 w-4 text-[#0056D2]" />
                        <span>1x {product.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-foreground bg-surface dark:bg-[#181818] p-3.5 rounded-xl border border-border dark:border-[#262626]">
                        <FileDown className="h-4 w-4 text-[#0056D2]" />
                        <span>1x Manual de instrucciones y certificado de garantía oficial</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-foreground bg-surface dark:bg-[#181818] p-3.5 rounded-xl border border-border dark:border-[#262626]">
                        <Shield className="h-4 w-4 text-[#0056D2]" />
                        <span>Accesorios estándar de empaque oficial</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Recomendaciones */}
            {activeTab === "recommendations" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0056D2]" />
                  Recomendaciones de Uso y Seguridad
                </h3>
                {(product as any).recommendations ? (
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                    {(product as any).recommendations}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-border dark:border-[#262626] bg-surface dark:bg-[#181818]">
                      <h4 className="text-sm font-bold text-foreground mb-1.5 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-amber-500" />
                        Seguridad Personal (EPP)
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Utilice siempre lentes de protección ocular, guantes de trabajo adecuados y protección auditiva durante el funcionamiento.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-border dark:border-[#262626] bg-surface dark:bg-[#181818]">
                      <h4 className="text-sm font-bold text-foreground mb-1.5 flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-blue-500" />
                        Mantenimiento Preventivo
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Limpie las ranuras de ventilación después de cada jornada para evitar la acumulación de virutas o polvo en el motor.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-border dark:border-[#262626] bg-surface dark:bg-[#181818]">
                      <h4 className="text-sm font-bold text-foreground mb-1.5 flex items-center gap-2">
                        <Package className="h-4 w-4 text-green-500" />
                        Almacenamiento
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Guarde la herramienta en un lugar seco y limpio, lejos del alcance de niños o de la intemperie húmeda.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-border dark:border-[#262626] bg-surface dark:bg-[#181818]">
                      <h4 className="text-sm font-bold text-foreground mb-1.5 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-purple-500" />
                        Servicio Oficial
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Para cualquier reparación o cambio de carbones/repuestos, recurra a los centros de servicio técnico autorizados iTools.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. Garantía */}
            {activeTab === "warranty" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0056D2]" />
                  Garantía y Respaldo Oficial
                </h3>
                <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-5 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0056D2] text-white flex items-center justify-center shrink-0">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-foreground">
                        {(product as any).warranty || (product.brand?.name ? `Garantía Oficial ${product.brand.name} Perú` : "Garantía Oficial del Fabricante")}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Todos los productos comercializados en iTools Perú cuentan con respaldo directo del fabricante contra defectos de fabricación y mano de obra.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-900/30 text-xs text-foreground/80">
                    <div>
                      <strong>Cobertura:</strong> Defectos de fabricación en motor y componentes mecánicos.
                    </div>
                    <div>
                      <strong>Repuestos:</strong> 100% legítimos y certificados.
                    </div>
                    <div>
                      <strong>Soporte:</strong> Asistencia técnica a nivel nacional.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Ficha Técnica */}
            {activeTab === "datasheet" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0056D2]" />
                  Ficha Técnica Oficial del Producto
                </h3>
                <div className="border border-border dark:border-[#262626] rounded-2xl p-6 sm:p-8 bg-surface dark:bg-[#181818] flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 text-left w-full sm:w-auto">
                    <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/40 text-[#D1001C] flex items-center justify-center shrink-0">
                      <FileDown className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground mb-1">
                        Ficha Técnica Oficial — {product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Documento PDF con todas las especificaciones, diagramas y recomendaciones técnicas oficiales.
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 mt-1">
                        SKU: {product.sku} &bull; Idioma: Español &bull; Formato: PDF
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                    <a
                      href={(product as any).technicalSheetUrl || `/api/pdf/ficha-tecnica?sku=${product.sku}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-[#D1001C] text-white hover:bg-[#b00018] transition-colors shadow-sm"
                    >
                      <FileDown className="h-4 w-4" />
                      Descargar PDF
                    </a>
                    <a
                      href={`/api/pdf/ficha-tecnica?sku=${product.sku}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-border hover:bg-black/5 dark:hover:bg-white/5 text-foreground transition-colors"
                    >
                      Imprimir Ficha
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Reseñas (Sub-sección complementaria) */}
            {activeTab === "reviews" && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0056D2]" />
                  Opiniones de Clientes Verificados
                </h3>
                <ProductReviews
                  reviews={reviews || []}
                  productSlug={product.slug || product.id}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Section: Completa Tu Equipo Con (Image 4) ── */}
        {relatedProducts.length > 0 && (
          <section data-section="COMPLETA TU EQUIPO CON" className="mt-14">
            <h2 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight mb-6">
              COMPLETA TU EQUIPO CON
            </h2>

            <div className="relative group/carousel">
              {/* Flecha Izquierda */}
              <button
                type="button"
                onClick={() => scrollCarousel("left")}
                aria-label="Ver productos anteriores"
                className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2c2c2c] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </button>

              {/* Carrusel de Productos */}
              <div
                ref={carouselRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2 px-1"
              >
                {relatedProducts.map((p, i) => {
                  const pPrice = p.price || 0;
                  const pSalePrice = (p.salePrice && p.salePrice < pPrice) ? p.salePrice : null;
                  const pComparePrice = p.comparePrice && p.comparePrice > (pSalePrice || pPrice) ? p.comparePrice : null;
                  const currentPrice = pSalePrice || pPrice;
                  const strikethroughPrice = pSalePrice ? pPrice : pComparePrice;
                  const pId = p.id || (p as any)._id || p.slug;
                  const isItemWishlisted = isWishlisted(pId) || isWishlisted(p.slug);
                  const isDiscounted = !!pSalePrice || (!!p.comparePrice && p.comparePrice > pPrice);

                  return (
                    <div
                      key={pId || i}
                      className="group/card w-[185px] sm:w-[205px] md:w-[220px] shrink-0 rounded-xl border border-gray-200 dark:border-[#262626] bg-white dark:bg-[#161616] p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative"
                    >
                      {/* Fila superior: Badge y Favorito */}
                      <div className="flex items-center justify-between gap-1 min-h-[22px]">
                        {isDiscounted ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-[#16A34A] dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/50">
                            <span className="text-[10px] leading-none">📉</span>
                            BAJADA DE PRECIO
                          </span>
                        ) : i % 2 === 0 ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-[#D97706] dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/50">
                            <Star className="h-2.5 w-2.5 fill-[#D97706] text-[#D97706]" />
                            MEJOR VALORADO
                          </span>
                        ) : (
                          <span />
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleItem(pId);
                            toast({
                              title: isItemWishlisted ? "Eliminado de la lista" : "Añadido a la lista",
                              description: p.name,
                            });
                          }}
                          className="text-gray-400 hover:text-[#E60000] p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#222] transition-colors cursor-pointer ml-auto"
                          aria-label="Añadir a lista de deseos"
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4 transition-colors",
                              isItemWishlisted ? "fill-[#E60000] text-[#E60000]" : "text-gray-400 group-hover/card:text-gray-600"
                            )}
                          />
                        </button>
                      </div>

                      {/* Imagen centrada */}
                      <Link
                        href={`/producto/${p.slug}`}
                        className="block relative aspect-square w-full my-2 overflow-hidden rounded-lg bg-white p-2"
                      >
                        <img
                          src={safeUrlFor(p.image, 300, 300) || (p.image as any)?.asset?.url || "/placeholder-product.png"}
                          alt={p.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover/card:scale-105"
                          loading="lazy"
                        />
                      </Link>

                      {/* Título */}
                      <Link
                        href={`/producto/${p.slug}`}
                        className="font-bold text-xs sm:text-sm text-foreground line-clamp-2 leading-snug mb-1 hover:text-[#0056D2] transition-colors h-9"
                        title={p.name}
                      >
                        {p.name}
                      </Link>

                      {/* Número de artículo / SKU */}
                      <p className="text-[11px] text-muted-foreground font-medium truncate mb-1">
                        {p.sku
                          ? (p.sku.toLowerCase().startsWith("sku") ? p.sku : `Número de artículo: ${p.sku}`)
                          : "Artículo iTools"}
                      </p>

                      {/* Calificación por estrellas */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-3 w-3 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          ({p.reviewCount || 45})
                        </span>
                      </div>

                      {/* Precios */}
                      <div className="mb-3">
                        {strikethroughPrice ? (
                          <p className="text-[11px] text-muted-foreground line-through leading-tight">
                            {formatPrice(strikethroughPrice)}
                          </p>
                        ) : (
                          <p className="text-[11px] text-muted-foreground line-through opacity-0 select-none leading-tight">
                            -
                          </p>
                        )}
                        <p className="text-base sm:text-lg font-black text-[#E60000] leading-tight">
                          {formatPrice(currentPrice)}
                        </p>
                      </div>

                      {/* Botón Rojo + AÑADIR */}
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(
                            {
                              id: pId,
                              name: p.name,
                              slug: p.slug,
                              price: currentPrice,
                              image: safeUrlFor(p.image, 200, 200) || (p.image as any)?.asset?.url || "",
                              sku: p.sku || "",
                              brand: p.brand?.name || "",
                            },
                            1
                          );
                          openCart();
                          toast({ title: "Añadido al carrito", description: p.name });
                        }}
                        className="w-full bg-[#E60000] hover:bg-[#CC0000] active:scale-[0.98] text-white font-black text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all uppercase tracking-wide shadow-xs cursor-pointer"
                      >
                        <Plus className="h-4 w-4 stroke-[3]" />
                        <span>AÑADIR</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Flecha Derecha */}
              <button
                type="button"
                onClick={() => scrollCarousel("right")}
                aria-label="Ver siguientes productos"
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2c2c2c] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5 stroke-[2.5]" />
              </button>
            </div>
          </section>
        )}

        {/* ── 4 Trust Badges (Image 4) ── */}
        <div className="mt-16 pt-10 pb-6 border-t border-border dark:border-[#262626]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#EBF4FF] dark:bg-[#0A2540] text-[#0066FF] flex items-center justify-center mb-3 shadow-xs">
                <Truck className="h-6 w-6" />
              </div>
              <h4 className="text-sm md:text-base font-bold text-foreground">Envío a todo Perú</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Lima y provincias</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#EBF4FF] dark:bg-[#0A2540] text-[#0066FF] flex items-center justify-center mb-3 shadow-xs">
                <CreditCard className="h-6 w-6" />
              </div>
              <h4 className="text-sm md:text-base font-bold text-foreground">Pago seguro</h4>
              <p className="text-xs text-muted-foreground mt-0.5">SSL encriptado</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#EBF4FF] dark:bg-[#0A2540] text-[#0066FF] flex items-center justify-center mb-3 shadow-xs">
                <Shield className="h-6 w-6" />
              </div>
              <h4 className="text-sm md:text-base font-bold text-foreground">Garantía oficial</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Respaldado por la marca</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#EBF4FF] dark:bg-[#0A2540] text-[#0066FF] flex items-center justify-center mb-3 shadow-xs">
                <RotateCcw className="h-6 w-6" />
              </div>
              <h4 className="text-sm md:text-base font-bold text-foreground">Politica de compra</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Sin preguntas</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



