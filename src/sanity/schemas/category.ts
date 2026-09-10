import { defineType, defineField } from "sanity";

export default defineType({
  name: "category",
  title: "Categoría (Menú / Grid)",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nombre", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "parent",
      title: "Categoría Padre",
      type: "reference",
      to: [{ type: "category" }],
      description: "Si está vacío, es una categoría principal (raíz).",
    }),
    defineField({ name: "viewCount", title: "Texto de vistas (ej: 18.8K) (Opcional, para sidebar)", type: "string" }),
    defineField({
      name: "iconName",
      title: "Nombre del Ícono (Lucide)",
      description: "Ej: Zap, Wrench, Package, HardHat, Disc, Trees, Shield, Ruler, Cog, Drill, Hammer",
      type: "string",
    }),
    defineField({ name: "color", title: "Color Hexadecimal", type: "string", description: "Ej: #D1001C" }),
    defineField({ name: "showInSidebar", title: "Mostrar en Sidebar / Tendencias", type: "boolean", initialValue: true }),
    defineField({ name: "productsLimit", title: "Cantidad de productos a mostrar", type: "number", initialValue: 24, description: "Número de productos a mostrar por página en esta categoría" }),
    defineField({ name: "bannerTitle", title: "Título del Banner Separador (ej: OFERTAS)", type: "string" }),
    defineField({ name: "bannerSubtitle", title: "Texto / Subtítulo del Banner", type: "string" }),
    defineField({ name: "bannerImage", title: "Banner Horizontal de la Categoría", type: "image", options: { hotspot: true } }),
    defineField({ name: "bannerLink", title: "Enlace del Banner", type: "string" }),
    defineField({ name: "order", title: "Orden", type: "number", validation: (r) => r.required().min(0) }),
    defineField({
      name: "subcategories",
      title: "Subcategorías del Desplegable (Menú Superior)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Nombre", type: "string", validation: (r) => r.required() },
            { name: "link", title: "Enlace o Búsqueda", type: "string" },
          ],
          preview: {
            select: { title: "name", subtitle: "link" },
          },
        },
      ],
      description: "Subcategorías administrables desde Sanity que se muestran en el menú desplegable superior.",
    }),
    defineField({ name: "isActive", title: "Activo", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", slug: "slug" },
    prepare({ title, slug }: { title?: string; slug?: { current?: string } | string }) {
      const slugText = typeof slug === "string" ? slug : slug?.current || "";
      return {
        title: title || "Sin nombre",
        subtitle: slugText ? `/${slugText}` : "",
      };
    },
  },
});
