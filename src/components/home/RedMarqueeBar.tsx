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
  btn4Text?: string;
  btn4Href?: string;
  btn5Text?: string;
  btn5Href?: string;
  btn6Text?: string;
  btn6Href?: string;
  btn7Text?: string;
  btn7Href?: string;
}

export function RedMarqueeBar({
  uiConfig,
  btn1Text,
  btn1Href,
  btn2Text,
  btn2Href,
  btn3Text,
  btn3Href,
  btn4Text,
  btn4Href,
  btn5Text,
  btn5Href,
  btn6Text,
  btn6Href,
  btn7Text,
  btn7Href,
}: RedMarqueeBarProps) {
  const sanityAttr = getSanityAttr("uiConfig", "uiConfig", "announcementBar");

  const b1Text = btn1Text || uiConfig?.marqueeBtn1Text || "¡¡ ENVIOS A TODO EL PERÚ !!";
  const b1Href = btn1Href || uiConfig?.marqueeBtn1Link || "/buscar?q=envios";

  const b2Text = btn2Text || uiConfig?.marqueeBtn2Text || "¡¡ DESPACHO EN 24H !!";
  const b2Href = btn2Href || uiConfig?.marqueeBtn2Link || "/buscar?q=despacho";

  const b3Text = btn3Text || uiConfig?.marqueeBtn3Text || "¡¡ RECOJOS INMEDIATOS !!";
  const b3Href = btn3Href || uiConfig?.marqueeBtn3Link || "/contacto";

  const b4Text = btn4Text || uiConfig?.marqueeBtn4Text || "¡¡ OFERTA DEL DÍA !!";
  const b4Href = btn4Href || uiConfig?.marqueeBtn4Link || "/#ofertas-en-tendencia";

  const b5Text = btn5Text || uiConfig?.marqueeBtn5Text || "¡¡ ATENCIÓN AL CLIENTE !!";
  const b5Href = btn5Href || uiConfig?.marqueeBtn5Link || "https://wa.me/51936085056";

  const b6Text = btn6Text || uiConfig?.marqueeBtn6Text || "¡¡ SERVICIO TÉCNICO !!";
  const b6Href = btn6Href || uiConfig?.marqueeBtn6Link || "/#servicio-tecnico";

  const b7Text = btn7Text || uiConfig?.marqueeBtn7Text || "¡¡ AYUDA CON MI COMPRA !!";
  const b7Href = btn7Href || uiConfig?.marqueeBtn7Link || "https://wa.me/51936085056";

  const buttons = [
    {
      id: "btn-envios",
      text: b1Text,
      href: b1Href,
      ariaLabel: "Envíos a todo el Perú",
      icon: (
        // Airplane
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current" viewBox="0 0 24 24">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      ),
    },
    {
      id: "btn-despacho",
      text: b2Text,
      href: b2Href,
      ariaLabel: "Despacho en 24 Horas",
      icon: (
        // Delivery courier motorbike
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current" viewBox="0 0 24 24">
          <path d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4.18c.41 1.16 1.51 2 2.82 2 1.66 0 3-1.34 3-3h1v-5l-4-3zm-12 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm11 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
          <path d="M5 6h5v2H5zM2 9h6v2H2z" />
        </svg>
      ),
    },
    {
      id: "btn-recojo",
      text: b3Text,
      href: b3Href,
      ariaLabel: "Recojos Inmediatos",
      icon: (
        // Storefront
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current" viewBox="0 0 24 24">
          <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
        </svg>
      ),
    },
    {
      id: "btn-ofertas",
      text: b4Text,
      href: b4Href,
      ariaLabel: "Oferta del Día",
      icon: (
        // Flame / Discount tag
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current" viewBox="0 0 24 24">
          <path d="M19.48 12.35c-1.57-4.08-7.16-4.3-5.81-10.23.1-.44-.37-.78-.7-.52-2.37 1.87-4.93 4.95-4.93 8.35 0 2.21 1.25 4.14 3.09 5.08.38.19.46.71.16 1-1.07 1.05-2.58 1.68-4.24 1.68-3.08 0-5.61-2.27-5.98-5.23-.05-.43-.53-.61-.83-.3-1.07 1.11-1.7 2.6-1.7 4.24C-.02 20.08 3.55 24 7.98 24c6.32 0 11.5-5.18 11.5-11.5 0-.05 0-.1-.01-.15h.01z" />
        </svg>
      ),
    },
    {
      id: "btn-atencion",
      text: b5Text,
      href: b5Href,
      ariaLabel: "Atención al Cliente",
      icon: (
        // Headset / Customer Support
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current" viewBox="0 0 24 24">
          <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2a7 7 0 0 1 14 0v2h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 0 0-9-9z" />
        </svg>
      ),
    },
    {
      id: "btn-servicio",
      text: b6Text,
      href: b6Href,
      ariaLabel: "Servicio Técnico",
      icon: (
        // Wrench & Screwdriver
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current" viewBox="0 0 24 24">
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
        </svg>
      ),
    },
    {
      id: "btn-ayuda",
      text: b7Text,
      href: b7Href,
      ariaLabel: "Ayuda con mi Compra",
      icon: (
        // Help / Shopping bag with question
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
        </svg>
      ),
    },
  ];

  const renderButtonGroup = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex shrink-0 items-center gap-4 sm:gap-6 px-2.5 sm:px-4">
      {[0, 1].flatMap((repeatIdx) =>
        buttons.map((b) => (
          <Link
            key={`${keyPrefix}-${repeatIdx}-${b.id}`}
            href={b.href}
            aria-label={b.ariaLabel}
            className="group/btn relative inline-flex items-center -skew-x-[14deg] bg-white hover:bg-slate-50 active:scale-95 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.18)] border border-blue-100/60 transition-all duration-200 hover:scale-105 shrink-0"
          >
            {/* Inner content unskewed so text and icon stay upright */}
            <div className="flex items-center gap-2 sm:gap-2.5 skew-x-[14deg]">
              {/* Blue Circle with White Icon (Matching Image 3) */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0047AB] flex items-center justify-center shrink-0 shadow-sm">
                {b.icon}
              </div>
              {/* Bold Condensed Red Text */}
              <span className="font-black text-xs sm:text-sm uppercase tracking-tight text-[#E60000] whitespace-nowrap">
                {b.text}
              </span>
            </div>
          </Link>
        ))
      )}
    </div>
  );

  return (
    <div
      className="group relative w-full bg-[#0047AB] overflow-hidden py-3 shadow-md border-y border-[#003882] select-none"
      id="envios-peru"
      data-section="Envíos a Todo el Perú"
      data-sanity-doc="uiConfig"
      {...sanityAttr}
    >
      {/* Moving ticker: continuous infinite scroll with pause on hover */}
      <div className="flex w-max animate-[marquee_45s_linear_infinite] group-hover:[animation-play-state:paused]">
        {renderButtonGroup("set-1")}
        {renderButtonGroup("set-2")}
      </div>
    </div>
  );
}
