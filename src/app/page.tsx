import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* ── Desktop-only components ── */
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { ToolCribSidebar } from "@/components/home/ToolCribSidebar";
import { CenterHeroBanner } from "@/components/home/CenterHeroBanner";
import { CenterSmallBanners } from "@/components/home/CenterSmallBanners";

/* ── Shared components ── */
import { CenterGiveawayBanner } from "@/components/home/CenterGiveawayBanner";
import { BestDealsSection } from "@/components/home/BestDealsSection";

/* ── Mobile-only components ── */
import { HorizontalCategoryMenu } from "@/components/home/HorizontalCategoryMenu";
import { ToolCribMobileBar } from "@/components/home/ToolCribMobileBar";
import { TrendingCategoriesMobile } from "@/components/home/TrendingCategoriesMobile";
import { TrendingProductsMobile } from "@/components/home/TrendingProductsMobile";
import { CategoriesGridMobile } from "@/components/home/CategoriesGridMobile";
import { BrandsGridMobile } from "@/components/home/BrandsGridMobile";
import { ExploreProductsMobile } from "@/components/home/ExploreProductsMobile";

/* ── Desktop full-width sections ── */
import { FeaturedSection, NewArrivalsSection } from "@/components/home/ProductSections";
import { BrandShowcase } from "@/components/home/BrandShowcase";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════
            MOBILE LAYOUT (below lg)
            Horizontal Menu → Hero → 2-col Banners → Tool Crib bar
            → Trending Categories → Giveaway → Trending Products
            → Best Deals (lower) → Brands → Explore
            ═══════════════════════════════════════════════════ */}
        <div className="lg:hidden">
          {/* 0. Horizontal Scrolling Category Menu (Acme style) */}
          <HorizontalCategoryMenu />

          {/* 1. Hero banner — full-width horizontal */}
          <div className="px-2.5">
            <CenterHeroBanner />
          </div>

          {/* 2. Two tall vertical banners — 2 columns side-by-side */}
          <div className="px-2.5 pt-2.5">
            <CenterSmallBanners />
          </div>

          {/* 3. Tool Crib — thin horizontal bar */}
          <ToolCribMobileBar />

          {/* 4. Categorías de Tendencia — 2-col grid with view counts */}
          <TrendingCategoriesMobile />

          {/* 5. Giveaway banner */}
          <div className="px-2.5">
            <CenterGiveawayBanner />
          </div>

          {/* 6. Productos de Moda — horizontal scroll cards */}
          <TrendingProductsMobile />

          {/* 7. Best Deals — horizontal scroll (below other content) */}
          <BestDealsSection />

          {/* 8. Categorías Principales — tile grid */}
          <CategoriesGridMobile />

          {/* 9. Comprar por Marca — brand button grid */}
          <BrandsGridMobile />

          {/* 10. Explorar Productos — tabbed + horizontal scroll */}
          <ExploreProductsMobile />
        </div>

        {/* ═══════════════════════════════════════════════════
            DESKTOP LAYOUT (lg+)
            3-column: Left trending | Center banners | Right tool crib
            ═══════════════════════════════════════════════════ */}
        <div className="hidden lg:block">
          <div className="mx-auto max-w-[1440px] px-2.5 lg:px-4 py-3">
            <div className="flex gap-3">
              {/* LEFT SIDEBAR */}
              <div className="w-[240px] xl:w-[260px] shrink-0">
                <div className="sticky top-[120px]">
                  <TrendingSidebar />
                </div>
              </div>

              {/* CENTER COLUMN */}
              <div className="flex-1 min-w-0 space-y-2.5">
                <CenterHeroBanner />
                <CenterSmallBanners />
                <CenterGiveawayBanner />

                {/* Desktop deals (3-col grid) */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-4 w-4 text-[#CC3300]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                    <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
                      Las Mejores Ofertas
                    </h2>
                  </div>
                  <DesktopDealTiles />
                </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="w-[280px] xl:w-[300px] shrink-0">
                <div className="sticky top-[120px]">
                  <ToolCribSidebar />
                </div>
              </div>
            </div>
          </div>

          <BrandShowcase />
          <FeaturedSection />
          <NewArrivalsSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ── Desktop-only 3-column deal tiles ── */
function DesktopDealTiles() {
  const tiles = [
    { brand: "BOSCH", brandColor: "#005691", title: "Batería de 18 V de regalo", subtitle: "Consigue una batería GRATIS con kits BOSCH.", href: "/categoria/herramientas-electricas" },
    { brand: "MILWAUKEE", brandColor: "#D1001C", title: "Kit M18 FUEL™ con 2 baterías", subtitle: "Lleva el kit M18 FUEL™ y recibe batería extra.", href: "/categoria/herramientas-electricas" },
    { brand: "DEWALT", brandColor: "#FFD700", textColor: "#1A1A1A", title: "20V MAX XR — Hasta 25% OFF", subtitle: "Descuentos exclusivos en la línea 20V MAX XR.", href: "/categoria/herramientas-electricas" },
    { brand: "MAKITA", brandColor: "#0077C8", title: "18V LXT — 15% adicional", subtitle: "15% extra en herramientas Makita 18V.", href: "/categoria/herramientas-electricas" },
    { brand: "STANLEY", brandColor: "#E35205", title: "Envío Gratis en Manuales", subtitle: "Herramientas manuales Stanley envío gratis.", href: "/categoria/herramientas-manuales" },
    { brand: "3M", brandColor: "#CC3300", title: "Seguridad — 10% extra", subtitle: "EPP 3M con 10% de descuento adicional.", href: "/categoria/equipos-de-proteccion" },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mb-2.5">
        {tiles.map((tile) => (
          <a
            key={tile.brand}
            href={tile.href}
            className="enhanced-7by-tile group relative overflow-hidden rounded-lg bg-white border border-[#E0E0E0] hover:shadow-md transition-shadow"
          >
            <div className="h-1 w-full" style={{ backgroundColor: tile.brandColor }} />
            <div className="p-3">
              <span className="text-[11px] font-bold tracking-[0.06em]" style={{ color: tile.brandColor }}>
                {tile.brand}
              </span>
              <p className="font-impact text-[#1A1A1A] text-xs leading-tight mt-1 mb-1">{tile.title}</p>
              <p className="text-[#666] text-[10px] leading-relaxed mb-2 line-clamp-2">{tile.subtitle}</p>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F5F6F8] group-hover:bg-[#E35205] text-[#999] group-hover:text-white transition-all">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </span>
            </div>
          </a>
        ))}
      </div>
      <a
        href="/categoria/herramientas-electricas"
        className="block w-full text-center bg-[#E35205] hover:bg-[#CC4400] text-white py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors"
      >
        Ver Todas Las Ofertas
      </a>
    </>
  );
}