import { defineType, defineField } from "sanity";

export default defineType({
  name: "page",
  title: "Páginas Estáticas",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título de la Página",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "content",
      title: "Contenido",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Texto alternativo",
              type: "string",
            },
          ],
        },
      ],
    }),
  ],
});
