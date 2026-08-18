"use client";
import Link from "next/link";
import { Wrench, TrendingUp, Plus } from "lucide-react";
import { HorizontalScroll } from "@/components/home/HorizontalScroll";
import { formatPrice } from "@/lib/format";

function MobileProductCard({ product }: { product: any }) {
  const discount = product.price && product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  const displayPrice = product.salePrice || product.price || 0;
  const originalPrice = product.salePrice ? product.price : null;

  return (
    <Link href={`/producto/${product.slug}`} className="group flex-shrink-0 w-[48%] sm:w-[45%] bg-white dark:bg-[#111111] border border-[#E0E0E0] dark:border-[#333] rounded-lg overflow-hidden hover:shadow-md transition-shadow snap-start">
      <div className="relative aspect-square bg-[#F5F5F5] dark:bg-[#1a1a1a] flex items-center justify-center">
        {product.image?.asset?.url ? (
          <img src={product.image.asset.url} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <Wrench className="h-12 w-12 text-gray-300 dark:text-gray-500" />
        )}
        {discount > 0 && <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: "#00A651" }}>-{discount}%</span>}
        {product.discountBadge && <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: "#00A651" }}>{product.discountBadge}</span>}
      </div>
      <div className="p-2">
        {product.brand && <p className="text-[10px] font-semibold text-[#666] dark:text-gray-300 dark:text-gray-500 uppercase tracking-wide mb-0.5">{product.brand}</p>}
        <p className="text-[11px] text-[#333] dark:text-gray-200 leading-snug line-clamp-2 mb-1.5">{product.name}</p>
        <div className="flex items-center gap-1.5">
          {originalPrice && <span className="text-[10px] text-[#999] dark:text-gray-400 line-through">{formatPrice(originalPrice)}</span>}
          <span className="text-sm font-bold text-[#E60000]">{formatPrice(displayPrice)}</span>
        </div>
        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="mt-2 w-full h-7 bg-[#0071C5] hover:bg-[#005a9e] text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
          <Plus className="h-3 w-3" />Agregar
        </button>
      </div>
    </Link>
  );
}

export function TrendingProductsMobile({ products }: { products: any[] }) {
  const safeProducts = products || [];
  if (safeProducts.length === 0) return null;

  return (
    <section className="bg-white dark:bg-[#111111] py-2.5 lg:hidden" data-section="Productos de Moda Móvil">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-[#00A651]" />
          <h2 className="text-sm font-bold text-[#00A651] uppercase tracking-wide">Productos de Moda</h2>
        </div>
        <HorizontalScroll>
          {safeProducts.map((product) => (
            <MobileProductCard key={product._id} product={product} />
          ))}
        </HorizontalScroll>
      </div>
    </section>
  );
}
