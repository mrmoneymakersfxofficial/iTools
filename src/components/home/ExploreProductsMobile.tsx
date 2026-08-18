"use client";
import { useState } from "react";
import Link from "next/link";
import { Wrench, Star, Plus } from "lucide-react";
import { HorizontalScroll } from "@/components/home/HorizontalScroll";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/format";

const tabs = [
  { id: "featured", label: "Productos Destacados" },
  { id: "sale", label: "En Oferta" },
  { id: "new", label: "Nuevos Ingresos" },
];

function TabProductCard({ product }: { product: any }) {
  const addToCart = useCartStore((s) => s.addItem);
  const price = product.price || 0;
  const comparePrice = product.salePrice ? product.price : (product.comparePrice || null);
  const displayPrice = product.salePrice || product.price || 0;
  const discount = comparePrice ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100) : 0;
  
  const brandColors: Record<string, string> = { milwaukee: "#D1001C", dewalt: "#FFD700", bosch: "#005691", makita: "#0077C8" };
  const brandSlug = product.brandSlug || (typeof product.brand === "string" ? product.brand.toLowerCase() : "");
  const brandName = typeof product.brand === "string" ? product.brand : (product.brand?.name || product.brand);

  const storeProduct = { ...product, id: product._id, price: displayPrice, comparePrice };

  return (
    <Link href={`/producto/${product.slug}`} className="group flex-shrink-0 w-[48%] sm:w-[45%] bg-white dark:bg-[#111111] border border-[#E0E0E0] dark:border-[#333] rounded-lg overflow-hidden hover:shadow-md transition-shadow snap-start">
      <div className="relative aspect-square bg-[#F5F5F5] dark:bg-[#1a1a1a] flex items-center justify-center">
        {product.image?.asset?.url ? (
          <img src={product.image.asset.url} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <Wrench className="h-12 w-12 text-gray-300 dark:text-gray-500" />
        )}
        {brandName && <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: brandColors[brandSlug] || "#333" }}>{brandName.toUpperCase()}</span>}
        {discount > 0 && <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded text-white bg-[#00A651]">-{discount}%</span>}
      </div>
      <div className="p-2">
        <p className="text-[11px] text-[#333] dark:text-gray-200 leading-snug line-clamp-2 mb-0.5">{product.name}</p>
        <div className="flex items-center gap-1.5 mb-2 mt-1">
          {comparePrice && <span className="text-[10px] text-[#999] dark:text-gray-400 line-through">{formatPrice(comparePrice)}</span>}
          <span className="text-sm font-bold text-[#E60000]">{formatPrice(displayPrice)}</span>
        </div>
        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(storeProduct); }} className="w-full h-7 bg-[#0071C5] hover:bg-[#005a9e] text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"><Plus className="h-3 w-3" />Agregar</button>
      </div>
    </Link>
  );
}

export function ExploreProductsMobile({ products }: { products: any[] }) {
  const [activeTab, setActiveTab] = useState("featured");
  const safeProducts = products || [];

  if (safeProducts.length === 0) return null;

  const activeProducts = safeProducts.filter((p) => {
    if (activeTab === "featured") return p.showInFeatured;
    if (activeTab === "sale") return p.salePrice || p.discountBadge;
    if (activeTab === "new") return p.isNewArrival || p.showInNewArrivals;
    return false;
  });

  return (
    <section className="bg-white dark:bg-[#111111] py-2.5 lg:hidden" data-section="Explorar Productos">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-4">
        <div className="bg-[#1A1A1A] -mx-2.5 sm:-mx-4 px-4 sm:px-6 py-3 mb-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">Explorar Productos</h2>
        </div>
        <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {tabs.map((tab) => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex-shrink-0 px-3 py-1.5 rounded text-[11px] font-semibold uppercase tracking-wide transition-colors ${activeTab === tab.id ? "bg-[#1A1A1A] text-white" : "bg-[#F5F6F8] dark:bg-[#1a1a1a] text-[#666] dark:text-gray-300 dark:text-gray-500 hover:bg-[#E8EDF2]"}`}>{tab.label}</button>
          ))}
        </div>
        <HorizontalScroll>{activeProducts.slice(0, 10).map((product) => (<TabProductCard key={product._id} product={product} />))}</HorizontalScroll>
      </div>
    </section>
  );
}
