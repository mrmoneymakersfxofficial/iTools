import { defineType, defineField } from "sanity";

export default defineType({
  name: "promoPopup",
  title: "Banner Emergente (Popup)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtítulo / Descripción",
      type: "text",
      rows: 3,
      description: "Texto descriptivo del popup. Puede incluir detalles de la promoción.",
    }),
    defineField({
      name: "image",
      title: "Imagen del Popup",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "originalPrice",
      title: "Precio Original (S/)",
      type: "number",
      description: "Precio tachado, ej: 599.90",
    }),
    defineField({
      name: "promoPrice",
      title: "Precio Promocional (S/)",
      type: "number",
      description: "Precio de oferta, ej: 399.90",
    }),
    defineField({
      name: "discountText",
      title: "Texto de Descuento (Badge)",
      type: "string",
      description: "Ej: -34%, SOLO HOY, BUEN FIN",
    }),
    defineField({
      name: "ctaText",
      title: "Texto del Botón CTA",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ctaLink",
      title: "Enlace del Botón CTA",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "countdownEnd",
      title: "Fecha de Expiración del Popup",
      type: "datetime",
      description: "Si se establece, se mostrará una cuenta regresiva y el popup se ocultará automáticamente al llegar esta fecha",
    }),
    defineField({
      name: "showOnEntry",
      title: "Mostrar al entrar al sitio",
      type: "boolean",
      initialValue: () => true,
      description: "Si está activo, el popup aparece automáticamente cuando el usuario ingresa al sitio",
    }),
    defineField({
      name: "delaySeconds",
      title: "Delay de aparición (segundos)",
      type: "number",
      initialValue: () => 3,
      description: "Segundos a esperar antes de mostrar el popup (default: 3)",
    }),
    defineField({
      name: "isActive",
      title: "Activo",
      type: "boolean",
      initialValue: () => true,
    }),
  ],
  preview: {
    select: { title: "title", media: "image" },
    prepare: ({ title, media }: { title?: string; media?: any }) => ({ title, media }),
  },
});
