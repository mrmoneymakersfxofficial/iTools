import { defineType, defineField } from "sanity";

export default defineType({
  name: "dealTile",
  title: "Ofertas (Deal Tiles)",
  type: "document",
  fields: [
    defineField({ name: "brand", title: "Marca (ej: BOSCH)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "brandColor", title: "Color de Marca (ej: #1e4b8f)", type: "string" }),
    defineField({ name: "textColor", title: "Color de Texto", type: "string", description: "Opcional, defecto #FFFFFF" }),
    defineField({ name: "title", title: "Título (ej: Batería de 18 V de regalo)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Subtítulo", type: "string" }),
    defineField({ name: "href", title: "Link destino", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "countdownEnd",
      title: "Fecha de Expiración (Countdown)",
      type: "datetime",
      description: "Si se establece, muestra una cuenta regresiva. Al llegar a 0, la oferta se marca como expirada automáticamente.",
    }),
    defineField({
      name: "discountPercentage",
      title: "Porcentaje de Descuento",
      type: "number",
      description: "Ej: 34 para mostrar -34%",
    }),
    defineField({
      name: "originalPrice",
      title: "Precio Original (S/)",
      type: "number",
      description: "Precio antes del descuento (tachado)",
    }),
    defineField({
      name: "promoPrice",
      title: "Precio Oferta (S/)",
      type: "number",
      description: "Precio promocional actual",
    }),
    defineField({
      name: "productSlug",
      title: "Slug del Producto",
      type: "string",
      description: "Si la oferta es para un producto específico, agregar su slug aquí",
    }),
    defineField({ name: "image", title: "Imagen de fondo (Opcional)", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", title: "Orden", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "isActive", title: "Activo", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "brand", media: "image" } },
});
