import { defineType, defineField } from "sanity";

export default defineType({
  name: "packoutComponent",
  title: "Componente PACKOUT",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "componentType",
      title: "Tipo de Componente",
      type: "string",
      options: {
        list: [
          { title: "Base (Caja Rodante)", value: "base" },
          { title: "Módulo Apilable", value: "stackable" },
          { title: "Accesorio", value: "accessory" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "price",
      title: "Precio",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "salePrice",
      title: "Precio Oferta",
      type: "number",
    }),
    defineField({
      name: "compatibleBases",
      title: "Bases Compatibles",
      type: "array",
      of: [defineType({ name: "baseRef", type: "string" })],
      description: "Slugs de las bases con las que este módulo es compatible. Vacío = compatible con todas.",
    }),
    defineField({
      name: "dimensions",
      title: "Dimensiones",
      type: "string",
      description: "Ej: 48 x 28 x 41 cm",
    }),
    defineField({
      name: "productId",
      title: "ID de Producto Vinculado",
      type: "string",
      description: "Slug del producto en Sanity para vincular con la ficha del producto",
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      validation: (r) => r.required().min(0),
      initialValue: () => 0,
    }),
    defineField({
      name: "isActive",
      title: "Activo",
      type: "boolean",
      initialValue: () => true,
    }),
  ],
  orderings: [
    { name: "orderAsc", title: "Orden Ascendente", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", media: "image", subtitle: "componentType" },
    prepare: ({ title, media, subtitle }) => ({
      title,
      media,
      subtitle: subtitle === "base" ? "Base" : subtitle === "stackable" ? "Módulo" : "Accesorio",
    }),
  },
});
