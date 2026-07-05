"use client";
import { useState } from "react";
import Link from "next/link";
import { Wrench, Star, Plus } from "lucide-react";
import { products, getFeaturedProducts, getOnSaleProducts, getNewArrivals } from "@/lib/data";
import type { Product } from "@/types";
import { HorizontalScroll } from "@/components/home/HorizontalScroll";

function formatPrice(price: number): string {
  return `S/ ${price.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const tabs = [
  { id: "featured", label: "Productos Destacados", fn: getFeaturedProducts },
  { id: "sale", label: "Herramientas Eléctricas", fn: getOnSaleProducts },
  { id: "new", label: "Nuevos Ingresos", fn: getNewArrivals },
];

function TabProductCard({ product }: { product: Product }) {
  const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
  const brandColors: Record<string, string> = { milwaukee: "#D1001C", dewalt: "#FFD700", bosch: "#005691", makita: "#0077C8" };
  return (
    <Link href={`/producto/${product.slug}`} className="group flex-shrink-0 w-[48%] sm:w-[45%] bg-white border border-[#E0E0E0] rounded-lg overflow-hidden hover:shadow-md transition-shadow snap-start">
      <div className="relative aspect-square bg-[#F5F5F5] flex items-center justify-center">
        <Wrench className="h-12 w-12 text-gray-300" />
        {product.brand && <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: brandColors[product.brand.slug] || "#333" }}>{product.brand.name.toUpperCase()}</span>}
        {discount > 0 && <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded text-white bg-[#00A651]">-{discount}%</span>}
      </div>
      <div className="p-2">
        <p className="text-[11px] text-[#333] leading-snug line-clamp-2 mb-0.5">{product.name}</p>
        <p className="text-[10px] text-[#999] mb-1">SKU: {product.sku}</p>
        {product.stock > 0 && <p className="text-[10px] text-[#00A651] font-medium flex items-center gap-0.5 mb-1"><Star className="h-2.5 w-2.5 fill-[#00A651] text-[#00A651]" />En stock</p>}
        <div className="flex items-center gap-1.5 mb-2">
          {product.comparePrice && <span className="text-[10px] text-[#999] line-through">{formatPrice(product.comparePrice)}</span>}
          <span className="text-sm font-bold text-[#E60000]">{formatPrice(product.price)}</span>
        </div>
        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="w-full h-7 bg-[#0071C5] hover:bg-[#005a9e] text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"><Plus className="h-3 w-3" />Agregar</button>
      </div>
    </Link>
  );
}

export function ExploreProductsMobile() {
  const [activeTab, setActiveTab] = useState("featured");
  const activeProducts = tabs.find((t) => t.id === activeTab)?.fn() || [];
  return (
    <section className="bg-white py-2.5 lg:hidden" data-section="Explorar Productos">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-4">
        <div className="bg-[#1A1A1A] -mx-2.5 sm:-mx-4 px-4 sm:px-6 py-3 mb-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">Explorar Productos</h2>
        </div>
        <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {tabs.map((tab) => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex-shrink-0 px-3 py-1.5 rounded text-[11px] font-semibold uppercase tracking-wide transition-colors ${activeTab === tab.id ? "bg-[#1A1A1A] text-white" : "bg-[#F5F6F8] text-[#666] hover:bg-[#E8EDF2]"}`}>{tab.label}</button>
          ))}
        </div>
        <HorizontalScroll>{activeProducts.slice(0, 10).map((product) => (<TabProductCard key={product.id} product={product} />))}</HorizontalScroll>
      </div>
    </section>
  );
}