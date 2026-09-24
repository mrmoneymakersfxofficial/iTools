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
          { title: "Video Subido Directo / MP4 (Recomendado)", value: "direct" },
          { title: "TikTok", value: "tiktok" },
          { title: "YouTube / YouTube Shorts", value: "youtube" },
          { title: "Google Drive", value: "googleDrive" },
          { title: "Mixto (URLs variadas)", value: "mixed" },
        ],
      },
      initialValue: () => "direct",
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
              name: "videoFile",
              title: "1. 📁 Subir Video Manualmente (Recomendado: MP4 / WebM)",
              type: "file",
              options: { accept: "video/*" },
              description: "Sube directamente el video desde tu computadora (MP4, WebM o MOV). Es la opción más rápida y recomendada: se reproduce en pantalla completa limpia sin enlaces externos.",
            }),
            defineField({
              name: "googleDriveUrl",
              title: "2. 📁 Enlace de Video de Google Drive",
              type: "url",
              description: "Pega el enlace de compartir de Google Drive (ej: https://drive.google.com/file/d/XXXX/view?usp=sharing). ⚠️ IMPORTANTE: En Google Drive, da clic derecho al archivo → Compartir → Configurar como 'Cualquier persona que tenga el vínculo puede ver'.",
            }),
            defineField({
              name: "videoUrl",
              title: "3. 🌐 Enlace Externo (TikTok / YouTube Shorts / MP4 URL)",
              type: "url",
              description: "URL pública opcional de TikTok, YouTube Shorts o link directo a un video .mp4 externo.",
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
