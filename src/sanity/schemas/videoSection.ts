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
      name: "videos",
      title: "Videos",
      type: "array",
      of: [
        defineType({
          name: "videoItem",
          title: "Video",
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
              title: "URL de Google Drive (embed)",
              type: "url",
              description: "URL del video en Google Drive. Formato: https://drive.google.com/file/d/FILE_ID/preview",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "thumbnail",
              title: "Miniatura",
              type: "image",
              options: { hotspot: true },
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
            prepare: ({ title, media }) => ({ title, media }),
          },
        }),
      ],
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
    prepare: ({ title }) => ({ title }),
  },
});
