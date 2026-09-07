"use client";

import Link from "next/link";
import Image from "next/image";

interface TechnicalServiceBannerProps {
  phone?: string;
  link?: string;
}

export function TechnicalServiceBanner({ phone = "936 085 056", link = "https://wa.me/51936085056" }: TechnicalServiceBannerProps) {
  return (
    <section className="py-2.5 md:py-3 w-full" data-section="Servicio Técnico Oficial">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block w-full h-[120px] sm:h-[150px] md:h-[175px] rounded-xl overflow-hidden shadow-md border border-[#222] transition-transform duration-300 hover:scale-[1.005]"
        >
          <img
            src="/banners/sections/servicio-tecnico-banner.webp"
            alt="Servicio Técnico Oficial Milwaukee 936 085 056"
            className="w-full h-full object-cover object-center"
          />
        </a>
      </div>
    </section>
  );
}
