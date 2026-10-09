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
          { title: "Google Drive (Recomendado - $0 ancho de banda)", value: "googleDrive" },
          { title: "TikTok / YouTube Shorts", value: "youtube" },
          { title: "Mixto (URLs variadas)", value: "mixed" },
          { title: "Subido Directo (⚠️ Consume cuota de Sanity)", value: "direct" },
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
              name: "googleDriveUrl",
              title: "1. 📁 Enlace de Video de Google Drive (Recomendado: 0 consumo de ancho de banda)",
              type: "url",
              description: "Pega el enlace de compartir de Google Drive (ej: https://drive.google.com/file/d/XXXX/view?usp=sharing). ⚠️ IMPORTANTE: En Google Drive, dar clic derecho → Compartir → Configurar como 'Cualquier persona con el enlace puede ver'.",
            }),
            defineField({
              name: "videoUrl",
              title: "2. 🌐 Enlace Externo (TikTok / YouTube Shorts / Link MP4 externo)",
              type: "url",
              description: "URL pública de TikTok, YouTube Shorts o enlace directo a un MP4 alojado en un servidor externo.",
            }),
            defineField({
              name: "videoFile",
              title: "3. ⚠️ Subir Archivo Manual a Sanity (NO RECOMENDADO - Agota la cuota de Sanity)",
              type: "file",
              options: { accept: "video/*" },
              description: "ADVERTENCIA: Subir videos aquí consume la cuota mensual de ancho de banda de Sanity (hasta 100 GB por mes). Es preferible usar el campo 1 (Google Drive).",
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
