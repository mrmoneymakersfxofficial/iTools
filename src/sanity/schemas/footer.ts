import { defineField, defineType } from "sanity";

export default defineType({
  name: "footerConfig",
  title: "Configuración del Footer",
  type: "document",
  fields: [
    defineField({
      name: "aboutText",
      title: "Texto 'Sobre Nosotros'",
      type: "text",
    }),
    defineField({
      name: "contactInfo",
      title: "Información de Contacto",
      type: "object",
      fields: [
        { name: "address", title: "Dirección", type: "string" },
        { name: "phone", title: "Teléfono", type: "string" },
        { name: "email", title: "Email", type: "string" },
        { name: "hours", title: "Horario", type: "string" },
      ]
    }),
    defineField({
      name: "columns",
      title: "Columnas de Enlaces",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Título de la Columna", type: "string" },
            {
              name: "links",
              title: "Enlaces",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "label", title: "Texto del Enlace", type: "string" },
                    { name: "href", title: "URL", type: "string" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: "socialLinks",
      title: "Redes Sociales",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "platform", title: "Plataforma (ej: facebook, instagram, youtube)", type: "string" },
            { name: "url", title: "URL", type: "string" }
          ]
        }
      ]
    }),
    defineField({
      name: "bottomLinks",
      title: "Enlaces Inferiores (Términos, Privacidad)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Texto", type: "string" },
            { name: "href", title: "URL", type: "string" }
          ]
        }
      ]
    })
  ]
});
