import type { Metadata } from "next";
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
import { DynamicClientWidgets } from "@/components/layout/DynamicClientWidgets";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://itools.pe";

export const metadata: Metadata = {
  title: {
    default: "iTools Perú | Herramientas Milwaukee — Distribuidor Oficial",
    template: "%s | iTools Perú",
  },
  description:
    "iTools Perú — Distribuidor autorizado de herramientas Milwaukee. Taladros, impactos, sierras, rotomartillos y más. Servicio Técnico Oficial. Envío a todo Perú. RUC: 20610613749.",
  keywords: [
    "iTools Perú",
    "Milwaukee Perú",
    "herramientas Milwaukee",
    "taladro Milwaukee",
    "servicio técnico Milwaukee",
    "herramientas profesionales",
    "herramientas eléctricas",
    "herramientas inalámbricas",
    "M18 FUEL",
    "comprar herramientas Perú",
    "herramientas de construcción",
    "DeWalt Perú",
    "Bosch Perú",
    "Makita Perú",
  ],
  authors: [{ name: "iTools Perú", url: SITE_URL }],
  creator: "iTools Perú",
  publisher: "iTools Perú",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "iTools Perú | Herramientas Milwaukee — Distribuidor Oficial",
    description:
      "Distribuidor autorizado de herramientas Milwaukee en Perú. Taladros, impactos, sierras y más. Servicio Técnico Oficial. Envío a todo Perú.",
    type: "website",
    locale: "es_PE",
    siteName: "iTools Perú",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "iTools Perú — Herramientas Milwaukee",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "iTools Perú | Herramientas Milwaukee",
    description:
      "Distribuidor autorizado de herramientas Milwaukee en Perú. Envío a todo Perú.",
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
      addToCartText: "Añadir al Carrito",
      viewDetailsText: "Ver Detalles",
      outOfStockText: "Agotado",
      searchPlaceholder: "Buscar herramientas...",
      shippingBadgeText: "Envío a todo Perú",
      securePaymentText: "Pago Seguro",
      warrantyText: "Garantía Oficial",
      returnsText: "Devolución en 30 días",
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
              <main className="flex-1 mt-[112px] md:mt-[136px]">{children}</main>
              <Footer />
              <DynamicClientWidgets />
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