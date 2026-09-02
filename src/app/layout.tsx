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
import { AgentIA } from "@/components/chat/AgentIA";
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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  title: {
    default: "iTools Perú | Distribuidor de Herramientas Profesionales",
    template: "%s | iTools Perú",
  },
  description:
    "iTools Perú — Distribuidor autorizado de herramientas profesionales Milwaukee, DeWalt, Bosch, Makita, Ingco, Total y más. Servicio Técnico Oficial. Envío a todo el Perú.",
  keywords: [
    "iTools Perú",
    "Milwaukee Perú",
    "herramientas Milwaukee",
    "taladros",
    "rotomartillos",
    "herramientas eléctricas",
    "herramientas inalámbricas",
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
    title: "iTools Perú | Distribuidor de Herramientas Profesionales",
    description:
      "Distribuidor autorizado de herramientas en el Perú. Taladros, rotomartillos, sierras y más. Envío a todo el Perú.",
    type: "website",
    locale: "es_PE",
    siteName: "iTools Perú",
    url: SITE_URL,
    images: [
      {
        url: "/icon.png",
        width: 800,
        height: 800,
        alt: "iTools Perú — Herramientas Profesionales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "iTools Perú | Herramientas Profesionales",
    description:
      "Distribuidor de herramientas profesionales en el Perú. Envío a todo el país.",
    images: ["/icon.png"],
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
              <AgentIA />
              <ClientLayoutEffects />
              {mode.isEnabled && <SanityVisualEditing />}
            </AuthProvider>
          </GlobalSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

