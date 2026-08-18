import { defineType, defineField } from "sanity";

export default defineType({
  name: "brandShowcaseSettings",
  title: "Configuración: Cuadrícula de Marcas",
  type: "document",
  fields: [
    defineField({
      name: "brands",
      title: "Marcas a mostrar",
      description: "Agrega las marcas exactas en el orden que deseas que aparezcan. Recomendado: 18 marcas.",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "brandShowcaseItem" }],
        },
      ],
      validation: (Rule) => Rule.unique(),
    }),
  ],
});
