import { defineType, defineField } from "sanity";

export default defineType({
  name: "videoSection",
  title: "Sección de Videos",
  type: "document",
  fields: [
    defineField({
      name: "sectionTitle",
      title: "Título de la Sección",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sectionSubtitle",
      title: "Subtítulo",
      type: "string",
    }),
    defineField({
      name: "videoSourceType",
      title: "Tipo de Videos",
      type: "string",
      options: {
        list: [
          { title: "Google Drive", value: "googleDrive" },
          { title: "YouTube / YouTube Shorts", value: "youtube" },
          { title: "TikTok", value: "tiktok" },
          { title: "Mixto (URLs variadas)", value: "mixed" },
        ],
      },
      initialValue: () => "googleDrive",
      description: "Selecciona el tipo de videos que se mostrarán.",
    }),
    defineField({
      name: "videos",
      title: "Videos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Título del Video",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "videoUrl",
              title: "URL del Video",
              type: "url",
              description: "URL del video. Google Drive, YouTube, YouTube Shorts, TikTok, Vimeo.",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "googleDriveUrl",
              title: "URL de Google Drive (legacy)",
              type: "url",
              description: "Campo legacy. Usar videoUrl en su lugar.",
            }),
            defineField({
              name: "thumbnail",
              title: "Miniatura",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "isVertical",
              title: "Video Vertical (Shorts/TikTok)",
              type: "boolean",
              initialValue: () => false,
              description: "Marcar si el video es formato vertical (9:16)",
            }),
            defineField({
              name: "productSlug",
              title: "Slug del Producto Relacionado",
              type: "string",
              description: "Slug del producto relacionado con este video",
            }),
            defineField({
              name: "order",
              title: "Orden",
              type: "number",
              validation: (r) => r.min(0),
            }),
          ],
          preview: {
            select: { title: "title", media: "thumbnail" },
            prepare: ({ title, media }: { title?: string; media?: any }) => ({ title, media }),
          },
        },
      ],
    }),
    defineField({
      name: "ctaText",
      title: "Texto del Botón CTA",
      type: "string",
      description: "Ej: 'Ver más productos', 'Ver todos los videos'",
    }),
    defineField({
      name: "ctaLink",
      title: "Enlace del Botón CTA",
      type: "string",
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
  preview: {
    select: { title: "sectionTitle" },
    prepare: ({ title }: { title?: string }) => ({ title }),
  },
});
