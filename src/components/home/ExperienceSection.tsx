"use client";

import Link from "next/link";
import Image from "next/image";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

interface ExperienceSectionProps {
  banners?: any[];
}

export function ExperienceSection({ banners }: ExperienceSectionProps) {
  const bWhatsapp = banners?.find((b: any) => b._id === "promo-banner-exp-whatsapp");
  const bSorteo = banners?.find((b: any) => b._id === "promo-banner-exp-sorteo");
  const bCirculo = banners?.find((b: any) => b._id === "promo-banner-exp-circulo");
  const bApp = banners?.find((b: any) => b._id === "promo-banner-exp-app");

  const cards = [
    {
      id: "promo-banner-exp-whatsapp",
      title: bWhatsapp?.title || "Únete a nuestro canal de Whatsapp",
      subtitle: bWhatsapp?.headline || "¡Entérate de las novedades!",
      image: bWhatsapp?.image?.asset?.url || "/banners/sections/exp-whatsapp.webp",
      href: bWhatsapp?.link || "https://wa.me/51936085056",
      isExternal: true,
    },
    {
      id: "promo-banner-exp-sorteo",
      title: bSorteo?.title || "¡Regístrate y gana!",
      subtitle: bSorteo?.headline || "Descubre lo que tenemos preparado",
      image: bSorteo?.image?.asset?.url || "/banners/sections/exp-sorteo.webp",
      href: bSorteo?.link || "/registro",
      isExternal: false,
    },
    {
      id: "promo-banner-exp-circulo",
      title: bCirculo?.title || "Círculo de especialistas",
      subtitle: bCirculo?.headline || "¡Disfruta de los múltiples beneficios!",
      image: bCirculo?.image?.asset?.url || "/banners/sections/exp-circulo.webp",
      href: bCirculo?.link || "/cuenta",
      isExternal: false,
    },
    {
      id: "promo-banner-exp-app",
      title: bApp?.title || "Descarga el APP iTools.pe",
      subtitle: bApp?.headline || "¡Compra más fácil y rápido!",
      image: bApp?.image?.asset?.url || "/banners/sections/exp-app.webp",
      href: bApp?.link || "#instalar-app",
      isExternal: false,
    },
  ];

  return (
    <section
      id="vive-la-experiencia"
      className="py-6 w-full scroll-mt-20"
      data-section="Vive la Experiencia iTools"
      data-sanity-doc="promoBanner"
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#E60000] font-black text-lg tracking-tighter">▶▶</span>
          <h2 className="text-base sm:text-lg font-black text-[#1A1A1A] dark:text-white uppercase tracking-wider">
            VIVE LA EXPERIENCIA iTOOLS
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card, idx) => {
            const sanityAttr = getSanityAttr(card.id, "promoBanner", "image");
            return (
              <a
                key={idx}
                href={card.href}
                target={card.isExternal ? "_blank" : undefined}
                rel={card.isExternal ? "noopener noreferrer" : undefined}
                {...sanityAttr}
                className="group relative block w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.02]"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
