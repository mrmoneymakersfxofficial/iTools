"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { toast } from "@/hooks/use-toast";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

interface ProDealsSectionProps {
  products?: any[];
  banners?: any[];
}

const fallbackProProducts = [
  {
    _id: "pro-stanley-stdh8013",
    name: "Taladro Percutor 1/2 800W STANLEY STDH8013",
    slug: "taladro-percutor-stanley-stdh8013",
    price: 219.00,
    salePrice: 186.99,
    discountBadge: "15",
    reviews: 45,
    brand: { name: "STANLEY" },
    image: { asset: { url: "/products/dewalt-drill.webp" } },
  },
  {
    _id: "pro-bosch-go-2",
    name: "ATORNILLADOR 1/4\" 3.6V 5NM 1 BAT 1.5 AH BOSCH GO 2.0",
    slug: "atornillador-bosch-go-2",
    price: 229.90,
    salePrice: 199.90,
    discountBadge: "13",
    reviews: 45,
    brand: { name: "BOSCH" },
    image: { asset: { url: "/products/bosch-flexiclick.webp" } },
  },
  {
    _id: "pro-bosch-gsr-12v",
    name: "ATORNILLADOR 12V, SISTEMA FLEXICLICK 5 EN 1 GSR 12V-15 FC BOSCH",
    slug: "atornillador-12v-flexiclick-bosch",
    price: 899.00,
    salePrice: 594.92,
    discountBadge: "34",
    reviews: 45,
    brand: { name: "BOSCH" },
    image: { asset: { url: "/products/bosch-flexiclick.webp" } },
  },
  {
    _id: "pro-dewalt-d25133k",
    name: "ROTOMARTILLO SDS PLUS 800W DEWALT D25133K",
    slug: "rotomartillo-sds-plus-dewalt-d25133k",
    price: 549.90,
    salePrice: 489.00,
    discountBadge: "11",
    reviews: 45,
    brand: { name: "DEWALT" },
    image: { asset: { url: "/products/dewalt-drill.webp" } },
  },
  {
    _id: "pro-milwaukee-m18-fuel",
    name: "COMBO ROTOMARTILLO + ESMERILADORA M18 FUEL MILWAUKEE",
    slug: "combo-rotomartillo-esmeriladora-milwaukee",
    price: 1999.90,
    salePrice: 1799.90,
    discountBadge: "10",
    reviews: 48,
    brand: { name: "MILWAUKEE" },
    image: { asset: { url: "/products/milwaukee-m18.webp" } },
  },
  {
    _id: "pro-makita-xph14",
    name: "TALADRO PERCUTOR 18V LXT BRUSHLESS MAKITA XPH14Z",
    slug: "taladro-percutor-18v-makita-xph14z",
    price: 749.00,
    salePrice: 629.00,
    discountBadge: "16",
    reviews: 42,
    brand: { name: "MAKITA" },
    image: { asset: { url: "/products/makita-grinder.webp" } },
  },
  {
    _id: "pro-dewalt-dcf887",
    name: "ATORNILLADOR DE IMPACTO 20V MAX XR DEWALT DCF887B",
    slug: "atornillador-impacto-20v-dewalt-dcf887b",
    price: 649.00,
    salePrice: 539.00,
    discountBadge: "17",
    reviews: 50,
    brand: { name: "DEWALT" },
    image: { asset: { url: "/products/dewalt-drill.webp" } },
  },
  {
    _id: "pro-dongcheng-dzk05",
    name: "MARTILLO DEMOLEDOR HEXAGONAL 1500W DONGCHENG DZG05-6",
    slug: "martillo-demoledor-dongcheng-dzg05-6",
    price: 1299.00,
    salePrice: 1099.00,
    discountBadge: "15",
    reviews: 38,
    brand: { name: "DONGCHENG" },
    image: { asset: { url: "/products/dongcheng-combo.webp" } },
  },
];

export function ProDealsSection({ products, banners }: ProDealsSectionProps) {
  const { addItem } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();

  const b1 = banners?.find((b: any) => b._id === "promo-banner-pro-dewalt") || banners?.[0];
  const b2 = banners?.find((b: any) => b._id === "promo-banner-pro-milwaukee") || banners?.[1];

  const attr1 = getSanityAttr(b1?._id || "promo-banner-pro-dewalt", "promoBanner", "image");
  const attr2 = getSanityAttr(b2?._id || "promo-banner-pro-milwaukee", "promoBanner", "image");

  // Combine products with fallbacks to ensure at least 8 items for rotation
  const combinedList = (products && products.length > 0) ? [...products] : [];
  fallbackProProducts.forEach((item) => {
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
    <section
      className="py-6 w-full group/section"
      id="ofertas-para-profesionales"
      data-section="Ofertas Para Profesionales"
      data-sanity-doc="promoBanner"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        {/* Section Title */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#E60000] font-black text-lg tracking-tighter">▶▶</span>
          <h2 className="text-base sm:text-lg font-black text-[#1A1A1A] dark:text-white uppercase tracking-wider">
            OFERTAS PARA PROFESIONALES
          </h2>
        </div>

        {/* 2 50/50 Banners: DeWalt XR vs Milwaukee Forge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <Link
            href={b1?.link || "/marca/dewalt"}
            {...attr1}
            className="group relative block w-full h-[180px] sm:h-[220px] md:h-[250px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src={b1?.image?.asset?.url || "/banners/sections/dewalt-xr-powerpack.webp"}
              alt={b1?.title || "DeWalt XR Powerpack 20V 8Ah 50% Más Potencia"}
              className="w-full h-full object-cover"
            />
          </Link>

          <Link
            href={b2?.link || "/marca/milwaukee"}
            {...attr2}
            className="group relative block w-full h-[180px] sm:h-[220px] md:h-[250px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src={b2?.image?.asset?.url || "/banners/sections/milwaukee-forge.webp"}
              alt={b2?.title || "Milwaukee M18 Redlithium Forge 15 Minutos de Recarga"}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>

        {/* Product Carousel with Auto-Rotation */}
        <div className="relative">
          {/* Navigation Prev Button */}
          <button
            onClick={handlePrev}
            aria-label="Ver ofertas anteriores"
            className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white dark:bg-[#1A1A1A] text-gray-800 dark:text-white shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-[#E60000] hover:text-white transition-all duration-200 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Navigation Next Button */}
          <button
            onClick={handleNext}
            aria-label="Ver ofertas siguientes"
            className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white dark:bg-[#1A1A1A] text-gray-800 dark:text-white shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-[#E60000] hover:text-white transition-all duration-200 active:scale-95"
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
                const inWish = isWishlisted(product._id || product.id);
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
                      className="group relative bg-white dark:bg-[#1A1A1A] rounded-xl p-3 border border-[#EBEBEB] dark:border-[#2A2A2A] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full min-h-[330px]"
                    >
                      {/* Top: Discount badge & Wishlist Heart */}
                      <div className="flex items-center justify-between mb-2">
                        {discount > 0 ? (
                          <span className="bg-[#E60000] text-white text-[11px] font-black px-2 py-0.5 rounded shadow-sm">
                            -{discount}%
                          </span>
                        ) : <span />}

                        <button
                          onClick={(e) => handleToggleWishlist(e, product)}
                          className="p-1 rounded-full text-gray-400 hover:text-[#E60000] transition-colors"
                          title={inWish ? "Quitar de favoritos" : "Guardar en favoritos"}
                        >
                          <Heart className={`h-4 w-4 ${inWish ? "fill-[#E60000] text-[#E60000]" : ""}`} />
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
                              <Star key={s} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400">({product.reviews || 45})</span>
                        </div>
                      </div>

                      {/* Price & Red Add Button */}
                      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
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
                          className="flex items-center gap-1 bg-[#E60000] hover:bg-[#CC0000] text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors shadow-sm active:scale-95"
                        >
                          <ShoppingCart className="h-3 w-3" />
                          Añadir
                        </button>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Ir al slide ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  dotIdx === currentIndex ? "w-6 bg-[#E60000]" : "w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
