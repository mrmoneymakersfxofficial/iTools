
export const dynamic = 'force-dynamic';

/* ── Desktop-only components ── */
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { ToolCribSidebar } from "@/components/home/ToolCribSidebar";
import { HeroCarousel } from "@/components/home/HeroCarousel";
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
import { BrandBannersCarousel } from "@/components/home/BrandBannersCarousel";
import { VideoSection } from "@/components/home/VideoSection";
import { PromoPopup } from "@/components/layout/PromoPopup";
import { CompareDrawer } from "@/components/product/CompareDrawer";



import { fetchHomePageData } from "@/lib/sanity/fetch-home";
import { VALID_LOCAL_BRANDS } from "@/lib/constants/brands";

export default async function Home() {
  const data = await fetchHomePageData();

  if (!data) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════
            MOBILE LAYOUT (below lg)
            ═══════════════════════════════════════════════════ */}
        <div className="lg:hidden" data-mobile>
          <HorizontalCategoryMenu categories={data.categories} />

          <section className="container mx-auto max-w-7xl px-4 md:px-6 py-4 md:py-8">
            <div className="mb-4 md:mb-6">
              <HeroCarousel banners={data.heroBanners} />
            </div>

            <div className="mb-4 md:mb-6">
              <BrandBannersCarousel banners={data.brandPromoBanners} />
            </div>

            <CenterSmallBanners banners={data.promoBanners} />
          </section>

          <ToolCribMobileBar settings={data.homeSettings} />

          <TrendingCategoriesMobile categories={data.trendingCategories} />

          <div className="px-4 md:px-6">
            <CenterGiveawayBanner banner={data.giveawayBanner} />
          </div>

          <TrendingProductsMobile products={data.products?.filter(p => p.showInTrending)} />

          <BestDealsSection dealTiles={data.dealTiles} />

          <CategoriesGridMobile categories={data.categories} />

          <BrandsGridMobile brands={data.brandShowcase?.filter(b => b.showInGrid)} />

          <ExploreProductsMobile products={data.products} />
        </div>

        {/* ═══════════════════════════════════════════════════
            DESKTOP LAYOUT (lg+)
            ═══════════════════════════════════════════════════ */}
        <div className="hidden lg:block">
          <div className="mx-auto max-w-[1440px] px-2.5 lg:px-4 py-3">
            <div className="flex gap-3">
              {/* LEFT SIDEBAR */}
              <div className="w-[240px] xl:w-[260px] shrink-0">
                <div className="sticky top-[120px]">
                  <TrendingSidebar categories={data.trendingCategories} />
                </div>
              </div>

              {/* CENTER COLUMN */}
              <div className="flex-1 min-w-0 space-y-2.5">
                <HeroCarousel banners={data.heroBanners} />
                <BrandBannersCarousel banners={data.brandPromoBanners} />
                <CenterSmallBanners banners={data.promoBanners} />
                <CenterGiveawayBanner banner={data.giveawayBanner} />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-4 w-4 text-[#CC3300]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                    <h2 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wide">
                      Las Mejores Ofertas
                    </h2>
                  </div>
                  <DesktopDealTiles dealTiles={data.dealTiles} />
                </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="w-[280px] xl:w-[300px] shrink-0">
                <div className="sticky top-[120px]">
                  <ToolCribSidebar products={data.products?.filter(p => p.showInToolCrib)} />
                </div>
              </div>
            </div>
          </div>

          <BrandShowcase brands={data.brandShowcase} />
          <FeaturedSection products={data.products?.filter(p => p.showInFeatured)} />
          <NewArrivalsSection products={data.products?.filter(p => p.showInNewArrivals)} />

          {/* Video Section */}
          <VideoSection data={data.videoSection} />
        </div>
      </main>
      {/* Global: Promo Popup */}
      <PromoPopup data={data.promoPopup} />
    </div>
  );
}

/* ── Desktop deal tiles — brand-colored cards with dark bottom gradient ── */
const fallbackDealTiles = [
  { _id: "dt1", brand: "BOSCH", brandColor: "#1e4b8f", title: "Batería de 18 V de regalo", subtitle: "Consigue una batería GRATIS con kits BOSCH.", href: "/marca/bosch" },
  { _id: "dt2", brand: "MILWAUKEE", brandColor: "#c61010", title: "Herramienta gratuita de elección", subtitle: "Con la compra de kits Milwaukee M18 seleccionados.", href: "/marca/milwaukee" },
  { _id: "dt3", brand: "DEWALT", brandColor: "#e6a817", textColor: "#1A1A1A", title: "Herramienta gratuita por nuestra cuenta", subtitle: "Con kit de batería DEWALT 20V MAX XR seleccionado.", href: "/marca/dewalt" },
  { _id: "dt4", brand: "MAKITA", brandColor: "#0077C8", title: "18V LXT — 15% adicional", subtitle: "15% extra en herramientas Makita 18V.", href: "/marca/makita" },
  { _id: "dt5", brand: "STANLEY", brandColor: "#E35205", title: "Envío Gratis en Manuales", subtitle: "Herramientas manuales Stanley envío gratis.", href: "/categoria/herramientas-manuales" },
  { _id: "dt6", brand: "3M", brandColor: "#CC3300", title: "Seguridad — 10% extra", subtitle: "EPP 3M con 10% de descuento adicional.", href: "/categoria/equipos-de-proteccion" },
];

function DesktopDealTiles({ dealTiles }: { dealTiles: any[] }) {
  const rawTiles = (dealTiles && dealTiles.length > 0) ? dealTiles : fallbackDealTiles;
  const safeTiles = rawTiles.filter(t => t && t.brand);


  return (
    <>
      <div className="grid grid-cols-3 gap-2.5 mb-2.5">
        {safeTiles.map((tile) => {
          const textCol = tile.textColor || "#FFFFFF";
          return (
            <a
              key={tile._id}
              href={tile.href}
              className="group relative overflow-hidden rounded-lg h-[200px] transition-shadow hover:shadow-lg"
            >
              <div className="absolute inset-0" style={{ backgroundColor: tile.brandColor || "#000" }} />
              {(tile.image?.asset?.url || (tile.brand && VALID_LOCAL_BRANDS.includes(tile.brand.toLowerCase()))) && (
                <img 
                  src={tile.image?.asset?.url || `/brands/${tile.brand?.toLowerCase()}.webp`} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-500" 
                />
              )}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)" }} />
              <div className="relative z-10 flex flex-col justify-between h-full p-4">
                <span className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: textCol, opacity: 0.85 }}>{tile.brand}</span>
                <div>
                  <p className="font-impact text-sm leading-tight mb-1" style={{ color: textCol }}>{tile.title}</p>
                  <p className="text-[10px] leading-relaxed mb-2 line-clamp-2" style={{ color: textCol, opacity: 0.8 }}>{tile.subtitle}</p>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full transition-all" style={{ backgroundColor: `${textCol}20`, color: textCol }}>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
      <a href="/categoria/herramientas-electricas" className="block w-full text-center bg-[#E35205] hover:bg-[#CC4400] text-white py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors">Ver Todas Las Ofertas</a>
    </>
  );
}