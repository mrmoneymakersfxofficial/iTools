import { defineType, defineField } from "sanity";

export default defineType({
  name: "productReview",
  title: "Reseña de Producto",
  type: "document",
  fields: [
    defineField({
      name: "productName",
      title: "Producto (Slug)",
      type: "string",
      description: "Slug del producto al que pertenece esta reseña",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "authorAvatar",
      title: "Avatar del Autor",
      type: "image",
      options: { hotspot: true },
      description: "Foto de perfil del revisor (opcional)",
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
      name: "isLocalGuide",
      title: "Local Guide (Google)",
      type: "boolean",
      initialValue: () => false,
      description: "Marcar si el revisor es un Google Local Guide",
    }),
    defineField({
      name: "reviewCount",
      title: "Nro. Reseñas del Autor",
      type: "number",
      description: "Cantidad de reseñas que tiene este autor en Google (solo para reseñas de Google)",
    }),
    defineField({
      name: "datePublished",
      title: "Fecha de Publicación",
      type: "datetime",
      description: "Fecha original de la reseña (para reseñas importadas de Google)",
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
      name: "googlePlaceId",
      title: "Google Place ID",
      type: "string",
      description: "ID del lugar de Google para reseñas importadas (ej: ChIJ...)",
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
    select: { title: "title", subtitle: "author" },
    prepare: ({ title, subtitle }: { title?: string; subtitle?: string }) => ({ title: title || "Sin título", subtitle }),
  },
});
