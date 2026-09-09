"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { toast } from "@/hooks/use-toast";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

interface EquipWorkshopSectionProps {
  products?: any[];
  banners?: any[];
}

const fallbackWorkshopProducts = [
  {
    _id: "ws-ingco-rgh9528",
    name: "ROTOMARTILLO SDS PLUS 950W INGCO RGH9528",
    slug: "rotomartillo-sds-plus-950w-ingco-rgh9528",
    price: 319.00,
    salePrice: 266.90,
    discountBadge: "16",
    reviews: 45,
    brand: { name: "INGCO" },
    image: { asset: { url: "/products/ingco-combo.webp" } },
  },
  {
    _id: "ws-ingco-rh10508",
    name: "ROTOMARTILLO SDS PLUS 1050W INGCO RH10508",
    slug: "rotomartillo-sds-plus-1050w-ingco-rh10508",
    price: 209.00,
    salePrice: 164.90,
    discountBadge: "21",
    reviews: 45,
    brand: { name: "INGCO" },
    image: { asset: { url: "/products/dewalt-drill.webp" } },
  },
  {
    _id: "ws-ingco-rh150028",
    name: "ROTOMARTILLO SDS PLUS 1500W INDUSTRIAL INGCO RH150028",
    slug: "rotomartillo-sds-plus-1500w-ingco-rh150028",
    price: 249.00,
    salePrice: 209.95,
    discountBadge: "16",
    reviews: 45,
    brand: { name: "INGCO" },
    image: { asset: { url: "/products/ingco-combo.webp" } },
  },
  {
    _id: "ws-ingco-rh12008",
    name: "ROTOMARTILLO SDS PLUS 1200W INGCO RH12008",
    slug: "rotomartillo-sds-plus-1200w-ingco-rh12008",
    price: 299.00,
    salePrice: 249.90,
    discountBadge: "16",
    reviews: 45,
    brand: { name: "INGCO" },
    image: { asset: { url: "/products/dewalt-drill.webp" } },
  },
  {
    _id: "ws-ingco-rh150068",
    name: "ROTOMARTILLO SDS PLUS 1500W PRO INGCO RH150068",
    slug: "rotomartillo-sds-plus-1500w-ingco-rh150068",
    price: 249.00,
    salePrice: 209.95,
    discountBadge: "16",
    reviews: 45,
    brand: { name: "INGCO" },
    image: { asset: { url: "/products/ingco-combo.webp" } },
  },
  {
    _id: "ws-total-tg1121006",
    name: "ESMERILADORA ANGULAR 1010W 4-1/2 TOTAL TG1121006",
    slug: "esmeriladora-angular-1010w-total-tg1121006",
    price: 189.00,
    salePrice: 149.00,
    discountBadge: "21",
    reviews: 40,
    brand: { name: "TOTAL" },
    image: { asset: { url: "/products/makita-grinder.webp" } },
  },
  {
    _id: "ws-makita-m0901b",
    name: "ESMERILADORA ANGULAR 4-1/2 540W MAKITA M0901B",
    slug: "esmeriladora-angular-540w-makita-m0901b",
    price: 219.00,
    salePrice: 179.00,
    discountBadge: "18",
    reviews: 52,
    brand: { name: "MAKITA" },
    image: { asset: { url: "/products/makita-grinder.webp" } },
  },
  {
    _id: "ws-milwaukee-2401-20",
    name: "ATORNILLADOR SUBCOMPACTO M12 1/4 MILWAUKEE 2401-20",
    slug: "atornillador-subcompacto-m12-milwaukee-2401-20",
    price: 399.00,
    salePrice: 329.00,
    discountBadge: "17",
    reviews: 46,
    brand: { name: "MILWAUKEE" },
    image: { asset: { url: "/products/milwaukee-m18.webp" } },
  },
  {
    _id: "ws-bosch-gws-700",
    name: "AMOLADORA ANGULAR 4-1/2 710W BOSCH GWS 700",
    slug: "amoladora-angular-710w-bosch-gws-700",
    price: 249.00,
    salePrice: 199.90,
    discountBadge: "20",
    reviews: 50,
    brand: { name: "BOSCH" },
    image: { asset: { url: "/products/bosch-flexiclick.webp" } },
  },
  {
    _id: "ws-dongcheng-dsm03-100a",
    name: "ESMERILADORA ANGULAR 710W DONGCHENG DSM03-100A",
    slug: "esmeriladora-angular-710w-dongcheng-dsm03-100a",
    price: 159.00,
    salePrice: 129.90,
    discountBadge: "18",
    reviews: 35,
    brand: { name: "DONGCHENG" },
    image: { asset: { url: "/products/dongcheng-combo.webp" } },
  },
];

export function EquipWorkshopSection({ products, banners }: EquipWorkshopSectionProps) {
  const { addItem } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();

  const bAuto = banners?.find((b: any) => b._id === "promo-banner-taller-autostyle") || banners?.[0];
  const bTotal = banners?.find((b: any) => b._id === "promo-banner-total-530w") || banners?.[1];
  const bMakita = banners?.find((b: any) => b._id === "promo-banner-taller-card2") || banners?.find((b: any) => b._id === "promo-banner-taller-makita") || banners?.[2];
  const bMilwaukee = banners?.find((b: any) => b._id === "promo-banner-taller-card3") || banners?.find((b: any) => b._id === "promo-banner-taller-milwaukee") || banners?.[3];

  const attrAuto = getSanityAttr(bAuto?._id || "promo-banner-taller-autostyle", "promoBanner", "image");
  const attrTotal = getSanityAttr(bTotal?._id || "promo-banner-total-530w", "promoBanner", "image");
  const attrMakita = getSanityAttr(bMakita?._id || "promo-banner-taller-card2", "promoBanner", "image");
  const attrMilwaukee = getSanityAttr(bMilwaukee?._id || "promo-banner-taller-card3", "promoBanner", "image");

  // Combine products with fallbacks to ensure at least 10 items for rotation
  const combinedList = (products && products.length > 0) ? [...products] : [];
  fallbackWorkshopProducts.forEach((item) => {
    if (!combinedList.some((p: any) => (p._id || p.id) === item._id || p.slug === item.slug)) {
      combinedList.push(item);
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  // Responsive visible count
  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 768) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(5);
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
      id="equipa-tu-taller"
      data-section="Equipa Tu Taller"
      data-sanity-doc="promoBanner"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
          href={bAuto?.link || "/categoria/herramientas-electricas"}
          {...attrAuto}
          className="group relative block w-full h-[110px] sm:h-[130px] md:h-[145px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.005] mb-3 sm:mb-4"
        >
          <img
            src={bAuto?.image?.asset?.url || "/banners/sections/autostyle-banner.webp"}
            alt={bAuto?.title || "Auto Style hasta 50% de ahorro"}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* 3 Banners Row (33% / 33% / 33%) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
          {/* Total 530W */}
          <Link
            href={bTotal?.link || "/marca/total"}
            {...attrTotal}
            className="group relative block w-full h-[170px] sm:h-[200px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src={bTotal?.image?.asset?.url || "/banners/sections/total-530w.webp"}
              alt={bTotal?.title || "Total 530W Pistola para pintar S/ 99.90"}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Makita Teal Deals / Potencia tu Sistema */}
          <Link
            href={bMakita?.link || "/marca/makita"}
            {...attrMakita}
            className="group relative block w-full h-[170px] sm:h-[200px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src={bMakita?.image?.asset?.url || "/banners/sections/makita-teal-deals.webp"}
              alt={bMakita?.title || "Makita Teal Deals"}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Milwaukee Red Hot Deals / Bateria Gratis */}
          <Link
            href={bMilwaukee?.link || "/marca/milwaukee"}
            {...attrMilwaukee}
            className="group relative block w-full h-[170px] sm:h-[200px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src={bMilwaukee?.image?.asset?.url || "/banners/sections/milwaukee-redhot-deals.webp"}
              alt={bMilwaukee?.title || "Milwaukee Red Hot Deals"}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>

        {/* 5 Columns Product Carousel */}
        <div className="relative">
          {/* Navigation Prev Button */}
          <button
            onClick={handlePrev}
            aria-label="Ver productos anteriores"
            className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white dark:bg-[#1A1A1A] text-gray-800 dark:text-white shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-[#E60000] hover:text-white transition-all duration-200 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Navigation Next Button */}
          <button
            onClick={handleNext}
            aria-label="Ver productos siguientes"
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
                    className="shrink-0 px-1.5"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <Link
                      href={`/producto/${product.slug}`}
                      {...prodSanityAttr}
                      className="group relative bg-white dark:bg-[#1A1A1A] rounded-xl p-3 border border-[#EBEBEB] dark:border-[#2A2A2A] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full min-h-[320px]"
                    >
                      {/* Top: Discount badge & Wishlist Heart */}
                      <div className="flex items-center justify-between mb-1.5">
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
                          className="flex items-center gap-1 bg-[#E60000] hover:bg-[#CC0000] text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-colors shadow-sm active:scale-95"
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
