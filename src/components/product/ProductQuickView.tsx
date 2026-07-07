"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Star,
  Wrench,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Share2,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useQuickViewStore } from "@/stores/quickview-store";
import { getProductsByBrand, getBrandTheme } from "@/lib/data";
import type { Product } from "@/types";

function formatPrice(n: number): string {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getBrandColorForProduct(product: Product): string {
  if (product.brand) {
    const theme = getBrandTheme(product.brand.slug);
    return theme.color;
  }
  return "#D1001C";
}

export function ProductQuickView() {
  const { isOpen, product, brandColor, closeQuickView } = useQuickViewStore();
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState<"details" | "specs" | "shipping">("details");
  const [copied, setCopied] = useState(false);

  const wishlisted = product ? isWishlisted(product.id) : false;

  // Derived: related products from same brand (no effect needed)
  const relatedProducts = product?.brand
    ? getProductsByBrand(product.brand.id).filter((p) => p.id !== product.id).slice(0, 6)
    : [];

  // Reset copied state after timeout using ref pattern (no effect needed)
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/producto/${product?.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickView();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeQuickView]);

  if (!product) return null;

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const effectiveBrandColor = brandColor || getBrandColorForProduct(product);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    openCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={closeQuickView}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[101] w-full sm:w-[520px] lg:w-[580px] bg-[#0F0F0F] shadow-2xl flex flex-col overflow-hidden"
            style={{ borderLeft: `3px solid ${effectiveBrandColor}` }}
          >
            {/* ── Header ── */}
            <div
              className="shrink-0 px-5 py-4 flex items-center justify-between"
              style={{ backgroundColor: effectiveBrandColor }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Wrench className="h-5 w-5 text-white shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wide truncate">
                    {product.brand?.name || "iTools"} Perú
                  </h2>
                  <p className="text-[10px] text-white/70 truncate">
                    Vista rápida de producto
                  </p>
                </div>
              </div>
              <button
                onClick={closeQuickView}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Product Image Area */}
              <div className="relative aspect-[4/3] bg-[#1A1A1A] flex items-center justify-center">
                <Wrench className="h-28 w-28 text-[#333]" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {discount > 0 && (
                    <Badge className="text-white border-0 text-xs px-2.5 py-1 font-bold" style={{ backgroundColor: effectiveBrandColor }}>
                      -{discount}% OFF
                    </Badge>
                  )}
                  {product.isNewArrival && (
                    <Badge className="bg-emerald-500 text-white border-0 text-xs px-2.5 py-1 font-bold">
                      NUEVO
                    </Badge>
                  )}
                </div>

                {/* Wishlist */}
                <button
                  onClick={() => toggleItem(product.id)}
                  className="absolute top-3 right-3 h-9 w-9 rounded-full bg-[#222]/80 backdrop-blur-sm flex items-center justify-center hover:bg-[#333] transition-colors"
                >
                  <Heart
                    className={`h-4.5 w-4.5 transition-colors ${
                      wishlisted ? "fill-red-500 text-red-500" : "text-[#888]"
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="px-5 py-4 space-y-3">
                {/* Brand tag */}
                {product.brand && (
                  <Link
                    href={`/marca/${product.brand.slug}`}
                    className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-md text-white uppercase tracking-wider hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: effectiveBrandColor }}
                    onClick={closeQuickView}
                  >
                    {product.brand.name}
                  </Link>
                )}

                {/* Title */}
                <h3 className="text-lg font-semibold text-white leading-tight">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= Math.round(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-[#333] text-[#333]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#888]">
                    {product.rating} ({product.reviewCount} reseñas)
                  </span>
                </div>

                {/* SKU + Stock */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-[#666]">
                    SKU: <span className="font-mono text-[#999]">{product.sku}</span>
                  </span>
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      En Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="text-red-400 font-medium">Agotado</span>
                  )}
                </div>

                {/* Price Block */}
                <div className="bg-[#1A1A1A] rounded-xl p-4">
                  {product.comparePrice && product.comparePrice > product.price ? (
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="text-2xl font-bold" style={{ color: effectiveBrandColor }}>
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-[#666] line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                      <Badge className="text-white border-0 text-xs font-bold" style={{ backgroundColor: effectiveBrandColor }}>
                        Ahorras {formatPrice(product.comparePrice - product.price)}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Section Tabs */}
                <div className="flex gap-0 border-b border-[#222]">
                  {[
                    { key: "details" as const, label: "Detalles" },
                    { key: "specs" as const, label: "Especificaciones" },
                    { key: "shipping" as const, label: "Envío" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveSection(tab.key)}
                      className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                        activeSection === tab.key
                          ? "border-white text-white"
                          : "border-transparent text-[#666] hover:text-[#999]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeSection === "details" && (
                  <div className="space-y-3 py-2">
                    <div className="border-l-2 pl-3" style={{ borderColor: effectiveBrandColor }}>
                      <p className="text-sm text-[#CCC] leading-relaxed">
                        {product.shortDescription}
                      </p>
                    </div>
                    <p className="text-xs text-[#888] leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {activeSection === "specs" && (
                  <div className="py-2">
                    {Object.keys(product.specs).length > 0 ? (
                      <div className="space-y-0 divide-y divide-[#1A1A1A]">
                        {Object.entries(product.specs).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2.5">
                            <span className="text-xs text-[#888]">{key}</span>
                            <span className="text-xs text-[#CCC] font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#666] text-center py-6">
                        No hay especificaciones disponibles.
                      </p>
                    )}
                  </div>
                )}

                {activeSection === "shipping" && (
                  <div className="space-y-4 py-2">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${effectiveBrandColor}20` }}>
                        <Truck className="h-4 w-4" style={{ color: effectiveBrandColor }} />
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">Envío a todo Perú</p>
                        <p className="text-xs text-[#888] mt-0.5">Lima: 2-5 días hábiles. Provincias: 5-10 días hábiles.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${effectiveBrandColor}20` }}>
                        <Shield className="h-4 w-4" style={{ color: effectiveBrandColor }} />
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">Garantía Oficial</p>
                        <p className="text-xs text-[#888] mt-0.5">{product.specs["Garantía"] || "Garantía del fabricante"}. Servicio técnico autorizado.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${effectiveBrandColor}20` }}>
                        <RotateCcw className="h-4 w-4" style={{ color: effectiveBrandColor }} />
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">Devolución 30 días</p>
                        <p className="text-xs text-[#888] mt-0.5">Sin preguntas. Producto en su empaque original.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity + Add to Cart */}
                <div className="flex gap-3 pt-2">
                  <div className="flex items-center border border-[#333] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-11 w-11 flex items-center justify-center hover:bg-[#1A1A1A] transition-colors"
                    >
                      <Minus className="h-4 w-4 text-[#888]" />
                    </button>
                    <span className="w-12 text-center text-sm font-medium text-white tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-11 w-11 flex items-center justify-center hover:bg-[#1A1A1A] transition-colors"
                    >
                      <Plus className="h-4 w-4 text-[#888]" />
                    </button>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 h-11 text-sm font-bold uppercase tracking-wide rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: effectiveBrandColor,
                      color: "#FFF",
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Añadir al Carrito
                  </Button>
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => toggleItem(product.id)}
                    className="flex items-center gap-1.5 text-xs text-[#888] hover:text-white transition-colors"
                  >
                    <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
                    {wishlisted ? "En favoritos" : "Guardar"}
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 text-xs text-[#888] hover:text-white transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                    {copied ? "Copiado" : "Compartir"}
                  </button>
                  <Link
                    href={`/producto/${product.slug}`}
                    onClick={closeQuickView}
                    className="flex items-center gap-1 text-xs hover:text-white transition-colors ml-auto"
                    style={{ color: effectiveBrandColor }}
                  >
                    Ver página completa <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* ── Related Products ── */}
              {relatedProducts.length > 0 && (
                <div className="px-5 pb-5">
                  <div className="h-px bg-[#222] mb-4" />
                  <h4 className="text-xs font-bold text-[#888] uppercase tracking-wide mb-3">
                    Productos Relacionados
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {relatedProducts.slice(0, 4).map((rp) => {
                      const rpDiscount = rp.comparePrice
                        ? Math.round(((rp.comparePrice - rp.price) / rp.comparePrice) * 100)
                        : 0;
                      return (
                        <Link
                          key={rp.id}
                          href={`/marca/${rp.brand?.slug || ""}`}
                          onClick={closeQuickView}
                          className="group bg-[#1A1A1A] rounded-xl p-3 hover:bg-[#222] transition-colors"
                        >
                          <div className="relative aspect-square bg-[#222] rounded-lg flex items-center justify-center mb-2">
                            <Wrench className="h-10 w-10 text-[#444]" />
                            {rpDiscount > 0 && (
                              <span
                                className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded text-white"
                                style={{ backgroundColor: getBrandColorForProduct(rp) }}
                              >
                                -{rpDiscount}%
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#BBB] line-clamp-2 leading-tight mb-1.5 group-hover:text-white transition-colors">
                            {rp.name}
                          </p>
                          <span className="text-xs font-bold" style={{ color: getBrandColorForProduct(rp) }}>
                            {formatPrice(rp.price)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}