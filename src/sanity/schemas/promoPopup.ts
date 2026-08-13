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
      title: "Subtítulo",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Imagen del Popup",
      type: "image",
      options: { hotspot: true },
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
      description: "Si se establece, el popup se ocultará automáticamente al llegar esta fecha",
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
    prepare: ({ title, media }) => ({ title, media }),
  },
});
