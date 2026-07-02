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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/data";

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

const topCategories = categories
  .filter((c) => !c.parentId)
  .slice(0, 8);

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/itoolsperu", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/itoolsperu", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@itoolsperu", label: "YouTube" },
];

export default function Footer() {
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

      {/* ── Main Footer ───────────────────────────────────────── */}
      <section className="bg-itools-dark text-gray-300" aria-label="Pie de página">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {/* Column 1 — About iTools */}
            <div>
              {/* Logo */}
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-2xl font-impact tracking-tight text-itools-blue">
                  iTools
                </span>
                <span className="text-xs font-impact uppercase tracking-widest text-gray-400">
                  PERÚ
                </span>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-gray-400">
                Distribuidor autorizado de herramientas Milwaukee en Perú. Más
                de 10 años de experiencia en el mercado industrial.
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
                  href="tel:+5112345678"
                  className="flex items-start gap-3 text-sm text-gray-400 transition-colors duration-200 hover:text-itools-blue-light"
                >
                  <Phone
                    className="mt-0.5 h-4 w-4 shrink-0 text-gray-500"
                    aria-hidden="true"
                  />
                  <span>01 234 5678</span>
                </a>
                <a
                  href="mailto:ventas@itoolsperu.com"
                  className="flex items-start gap-3 text-sm text-gray-400 transition-colors duration-200 hover:text-itools-blue-light"
                >
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0 text-gray-500"
                    aria-hidden="true"
                  />
                  <span>ventas@itoolsperu.com</span>
                </a>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-gray-500"
                    aria-hidden="true"
                  />
                  <span>Av. Industrial 1234, Ate, Lima, Perú</span>
                </div>
              </address>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar: Newsletter + Copyright ───────────────── */}
        <Separator className="border-white/10" />

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          {/* Newsletter */}
          <div className="mb-8 text-center lg:mb-10">
            <h3 className="mb-1 text-lg font-impact text-white sm:text-xl">
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
                className="h-11 shrink-0 bg-itools-blue px-6 font-semibold uppercase tracking-wider text-white hover:bg-itools-blue-dark"
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