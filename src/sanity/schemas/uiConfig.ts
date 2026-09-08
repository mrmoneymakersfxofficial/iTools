import { defineType, defineField } from "sanity";

export default defineType({
  name: "uiConfig",
  title: "Configuración Global UI (Textos)",
  type: "document",
  fields: [
    defineField({
      name: "addToCartText",
      title: "Texto de Añadir al Carrito",
      type: "string",
      initialValue: "Añadir al Carrito",
    }),
    defineField({
      name: "viewDetailsText",
      title: "Texto de Ver Detalles",
      type: "string",
      initialValue: "Ver Detalles",
    }),
    defineField({
      name: "outOfStockText",
      title: "Texto de Agotado",
      type: "string",
      initialValue: "Agotado",
    }),
    defineField({
      name: "searchPlaceholder",
      title: "Texto del Buscador",
      type: "string",
      initialValue: "Buscar herramientas...",
    }),
    defineField({
      name: "shippingBadgeText",
      title: "Insignia de Envío",
      type: "string",
      initialValue: "Envío a todo Perú",
    }),
    defineField({
      name: "securePaymentText",
      title: "Insignia de Pago Seguro",
      type: "string",
      initialValue: "Pago Seguro",
    }),
    defineField({
      name: "warrantyText",
      title: "Insignia de Garantía",
      type: "string",
      initialValue: "Garantía Oficial",
    }),
    defineField({
      name: "returnsText",
      title: "Insignia de Devolución",
      type: "string",
      initialValue: "Devolución en 30 días",
    }),
    defineField({
      name: "marqueeBtn1Text",
      title: "Franja Envíos - Texto Botón 1",
      type: "string",
      initialValue: "¡¡ ENVIOS A TODO EL PERÚ !!",
    }),
    defineField({
      name: "marqueeBtn1Link",
      title: "Franja Envíos - Enlace Botón 1",
      type: "string",
      initialValue: "/buscar?q=envios",
    }),
    defineField({
      name: "marqueeBtn2Text",
      title: "Franja Envíos - Texto Botón 2",
      type: "string",
      initialValue: "¡¡ DESPACHO EN 24H !!",
    }),
    defineField({
      name: "marqueeBtn2Link",
      title: "Franja Envíos - Enlace Botón 2",
      type: "string",
      initialValue: "/buscar?q=despacho",
    }),
    defineField({
      name: "marqueeBtn3Text",
      title: "Franja Envíos - Texto Botón 3",
      type: "string",
      initialValue: "¡¡ RECOJO EN TIENDA !!",
    }),
    defineField({
      name: "marqueeBtn3Link",
      title: "Franja Envíos - Enlace Botón 3",
      type: "string",
      initialValue: "/contacto",
    }),
  ],
});
