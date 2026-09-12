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
    defineField({ name: "order", title: "Orden", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "isActive", title: "Activo", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", media: "logo" }, prepare: ({ title, media }) => ({ title, media }) },
});