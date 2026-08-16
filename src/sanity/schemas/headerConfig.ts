import { defineField, defineType } from "sanity";

export default defineType({
  name: "headerConfig",
  title: "Configuración del Header",
  type: "document",
  fields: [
    defineField({
      name: "phone",
      title: "Teléfono",
      type: "string",
      description: "Ej: 01 234 5678",
    }),
    defineField({
      name: "phoneUrl",
      title: "Enlace del Teléfono",
      type: "string",
      description: "Ej: tel:+5112345678",
    }),
    defineField({
      name: "location",
      title: "Ubicación",
      type: "string",
      description: "Ej: Lima, Perú",
    }),
    defineField({
      name: "badge1",
      title: "Etiqueta 1",
      type: "string",
      description: "Ej: Servicio Técnico Oficial Milwaukee",
    }),
    defineField({
      name: "badge2",
      title: "Etiqueta 2",
      type: "string",
      description: "Ej: Envío a todo Perú",
    }),
    defineField({
      name: "announcementBar",
      title: "Barra de Anuncios (Opcional)",
      type: "string",
      description: "Mensaje promocional en la parte superior.",
    }),
    defineField({
      name: "showBrandLogos",
      title: "Mostrar Logos de Marcas en Cabecera",
      type: "boolean",
      initialValue: () => true,
      description: "Si está activo, se muestran los logos de marcas (en lugar de pestañas) en la barra de navegación",
    }),
    defineField({
      name: "brandLogos",
      title: "Logos de Marcas en Cabecera",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Nombre de Marca", type: "string" },
            { name: "slug", title: "Slug (link)", type: "string", description: "Ej: milwaukee → /marca/milwaukee" },
            {
              name: "logo",
              title: "Logo",
              type: "image",
              options: { hotspot: true },
            },
            { name: "order", title: "Orden", type: "number", initialValue: () => 0 },
          ],
          preview: {
            select: { title: "name", media: "logo" },
            prepare: ({ title, media }: { title?: string; media?: any }) => ({ title, media }),
          },
        },
      ],
      description: "Logos de marcas que se muestran en la cabecera. Al hacer clic llevan a /marca/[slug]. Deben ser visibles, ordenados y clickeables.",
    }),
  ],
});
