"use client";

import Link from "next/link";
import Image from "next/image";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

interface TechnicalServiceBannerProps {
  phone?: string;
  link?: string;
  banner?: any;
}

export function TechnicalServiceBanner({
  phone = "936 085 056",
  link = "https://wa.me/51936085056",
  banner,
}: TechnicalServiceBannerProps) {
  const imgUrl = banner?.image?.asset?.url || "/banners/sections/servicio-tecnico-banner.webp";
  const linkUrl = banner?.link || link;
  const sanityAttr = getSanityAttr(banner?._id || "promo-banner-servicio-tecnico", "promoBanner", "image");

  return (
    <section className="py-2.5 md:py-3 w-full" id="servicio-tecnico" data-section="Servicio Técnico Oficial" data-sanity-doc="promoBanner">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          {...sanityAttr}
          className="group relative block w-full h-[120px] sm:h-[150px] md:h-[175px] rounded-xl overflow-hidden shadow-md border border-[#222] transition-transform duration-300 hover:scale-[1.005]"
        >
          <img
            src={imgUrl}
            alt="Servicio Técnico Oficial Milwaukee 936 085 056"
            className="w-full h-full object-cover object-center"
          />
        </a>
      </div>
    </section>
  );
}
