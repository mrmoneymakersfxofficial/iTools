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
