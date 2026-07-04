"use client";
import Link from "next/link";
import { Wrench, Star, TrendingUp, Plus } from "lucide-react";
import { products } from "@/lib/data";
import { HorizontalScroll } from "@/components/home/HorizontalScroll";
import type { Product } from "@/types";

function formatPrice(price: number): string {
  return `S/ ${price.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function MobileProductCard({ product }: { product: Product }) {
  const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
  return (
    <Link href={`/producto/${product.slug}`} className="group flex-shrink-0 w-[48%] sm:w-[45%] bg-white border border-[#E0E0E0] rounded-lg overflow-hidden hover:shadow-md transition-shadow snap-start">
      <div className="relative aspect-square bg-[#F5F5F5] flex items-center justify-center">
        <Wrench className="h-12 w-12 text-gray-300" />
        {discount > 0 && <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: "#00A651" }}>-{discount}%</span>}
      </div>
      <div className="p-2">
        {product.brand && <p className="text-[10px] font-semibold text-[#666] uppercase tracking-wide mb-0.5">{product.brand.name}</p>}
        <p className="text-[11px] text-[#333] leading-snug line-clamp-2 mb-1.5">{product.name}</p>
        <div className="flex items-center gap-1.5">
          {product.comparePrice && <span className="text-[10px] text-[#999] line-through">{formatPrice(product.comparePrice)}</span>}
          <span className="text-sm font-bold text-[#E60000]">{formatPrice(product.price)}</span>
        </div>
        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="mt-2 w-full h-7 bg-[#0071C5] hover:bg-[#005a9e] text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
          <Plus className="h-3 w-3" />Agregar
        </button>
      </div>
    </Link>
  );
}

export function TrendingProductsMobile() {
  const trendingProducts = products.filter((p) => p.isOnSale || p.isFeatured).slice(0, 8);
  return (
    <section className="bg-white py-2.5 lg:hidden" data-section="Productos de Moda Móvil">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-[#00A651]" />
          <h2 className="text-sm font-bold text-[#00A651] uppercase tracking-wide">Productos de Moda</h2>
        </div>
        <HorizontalScroll>{trendingProducts.map((product) => (<MobileProductCard key={product.id} product={product} />))}</HorizontalScroll>
      </div>
    </section>
  );
}