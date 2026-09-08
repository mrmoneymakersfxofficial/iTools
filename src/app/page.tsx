export const dynamic = 'force-dynamic';

/* ── Desktop-only & Shared components ── */
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { ToolCribSidebar } from "@/components/home/ToolCribSidebar";
import { HomeCenterHero } from "@/components/home/HomeCenterHero";
import { MainCategoriesSection } from "@/components/home/MainCategoriesSection";
import { DewaltPowerstackBanner } from "@/components/home/DewaltPowerstackBanner";
import { RedMarqueeBar } from "@/components/home/RedMarqueeBar";
import { VideoSection } from "@/components/home/VideoSection";
import { BrandShowcase } from "@/components/home/BrandShowcase";
import { BestSellersWorkshopSection } from "@/components/home/BestSellersWorkshopSection";
import { TechnicalServiceBanner } from "@/components/home/TechnicalServiceBanner";
import { ExclusivePromosSection } from "@/components/home/ExclusivePromosSection";
import { ProDealsSection } from "@/components/home/ProDealsSection";
import { EquipWorkshopSection } from "@/components/home/EquipWorkshopSection";
import { SataFavoritesBanner } from "@/components/home/SataFavoritesBanner";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { WhyBuySection } from "@/components/home/WhyBuySection";
import { PromoPopup } from "@/components/layout/PromoPopup";
import { HorizontalCategoryMenu } from "@/components/home/HorizontalCategoryMenu";
import { SectionUrlTracker } from "@/components/layout/SectionUrlTracker";
import { FlashSaleCountdownCard } from "@/components/home/FlashSaleCountdownCard";

import { fetchHomePageData } from "@/lib/sanity/fetch-home";

export default async function Home() {
  const data = await fetchHomePageData();

  if (!data) return null;

  // Products subsets for different sections (passed to auto-rotating carousels)
  const allProducts = data.products || [];
  const bestSellers = allProducts.filter((p: any) => p.showInTrending || p.showInFeatured || p.stock > 0);
  const proProducts = allProducts.filter((p: any) => p.showInFeatured || p.price > 100);
  const workshopProducts = allProducts.filter((p: any) => p.showInNewArrivals || p.stock > 0);

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD] dark:bg-[#0A0A0A]">
      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════
            MOBILE LAYOUT (below lg)
            ═══════════════════════════════════════════════════ */}
        <div className="lg:hidden" data-mobile>
          <HorizontalCategoryMenu categories={data.categories} />

          <div className="px-3 py-3">
            <HomeCenterHero
              heroBanners={data.heroBanners}
              brandPromoBanners={data.brandPromoBanners}
              promoBanners={data.promoBanners}
            />
          </div>

          {/* Flash Sale Cuadro de Tiempo en Mobile */}
          <div className="px-3 mb-3">
            <FlashSaleCountdownCard />
          </div>

          <MainCategoriesSection categories={data.categories} dealTiles={data.dealTiles} />
          <DewaltPowerstackBanner banner={data.promoBanners?.find((b: any) => b._id === "promo-banner-dewalt-powerstack")} />
          <RedMarqueeBar uiConfig={data.uiConfig} />
          <VideoSection data={data.videoSection} />
          <BrandShowcase brands={data.brandShowcase} />
          <BestSellersWorkshopSection
            products={bestSellers.length ? bestSellers : allProducts}
            backgroundBanner={data.promoBanners?.find((b: any) => b._id === "promo-banner-mas-vendidos-bg")}
          />
          <TechnicalServiceBanner banner={data.promoBanners?.find((b: any) => b._id === "promo-banner-servicio-tecnico")} />
          <ExclusivePromosSection banners={data.promoBanners} />
          <ProDealsSection
            products={proProducts.length ? proProducts : allProducts}
            banners={data.promoBanners}
          />
          <EquipWorkshopSection
            products={workshopProducts.length ? workshopProducts : allProducts}
            banners={data.promoBanners}
          />
          <SataFavoritesBanner banner={data.promoBanners?.find((b: any) => b._id === "promo-banner-sata-380")} />
          <ExperienceSection banners={data.promoBanners} />
          <WhyBuySection banners={data.promoBanners} />
        </div>

        {/* ═══════════════════════════════════════════════════
            DESKTOP LAYOUT (lg+) - EXACT 5 IMAGES SEQUENCE
            ═══════════════════════════════════════════════════ */}
        <div className="hidden lg:block">
          {/* ── IMAGE 1: Hero 3-Column Grid ── */}
          <div className="mx-auto max-w-[1440px] px-2.5 lg:px-4 py-3">
            <div className="flex gap-3">
              {/* LEFT SIDEBAR: Categorías de Tendencia + Cuadro de Tiempo Flash Sale */}
              <div className="w-[240px] xl:w-[260px] shrink-0">
                <div className="sticky top-[120px] flex flex-col gap-2.5">
                  <TrendingSidebar categories={data.trendingCategories} />
                  <FlashSaleCountdownCard />
                </div>
              </div>

              {/* CENTER COLUMN: Hero Banners */}
              <div className="flex-1 min-w-0">
                <HomeCenterHero
                  heroBanners={data.heroBanners}
                  brandPromoBanners={data.brandPromoBanners}
                  promoBanners={data.promoBanners}
                />
              </div>

              {/* RIGHT SIDEBAR: Tool Crib of the North */}
              <div className="w-[280px] xl:w-[300px] shrink-0">
                <div className="sticky top-[120px]">
                  <ToolCribSidebar
                    products={
                      data.products?.filter((p: any) => p.showInToolCrib)?.length
                        ? data.products.filter((p: any) => p.showInToolCrib)
                        : data.featuredProducts || data.products?.slice(0, 5)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── IMAGE 1: Categorías Principales (Duo Chambeador + Combos) ── */}
          <MainCategoriesSection categories={data.categories} dealTiles={data.dealTiles} />

          {/* ── IMAGE 1: Full-Width DeWalt Powerstack Banner ── */}
          <DewaltPowerstackBanner banner={data.promoBanners?.find((b: any) => b._id === "promo-banner-dewalt-powerstack")} />

          {/* ── IMAGE 1: Red Moving Marquee (Envíos a todo el Perú) ── */}
          <RedMarqueeBar uiConfig={data.uiConfig} />

          {/* ── IMAGE 2: Ofertas en Tendencia (TikTok/Reels Vertical Videos) ── */}
          <VideoSection data={data.videoSection} />

          {/* ── IMAGE 2: Las Mejores Marcas Para Tu Trabajo (18 Marcas Grid) ── */}
          <BrandShowcase brands={data.brandShowcase} />

          {/* ── IMAGE 2: Los Más Vendidos (Carrusel en Rotación) ── */}
          <BestSellersWorkshopSection
            products={bestSellers.length ? bestSellers : allProducts}
            backgroundBanner={data.promoBanners?.find((b: any) => b._id === "promo-banner-mas-vendidos-bg")}
          />

          {/* ── IMAGE 2: Servicio Técnico de Tus Marcas Favoritas ── */}
          <TechnicalServiceBanner banner={data.promoBanners?.find((b: any) => b._id === "promo-banner-servicio-tecnico")} />

          {/* ── IMAGE 3: Promociones Exclusivas (50/50 + Hot Sale Cocina) ── */}
          <ExclusivePromosSection banners={data.promoBanners} />

          {/* ── IMAGE 3: Ofertas Para Profesionales (Carrusel en Rotación) ── */}
          <ProDealsSection
            products={proProducts.length ? proProducts : allProducts}
            banners={data.promoBanners}
          />

          {/* ── IMAGE 4: Equipa Tu Taller (Carrusel en Rotación) ── */}
          <EquipWorkshopSection
            products={workshopProducts.length ? workshopProducts : allProducts}
            banners={data.promoBanners}
          />

          {/* ── IMAGE 4: Favoritos de los Profesionales (SATA 380 piezas) ── */}
          <SataFavoritesBanner banner={data.promoBanners?.find((b: any) => b._id === "promo-banner-sata-380")} />

          {/* ── IMAGE 4: Vive la Experiencia iTools (4 Cards) ── */}
          <ExperienceSection banners={data.promoBanners} />

          {/* ── IMAGE 5: ¿Por Qué Comprar en iTools.pe? (Tractor + 3 Banners) ── */}
          <WhyBuySection banners={data.promoBanners} />
        </div>

        {/* Section URL hash and Sanity CMS tracker */}
        <SectionUrlTracker />
      </main>

      {/* Global: Promo Popup */}
      <PromoPopup data={data.promoPopup} />
    </div>
  );
}