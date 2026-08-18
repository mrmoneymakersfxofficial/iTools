"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Category } from "@/types";

export type UIConfig = {
  addToCartText: string;
  viewDetailsText: string;
  outOfStockText: string;
  searchPlaceholder: string;
  shippingBadgeText: string;
  securePaymentText: string;
  warrantyText: string;
  returnsText: string;
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

export function useGlobalSettings() {
  const context = useContext(GlobalSettingsContext);
  if (!context) {
    throw new Error("useGlobalSettings must be used within a GlobalSettingsProvider");
  }
  return context;
}
