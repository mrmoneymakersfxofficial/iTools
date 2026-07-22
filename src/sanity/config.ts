import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { structure } from "./structure";
import { visionTool } from "@sanity/vision";
import { presentationTool, defineLocations } from "sanity/presentation";
import { apiVersion, dataset, projectId } from "./env";
import { schemaTypes } from "./schemas";

const PREVIEW_ORIGIN = "https://i-tools-steel.vercel.app";

export const locationUrl = (href: string) => `${PREVIEW_ORIGIN}${href}`;

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
          enable: "/api/draft",
        },
      },
      document: homeLocations,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});