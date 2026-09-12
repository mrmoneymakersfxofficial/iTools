import { defineType, defineField } from "sanity";

export default defineType({
  name: "promoBanner",
  title: "Banner Promocional Pequeño",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Título (ej: EGO, LIQUIDACIÓN)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "headline", title: "Titular", type: "string" }),
    defineField({ name: "description", title: "Descripción", type: "text", rows: 3 }),
    defineField({ name: "ctaText", title: "Texto del botón", type: "string" }),
    defineField({ name: "link", title: "Enlace", type: "string" }),
    defineField({ name: "bgGradient", title: "Gradiente de fondo (CSS)", type: "string" }),
    defineField({
      name: "image",
      title: "Imagen del Banner (Opcional - Imagen de fondo completa)",
      type: "image",
      options: { hotspot: true },
      description: "📐 Resoluciones recomendadas según la sección:\n• Hero Inferior (Rotomartillo / Electricista): 600 x 340 px (o 1200 x 680 px @2x)\n• Banners anchos (DeWalt Powerstack / SATA 380 / Servicio Técnico): 1440 x 220 px\n• Promociones Exclusivas / Pro Deals: 600 x 320 px\n• Equipa tu Taller: 350 x 320 px\n• Fondo Los Más Vendidos: 1440 x 480 px",
    }),
    defineField({ name: "order", title: "Orden", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "isActive", title: "Activo", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "headline" } },
});