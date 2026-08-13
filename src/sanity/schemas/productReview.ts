import { defineType, defineField } from "sanity";

export default defineType({
  name: "productReview",
  title: "Reseña de Producto",
  type: "document",
  fields: [
    defineField({
      name: "productName",
      title: "Producto",
      type: "string",
      description: "Nombre o slug del producto al que pertenece esta reseña",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rating",
      title: "Calificación",
      type: "number",
      validation: (r) => r.required().min(1).max(5),
      description: "De 1 a 5 estrellas",
    }),
    defineField({
      name: "title",
      title: "Título de la Reseña",
      type: "string",
    }),
    defineField({
      name: "comment",
      title: "Comentario",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "isVerified",
      title: "Compra Verificada",
      type: "boolean",
      initialValue: () => false,
    }),
    defineField({
      name: "source",
      title: "Fuente",
      type: "string",
      options: {
        list: [
          { title: "Sitio Web", value: "website" },
          { title: "Google", value: "google" },
        ],
      },
      initialValue: () => "website",
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      validation: (r) => r.min(0),
      initialValue: () => 0,
    }),
    defineField({
      name: "isActive",
      title: "Activo",
      type: "boolean",
      initialValue: () => true,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "author", media: "rating" },
    prepare: ({ title, subtitle }) => ({ title: title || "Sin título", subtitle }),
  },
});
