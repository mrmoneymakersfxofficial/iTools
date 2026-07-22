import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Homepage")
        .child(
          S.list()
            .title("Secciones del Inicio")
            .items([
              S.documentTypeListItem("heroSlide").title("Hero Banners"),
              S.documentTypeListItem("promoBanner").title("Promo Banners"),
              S.documentTypeListItem("giveawayBanner").title("Sorteos (Giveaway)"),
              S.documentTypeListItem("brandPromoSlide").title("Banners de Marcas"),
              S.documentTypeListItem("brandShowcaseItem").title("Showcase de Marcas"),
              S.documentTypeListItem("trendingCategory").title("Categorías en Tendencia"),
              S.documentTypeListItem("sectionHeader").title("Encabezados de Sección"),
            ])
        ),
      // Here you could add more categories or document types that don't belong to the Homepage in the future
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "heroSlide",
            "promoBanner",
            "giveawayBanner",
            "brandPromoSlide",
            "brandShowcaseItem",
            "trendingCategory",
            "sectionHeader",
          ].includes(listItem.getId() as string)
      ),
    ]);
