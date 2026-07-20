import { defineType, defineField } from "sanity";

export default defineType({
  name: "heroSlide",
  title: "Banner Hero",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Subtítulo", type: "string", validation: (r) => r.required() }),
    defineField({ name: "cta", title: "Texto del botón CTA", type: "string", validation: (r) => r.required() }),
    defineField({ name: "link", title: "Enlace", type: "string" }),
    defineField({
      name: "image",
      title: "Imagen de fondo",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({ name: "bgGradient", title: "Gradiente de fallback (CSS)", type: "string" }),
    defineField({ name: "order", title: "Orden", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "isActive", title: "Activo", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "subtitle" }, prepare: ({ title, subtitle }) => ({ title, subtitle }) },
});