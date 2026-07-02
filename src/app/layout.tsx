import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ClientLayoutEffects } from "@/components/layout/ClientLayoutEffects";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <ClientLayoutEffects />
        {children}
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}