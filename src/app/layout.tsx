import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ClientLayoutEffects } from "@/components/layout/ClientLayoutEffects";
import { CompareDrawer } from "@/components/product/CompareDrawer";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { BottomNav } from "@/components/layout/BottomNav";
import { draftMode } from "next/headers";
import { SanityVisualEditing } from "@/components/sanity/SanityVisualEditing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { fetchLayoutData } from "@/lib/sanity/fetch-layout";
import { GlobalSettingsProvider } from "@/stores/global-settings-context";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://itools.pe";

export const viewport: Viewport = {
  themeColor: "#D1001C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "iTools" },
  title: {
    default: "iTools PerÃº | Herramientas Milwaukee â€” Distribuidor Oficial",
    template: "%s | iTools PerÃº",
  },
  description:
    "iTools PerÃº â€” Distribuidor autorizado de herramientas Milwaukee. Taladros, impactos, sierras, rotomartillos y mÃ¡s. Servicio TÃ©cnico Oficial. EnvÃ­o a todo PerÃº. RUC: 20610613749.",
  keywords: [
    "iTools PerÃº",
    "Milwaukee PerÃº",
    "herramientas Milwaukee",
    "taladro Milwaukee",
    "servicio tÃ©cnico Milwaukee",
    "herramientas profesionales",
    "herramientas elÃ©ctricas",
    "herramientas inalÃ¡mbricas",
    "M18 FUEL",
    "comprar herramientas PerÃº",
    "herramientas de construcciÃ³n",
    "DeWalt PerÃº",
    "Bosch PerÃº",
    "Makita PerÃº",
  ],
  authors: [{ name: "iTools PerÃº", url: SITE_URL }],
  creator: "iTools PerÃº",
  publisher: "iTools PerÃº",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "iTools PerÃº | Herramientas Milwaukee â€” Distribuidor Oficial",
    description:
      "Distribuidor autorizado de herramientas Milwaukee en PerÃº. Taladros, impactos, sierras y mÃ¡s. Servicio TÃ©cnico Oficial. EnvÃ­o a todo PerÃº.",
    type: "website",
    locale: "es_PE",
    siteName: "iTools PerÃº",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "iTools PerÃº â€” Herramientas Milwaukee",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "iTools PerÃº | Herramientas Milwaukee",
    description:
      "Distribuidor autorizado de herramientas Milwaukee en PerÃº. EnvÃ­o a todo PerÃº.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mode = await draftMode();
  const layoutData = await fetchLayoutData();

  // Fallback defaults if Sanity is empty
  const settings = {
    headerConfig: layoutData?.header || {},
    footerConfig: layoutData?.footer || {},
    uiConfig: layoutData?.uiConfig || {
      addToCartText: "AÃ±adir al Carrito",
      viewDetailsText: "Ver Detalles",
      outOfStockText: "Agotado",
      searchPlaceholder: "Buscar herramientas...",
      shippingBadgeText: "EnvÃ­o a todo PerÃº",
      securePaymentText: "Pago Seguro",
      warrantyText: "GarantÃ­a Oficial",
      returnsText: "DevoluciÃ³n en 30 dÃ­as",
    },
    categories: layoutData?.categories || [],
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen antialiased bg-background text-foreground flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <GlobalSettingsProvider settings={settings}>
            <AuthProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />

              <BottomNav />
              <CartDrawer />
              <CompareDrawer />
              <Toaster />
              <ClientLayoutEffects />
              {mode.isEnabled && <SanityVisualEditing />}
            </AuthProvider>
          </GlobalSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
