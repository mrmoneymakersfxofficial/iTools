import { defineType, defineField } from "sanity";

export default defineType({
  name: "trendingCategory",
  title: "Categoría de Tendencia",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nombre", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "string", validation: (r) => r.required() }),
    defineField({ name: "viewCount", title: "Texto de vistas (ej: 18.8K)", type: "string" }),
    defineField({
      name: "iconType",
      title: "Tipo de ícono",
      type: "string",
      options: {
        list: [
          { title: "Taladro", value: "drill" },
          { title: "Impacto", value: "impact" },
          { title: "Llave", value: "wrench" },
          { title: "Sierra", value: "saw" },
          { title: "Kit", value: "kit" },
          { title: "M18", value: "m18" },
          { title: "M12", value: "m12" },
          { title: "Batería", value: "battery" },
          { title: "Destornillador", value: "screwdriver" },
          { title: "Cortafrío", value: "chisel" },
          { title: "Esmeril", value: "grinder" },
          { title: "Medición", value: "measure" },
        ],
      },
    }),
    defineField({ name: "order", title: "Orden", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "isActive", title: "Activo", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "viewCount" } },
});