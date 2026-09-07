"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { toast } from "@/hooks/use-toast";

interface EquipWorkshopSectionProps {
  products?: any[];
}

export function EquipWorkshopSection({ products }: EquipWorkshopSectionProps) {
  const { addItem } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const displayProducts = (products && products.length > 0) ? products.slice(0, 5) : [];

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
      description: `${product.name} se agregó al carrito`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const id = product._id || product.id;
    if (!id) return;
    const currentlyInWish = isWishlisted(id);
    toggleItem(id);
    toast({
      title: currentlyInWish ? "Eliminado de favoritos" : "Añadido a favoritos",
      description: product.name,
    });
  };

  return (
    <section className="py-6 w-full" id="equipa-tu-taller" data-section="Equipa Tu Taller" data-sanity-doc="promoBanner">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#E60000] font-black text-lg tracking-tighter">▶▶</span>
          <h2 className="text-base sm:text-lg font-black text-[#1A1A1A] dark:text-white uppercase tracking-wider">
            EQUIPA TU TALLER
          </h2>
        </div>

        {/* Top Panoramic Auto Style Banner */}
        <Link
          href="/categoria/herramientas-electricas"
          className="group relative block w-full h-[110px] sm:h-[130px] md:h-[145px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.005] mb-3 sm:mb-4"
        >
          <img
            src="/banners/sections/autostyle-banner.webp"
            alt="Auto Style hasta 50% de ahorro"
            className="w-full h-full object-cover"
          />
        </Link>

        {/* 3 Banners Row (33% / 33% / 33%) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
          {/* Total 530W */}
          <Link
            href="/marca/total"
            className="group relative block w-full h-[170px] sm:h-[200px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src="/banners/sections/total-530w.webp"
              alt="Total 530W Pistola para pintar S/ 99.90"
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Makita Teal Deals */}
          <Link
            href="/marca/makita"
            className="group relative block w-full h-[170px] sm:h-[200px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src="/banners/sections/makita-teal-deals.webp"
              alt="Makita Teal Deals"
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Milwaukee Red Hot Deals */}
          <Link
            href="/marca/milwaukee"
            className="group relative block w-full h-[170px] sm:h-[200px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src="/banners/sections/milwaukee-redhot-deals.webp"
              alt="Milwaukee Red Hot Deals"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>

        {/* 5 Columns Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
          {displayProducts.map((product, idx) => {
            const price = product.price || 0;
            const salePrice = product.salePrice;
            const comparePrice = salePrice ? price : (product.comparePrice || null);
            const displayPrice = salePrice || price || 0;
            const discount = comparePrice ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100) : (product.discountBadge ? parseInt(product.discountBadge) : 0);
            const inWish = isWishlisted(product._id);

            return (
              <Link
                key={product._id || idx}
                href={`/producto/${product.slug}`}
                className="group relative bg-white dark:bg-[#1A1A1A] rounded-xl p-3 border border-[#EBEBEB] dark:border-[#2A2A2A] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top: Discount badge & Wishlist Heart */}
                <div className="flex items-center justify-between mb-1.5">
                  {discount > 0 ? (
                    <span className="bg-[#E60000] text-white text-[11px] font-black px-2 py-0.5 rounded">
                      -{discount}%
                    </span>
                  ) : <span />}

                  <button
                    onClick={(e) => handleToggleWishlist(e, product)}
                    className="p-1 rounded-full text-gray-400 hover:text-[#E60000] transition-colors"
                    title={inWish ? "Quitar de favoritos" : "Guardar en favoritos"}
                  >
                    <Heart className={`h-3.5 w-3.5 ${inWish ? "fill-[#E60000] text-[#E60000]" : ""}`} />
                  </button>
                </div>

                {/* Product Image */}
                <div className="relative w-full aspect-square rounded-lg bg-white overflow-hidden flex items-center justify-center p-2 mb-2">
                  {product.image?.asset?.url ? (
                    <img
                      src={product.image.asset.url}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      iTools.pe
                    </div>
                  )}
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-xs font-bold text-[#1A1A1A] dark:text-white line-clamp-2 leading-snug group-hover:text-[#0056D2] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-2 w-2 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[9px] text-gray-400">({product.reviews || 45})</span>
                  </div>
                </div>

                {/* Price & Red Add Button */}
                <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-1">
                  <div>
                    {comparePrice && (
                      <span className="text-[10px] text-gray-400 line-through block">
                        {formatPrice(comparePrice)}
                      </span>
                    )}
                    <span className="text-xs sm:text-sm font-black text-[#E60000]">
                      {formatPrice(displayPrice)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="flex items-center gap-1 bg-[#E60000] hover:bg-[#CC0000] text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-colors shadow-sm"
                  >
                    <ShoppingCart className="h-3 w-3" />
                    Añadir
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
