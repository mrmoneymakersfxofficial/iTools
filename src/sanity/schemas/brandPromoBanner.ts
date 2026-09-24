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
      title: "Imagen del banner (Desktop / Computadora)",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
      description: "📐 Resolución recomendada: 1200 x 88 px (o 2400 x 176 px @2x). Banner horizontal delgado intermedio (ej: Milwaukee Combo Kit).",
    }),
    defineField({
      name: "imageMobile",
      title: "Imagen para Móvil / Celular (Opcional)",
      type: "image",
      options: { hotspot: true },
      description: "📐 Imagen adaptada para móviles (ej: 750 x 200 px). Si se sube, se mostrará en teléfonos.",
    }),
    defineField({ name: "order", title: "Orden", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "isActive", title: "Activo", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "brandName" } },
});