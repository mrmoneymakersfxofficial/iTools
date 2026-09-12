"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "@/hooks/use-toast";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

interface BestSellersWorkshopSectionProps {
  products?: any[];
  backgroundBanner?: any;
}

const fallbackBestSellers = [
  {
    _id: "product-bs-total-pistola",
    name: "SUPER KIT PISTOLA DE PINTAR TOTAL + BATERÍA 5AH + CARGADOR",
    slug: "super-kit-pistola-pintar-total",
    price: 449.90,
    salePrice: 299.90,
    discountBadge: "33",
    brand: { name: "TOTAL" },
    image: { asset: { url: "/products/paint-sprayer.webp" } },
  },
  {
    _id: "product-bs-dongcheng-combo",
    name: "EL SUPER COMBO DE INICIO EL TIO CHENG DONGCHENG",
    slug: "super-combo-inicio-tio-cheng",
    price: 519.90,
    salePrice: 449.90,
    discountBadge: "13",
    brand: { name: "DONGCHENG" },
    image: { asset: { url: "/products/dongcheng-combo.webp" } },
  },
  {
    _id: "product-bs-total-pack-electrico",
    name: "PACK ELECTRICO 16PZS/SET 1000V TOTAL HERRAMIENTAS",
    slug: "pack-electrico-16pzs-total",
    price: 599.90,
    salePrice: 499.90,
    discountBadge: "16",
    brand: { name: "TOTAL" },
    image: { asset: { url: "/products/electrical-kit.webp" } },
  },
  {
    _id: "product-bs-ingco-combo-amoladora",
    name: "COMBO DUPLI AMOLADORA INGCO P20S 1200W BRUSHLESS",
    slug: "combo-dupli-amoladora-ingco",
    price: 609.90,
    salePrice: 499.90,
    discountBadge: "18",
    brand: { name: "INGCO" },
    image: { asset: { url: "/products/ingco-combo.webp" } },
  },
  {
    _id: "product-bs-dewalt-d25133k",
    name: "ROTOMARTILLO SDS PLUS 800W DEWALT D25133K",
    slug: "rotomartillo-sds-plus-dewalt-d25133k",
    price: 549.90,
    salePrice: 489.00,
    discountBadge: "11",
    brand: { name: "DEWALT" },
    image: { asset: { url: "/products/dewalt-drill.webp" } },
  },
  {
    _id: "product-bs-milwaukee-m18-fuel",
    name: "TALADRO PERCUTOR M18 FUEL 1/2\" MILWAUKEE 2804-20",
    slug: "taladro-percutor-m18-fuel-milwaukee",
    price: 899.00,
    salePrice: 749.00,
    discountBadge: "17",
    brand: { name: "MILWAUKEE" },
    image: { asset: { url: "/products/milwaukee-m18.webp" } },
  },
  {
    _id: "product-bs-makita-dga452",
    name: "ESMERILADORA ANGULAR 18V LXT 4-1/2 MAKITA DGA452Z",
    slug: "esmeriladora-angular-18v-makita-dga452z",
    price: 529.00,
    salePrice: 439.00,
    discountBadge: "17",
    brand: { name: "MAKITA" },
    image: { asset: { url: "/products/makita-grinder.webp" } },
  },
  {
    _id: "product-bs-bosch-gsr-12v",
    name: "ATORNILLADOR 12V FLEXICLICK 5 EN 1 GSR 12V-15 FC BOSCH",
    slug: "atornillador-12v-flexiclick-bosch",
    price: 899.00,
    salePrice: 594.92,
    discountBadge: "34",
    brand: { name: "BOSCH" },
    image: { asset: { url: "/products/bosch-flexiclick.webp" } },
  },
];

export function BestSellersWorkshopSection({ products, backgroundBanner }: BestSellersWorkshopSectionProps) {
  const { addItem } = useCartStore();
  const defaultBg = "/banners/sections/mas-vendidos-bg.webp";
  const bgUrl =
    backgroundBanner?.image?.asset?.url &&
    !backgroundBanner.image.asset.url.includes("f3d54967ec4593bb9cb9164a469fbd16f782e4b5")
      ? backgroundBanner.image.asset.url
      : defaultBg;
  const bgSanityAttr = getSanityAttr(backgroundBanner?._id || "promo-banner-mas-vendidos-bg", "promoBanner", "image");

  // Combine provided products with fallbacks ensuring at least 8 products for carousel
  const combinedList = (products && products.length > 0) ? [...products] : [];
  fallbackBestSellers.forEach((item) => {
    if (!combinedList.some((p: any) => (p._id || p.id) === item._id || p.slug === item.slug)) {
      combinedList.push(item);
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  // Responsive visible count
  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const maxIndex = Math.max(0, combinedList.length - visibleCount);

  // Auto-rotation every 3.5s with pause on hover
  useEffect(() => {
    if (isHovered || maxIndex <= 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

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
    <section
      className="relative pt-24 sm:pt-28 md:pt-36 pb-8 w-full overflow-hidden group/section bg-neutral-900"
      id="los-mas-vendidos"
      data-section="Los Más Vendidos"
      data-sanity-doc="product"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Background Workshop Graphic with 3 drills (Clear & Crisp, Image 4) ── */}
      <div className="absolute inset-0 z-0" {...bgSanityAttr}>
        <img
          src={bgUrl}
          alt="Fondo Taller Los Más Vendidos"
          className="w-full h-full object-cover object-top"
        />
        {/* Subtle bottom fade only to ground the cards */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        <h2 className="sr-only">LOS MAS VENDIDOS</h2>

        {/* Carousel Container with Controls */}
        <div className="relative">
          {/* Navigation Prev Button */}
          <button
            onClick={handlePrev}
            aria-label="Ver productos anteriores"
            className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/95 dark:bg-black/90 text-gray-800 dark:text-white shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-[#E60000] hover:text-white transition-all duration-200 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Navigation Next Button */}
          <button
            onClick={handleNext}
            aria-label="Ver productos siguientes"
            className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/95 dark:bg-black/90 text-gray-800 dark:text-white shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-[#E60000] hover:text-white transition-all duration-200 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Carousel Viewport */}
          <div className="overflow-hidden px-1 py-1">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {combinedList.map((product, idx) => {
                const price = product.price || 0;
                const salePrice = product.salePrice;
                const comparePrice = salePrice ? price : (product.comparePrice || null);
                const displayPrice = salePrice || price || 0;
                const discount = comparePrice
                  ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100)
                  : (product.discountBadge ? parseInt(product.discountBadge) : 0);

                const prodSanityAttr = getSanityAttr(product._id || product.id, "product", "image");

                return (
                  <div
                    key={product._id || idx}
                    className="shrink-0 px-2"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <Link
                      href={`/producto/${product.slug}`}
                      {...prodSanityAttr}
                      className="group relative bg-white dark:bg-[#1A1A1A] rounded-xl p-3.5 border border-[#E2E8F0] dark:border-[#2A2A2A] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between h-full min-h-[330px]"
                    >
                      {/* Discount Badge */}
                      {discount > 0 && (
                        <span className="absolute top-2.5 left-2.5 z-10 bg-[#E60000] text-white text-[11px] font-black px-2 py-0.5 rounded shadow-sm">
                          -{discount}%
                        </span>
                      )}

                      {/* Product Image */}
                      {(() => {
                        const productImageUrl =
                          product.image?.asset?.url ||
                          fallbackBestSellers.find(
                            (f) =>
                              f.slug === product.slug ||
                              f._id === product._id ||
                              (product._id && product._id.includes(f._id.replace("bs-", "")))
                          )?.image?.asset?.url;

                        return (
                          <div className="relative w-full aspect-square rounded-lg bg-white overflow-hidden flex items-center justify-center p-2 mb-2">
                            {productImageUrl ? (
                              <img
                                src={productImageUrl}
                                alt={product.name}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">
                                iTools.pe
                              </div>
                            )}
                          </div>
                        );
                      })()}

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
                  </div>
                );
              })}
            </div>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Ir al slide ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  dotIdx === currentIndex ? "w-6 bg-[#E60000]" : "w-2 bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
