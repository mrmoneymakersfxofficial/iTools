"use client";

import { motion } from "framer-motion";
import { Wrench, Star, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useQuickViewStore } from "@/stores/quickview-store";
import type { Product } from "@/types";

function formatPrice(price: number): string {
  return `S/ ${price.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">({count})</span>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  index?: number;
  /** If provided, clicking the card opens the quick view panel instead of navigating */
  quickView?: boolean;
  /** Override the brand color used in quick view header */
  quickViewColor?: string;
}

export function ProductCard({ product, index = 0, quickView, quickViewColor }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const openQuickView = useQuickViewStore((s) => s.openQuickView);
  const wishlisted = isWishlisted(product.id);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group product-card-hover relative flex flex-col rounded-lg border border-border bg-white dark:bg-[#1a1a1a] overflow-hidden h-full"
    >
      {/* Clickable overlay for entire card */}
      {quickView ? (
        <button
          onClick={() => openQuickView(product, quickViewColor)}
          className="absolute inset-0 z-[5] cursor-pointer"
          aria-label={`Ver ${product.name}`}
        />
      ) : (
        <Link
          href={`/producto/${product.slug}`}
          className="absolute inset-0 z-[5]"
          aria-label={`Ver ${product.name}`}
        />
      )}

      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {discount > 0 && (
          <Badge className="bg-itools-red text-white border-0 text-[10px] px-2 py-0.5">
            -{discount}%
          </Badge>
        )}
        {product.isNewArrival && (
          <Badge className="bg-itools-dark text-white border-0 text-[10px] px-2 py-0.5">
            NUEVO
          </Badge>
        )}
      </div>

      {/* Wishlist button */}
      <button
        type="button"
        onClick={() => toggleItem(product.id)}
        className="absolute top-2 right-2 z-[10] h-8 w-8 rounded-full bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        aria-label={wishlisted ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            wishlisted ? "fill-itools-red text-itools-red" : "text-gray-400"
          }`}
        />
      </button>

      {/* Image area */}
      <div className="relative aspect-square bg-surface flex items-center justify-center p-6 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100/50 dark:to-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Wrench className="h-16 w-16 text-gray-300 dark:text-gray-500 group-hover:scale-110 transition-transform duration-300" />

        {/* Brand label */}
        {product.brand && (
          <div className="absolute bottom-2 left-2">
            <span
              className="text-[10px] px-2 py-0.5 rounded-sm text-white"
              style={{
                backgroundColor:
                  product.brand.slug === "milwaukee"
                    ? "#D1001C"
                    : product.brand.slug === "dewalt"
                    ? "#FFD700"
                    : product.brand.slug === "bosch"
                    ? "#005691"
                    : product.brand.slug === "makita"
                    ? "#0077C8"
                    : "#555",
                color: product.brand.slug === "dewalt" ? "#1A1A2E" : "#FFFFFF",
              }}
            >
              {product.brand.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 mb-1.5 group-hover:text-itools-blue dark:group-hover:text-[#3399FF] transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>

        <p className="text-xs text-muted-foreground dark:text-gray-400 line-clamp-1 mb-2 hidden sm:block">
          {product.shortDescription}
        </p>

        <StarRating rating={product.rating} count={product.reviewCount} />

        {/* Price + Add to Cart */}
        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            {product.comparePrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
            <span className="text-base sm:text-lg font-impact text-itools-red">
              {formatPrice(product.price)}
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => addToCart(product)}
            className="bg-itools-red hover:bg-itools-red-dark text-white h-9 px-3 text-xs font-impact shrink-0 transition-colors relative z-[10]"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            <span className="hidden sm:inline">Añadir</span>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}