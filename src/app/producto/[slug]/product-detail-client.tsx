"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product/ProductCard";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import type { Product } from "@/types";

function formatPrice(n: number): string {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">({count} reseñas)</span>
    </div>
  );
}

export function ProductDetailClient({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    openCart();
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ── LEFT: Image ── */}
          <div className="bg-white rounded-xl border border-border p-4 lg:p-6">
            <div className="relative aspect-square bg-surface rounded-lg flex items-center justify-center overflow-hidden">
              <Wrench className="h-32 w-32 text-gray-200" />
              {/* Badges on image */}
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
              {/* Wishlist on image */}
              <button
                type="button"
                onClick={() => toggleItem(product.id)}
                className="absolute top-3 right-3 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
              >
                <Heart className={`h-5 w-5 transition-colors ${wishlisted ? "fill-itools-red text-itools-red" : "text-gray-400"}`} />
              </button>
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="flex flex-col gap-4">
            {/* Brand */}
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

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <StarRating rating={product.rating} count={product.reviewCount} />

            {/* Price Block */}
            <div className="bg-surface rounded-lg p-4 flex items-center gap-4">
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
            {product.stock > 0 ? (
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-sm text-green-700 font-medium">En Stock — {product.stock} unidades disponibles</span>
              </div>
            ) : (
              <Badge variant="destructive" className="w-fit">Agotado</Badge>
            )}

            {/* SKU */}
            <p className="text-sm text-muted-foreground">
              SKU: <span className="font-mono">{product.sku}</span>
            </p>

            <Separator />

            {/* Description */}
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

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 bg-surface rounded-lg p-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="h-4 w-4 text-itools-blue shrink-0" />
                <span>Envío a todo Perú</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4 text-itools-blue shrink-0" />
                <span>Pago seguro</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4 text-itools-blue shrink-0" />
                <span>Garantía oficial</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <RotateCcw className="h-4 w-4 text-itools-blue shrink-0" />
                <span>Devolución 30 días</span>
              </div>
            </div>

            {/* Share */}
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-itools-blue transition-colors self-start"
            >
              <Share2 className="h-4 w-4" />
              Compartir producto
            </button>
          </div>
        </div>

        {/* ── Tabs: Specs / Description ── */}
        <div className="mt-12">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="w-full bg-surface rounded-none h-auto p-0">
              <TabsTrigger
                value="specs"
                className="flex-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-itools-blue data-[state=active]:bg-white data-[state=active]:shadow-none text-sm font-medium"
              >
                Especificaciones Técnicas
              </TabsTrigger>
              <TabsTrigger
                value="description"
                className="flex-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-itools-blue data-[state=active]:bg-white data-[state=active]:shadow-none text-sm font-medium"
              >
                Descripción Completa
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-itools-blue data-[state=active]:bg-white data-[state=active]:shadow-none text-sm font-medium"
              >
                Reseñas ({product.reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="bg-white rounded-b-xl border border-t-0 p-6">
              {Object.keys(product.specs).length > 0 ? (
                <div className="divide-y divide-border">
                  {Object.entries(product.specs).map(([key, value]) => (
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
              )}
            </TabsContent>

            <TabsContent value="description" className="bg-white rounded-b-xl border border-t-0 p-6">
              <p className="text-sm leading-relaxed text-foreground">
                {product.description}
              </p>
              {product.brand && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Marca: <span className="font-medium text-foreground">{product.brand.name}</span>
                </p>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="bg-white rounded-b-xl border border-t-0 p-6">
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Aún no hay reseñas
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Sé el primero en dejar tu reseña sobre este producto y comparte tu experiencia con otros profesionales.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl md:text-2xl font-impact text-foreground mb-6">
              Productos Relacionados
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