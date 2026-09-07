"use client";
import { cn } from "@/lib/utils";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
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
import type { Product } from "@/types";
import { useSectionDeepLinking } from "@/hooks/useSectionDeepLinking";
import { sectionId } from "@/hooks/useSectionDeepLinking";
import { urlFor } from "@/sanity/image";
import { formatPrice } from "@/lib/format";

/** Safe wrapper for urlFor — returns empty string if asset is missing */
function safeUrlFor(img: any, width: number, height?: number): string {
  try {
    if (!img?.asset) return "";
    const builder = urlFor(img).width(width).format("webp");
    return height ? builder.height(height).url() : builder.url();
  } catch {
    return "";
  }
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
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);
  const { addItem: addToCompare, isInCompare } = useCompareStore();
  const inCompare = isInCompare(product.slug || product.id);

  // Enable section deep linking on this page
  useSectionDeepLinking();

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
        <section data-section={product.name}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* LEFT: Image */}
            <div className="bg-white dark:bg-[#111111] rounded-xl border border-border dark:border-[#333] p-4 lg:p-6">
              <div className="flex flex-col gap-4">
                <div className="relative aspect-square bg-surface rounded-lg flex items-center justify-center overflow-hidden">
                  {(() => {
                    const activeImg = product.images?.[activeImageIndex] || product.images?.[0] || product.image;
                    const src = safeUrlFor(activeImg, 800, 800);
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
                    onClick={() => toggleItem(product.id)}
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

            {/* RIGHT: Product Info */}
            <div className="flex flex-col gap-4">
              {product.brand && (
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-sm text-white self-start"
                  style={{
                    backgroundColor:
                      product.brand.slug === "milwaukee" ? "#D1001C"
                      : product.brand.slug === "dewalt" ? "#FFD700"
                      : product.brand.slug === "bosch" ? "#005691"
                      : product.brand.slug === "makita" ? "#0077C8"
                      : "#555",
                    color: product.brand.slug === "dewalt" ? "#1A1A2E" : "#FFFFFF",
                  }}
                >
                  {product.brand.name}
                </span>
              )}

              <h1 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight">
                {product.name}
              </h1>

              <StarRating rating={product.rating} count={product.reviewCount} />

              {/* Price Block */}
              <div className="bg-surface rounded-lg p-4 flex flex-wrap items-center gap-4">
                {originalStrikethrough && originalStrikethrough > finalPrice ? (
                  <>
                    <span className="text-3xl font-impact text-itools-red">
                      {formatPrice(finalPrice)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(originalStrikethrough)}
                    </span>
                    <Badge className="bg-itools-red text-white border-0 text-sm">
                      {product.discountBadge || `-${discount}% OFF`}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Ahorras {formatPrice(originalStrikethrough - finalPrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-impact text-foreground">
                    {formatPrice(finalPrice)}
                  </span>
                )}
              </div>

              {/* Stock */}
              {(product.stock ?? 10) > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="text-sm text-green-700 dark:text-green-400 font-medium">En Stock — {product.stock ?? 10} unidades disponibles</span>
                </div>
              ) : (
                <Badge variant="destructive" className="w-fit">Agotado</Badge>
              )}

              <p className="text-sm text-muted-foreground">
                SKU: <span className="font-mono">{product.sku}</span>
              </p>

              <Separator />

              <div className="border-l-4 border-itools-blue pl-4">
                <p className="text-sm text-foreground leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Actions: Primary Red Buy Now, Secondary Blue Add to Cart, WhatsApp */}
              <div className="space-y-3 mt-4">
                {/* Row 1: Quantity selector & Add to Cart (Secondary iTools Blue) */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center border border-input rounded-lg bg-surface dark:bg-[#1a1a1a]">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-12 w-12 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-l-lg"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-14 text-center text-base font-semibold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-12 w-12 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-r-lg"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Botón Secundario: Azul logo iTools */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-[#0056D2] hover:bg-[#0047BA] text-white font-bold h-12 text-base shadow-sm transition-all active:scale-[0.98]"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Agregar al Carrito
                  </Button>
                </div>

                {/* Row 2: Buy Now (Primary Red) & Wishlist */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      for (let i = 0; i < quantity; i++) addToCart(product);
                      window.location.href = "/checkout";
                    }}
                    disabled={product.stock === 0}
                    className="flex-1 bg-[#D1001C] hover:bg-[#b00018] text-white font-bold h-12 text-base shadow-sm transition-all active:scale-[0.98]"
                  >
                    Comprar Ahora
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "h-12 w-12 border-2 transition-colors",
                      wishlisted ? "border-[#D1001C] text-[#D1001C]" : "border-gray-300 dark:border-gray-600 text-gray-400 hover:text-[#D1001C] hover:border-[#D1001C]"
                    )}
                    onClick={() => toggleItem(product.id)}
                    title={wishlisted ? "En tu lista de deseos" : "Agregar a lista de deseos"}
                  >
                    <Heart className={cn("h-5 w-5", wishlisted && "fill-[#D1001C]")} />
                  </Button>
                </div>

                {/* Row 3: WhatsApp direct purchase */}
                <a
                  href={`https://wa.me/51999999999?text=${encodeURIComponent(`Hola iTools Perú, deseo consultar disponibilidad y comprar: ${product.name} (SKU: ${product.sku}) - Precio: ${formatPrice(finalPrice)}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-11 rounded-lg text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  Comprar por WhatsApp
                </a>

                {/* Share & Compare */}
                <div className="flex items-center gap-3 pt-2">
                  <ShareDialog productName={product.name} productUrl={`/producto/${product.slug}`} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn("gap-1.5 text-xs", inCompare ? "text-[#0056D2]" : "text-muted-foreground hover:text-foreground")}
                    onClick={() =>
                      addToCompare({
                        slug: product.slug || product.id,
                        name: product.name,
                        price: product.price,
                        salePrice: product.comparePrice,
                        image: product.image ? urlFor(product.image).width(100).height(100).format("webp").url() : undefined,
                        brand: product.brand?.name,
                        specs: product.specs,
                      })
                    }
                  >
                    <GitCompare className="h-4 w-4" />
                    {inCompare ? "En comparación" : "Comparar"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: Benefits ── */}
        <section data-section={SECTION_BENEFITS} className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white dark:bg-[#111111] rounded-xl border border-border dark:border-[#333] p-5">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 rounded-full bg-itools-blue/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-itools-blue" />
              </div>
              <span className="text-sm font-medium text-foreground">Envío a todo Perú</span>
              <span className="text-xs text-muted-foreground">Lima y provincias</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 rounded-full bg-itools-blue/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-itools-blue" />
              </div>
              <span className="text-sm font-medium text-foreground">Pago seguro</span>
              <span className="text-xs text-muted-foreground">SSL encriptado</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 rounded-full bg-itools-blue/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-itools-blue" />
              </div>
              <span className="text-sm font-medium text-foreground">Garantía oficial</span>
              <span className="text-xs text-muted-foreground">Respaldado por la marca</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 rounded-full bg-itools-blue/10 flex items-center justify-center">
                <RotateCcw className="h-5 w-5 text-itools-blue" />
              </div>
              <span className="text-sm font-medium text-foreground">Devolución 30 días</span>
              <span className="text-xs text-muted-foreground">Sin preguntas</span>
            </div>
          </div>
        </section>

        {/* ── 6 Pestañas Informativas Ordenadas ── */}
        <div className="mt-12">
          {/* Navigation Bar */}
          <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-hide pb-px">
            {[
              { key: "features" as const, label: "1. Principales Características" },
              { key: "specs" as const, label: "2. Datos Técnicos" },
              { key: "includes" as const, label: "3. Qué Incluye" },
              { key: "recommendations" as const, label: "4. Recomendaciones" },
              { key: "warranty" as const, label: "5. Garantía" },
              { key: "datasheet" as const, label: "6. Ficha Técnica" },
              { key: "reviews" as const, label: `Reseñas (${product.reviewCount || 0})` },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? "border-[#0056D2] text-[#0056D2] bg-blue-50/40 dark:bg-blue-950/20"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                }`}
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
            {activeTab === "specs" && (
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
                  {Object.entries(product.specs || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 px-4 hover:bg-surface/30 dark:hover:bg-[#181818]/30 transition-colors">
                      <span className="text-sm text-muted-foreground">{key}</span>
                      <span className="text-sm font-medium text-foreground text-right">{value}</span>
                    </div>
                  ))}
                  {Object.keys(product.specs || {}).length === 0 && (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Especificaciones estandarizadas según catálogo oficial del fabricante.
                    </div>
                  )}
                </div>
              </div>
            )}

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
                    <Link
                      href={(product as any).technicalSheetUrl || `/api/pdf/ficha-tecnica?sku=${product.sku}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-[#D1001C] text-white hover:bg-[#b00018] transition-colors shadow-sm"
                    >
                      <FileDown className="h-4 w-4" />
                      Descargar PDF
                    </Link>
                    <Link
                      href={`/api/pdf/ficha-tecnica?sku=${product.sku}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-border hover:bg-black/5 dark:hover:bg-white/5 text-foreground transition-colors"
                    >
                      Imprimir Ficha
                    </Link>
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

        {/* ── Section: Related Products ── */}
        {relatedProducts.length > 0 && (
          <section data-section={SECTION_RELATED} className="mt-12">
            <h2 className="text-xl md:text-2xl font-impact text-foreground mb-6">
              {SECTION_RELATED}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}



