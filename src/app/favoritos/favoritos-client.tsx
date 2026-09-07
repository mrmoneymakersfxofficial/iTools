"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/format";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Loader2,
  Package,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function FavoritosClient() {
  const { items, toggleItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const [products, setProducts] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadWishlist() {
      setLoading(true);
      try {
        const res = await fetch("/api/wishlist/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: items }),
        });
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        if (!cancelled) {
          setProducts(data.products || []);
          setRecommended(data.recommended || []);
        }
      } catch (err) {
        console.error("Wishlist load error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, [items]);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  const handleBuyNow = (product: any) => {
    addToCart(product, 1);
    window.location.href = "/checkout";
  };

  const handleAddAllToCart = () => {
    products.forEach((p) => {
      addToCart(p, 1);
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0D0D0D] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Favoritos</span>
        </nav>

        {/* Page Header */}
        <div className="bg-itools-dark text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-[#D1001C] flex items-center justify-center">
                <Heart className="h-5 w-5 fill-[#D1001C]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Mis Favoritos
              </h1>
            </div>
            <p className="text-white/70 text-sm">
              {products.length === 1
                ? "1 herramienta guardada en tu lista de deseos"
                : `${products.length} herramientas guardadas en tu lista de deseos`}
            </p>
          </div>

          {products.length > 0 && (
            <Button
              onClick={handleAddAllToCart}
              className="bg-[#0056D2] hover:bg-[#0047BA] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Añadir Todos al Carrito
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white dark:bg-[#141414] rounded-2xl border border-border dark:border-[#262626] p-16 text-center max-w-md mx-auto shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-[#0056D2] mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-medium">
              Cargando tus productos favoritos desde la base de datos...
            </p>
          </div>
        ) : products.length > 0 ? (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div
                key={product.id || product.slug}
                className="bg-white dark:bg-[#141414] rounded-2xl border border-border dark:border-[#262626] p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group relative"
              >
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => toggleItem(product.id || product._id || product.slug)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-surface dark:bg-[#202020] text-muted-foreground hover:text-[#D1001C] flex items-center justify-center border border-border dark:border-[#333] transition-colors"
                  title="Quitar de favoritos"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Product Image */}
                <Link
                  href={`/producto/${product.slug}`}
                  className="block relative w-full h-44 mb-3 bg-surface dark:bg-[#181818] rounded-xl overflow-hidden p-2"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Package className="h-10 w-10 opacity-30" />
                    </div>
                  )}
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0 mb-4">
                  {product.brand?.name && (
                    <span className="text-[11px] font-bold text-[#0056D2] uppercase tracking-wider block mb-1">
                      {product.brand.name}
                    </span>
                  )}
                  <Link
                    href={`/producto/${product.slug}`}
                    className="text-sm font-semibold text-foreground line-clamp-2 hover:text-[#0056D2] transition-colors"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    SKU: {product.sku}
                  </p>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base font-bold text-itools-red">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>

                  {product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 font-medium mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      En Stock ({product.stock} disponibles)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-red-500 font-medium mt-1">
                      Agotado
                    </span>
                  )}
                </div>

                {/* Action Buttons: Secondary Blue Add to Cart & Primary Red Buy Now */}
                <div className="space-y-2 pt-2 border-t border-border dark:border-[#222]">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-[#0056D2] hover:bg-[#0047BA] text-white font-bold text-xs h-10 rounded-xl shadow-sm transition-all"
                  >
                    <ShoppingCart className="mr-1.5 h-4 w-4" />
                    Agregar al Carrito
                  </Button>
                  <Button
                    onClick={() => handleBuyNow(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-[#D1001C] hover:bg-[#b00018] text-white font-bold text-xs h-10 rounded-xl shadow-sm transition-all"
                  >
                    Comprar Ahora
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State + Real Recommended Products */
          <div className="space-y-10">
            <div className="bg-white dark:bg-[#141414] rounded-2xl border border-border dark:border-[#262626] p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm my-4">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-950/30 text-[#D1001C] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1.5">
                Tu lista de favoritos está vacía
              </h3>
              <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                Guarda tus herramientas profesionales favoritas haciendo clic en el corazón de cualquier producto.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-surface text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Ir al Inicio
                </Link>
              </div>
            </div>

            {/* Real Recommended Products from Database */}
            {recommended.length > 0 && (
              <div className="pt-6 border-t border-border dark:border-[#222]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-500" />
                      Herramientas Destacadas del Catálogo Real
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Agrega productos a tus favoritos con un solo clic
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommended.map((rec) => (
                    <div
                      key={rec.id || rec.slug}
                      className="bg-white dark:bg-[#141414] rounded-2xl border border-border dark:border-[#262626] p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group relative"
                    >
                      {/* Heart button */}
                      <button
                        type="button"
                        onClick={() => toggleItem(rec.id || rec.slug)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-surface dark:bg-[#202020] text-muted-foreground hover:text-[#D1001C] flex items-center justify-center border border-border dark:border-[#333] transition-colors"
                        title="Añadir a favoritos"
                      >
                        <Heart className="h-4 w-4" />
                      </button>

                      {/* Image */}
                      <Link
                        href={`/producto/${rec.slug}`}
                        className="block relative w-full h-36 mb-3 bg-surface dark:bg-[#181818] rounded-xl overflow-hidden p-2"
                      >
                        {rec.image ? (
                          <img
                            src={rec.image}
                            alt={rec.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Package className="h-8 w-8 opacity-30" />
                          </div>
                        )}
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0 mb-3">
                        {rec.brand?.name && (
                          <span className="text-[10px] font-bold text-[#0056D2] uppercase tracking-wider block mb-1">
                            {rec.brand.name}
                          </span>
                        )}
                        <Link
                          href={`/producto/${rec.slug}`}
                          className="text-xs font-semibold text-foreground line-clamp-2 hover:text-[#0056D2] transition-colors"
                        >
                          {rec.name}
                        </Link>
                        <p className="text-[10px] text-muted-foreground font-mono mt-1">
                          SKU: {rec.sku}
                        </p>
                        <div className="flex items-baseline gap-1.5 mt-1.5">
                          <span className="text-sm font-bold text-itools-red">
                            {formatPrice(rec.price)}
                          </span>
                          {rec.comparePrice && (
                            <span className="text-[10px] text-muted-foreground line-through">
                              {formatPrice(rec.comparePrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border dark:border-[#222]">
                        <Button
                          onClick={() => toggleItem(rec.id || rec.slug)}
                          className="w-full bg-red-600/10 hover:bg-red-600/20 text-[#D1001C] font-bold text-[11px] h-8 rounded-lg transition-all"
                        >
                          <Heart className="mr-1 h-3 w-3" />
                          Guardar
                        </Button>
                        <Button
                          onClick={() => handleAddToCart(rec)}
                          className="w-full bg-[#0056D2] hover:bg-[#0047BA] text-white font-bold text-[11px] h-8 rounded-lg shadow-sm transition-all"
                        >
                          <ShoppingCart className="mr-1 h-3 w-3" />
                          Carrito
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
