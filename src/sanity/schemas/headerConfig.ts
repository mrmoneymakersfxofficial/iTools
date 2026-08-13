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
  ],
});
