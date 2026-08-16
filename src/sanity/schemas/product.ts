import { defineType, defineField } from "sanity";

export default defineType({
  name: "product",
  title: "Producto",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nombre", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "string", validation: (r) => r.required() }),
    defineField({ name: "brand", title: "Marca", type: "string" }),
    defineField({ 
      name: "images", 
      title: "Imágenes", 
      type: "array", 
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (r) => r.max(10).error("Puedes subir hasta un máximo de 10 imágenes.")
    }),
    defineField({ name: "price", title: "Precio Original (Opcional)", type: "number" }),
    defineField({ name: "salePrice", title: "Precio Oferta (Opcional)", type: "number" }),
    defineField({ name: "discountBadge", title: "Badge de Descuento (ej: -17%)", type: "string" }),
    defineField({ name: "rating", title: "Rating (estrellas)", type: "number", validation: (r) => r.min(0).max(5) }),
    defineField({ name: "reviews", title: "Número de Reviews", type: "number" }),
    defineField({ name: "showInTrending", title: "Mostrar en Tendencias", type: "boolean", initialValue: false }),
    defineField({ name: "showInToolCrib", title: "Mostrar en Tool Crib", type: "boolean", initialValue: false }),
    defineField({ name: "showInFeatured", title: "Mostrar en Destacados", type: "boolean", initialValue: false }),
    defineField({ name: "showInNewArrivals", title: "Mostrar en Nuevos Ingresos", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Orden", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "isActive", title: "Activo", type: "boolean", initialValue: true }),
    defineField({
      name: "technicalSheetUrl",
      title: "Ficha Técnica (PDF URL)",
      type: "url",
      description: "URL del PDF de ficha técnica. Puede ser un enlace externo o generado automáticamente.",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL (YouTube/TikTok)",
      type: "url",
      description: "URL del video del producto (YouTube, TikTok, etc.)",
    }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "brand", media: "image" } },
});
