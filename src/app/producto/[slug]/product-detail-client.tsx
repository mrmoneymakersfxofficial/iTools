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
import { cn } from "@/lib/utils";
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
  const [activeTab, setActiveTab] = useState<"specs" | "description" | "reviews">("specs");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);
  const { addItem: addToCompare, isInCompare } = useCompareStore();
  const inCompare = isInCompare(product.slug || product.id);

  // Enable section deep linking on this page
  useSectionDeepLinking();

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
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
                {product.comparePrice && product.comparePrice > product.price ? (
                  <>
                    <span className="text-3xl font-impact text-itools-red">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                    <Badge className="bg-itools-red text-white border-0 text-sm">
                      Ahorras {formatPrice(product.comparePrice - product.price)}
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-impact text-foreground">
                    {formatPrice(product.price)}
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

              {/* Quantity + Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <div className="flex items-center border border-input rounded-lg">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 flex items-center justify-center hover:bg-surface transition-colors rounded-l-lg"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-14 text-center text-base font-medium tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12 flex items-center justify-center hover:bg-surface transition-colors rounded-r-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-itools-red hover:bg-itools-red-dark text-white font-impact h-12 text-base tracking-wide transition-colors"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Añadir al Carrito
                </Button>
              </div>

              {/* Buy Now + Wishlist actions */}
              <div className="flex gap-2 mt-1">
                <Button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) addToCart(product);
                    window.location.href = "/checkout";
                  }}
                  disabled={product.stock === 0}
                  className="flex-1 bg-itools-dark hover:bg-gray-800 text-white font-impact h-12 text-base tracking-wide transition-colors"
                >
                  Comprar Ahora
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-12 w-12 border-2 transition-colors",
                    wishlisted ? "border-itools-red text-itools-red" : "border-gray-300 dark:border-gray-600 text-gray-400 hover:text-itools-red hover:border-itools-red"
                  )}
                  onClick={() => toggleItem(product.id)}
                  title={wishlisted ? "En tu lista de deseos" : "Agregar a lista de deseos"}
                >
                  <Heart className={cn("h-5 w-5", wishlisted && "fill-itools-red")} />
                </Button>
              </div>

              {/* Share, Compare & Downloadable Resources */}
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <ShareDialog productName={product.name} productUrl={`/producto/${product.slug}`} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn("gap-1.5", inCompare ? "text-primary" : "text-muted-foreground hover:text-primary")}
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
                    title={inCompare ? "Ya en comparación" : "Comparar producto"}
                  >
                    <GitCompare className="h-4 w-4" />
                    Comparar
                  </Button>
                </div>

                {/* Downloadable Resources Section */}
                {(product as any).technicalSheetUrl && (
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Archivos descargables
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Link href={(product as any).technicalSheetUrl} target="_blank">
                        <Button variant="outline" size="sm" className="gap-1.5 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30">
                          <FileDown className="h-4 w-4" />
                          Ficha Técnica (PDF)
                        </Button>
                      </Link>
                      <Link href={`/api/pdf/ficha-tecnica?sku=${product.sku}`} target="_blank">
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <FileDown className="h-4 w-4" />
                          Imprimir Ficha
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                {!(product as any).technicalSheetUrl && (
                  <PdfDownloadButton
                    product={{
                      name: product.name,
                      slug: product.slug || product.id,
                      sku: product.sku,
                      brand: product.brand?.name,
                      price: product.price,
                      description: product.description || product.shortDescription,
                      specs: (product as any).specs,
                    }}
                    variant="outline"
                    size="sm"
                  />
                )}
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

        {/* ── Tab Navigation (acts as section anchor links) ── */}
        <div className="mt-12">
          <div className="flex gap-0 border-b border-border overflow-x-auto">
            {[
              { key: "specs" as const, label: SECTION_SPECS },
              { key: "description" as const, label: SECTION_DESC },
              { key: "reviews" as const, label: `${SECTION_REVIEWS} (${product.reviewCount})` },
            ].map((tab) => (
              <a
                key={tab.key}
                href={`#${sectionId(tab.label)}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab.key);
                  const el = document.getElementById(sectionId(tab.label));
                  if (el) {
                    const offset = 120;
                    const top = el.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: "smooth" });
                  }
                }}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-itools-blue text-itools-blue"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </a>
            ))}
          </div>

          {/* ── Section: Specs ── */}
          <section
            data-section={SECTION_SPECS}
            id={sectionId(SECTION_SPECS)}
            className="bg-white dark:bg-[#111111] rounded-b-xl border border-t-0 dark:border-[#333] p-6"
          >
            {activeTab === "specs" && (
              Object.keys(product.specs || {}).length > 0 ? (
                <div className="divide-y divide-border">
                  {Object.entries(product.specs || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3">
                      <span className="text-sm text-muted-foreground">{key}</span>
                      <span className="text-sm font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay especificaciones disponibles para este producto.
                </p>
              )
            )}
          </section>

          {/* ── Section: Description ── */}
          <section
            data-section={SECTION_DESC}
            id={sectionId(SECTION_DESC)}
            className="bg-white rounded-b-xl border border-t-0 p-6 mt-px"
          >
            {activeTab === "description" && (
              <div className="prose prose-sm max-w-none">
                <p className="leading-relaxed text-foreground">{product.description}</p>
                {product.brand && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Marca: <span className="font-medium text-foreground">{product.brand.name}</span> — Distribuidor autorizado en Perú.
                  </p>
                )}
                <p className="mt-4 text-sm text-muted-foreground">
                  <strong>Envío:</strong> A todo el Perú. Tiempo estimado 2-5 días hábiles en Lima, 5-10 días en provincias.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong>Garantía:</strong> {product.specs["Garantía"] || "Garantía del fabricante"}.
                </p>
              </div>
            )}
          </section>

          {/* ── Section: Reviews ── */}
          <section
            data-section={SECTION_REVIEWS}
            id={sectionId(SECTION_REVIEWS)}
            className="bg-white rounded-b-xl border border-t-0 p-6 mt-px"
          >
            {activeTab === "reviews" && (
              <ProductReviews
                reviews={reviews || []}
                productSlug={product.slug || product.id}
              />
            )}
          </section>
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


