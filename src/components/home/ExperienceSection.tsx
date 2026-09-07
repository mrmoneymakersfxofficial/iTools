"use client";

import Link from "next/link";
import Image from "next/image";

export function ExperienceSection() {
  const cards = [
    {
      title: "Únete a nuestro canal de Whatsapp",
      subtitle: "¡Entérate de las novedades!",
      image: "/banners/sections/exp-whatsapp.webp",
      href: "https://wa.me/51936085056",
      isExternal: true,
    },
    {
      title: "¡Regístrate y gana!",
      subtitle: "Descubre lo que tenemos preparado",
      image: "/banners/sections/exp-sorteo.webp",
      href: "/registro",
      isExternal: false,
    },
    {
      title: "Círculo de especialistas",
      subtitle: "¡Disfruta de los múltiples beneficios!",
      image: "/banners/sections/exp-circulo.webp",
      href: "/cuenta",
      isExternal: false,
    },
    {
      title: "Descarga el APP iTools.pe",
      subtitle: "¡Compra más fácil y rápido!",
      image: "/banners/sections/exp-app.webp",
      href: "#instalar-app",
      isExternal: false,
    },
  ];

  return (
    <section className="py-6 w-full" data-section="Vive la Experiencia iTools">
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
          {cards.map((card, idx) => (
            <a
              key={idx}
              href={card.href}
              target={card.isExternal ? "_blank" : undefined}
              rel={card.isExternal ? "noopener noreferrer" : undefined}
              className="group relative block w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.02]"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
