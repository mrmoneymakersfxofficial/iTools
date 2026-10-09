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
          { title: "YouTube / YouTube Shorts ($0 ancho de banda)", value: "youtube" },
          { title: "Google Drive ($0 ancho de banda)", value: "googleDrive" },
          { title: "TikTok ($0 ancho de banda)", value: "tiktok" },
        ],
      },
      initialValue: () => "youtube",
      description: "Solo enlaces externos (YouTube, Google Drive o TikTok). Los videos se transmiten desde sus servidores oficiales a costo $0 para la web.",
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
              title: "1. 🌐 Enlace de YouTube / TikTok (Recomendado)",
              type: "url",
              description: "Pega el enlace de YouTube, YouTube Shorts o TikTok. Se reproduce directamente desde su plataforma sin costo de ancho de banda.",
            }),
            defineField({
              name: "googleDriveUrl",
              title: "2. 📁 Enlace de Google Drive",
              type: "url",
              description: "Pega el enlace de compartir de Google Drive (ej: https://drive.google.com/file/d/XXXX/view?usp=sharing con permiso 'Cualquier persona con el enlace').",
            }),

            defineField({
              name: "productLink",
              title: "Enlace del Producto (Botón Carrito)",
              type: "string",
              description: "Ruta o URL del producto a comprar al hacer click en el botón rojo [🛒]. Ej: /producto/akd2101 o /buscar?q=total",
            }),
            defineField({
              name: "thumbnail",
              title: "Miniatura",
              type: "image",
              options: { hotspot: true },
              description: "Miniatura opcional de portada para el video. 📐 Resolución recomendada: 1080 x 1920 px (formato vertical 9:16) o 720 x 1280 px.",
            }),
            defineField({
              name: "isVertical",
              title: "Video Vertical (Shorts/TikTok)",
              type: "boolean",
              initialValue: () => true,
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
