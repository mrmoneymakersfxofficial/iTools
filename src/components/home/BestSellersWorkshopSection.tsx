"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "@/hooks/use-toast";

interface BestSellersWorkshopSectionProps {
  products?: any[];
}

export function BestSellersWorkshopSection({ products }: BestSellersWorkshopSectionProps) {
  const { addItem } = useCartStore();
  const displayProducts = (products && products.length > 0) ? products.slice(0, 4) : [];

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product._id || product.id,
      _id: product._id || product.id,
      name: product.name,
      slug: product.slug,
      price: product.salePrice || product.price,
      image: product.image?.asset?.url || "/icon.png",
      brand: product.brand?.name || "iTools",
      quantity: 1,
    });
    toast({
      title: "Agregado al carrito",
      description: `${product.name} se agregó correctamente`,
    });
  };

  return (
    <section className="relative py-8 md:py-10 w-full overflow-hidden" id="los-mas-vendidos" data-section="Los Más Vendidos" data-sanity-doc="product">
      {/* ── Background Workshop Graphic with 3 drills & White Gradient (Image 4) ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/banners/sections/mas-vendidos-taller-full.webp"
          alt="Fondo Taller Los Más Vendidos"
          className="w-full h-full object-cover object-top opacity-95"
        />
        {/* Soft white gradient at bottom & sides (degrade difuminado blanco) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFDFD] via-[#FDFDFD]/75 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/75 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDFDFD]/60 via-transparent to-[#FDFDFD]/60 dark:from-[#0A0A0A]/60 dark:to-[#0A0A0A]/60 pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        {/* Section Title centered */}
        <div className="text-center mb-6 pt-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            LOS MAS VENDIDOS
          </h2>
        </div>

        {/* 4 Floating Product Cards directly over background */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {displayProducts.map((product, idx) => {
            const price = product.price || 0;
            const salePrice = product.salePrice;
            const comparePrice = salePrice ? price : (product.comparePrice || null);
            const displayPrice = salePrice || price || 0;
            const discount = comparePrice ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100) : (product.discountBadge ? parseInt(product.discountBadge) : 0);

            return (
              <Link
                key={product._id || idx}
                href={`/producto/${product.slug}`}
                className="group relative bg-white dark:bg-[#1A1A1A] rounded-xl p-3.5 border border-[#E2E8F0] dark:border-[#2A2A2A] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
              >
                {/* Discount Badge */}
                {discount > 0 && (
                  <span className="absolute top-2.5 left-2.5 z-10 bg-[#E60000] text-white text-[11px] font-black px-2 py-0.5 rounded shadow-sm">
                    -{discount}%
                  </span>
                )}

                {/* Product Image */}
                <div className="relative w-full aspect-square rounded-lg bg-white overflow-hidden flex items-center justify-center p-2 mb-2">
                  {product.image?.asset?.url ? (
                    <img
                      src={product.image.asset.url}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">
                      iTools.pe
                    </div>
                  )}
                </div>

                {/* Info */}
                <div>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                    {product.brand?.name || "HERRAMIENTA"}
                  </span>
                  <h3 className="text-xs font-bold text-[#1A1A1A] dark:text-white line-clamp-2 mt-0.5 leading-snug group-hover:text-[#0056D2] transition-colors">
                    {product.name}
                  </h3>
                </div>

                {/* Price & Action */}
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    {comparePrice && (
                      <span className="text-[10px] text-gray-400 line-through block">
                        {formatPrice(comparePrice)}
                      </span>
                    )}
                    <span className="text-sm font-black text-[#E60000]">
                      {formatPrice(displayPrice)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="h-8 w-8 rounded-lg bg-gray-100 hover:bg-[#E60000] text-gray-600 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-[#E60000] dark:hover:text-white flex items-center justify-center transition-colors shadow-sm"
                    title="Añadir al carrito"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
