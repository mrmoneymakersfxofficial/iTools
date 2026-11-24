import { defineType, defineField } from "sanity";

export default defineType({
  name: "brandShowcaseItem",
  title: "Marca del Showcase",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nombre", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "logo",
      title: "Logo / Tarjeta de Marca",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
      description: "📐 Resolución recomendada: 240 x 88 px (o 480 x 176 px @2x). Sube el logo o tarjeta ajustada a esta proporción para que llene la tarjeta completa sin márgenes ni bordes.",
    }),
    defineField({ name: "showInGrid", title: "Mostrar en Grid Principal Móvil", type: "boolean", initialValue: false }),
    defineField({
      name: "brandSliders",
      title: "Sliders Principales de la Página de Marca",
      type: "array",
      description: "Carrusel principal que aparece al entrar a /marca/[slug]. Si subes 1 o más slides aquí, reemplazarán al banner predeterminado de esta marca.",
      of: [
        {
          type: "object",
          fields: [
            { name: "headline", title: "Titular (Opcional)", type: "string" },
            { name: "subheadline", title: "Subtítulo (Opcional)", type: "string" },
            { name: "ctaText", title: "Texto del Botón (Opcional)", type: "string" },
            { name: "link", title: "Enlace de destino (Opcional)", type: "string" },
            {
              name: "image",
              title: "Imagen Slider (Desktop)",
              type: "image",
              options: { hotspot: true },
              validation: (r) => r.required(),
            },
            {
              name: "imageMobile",
              title: "Imagen Slider (Móvil / Celular - Opcional)",
              type: "image",
              options: { hotspot: true },
            },
          ],
          preview: {
            select: { title: "headline", media: "image" },
          },
        },
      ],
    }),
    defineField({
      name: "promoCard1",
      title: "Banner Promocional Inferior 1 (Página de Marca)",
      type: "object",
      fields: [
        { name: "eyebrow", title: "Etiqueta superior (Opcional)", type: "string" },
        { name: "title", title: "Título (Opcional)", type: "string" },
        { name: "subtitle", title: "Subtítulo (Opcional)", type: "string" },
        { name: "link", title: "Enlace (Opcional)", type: "string" },
        { name: "image", title: "Imagen Desktop", type: "image", options: { hotspot: true } },
        { name: "imageMobile", title: "Imagen Móvil (Opcional)", type: "image", options: { hotspot: true } },
      ],
    }),
    defineField({
      name: "promoCard2",
      title: "Banner Promocional Inferior 2 (Página de Marca)",
      type: "object",
      fields: [
        { name: "eyebrow", title: "Etiqueta superior (Opcional)", type: "string" },
        { name: "title", title: "Título (Opcional)", type: "string" },
        { name: "subtitle", title: "Subtítulo (Opcional)", type: "string" },
        { name: "link", title: "Enlace (Opcional)", type: "string" },
        { name: "image", title: "Imagen Desktop", type: "image", options: { hotspot: true } },
        { name: "imageMobile", title: "Imagen Móvil (Opcional)", type: "image", options: { hotspot: true } },
      ],
    }),
    defineField({ name: "order", title: "Orden", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "isActive", title: "Activo", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", media: "logo" }, prepare: ({ title, media }) => ({ title, media }) },
});