import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartDrawer } from "@/components/layout/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "iTools Perú | Herramientas Milwaukee — Distribuidor Oficial",
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
  ],
  authors: [{ name: "iTools Perú" }],
  openGraph: {
    title: "iTools Perú | Herramientas Milwaukee — Distribuidor Oficial",
    description:
      "Distribuidor autorizado de herramientas Milwaukee en Perú. Taladros, impactos, sierras y más. Servicio Técnico Oficial.",
    type: "website",
    locale: "es_PE",
    siteName: "iTools Perú",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}