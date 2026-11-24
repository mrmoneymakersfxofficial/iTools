"use client";
import Link from "next/link";
import { Wrench, Star, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

const PRODUCT_FALLBACK_IMAGES: Record<string, string> = {
  "super-combo-inicio-tio-cheng": "/products/dongcheng-combo.webp",
  "esmeriladora-angular-18v-makita-dga452z": "/products/makita-grinder.webp",
  "super-kit-pistola-pintar-total": "/products/paint-sprayer.webp",
  "pack-electrico-16pzs-total": "/products/electrical-kit.webp",
  "combo-dupli-amoladora-ingco": "/products/ingco-combo.webp",
  "rotomartillo-sds-plus-dewalt-d25133k": "/products/dewalt-drill.webp",
  "taladro-percutor-m18-fuel-milwaukee": "/products/milwaukee-m18.webp",
  "atornillador-12v-flexiclick-bosch": "/products/bosch-flexiclick.webp",
};

function SidebarProductCard({ product }: { product: any }) {
  const price = product.price || 0;
  const comparePrice = product.salePrice ? product.price : (product.comparePrice || null);
  const displayPrice = product.salePrice || product.price || 0;
  const discount = comparePrice ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100) : 0;
  const sanityAttr = getSanityAttr(product._id || product.id, "product", "image");
  const imgUrl = product.image?.asset?.url || (typeof product.image === "string" ? product.image : null) || PRODUCT_FALLBACK_IMAGES[product.slug];
  
  return (
    <Link
      href={`/producto/${product.slug}`}
      {...sanityAttr}
      className="group flex gap-3 p-3 hover:bg-[#F5F6F8] dark:bg-[#1a1a1a] transition-colors border-b border-[#F0F0F0] last:border-b-0"
    >
      <div className="relative shrink-0 w-16 h-16 rounded bg-[#F5F5F5] dark:bg-[#1a1a1a] flex items-center justify-center border border-[#E8E8E8] dark:border-[#333]">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/logo.png";
              target.className = "w-12 h-auto object-contain opacity-85";
            }}
            className="absolute inset-0 w-full h-full object-cover rounded"
          />
        ) : (
          <img src="/logo.png" alt="iTools.Pe" className="w-12 h-auto object-contain opacity-85" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        {discount > 0 && (
          <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded text-white mb-1" style={{ backgroundColor: "#00A651" }}>-{discount}%</span>
        )}
        <p className="text-xs leading-snug text-[#333] dark:text-gray-200 group-hover:text-[#E35205] transition-colors line-clamp-2 mb-1">{product.name}</p>
        <div className="flex items-center gap-1 mb-0.5">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`h-2.5 w-2.5 ${star <= Math.round(product.rating || 0) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"}`} />
            ))}
          </div>
          <span className="text-[10px] text-[#999] dark:text-gray-400">({product.reviewCount || product.reviews || 0})</span>
        </div>
        <div className="flex items-center gap-2">
          {comparePrice && <span className="text-[11px] text-[#999] dark:text-gray-400 line-through">{formatPrice(comparePrice)}</span>}
          <span className="text-sm font-bold text-[#E60000]">{formatPrice(displayPrice)}</span>
        </div>
      </div>
    </Link>
  );
}

interface ToolCribHomeSettings {
  toolCribTitle?: string;
  toolCribSubtitle?: string;
  toolCribViewMoreText?: string;
  toolCribHeading?: string;
  toolCribLink?: string;
}

export function ToolCribSidebar({
  products,
  homeSettings,
}: {
  products: any[];
  homeSettings?: ToolCribHomeSettings | null;
}) {
  const trendingProducts = (products || []).slice(0, 6);
  if (trendingProducts.length === 0) return null;

  const mainTitle = homeSettings?.toolCribTitle || "TOOL CRIB";
  const subtitle = homeSettings?.toolCribSubtitle || "OF THE NORTH";
  const viewMoreText = homeSettings?.toolCribViewMoreText || "Ver más";
  const sectionHeading = homeSettings?.toolCribHeading || "PRODUCTOS DE MODA";
  const targetLink = homeSettings?.toolCribLink || "/categoria/herramientas-electricas";

  return (
    <aside
      className="bg-white dark:bg-[#111111] border border-[#E0E0E0] dark:border-[#333] rounded-lg overflow-hidden h-full flex flex-col justify-between"
      data-section="Productos de Moda"
    >
      <div>
        <div className="px-4 py-3 border-b border-[#E0E0E0] dark:border-[#333]">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h2
                {...getSanityAttr("homeSettings", "homeSettings", "toolCribTitle")}
                className="text-sm font-black text-[#1A1A1A] dark:text-white uppercase tracking-wider leading-tight truncate"
              >
                {mainTitle}
              </h2>
              <p
                {...getSanityAttr("homeSettings", "homeSettings", "toolCribSubtitle")}
                className="text-[10px] font-bold text-[#999] dark:text-gray-400 uppercase tracking-wider mt-0.5 truncate"
              >
                {subtitle}
              </p>
            </div>
            <Link
              href={targetLink}
              {...getSanityAttr("homeSettings", "homeSettings", "toolCribViewMoreText")}
              className="flex items-center gap-1 text-xs font-bold text-[#E35205] hover:underline shrink-0"
            >
              {viewMoreText}
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        <div
          className="bg-[#F5F6F8] dark:bg-[#1a1a1a] px-4 py-2 border-b border-[#E0E0E0] dark:border-[#333]"
          {...getSanityAttr("homeSettings", "homeSettings", "toolCribHeading")}
        >
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-[#00A651] shrink-0" />
            <span className="text-xs font-black text-[#00A651] uppercase tracking-wider">
              {sectionHeading}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between divide-y divide-[#F0F0F0] dark:divide-[#222]">
        {trendingProducts.map((product) => (
          <SidebarProductCard key={product._id} product={product} />
        ))}
      </div>
    </aside>
  );
}
