"use client";

import Link from "next/link";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

interface RedMarqueeBarProps {
  uiConfig?: any;
  btn1Text?: string;
  btn1Href?: string;
  btn2Text?: string;
  btn2Href?: string;
  btn3Text?: string;
  btn3Href?: string;
}

export function RedMarqueeBar({
  uiConfig,
  btn1Text,
  btn1Href,
  btn2Text,
  btn2Href,
  btn3Text,
  btn3Href,
}: RedMarqueeBarProps) {
  const sanityAttr = getSanityAttr("uiConfig", "uiConfig", "announcementBar");

  const finalBtn1Text = btn1Text || uiConfig?.marqueeBtn1Text || "¡¡ ENVIOS A TODO EL PERÚ !!";
  const finalBtn1Href = btn1Href || uiConfig?.marqueeBtn1Link || "/buscar?q=envios";
  const finalBtn2Text = btn2Text || uiConfig?.marqueeBtn2Text || "¡¡ DESPACHO EN 24H !!";
  const finalBtn2Href = btn2Href || uiConfig?.marqueeBtn2Link || "/buscar?q=despacho";
  const finalBtn3Text = btn3Text || uiConfig?.marqueeBtn3Text || "¡¡ RECOJO EN TIENDA !!";
  const finalBtn3Href = btn3Href || uiConfig?.marqueeBtn3Link || "/contacto";

  const buttons = [
    {
      id: "btn-envios",
      text: finalBtn1Text,
      href: finalBtn1Href,
      ariaLabel: "Envíos a todo el Perú",
      icon: (
        // Airplane icon matching Image 2
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#FFDD00] fill-current" viewBox="0 0 24 24">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      ),
    },
    {
      id: "btn-despacho",
      text: finalBtn2Text,
      href: finalBtn2Href,
      ariaLabel: "Despacho en 24 Horas",
      icon: (
        // Delivery courier motorbike with box matching Image 2
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#FFDD00] fill-current" viewBox="0 0 24 24">
          <path d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4.18c.41 1.16 1.51 2 2.82 2 1.66 0 3-1.34 3-3h1v-5l-4-3zm-12 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm11 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
          <path d="M5 6h5v2H5zM2 9h6v2H2z" />
        </svg>
      ),
    },
    {
      id: "btn-recojo",
      text: finalBtn3Text,
      href: finalBtn3Href,
      ariaLabel: "Recojo en Tienda",
      icon: (
        // Storefront shop icon matching Image 2
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#FFDD00] fill-current" viewBox="0 0 24 24">
          <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
        </svg>
      ),
    },
  ];

  const renderButtonGroup = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex shrink-0 items-center gap-5 sm:gap-8 px-4 sm:px-6">
      {buttons.map((b) => (
        <Link
          key={`${keyPrefix}-${b.id}`}
          href={b.href}
          aria-label={b.ariaLabel}
          className="group/btn relative inline-flex items-center -skew-x-[14deg] bg-[#FFDD00] hover:bg-[#FFE833] active:scale-95 px-5 sm:px-7 py-2 sm:py-2.5 rounded-lg shadow-[3px_3.5px_0px_#FFFFFF] border border-yellow-300 transition-all duration-200 hover:scale-105 shrink-0"
        >
          {/* Inner content unskewed so text and icon stay upright */}
          <div className="flex items-center gap-2.5 sm:gap-3 skew-x-[14deg]">
            {/* Red Circle with Yellow Icon */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E60000] flex items-center justify-center shrink-0 shadow-sm">
              {b.icon}
            </div>
            {/* Bold Condensed Red Text */}
            <span className="font-black text-sm sm:text-base uppercase tracking-tight text-[#E60000] whitespace-nowrap">
              {b.text}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div
      className="group relative w-full bg-[#E60000] overflow-hidden py-3 shadow-md border-y border-red-700 select-none"
      id="envios-peru"
      data-section="Envíos a Todo el Perú"
      data-sanity-doc="uiConfig"
      {...sanityAttr}
    >
      {/* Moving ticker: 50% shift marquee for seamless infinite continuous scroll with pause on hover */}
      <div className="flex w-max animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused]">
        {renderButtonGroup("set-1")}
        {renderButtonGroup("set-2")}
      </div>
    </div>
  );
}
