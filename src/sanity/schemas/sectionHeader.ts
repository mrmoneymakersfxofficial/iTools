import { defineType, defineField } from "sanity";

export default defineType({
  name: "sectionHeader",
  title: "Encabezado de Sección",
  type: "document",
  fields: [
    defineField({
      name: "sectionId",
      title: "ID de sección",
      type: "string",
      description: "Identificador único: deals, featured, newArrivals, trending, exploreProducts",
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Subtítulo", type: "string" }),
    defineField({ name: "ctaText", title: "Texto del botón CTA", type: "string" }),
    defineField({ name: "ctaLink", title: "Enlace del CTA", type: "string" }),
  ],
  preview: { select: { title: "title", subtitle: "sectionId" } },
});