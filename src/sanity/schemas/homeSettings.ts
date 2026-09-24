import { defineType, defineField } from "sanity";

export default defineType({
  name: "homeSettings",
  title: "Configuraciones Generales (Inicio)",
  type: "document",
  fields: [
    defineField({ 
      name: "toolCribTitle", 
      title: "Título de la barra Tool Crib", 
      type: "string", 
      initialValue: "TOOL CRIB DE LA SEMANA - Hasta 40% DCTO" 
    }),
    defineField({ 
      name: "toolCribLink", 
      title: "Link de Tool Crib", 
      type: "string", 
      initialValue: "/ofertas/tool-crib" 
    }),
    defineField({
      name: "mainCategoriesTitle",
      title: "Título de la sección Categorías Principales",
      type: "string",
      initialValue: "CATEGORIAS PRINCIPALES",
      description: "Título editable para la sección de las 5 tarjetas de combos / categorías principales (ej: CATEGORIAS PRINCIPALES)",
    }),
    defineField({
      name: "brandShowcaseTitle",
      title: "Título de la sección Marcas",
      type: "string",
      initialValue: "LAS MEJORES MARCAS PARA TU TRABAJO",
      description: "Título editable para la sección de cuadrícula de marcas",
    }),
    defineField({
      name: "brandShowcaseSubtitle",
      title: "Subtítulo de la sección Marcas",
      type: "string",
      initialValue: "Todo lo que necesitas para equipar tu taller con confianza.",
      description: "Subtítulo editable para la sección de marcas",
    }),
    defineField({
      name: "videoSectionTitle",
      title: "Título de la sección Videos (TikTok / Reels)",
      type: "string",
      initialValue: "VIDEOS DE PRODUCTOS Y PROMOCIONES",
      description: "Título editable para la sección de videos verticales",
    }),
    defineField({
      name: "videoSectionSubtitle",
      title: "Subtítulo de la sección Videos",
      type: "string",
      initialValue: "Descubre nuestras herramientas en acción — Tutoriales, demos y más",
      description: "Subtítulo editable para la sección de videos",
    }),
    defineField({
      name: "bestSellersTitle",
      title: "Título de la sección Los Más Vendidos",
      type: "string",
      initialValue: "LOS MÁS VENDIDOS",
    }),
    defineField({
      name: "bestSellersSubtitle",
      title: "Subtítulo de Los Más Vendidos",
      type: "string",
      initialValue: "Herramientas que los profesionales compran una y otra vez",
    }),
    defineField({
      name: "proDealsTitle",
      title: "Título de la sección Ofertas Para Profesionales",
      type: "string",
      initialValue: "OFERTAS PARA PROFESIONALES",
    }),
    defineField({
      name: "proDealsSubtitle",
      title: "Subtítulo de Ofertas Para Profesionales",
      type: "string",
      initialValue: "Precios exclusivos en herramientas de alta gama",
    }),
    defineField({
      name: "equipWorkshopTitle",
      title: "Título de la sección Equipa Tu Taller",
      type: "string",
      initialValue: "EQUIPA TU TALLER",
    }),
    defineField({
      name: "equipWorkshopSubtitle",
      title: "Subtítulo de Equipa Tu Taller",
      type: "string",
      initialValue: "Todo lo necesario para tu taller industrial y automotriz",
    }),
    defineField({
      name: "exploreProductsTitle",
      title: "Título de la sección Explorar Productos",
      type: "string",
      initialValue: "Explorar Productos"
    }),
    defineField({
      name: "exploreProductsSubtitle",
      title: "Subtítulo de Explorar Productos",
      type: "string",
      initialValue: "Descubre nuestra amplia gama de productos por categoría y uso."
    }),
    defineField({
      name: "bestSellersProducts",
      title: "Productos Seleccionados: Los Más Vendidos",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      description: "Selecciona y ordena manualmente los productos que aparecerán en la sección 'Los Más Vendidos'. Si está vacío, se mostrarán los marcados con 'Mostrar en Los Más Vendidos'.",
    }),
  ],
});
