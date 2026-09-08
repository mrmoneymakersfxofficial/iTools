"use client";

import Link from "next/link";
import { Plane, Truck, Store } from "lucide-react";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

export function RedMarqueeBar() {
  const sanityAttr = getSanityAttr("uiConfig", "uiConfig", "announcementBar");

  const buttons = [
    {
      id: "btn-envios",
      icon: Plane,
      text: "¡¡ ENVIOS A TODO EL PERÚ !!",
      href: "/buscar?q=envios",
      ariaLabel: "Envíos a todo el Perú",
    },
    {
      id: "btn-despacho",
      icon: Truck,
      text: "¡¡ DESPACHO EN 24H !!",
      href: "/buscar?q=despacho",
      ariaLabel: "Despacho en 24 Horas",
    },
    {
      id: "btn-recojo",
      icon: Store,
      text: "¡¡ RECOJO EN TIENDA !!",
      href: "/contacto",
      ariaLabel: "Recojo en Tienda",
    },
  ];

  const renderButtonGroup = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex shrink-0 items-center gap-4 sm:gap-6 px-3 sm:px-4">
      {buttons.map((b) => {
        const Icon = b.icon;
        return (
          <Link
            key={`${keyPrefix}-${b.id}`}
            href={b.href}
            aria-label={b.ariaLabel}
            className="group/btn flex items-center gap-2 bg-[#FFCC00] hover:bg-[#FFE033] active:scale-95 text-[#111] px-4 sm:px-5 py-1.5 rounded-full shadow-md border border-amber-600/20 transition-all duration-200 hover:scale-105 shrink-0"
          >
            <Icon className="h-4 w-4 text-[#111] group-hover/btn:scale-110 transition-transform" />
            <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-[#111] whitespace-nowrap">
              {b.text}
            </span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div
      className="group relative w-full bg-[#E60000] overflow-hidden py-2.5 shadow-sm border-y border-red-700 select-none"
      id="envios-peru"
      data-section="Envíos a Todo el Perú"
      data-sanity-doc="uiConfig"
      {...sanityAttr}
    >
      {/* Moving ticker with pause on hover */}
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {renderButtonGroup("set-1")}
        {renderButtonGroup("set-2")}
        {renderButtonGroup("set-3")}
        {renderButtonGroup("set-4")}
      </div>
    </div>
  );
}
