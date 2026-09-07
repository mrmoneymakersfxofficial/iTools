"use client";

import { getSanityAttr } from "@/lib/sanity/visual-attributes";

export function RedMarqueeBar() {
  const text = "ENVIOS A TODO EL PERÚ!!   ¡¡ ENVIOS A TODO EL PERÚ!!   ";
  const sanityAttr = getSanityAttr("uiConfig", "uiConfig", "announcementBar");

  return (
    <div
      className="w-full bg-[#E60000] text-white overflow-hidden py-2 select-none shadow-sm cursor-pointer"
      id="envios-peru"
      data-section="Envíos a Todo el Perú"
      data-sanity-doc="uiConfig"
      {...sanityAttr}
    >
      <div className="flex w-max animate-marquee">
        <div className="flex shrink-0 items-center space-x-12 px-4 text-sm sm:text-base md:text-lg font-black tracking-widest uppercase">
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
        </div>
        <div className="flex shrink-0 items-center space-x-12 px-4 text-sm sm:text-base md:text-lg font-black tracking-widest uppercase" aria-hidden="true">
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
}
