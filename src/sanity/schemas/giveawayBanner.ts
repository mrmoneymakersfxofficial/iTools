import { defineType, defineField } from "sanity";

export default defineType({
  name: "giveawayBanner",
  title: "Banner de Sorteo/Promoción",
  type: "document",
  fields: [
    defineField({ name: "heading", title: "Encabezado (ej: iTools PERÚ)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "preTitle", title: "Texto previo (ej: Participa para ganar un)", type: "string" }),
    defineField({ name: "prize", title: "Premio / Texto principal", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ctaText", title: "Texto del botón CTA", type: "string" }),
    defineField({ name: "ctaLink", title: "Enlace del CTA", type: "string" }),
    defineField({ name: "smsText", title: "Texto SMS instrucción", type: "text", rows: 3 }),
    defineField({ name: "smsKeyword", title: "Palabra clave SMS", type: "string" }),
    defineField({ name: "smsNumber", title: "Número SMS", type: "string" }),
    defineField({ name: "finePrint", title: "Letra pequeña / Términos", type: "text", rows: 2 }),
    defineField({ name: "bgGradient", title: "Gradiente de fondo (CSS)", type: "string" }),
    defineField({ name: "isActive", title: "Activo", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "heading", subtitle: "prize" } },
});