import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { structure } from "./structure";
import { visionTool } from "@sanity/vision";
import { presentationTool, defineLocations } from "sanity/presentation";
import { apiVersion, dataset, projectId } from "./env";
import { schemaTypes } from "./schemas";

const PREVIEW_ORIGIN = typeof window === "undefined" ? "https://i-tools-steel.vercel.app" : window.location.origin;

export const locationUrl = (href: string) => href;

export const homeLocations = {
  heroSlide: defineLocations({
    message: "Este banner aparece en la página de inicio",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  brandPromoSlide: defineLocations({
    message: "Este banner de marca aparece en la sección de marcas",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  brandShowcaseItem: defineLocations({
    message: "Esta marca aparece en el showcase de marcas",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  trendingCategory: defineLocations({
    message: "Esta categoría aparece en tendencias del inicio",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  giveawayBanner: defineLocations({
    message: "Este sorteo aparece en la página de inicio",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  promoBanner: defineLocations({
    message: "Esta promo aparece en la página de inicio",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  sectionHeader: defineLocations({
    message: "Este encabezado de sección aparece en el inicio",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  homeSettings: defineLocations({
    message: "Configuración de la página de inicio",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  product: defineLocations({
    message: "Este producto aparece en la página de inicio o en su página individual",
    resolve: (doc) => ({
      locations: [
        { title: "Inicio", href: locationUrl("/") },
        { title: "Ver Producto", href: locationUrl(`/producto/${doc?.slug?.current || ""}`) }
      ],
    }),
  }),
  category: defineLocations({
    message: "Esta categoría aparece en la página de inicio",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  dealTile: defineLocations({
    message: "Esta oferta aparece en la página de inicio",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  headerConfig: defineLocations({
    message: "Configuración global del Header",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  footerConfig: defineLocations({
    message: "Configuración global del Footer",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  uiConfig: defineLocations({
    message: "Configuración de Textos y UI Global",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  promoPopup: defineLocations({
    message: "Este popup aparece en la página de inicio",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  brandShowcaseSettings: defineLocations({
    message: "Configuración de Showcase de Marcas",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  videoSection: defineLocations({
    message: "Esta sección de videos aparece en la página de inicio",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
  page: defineLocations({
    message: "Página genérica estática",
    resolve: (doc) => ({
      locations: [{ title: "Ver Página", href: locationUrl(`/${doc?.slug?.current || ""}`) }],
    }),
  }),
  packoutComponent: defineLocations({
    message: "Este componente aparece en el PACKOUT Builder",
    resolve: (doc) => ({
      locations: [{ title: "PACKOUT Builder", href: locationUrl("/packout-builder") }],
    }),
  }),
  productReview: defineLocations({
    message: "Esta reseña aparece en la página de inicio o en la del producto",
    resolve: (doc) => ({
      locations: [{ title: "Inicio", href: locationUrl("/") }],
    }),
  }),
};

export default defineConfig({
  name: "iTools-CMS",
  title: "iTools Perú CMS",
  projectId,
  dataset,
  apiVersion,
  basePath: "/cms",
  plugins: [
    structureTool({ structure }),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: PREVIEW_ORIGIN,
        previewMode: {
          enable: `/api/draft?secret=${process.env.SANITY_REVALIDATE_SECRET || ''}`,
        },
      },
      document: homeLocations,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});