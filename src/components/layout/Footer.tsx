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
import { getSanityAttr } from "@/lib/sanity/visual-attributes";
import { PaymentBadge, DEFAULT_PAYMENT_METHODS } from "@/components/layout/PaymentBadge";

const defaultTrustFeatures: {
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

const getTrustIcon = (iconName?: string) => {
  const name = (iconName || "").toLowerCase();
  if (name.includes("truck") || name.includes("envio")) return Truck;
  if (name.includes("shield") || name.includes("tecnic") || name.includes("oficial")) return Shield;
  if (name.includes("clock") || name.includes("hora") || name.includes("atenc")) return Clock;
  if (name.includes("award") || name.includes("product") || name.includes("garant")) return Award;
  if (name.includes("lock") || name.includes("segur")) return Lock;
  return Truck;
};

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

  const trustFeaturesList = (footerConfig?.trustFeatures && footerConfig.trustFeatures.length > 0)
    ? footerConfig.trustFeatures.map((f) => ({
        icon: getTrustIcon(f.iconName),
        label: f.label,
        iconClassName: (f.iconName || f.label || "").toLowerCase().includes("milwaukee") || (f.iconName || "").toLowerCase().includes("shield")
          ? "text-itools-gold"
          : undefined,
      }))
    : defaultTrustFeatures;

  const socialBarTitle = footerConfig?.socialBarTitle || "Síguenos en:";
  const paymentMethodsTitle = footerConfig?.paymentMethodsTitle || "Medios de pago:";
  const secureStoreTitle = footerConfig?.secureStoreTitle || "Tienda 100% Segura";

  const aboutText =
    footerConfig?.aboutText ||
    "Distribuidor autorizado de herramientas Milwaukee en Perú. Más de 10 años de experiencia en el mercado industrial.";

  const contactAddress =
    footerConfig?.companyAddress ||
    (typeof footerConfig?.contactInfo === "object" ? footerConfig.contactInfo?.address : undefined) ||
    headerConfig?.location ||
    "Av. Universitaria 4974, Los Olivos, Lima";

  const contactPhone =
    footerConfig?.companyPhone ||
    (typeof footerConfig?.contactInfo === "object" ? footerConfig.contactInfo?.phone : undefined) ||
    headerConfig?.phone ||
    "(01) 123-4567";

  const contactEmail =
    footerConfig?.companyEmail ||
    (typeof footerConfig?.contactInfo === "object" ? footerConfig.contactInfo?.email : undefined) ||
    footerConfig?.email ||
    "ventas@itoolsperu.com";

  const contactHours =
    footerConfig?.workingHours ||
    (typeof footerConfig?.contactInfo === "object" ? footerConfig.contactInfo?.hours : undefined) ||
    "Lunes a Sábado: 8:00 AM - 6:00 PM";

  const topCategories = categories
    .filter((c) => !c.parentId)
    .slice(0, 8);

  const rawSocials = (footerConfig?.socialLinks && footerConfig.socialLinks.length > 0)
    ? footerConfig.socialLinks.filter((s) => s.isActive !== false)
    : [
        { platform: "YouTube", url: "https://youtube.com/@itoolsperu" },
        { platform: "Instagram", url: "https://instagram.com/itoolsperu" },
        { platform: "Facebook", url: "https://facebook.com/itoolsperu" },
      ];

  const socialLinks = rawSocials.map((s) => {
    const plat = (s.platform || "").toLowerCase();
    const Icon = plat.includes("youtube")
      ? Youtube
      : plat.includes("instagram")
      ? Instagram
      : Facebook;
    return {
      icon: Icon,
      customIconUrl: s.icon?.asset?.url,
      href: s.url || "#",
      label: s.platform || "Red Social",
    };
  });

  const activePaymentMethods =
    footerConfig?.paymentMethods && footerConfig.paymentMethods.length > 0
      ? footerConfig.paymentMethods.filter((pm) => pm.isActive !== false)
      : DEFAULT_PAYMENT_METHODS;

  return (
    <footer className="mt-auto" id="pie-de-pagina" data-section="Pie de Página" data-sanity-doc="footerConfig">
      {/* ── Trust / Features Bar (Editable desde Sanity) ── */}
      <section
        aria-label="Beneficios de iTools Perú"
        className="bg-itools-blue"
        {...getSanityAttr("footerConfig", "footerConfig", "trustFeatures")}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 sm:px-6 lg:grid-cols-4 lg:gap-6 lg:py-6">
          {trustFeaturesList.map((feature, idx) => (
            <div
              key={`${feature.label}-${idx}`}
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

      {/* ── Red Social & Payment Trust Strip (100% Editable desde Sanity) ── */}
      <section className="bg-[#E60000] text-white py-3.5 sm:py-4 px-4 shadow-sm" aria-label="Medios de pago y redes sociales">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 sm:gap-6 text-xs sm:text-sm font-bold">
          {/* Left: Social */}
          <div className="flex items-center gap-3">
            <span
              {...getSanityAttr("footerConfig", "footerConfig", "socialBarTitle")}
              className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider"
            >
              {socialBarTitle}
            </span>
            <div
              {...getSanityAttr("footerConfig", "footerConfig", "socialLinks")}
              className="flex items-center gap-2"
            >
              {socialLinks.map((social, idx) => (
                <a
                  key={`${social.label}-${idx}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="h-8 w-8 rounded-full bg-white text-[#E60000] flex items-center justify-center hover:scale-110 shadow-sm transition-transform overflow-hidden"
                >
                  {social.customIconUrl ? (
                    <img
                      src={social.customIconUrl}
                      alt={social.label}
                      className="h-5 w-5 object-contain"
                    />
                  ) : (
                    <social.icon className="h-4.5 w-4.5" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Center: Medios de pago */}
          <div className="flex items-center gap-3">
            <span
              {...getSanityAttr("footerConfig", "footerConfig", "paymentMethodsTitle")}
              className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider"
            >
              {paymentMethodsTitle}
            </span>
            <div
              {...getSanityAttr("footerConfig", "footerConfig", "paymentMethods")}
              className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 bg-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-md"
            >
              {activePaymentMethods.map((pm, idx) => (
                <PaymentBadge key={`${pm.name}-${idx}`} method={pm} />
              ))}
            </div>
          </div>

          {/* Right: Tienda 100% Segura */}
          <div
            {...getSanityAttr("footerConfig", "footerConfig", "secureStoreTitle")}
            className="flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 text-[#00C853] shrink-0" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">{secureStoreTitle}</span>
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
              <p
                className="mb-6 text-sm leading-relaxed text-gray-400"
                {...getSanityAttr("footerConfig", "footerConfig", "aboutText")}
              >
                {aboutText}
              </p>
              {/* Social Media */}
              <nav aria-label="Redes sociales">
                <ul className="flex items-center gap-3">
                  {socialLinks.map((social, idx) => (
                    <li key={`${social.label}-${idx}`}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-itools-blue overflow-hidden"
                      >
                        {social.customIconUrl ? (
                          <img src={social.customIconUrl} alt={social.label} className="h-5 w-5 object-contain" />
                        ) : (
                          <social.icon className="h-4 w-4" />
                        )}
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
                  href={`mailto:${contactEmail}`}
                  className="flex items-start gap-3 text-sm text-gray-400 transition-colors duration-200 hover:text-itools-blue-light"
                  {...getSanityAttr("footerConfig", "footerConfig", "companyEmail")}
                >
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0 text-gray-500"
                    aria-hidden="true"
                  />
                  <span>{contactEmail}</span>
                </a>
                <li
                  className="flex items-start gap-3 text-sm text-gray-400"
                  {...getSanityAttr("footerConfig", "footerConfig", "companyAddress")}
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-itools-blue" />
                  <span>{contactAddress}</span>
                </li>
                <li
                  className="flex items-center gap-3 text-sm text-gray-400"
                  {...getSanityAttr("footerConfig", "footerConfig", "companyPhone")}
                >
                  <Phone className="h-4 w-4 shrink-0 text-itools-blue" />
                  <span>{contactPhone}</span>
                </li>
                {contactHours && (
                  <li
                    className="flex items-start gap-3 text-sm text-gray-400"
                    {...getSanityAttr("footerConfig", "footerConfig", "workingHours")}
                  >
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-itools-blue" />
                    <span>{contactHours}</span>
                  </li>
                )}
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