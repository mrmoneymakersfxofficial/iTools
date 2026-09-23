"use client";

import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  ChevronRight,
  Shield,
  Truck,
  Clock,
  Award,
  Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useGlobalSettings } from "@/stores/global-settings-context";
import { BrandMarquee } from "@/components/layout/BrandMarquee";

const trustFeatures: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { strokeWidth?: number }>;
  label: string;
  iconClassName?: string;
}[] = [
  {
    icon: Truck,
    label: "Envío a Todo el Perú",
  },
  {
    icon: Shield,
    label: "Servicio Técnico Oficial Milwaukee",
    iconClassName: "text-itools-gold",
  },
  {
    icon: Clock,
    label: "Atención Lunes a Sábado 8am-6pm",
  },
  {
    icon: Award,
    label: "Más de 5,000 Productos",
  },
];

const infoLinks = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Términos y Condiciones", href: "/terminos-y-condiciones" },
  { label: "Política de Privacidad", href: "/politica-de-privacidad" },
  { label: "Envíos y Devoluciones", href: "/envios-y-devoluciones" },
  { label: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
  { label: "Contacto", href: "/contacto" },
];

export function Footer() {
  const { footerConfig, categories, headerConfig } = useGlobalSettings();

  const topCategories = categories
    .filter((c) => !c.parentId)
    .slice(0, 8);

  const socialLinks = footerConfig?.socialLinks?.map((s) => ({
    icon: s.platform.toLowerCase() === "facebook" ? Facebook : 
          s.platform.toLowerCase() === "instagram" ? Instagram :
          s.platform.toLowerCase() === "youtube" ? Youtube : Facebook,
    href: s.url,
    label: s.platform,
  })) || [
    { icon: Facebook, href: "https://facebook.com/itoolsperu", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/itoolsperu", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/@itoolsperu", label: "YouTube" },
  ];

  return (
    <footer className="mt-auto">
      {/* ── Trust / Features Bar ──────────────────────────────── */}
      <section
        aria-label="Beneficios de iTools Perú"
        className="bg-itools-blue"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 sm:px-6 lg:grid-cols-4 lg:gap-6 lg:py-6">
          {trustFeatures.map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-3 text-white"
            >
              <feature.icon
                className={cn("h-7 w-7 shrink-0 sm:h-8 sm:w-8", feature.iconClassName)}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="text-sm font-medium leading-tight sm:text-base">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Brand Marquee Slider (above main footer) ── */}
      <BrandMarquee />

      {/* ── Red Social & Payment Trust Strip (Image 4) ── */}
      <section className="bg-[#E60000] text-white py-3.5 sm:py-4 px-4 shadow-sm" aria-label="Medios de pago y redes sociales">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 sm:gap-6 text-xs sm:text-sm font-bold">
          {/* Left: Social */}
          <div className="flex items-center gap-3">
            <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">Síguenos en:</span>
            <div className="flex items-center gap-2">
              <a
                href="https://youtube.com/@itoolsperu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="h-8 w-8 rounded-full bg-white text-[#E60000] flex items-center justify-center hover:scale-110 shadow-sm transition-transform"
              >
                <Youtube className="h-4.5 w-4.5 fill-current" />
              </a>
              <a
                href="https://instagram.com/itoolsperu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-8 w-8 rounded-full bg-white text-[#E60000] flex items-center justify-center hover:scale-110 shadow-sm transition-transform"
              >
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://facebook.com/itoolsperu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-8 w-8 rounded-full bg-white text-[#E60000] flex items-center justify-center hover:scale-110 shadow-sm transition-transform"
              >
                <Facebook className="h-4.5 w-4.5 fill-current" />
              </a>
            </div>
          </div>

          {/* Center: Medios de pago */}
          <div className="flex items-center gap-3">
            <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">Medios de pago:</span>
            <div className="flex items-center gap-2.5 sm:gap-3.5 bg-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-md">
              {/* Yape */}
              <svg viewBox="0 0 42 22" className="h-5 sm:h-5.5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Yape">
                <rect width="42" height="22" rx="4" fill="#742284"/>
                <text x="21" y="15" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">yape</text>
              </svg>
              {/* Plin */}
              <svg viewBox="0 0 38 22" className="h-5 sm:h-5.5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Plin">
                <rect width="38" height="22" rx="4" fill="#00D1D5"/>
                <text x="19" y="15" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">plin</text>
              </svg>
              {/* Visa */}
              <svg viewBox="0 0 50 16" className="h-3.5 sm:h-4 w-auto" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
                <path d="M19.3 1.2L13.1 15.6H9.1L5.6 3.6C5.4 2.8 5.2 2.5 4.6 2.2C3.5 1.6 1.7 1.1 0 0.8L0.1 0.4H7.2C8.1 0.4 8.9 1 9.1 2.1L10.8 11.2L15.3 0.4H19.3ZM36.1 10.7C36.1 6.6 30.4 6.4 30.5 4.6C30.5 4 31 3.4 32.2 3.3C32.8 3.2 34.4 3.1 36.2 4L36.9 0.7C35.9 0.3 34.6 0 33 0C28.9 0 26.1 2.2 26 5.3C25.9 7.6 28 8.9 29.5 9.7C31.1 10.5 31.7 11 31.7 11.7C31.7 12.8 30.4 13.3 29.2 13.3C27.1 13.3 25.9 13 24.6 12.4L23.9 15.8C25.1 16.3 27 16.7 28.9 16.7C33.3 16.7 36.1 14.5 36.1 10.7ZM46.7 15.6H50.2L47.1 0.4H43.9C43.1 0.4 42.5 0.9 42.2 1.6L36 15.6H40.2L41 13.3H46L46.7 15.6ZM42.1 10.3L44.2 4.4L45.4 10.3H42.1ZM25.3 0.4L22.2 15.6H18.4L21.5 0.4H25.3Z" fill="#1434CB"/>
              </svg>
              {/* Mastercard */}
              <svg viewBox="0 0 34 22" className="h-4.5 sm:h-5.5 w-auto" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
                <circle cx="11" cy="11" r="10" fill="#EB001B"/>
                <circle cx="23" cy="11" r="10" fill="#F79E1B"/>
                <path d="M17 4.1a10 10 0 0 1 0 13.8 10 10 0 0 1 0-13.8z" fill="#FF5F00"/>
              </svg>
              {/* Amex */}
              <svg viewBox="0 0 28 22" className="h-4.5 sm:h-5.5 w-auto" xmlns="http://www.w3.org/2000/svg" aria-label="American Express">
                <rect width="28" height="22" rx="3" fill="#006FCF"/>
                <text x="14" y="14.5" fill="white" fontSize="7" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">AMEX</text>
              </svg>
              {/* Diners Club */}
              <svg viewBox="0 0 54 22" className="h-4.5 sm:h-5.5 w-auto" xmlns="http://www.w3.org/2000/svg" aria-label="Diners Club">
                <rect width="54" height="22" rx="3" fill="#0079BE"/>
                <circle cx="12" cy="11" r="7" fill="white"/>
                <path d="M12 4.5a6.5 6.5 0 0 0 0 13V4.5z" fill="#0079BE"/>
                <text x="33" y="10.5" fill="white" fontSize="5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">Diners Club</text>
                <text x="33" y="16" fill="white" fontSize="3" fontWeight="normal" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.4">INTERNATIONAL</text>
              </svg>
            </div>
          </div>

          {/* Right: Tienda 100% Segura with Green Shield */}
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 text-[#00C853] shrink-0" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">Tienda 100% Segura</span>
          </div>
        </div>
      </section>

      {/* ── Main Footer ───────────────────────────────────────── */}
      <section className="bg-itools-dark text-gray-300" aria-label="Pie de página">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {/* Column 1 — About iTools */}
            <div>
              {/* Logo */}
              <div className="mb-4">
                <img
                  src="/logo.png"
                  alt="iTools.Pe"
                  className="h-10 w-auto object-contain brightness-0 invert opacity-90"
                  width={180}
                  height={56}
                />
              </div>
              <p className="mb-6 text-sm leading-relaxed text-gray-400">
                {footerConfig?.aboutText || 
                  "Distribuidor autorizado de herramientas Milwaukee en Perú. Más de 10 años de experiencia en el mercado industrial."}
              </p>
              {/* Social Media */}
              <nav aria-label="Redes sociales">
                <ul className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-itools-blue"
                      >
                        <social.icon className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Column 2 — Categorías */}
            <div>
              <h3 className="mb-5 text-sm font-impact uppercase tracking-wider text-white">
                Categorías
              </h3>
              <ul className="space-y-2.5" role="list">
                {topCategories.map((category) => (
                  <li key={category.id}>
                    <a
                      href={`/categoria/${category.slug}`}
                      className="flex items-center gap-2 text-sm text-gray-400 transition-colors duration-200 hover:text-itools-blue-light"
                    >
                      <ChevronRight
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Información */}
            <div>
              <h3 className="mb-5 text-sm font-impact uppercase tracking-wider text-white">
                Información
              </h3>
              <ul className="space-y-2.5" role="list">
                {infoLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-400 transition-colors duration-200 hover:text-itools-blue-light"
                    >
                      <ChevronRight
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Contacto */}
            <div>
              <h3 className="mb-5 text-sm font-impact uppercase tracking-wider text-white">
                Contacto
              </h3>
              <address className="not-italic space-y-4">
                <a
                  href={`mailto:${footerConfig?.email || "ventas@itoolsperu.com"}`}
                  className="flex items-start gap-3 text-sm text-gray-400 transition-colors duration-200 hover:text-itools-blue-light"
                >
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0 text-gray-500"
                    aria-hidden="true"
                  />
                  <span>{footerConfig?.email || "ventas@itoolsperu.com"}</span>
                </a>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-itools-blue" />
                  <span>{headerConfig?.location || "Av. Industrial 123, Lima - Perú"}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <Phone className="h-4 w-4 shrink-0 text-itools-blue" />
                  <span>{headerConfig?.phone || "(01) 123-4567"}</span>
                </li>
              </address>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar: Newsletter + Copyright ───────────────── */}
        <Separator className="border-white/10" />

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          {/* Newsletter */}
          <div className="mb-8 text-center lg:mb-10">
            <h3 className="mb-1 text-lg text-white sm:text-xl">
              Suscríbete a nuestro boletín
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              Recibe ofertas exclusivas y novedades.
            </p>
            <form
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
              action="#"
            >
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                aria-label="Correo electrónico para suscripción"
                required
                className="h-11 flex-1 border-white/20 bg-white/10 text-white placeholder:text-gray-500 focus-visible:ring-itools-blue"
              />
              <Button
                type="submit"
                className="h-11 shrink-0 bg-itools-blue px-6 uppercase tracking-wider text-white hover:bg-itools-blue-dark"
              >
                Suscribirse
              </Button>
            </form>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-gray-500">
            © 2026 iTools Perú. Todos los derechos reservados. RUC:
            20610613749
          </p>
        </div>
      </section>
    </footer>
  );
}