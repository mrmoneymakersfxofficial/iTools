import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Configuración Global")
        .child(
          S.list()
            .title("Configuración Global")
            .items([
              S.listItem()
                .title("Header")
                .child(S.document().schemaType("headerConfig").documentId("headerConfig")),
              S.listItem()
                .title("Footer")
                .child(S.document().schemaType("footerConfig").documentId("footerConfig")),
              S.listItem()
                .title("Textos y UI Global")
                .child(S.document().schemaType("uiConfig").documentId("uiConfig")),
            ])
        ),
      S.listItem()
        .title("Homepage")
        .child(
          S.list()
            .title("Secciones del Inicio")
            .items([
              S.listItem()
                .title("Ajustes Generales")
                .child(S.document().schemaType("homeSettings").documentId("homeSettings")),
              S.listItem()
                .title("Cuadrícula de Marcas (Orden Fijo)")
                .child(S.document().schemaType("brandShowcaseSettings").documentId("brandShowcaseSettings")),
              S.documentTypeListItem("heroSlide").title("Hero Banners"),
              S.documentTypeListItem("promoBanner").title("Promo Banners"),
              S.documentTypeListItem("giveawayBanner").title("Sorteos (Giveaway)"),
              S.documentTypeListItem("brandPromoSlide").title("Banners de Marcas"),
              S.documentTypeListItem("brandShowcaseItem").title("Marcas"),
              S.documentTypeListItem("category").title("Categorías"),
              S.documentTypeListItem("dealTile").title("Ofertas Especiales"),
              S.documentTypeListItem("product").title("Productos"),
              S.documentTypeListItem("sectionHeader").title("Encabezados de Sección"),
            ])
        ),
      S.documentTypeListItem("page").title("Páginas Estáticas"),
    ]);
