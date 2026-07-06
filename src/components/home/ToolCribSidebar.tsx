"use client";
import Link from "next/link";
import { Wrench, Star, TrendingUp } from "lucide-react";
import { products } from "@/lib/data";
import type { Product } from "@/types";

function formatPrice(price: number): string {
  return `S/ ${price.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function SidebarProductCard({ product }: { product: Product }) {
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;
  return (
    <Link href={`/producto/${product.slug}`} className="group flex gap-3 p-3 hover:bg-[#F5F6F8] dark:bg-[#1a1a1a] transition-colors border-b border-[#F0F0F0] last:border-b-0">
      <div className="shrink-0 w-16 h-16 rounded bg-[#F5F5F5] dark:bg-[#1a1a1a] flex items-center justify-center border border-[#E8E8E8] dark:border-[#333]">
        <Wrench className="h-7 w-7 text-gray-300 dark:text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        {discount > 0 && (
          <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded text-white mb-1" style={{ backgroundColor: "#00A651" }}>-{discount}%</span>
        )}
        <p className="text-xs leading-snug text-[#333] dark:text-gray-200 group-hover:text-[#E35205] transition-colors line-clamp-2 mb-1">{product.name}</p>
        <div className="flex items-center gap-1 mb-0.5">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`h-2.5 w-2.5 ${star <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"}`} />
            ))}
          </div>
          <span className="text-[10px] text-[#999] dark:text-gray-400">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
          {product.comparePrice && <span className="text-[11px] text-[#999] dark:text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>}
          <span className="text-sm font-bold text-[#E60000]">{formatPrice(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}

export function ToolCribSidebar() {
  const trendingProducts = products.filter((p) => p.isOnSale || p.isFeatured).slice(0, 7);
  return (
    <aside className="bg-white dark:bg-[#111111] border border-[#E0E0E0] dark:border-[#333] rounded-lg overflow-hidden" data-section="Productos de Moda">
      <div className="px-4 py-3 border-b border-[#E0E0E0] dark:border-[#333]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wide leading-tight">Tool Crib</h2>
            <p className="text-[10px] text-[#999] dark:text-gray-400 uppercase tracking-wider">of the North</p>
          </div>
          <Link href="/categoria/herramientas-electricas" className="flex items-center gap-1 text-xs text-[#E35205] hover:underline">Ver más<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></Link>
        </div>
      </div>
      <div className="bg-[#F5F6F8] dark:bg-[#1a1a1a] px-4 py-2 border-b border-[#E0E0E0] dark:border-[#333]">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-[#00A651]" />
          <span className="text-xs font-bold text-[#00A651] uppercase tracking-wide">Productos de Moda</span>
        </div>
      </div>
      <div>{trendingProducts.map((product) => (<SidebarProductCard key={product.id} product={product} />))}</div>
    </aside>
  );
}