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
      description: "Descripción de la empresa que aparece en la primera columna del pie de página.",
    }),
    defineField({
      name: "companyAddress",
      title: "Dirección de la Empresa",
      type: "string",
      description: "Dirección física (ej: Av. Universitaria 4974, Los Olivos, Lima)",
    }),
    defineField({
      name: "companyPhone",
      title: "Teléfono de Contacto",
      type: "string",
      description: "Número telefónico de atención (ej: (01) 123-4567 / +51 987 654 321)",
    }),
    defineField({
      name: "companyEmail",
      title: "Correo Electrónico (Email)",
      type: "string",
      description: "Correo de ventas o atención (ej: ventas@itoolsperu.com)",
    }),
    defineField({
      name: "workingHours",
      title: "Horario de Atención",
      type: "string",
      description: "Horario de atención (ej: Lunes a Sábado: 8:00 AM - 6:00 PM)",
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
    }),
    defineField({
      name: "trustFeatures",
      title: "Barra Azul de Beneficios (Trust Features)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Texto del Beneficio", type: "string" },
            { name: "iconName", title: "Icono (Truck, Shield, Clock, Award, Package, Lock)", type: "string" },
          ],
        },
      ],
      description: "Beneficios de la barra azul: Envío a Todo el Perú, Servicio Técnico Oficial, etc.",
    }),
    defineField({
      name: "socialBarTitle",
      title: "Título Redes Sociales (Barra Roja)",
      type: "string",
      description: "Texto que acompaña los iconos de redes sociales (ej: 'Síguenos en:')",
    }),
    defineField({
      name: "paymentMethodsTitle",
      title: "Título Medios de Pago (Barra Roja)",
      type: "string",
      description: "Texto que acompaña las tarjetas de pago (ej: 'Medios de Pago:')",
    }),
    defineField({
      name: "secureStoreTitle",
      title: "Título Tienda Segura (Barra Roja)",
      type: "string",
      description: "Texto del candado de seguridad (ej: 'Tienda 100% Segura')",
    }),
  ]
});
