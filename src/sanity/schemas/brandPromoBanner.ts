import { defineType, defineField } from "sanity";

export default defineType({
  name: "brandPromoSlide",
  title: "Banner Promocional de Marca",
  type: "document",
  fields: [
    defineField({ name: "brandName", title: "Nombre de marca", type: "string", validation: (r) => r.required() }),
    defineField({ name: "brandSlug", title: "Slug de marca", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "image",
      title: "Imagen del banner",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Orden", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "isActive", title: "Activo", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "brandName" } },
});