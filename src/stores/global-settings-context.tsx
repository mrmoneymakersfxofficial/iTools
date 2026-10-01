"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Category } from "@/types";

export type UIConfig = {
  aiAssistantIconUrl?: string;
  aiAssistantTitle?: string;
  aiAssistantWelcome?: string;
  addToCartText: string;
  viewDetailsText: string;
  outOfStockText: string;
  searchPlaceholder: string;
  shippingBadgeText: string;
  securePaymentText: string;
  warrantyText: string;
  returnsText: string;
  marqueeBtn1Text?: string;
  marqueeBtn1Link?: string;
  marqueeBtn2Text?: string;
  marqueeBtn2Link?: string;
  marqueeBtn3Text?: string;
  marqueeBtn3Link?: string;
  marqueeBtn4Text?: string;
  marqueeBtn4Link?: string;
  marqueeBtn5Text?: string;
  marqueeBtn5Link?: string;
  marqueeBtn6Text?: string;
  marqueeBtn6Link?: string;
  marqueeBtn7Text?: string;
  marqueeBtn7Link?: string;
};

export type HeaderConfig = {
  phone?: string;
  phoneUrl?: string;
  location?: string;
  badge1?: string;
  badge2?: string;
  announcementBar?: string;
};

export type FooterConfig = {
  aboutText?: string;
  contactInfo?: string;
  socialLinks?: { platform: string; url: string }[];
  bottomLinks?: { title: string; url: string }[];
  columns?: any[];
};

export type GlobalSettings = {
  uiConfig: UIConfig;
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;
  categories: Category[];
};

const GlobalSettingsContext = createContext<GlobalSettings | null>(null);

export function GlobalSettingsProvider({
  children,
  settings,
}: {
  children: ReactNode;
  settings: GlobalSettings;
}) {
  return (
    <GlobalSettingsContext.Provider value={settings}>
      {children}
    </GlobalSettingsContext.Provider>
  );
}

const defaultSettings: GlobalSettings = {
  uiConfig: {
    addToCartText: "Añadir al Carrito",
    viewDetailsText: "Ver Detalles",
    outOfStockText: "Agotado",
    searchPlaceholder: "Buscar herramientas...",
    shippingBadgeText: "Envío a todo Perú",
    securePaymentText: "Pago Seguro",
    warrantyText: "Garantía Oficial",
    returnsText: "Devolución en 30 días",
  },
  headerConfig: {},
  footerConfig: {},
  categories: [],
};

export function useGlobalSettings() {
  const context = useContext(GlobalSettingsContext);
  return context || defaultSettings;
}
