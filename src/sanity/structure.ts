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
              S.listItem()
                .title("Ajustes Generales")
                .child(
                  S.document().schemaType("homeSettings").documentId("homeSettings")
                ),
              S.documentTypeListItem("heroSlide").title("Hero Banners"),
              S.documentTypeListItem("promoBanner").title("Promo Banners"),
              S.documentTypeListItem("giveawayBanner").title("Sorteos (Giveaway)"),
              S.documentTypeListItem("brandPromoSlide").title("Banners de Marcas"),
              S.documentTypeListItem("brandShowcaseItem").title("Marcas"),
              S.documentTypeListItem("category").title("Categorías"),
              S.documentTypeListItem("dealTile").title("Ofertas Especiales"),
              S.documentTypeListItem("product").title("Productos"),
              S.documentTypeListItem("sectionHeader").title("Encabezados de Sección"),
              S.documentTypeListItem("promoPopup").title("Popup Emergente"),
              S.documentTypeListItem("videoSection").title("Videos"),
              S.documentTypeListItem("packoutComponent").title("PACKOUT Builder"),
              S.documentTypeListItem("productReview").title("Reseñas"),
            ])
        ),
      // Here you could add more categories or document types that don't belong to the Homepage in the future
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "homeSettings",
            "heroSlide",
            "promoBanner",
            "giveawayBanner",
            "brandPromoSlide",
            "brandShowcaseItem",
            "category",
            "dealTile",
            "product",
            "trendingCategory", // Deprecated, left here so it's not shown in the main list
            "sectionHeader",
            "promoPopup",
            "videoSection",
            "packoutComponent",
            "productReview",
          ].includes(listItem.getId() as string)
      ),
    ]);
