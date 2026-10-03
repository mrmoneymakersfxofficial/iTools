import { sanityFetch } from "@/sanity/lib/sanityFetch";
import {
  heroBannersQuery,
  brandPromoBannersQuery,
  brandShowcaseSettingsQuery,
  brandShowcaseQuery,
  trendingCategoriesQuery,
  giveawayBannerQuery,
  promoBannersQuery,
  sectionHeadersQuery,
  homePageQuery,
} from "@/sanity/queries/home";

import { getFallbackHomeData } from "./home-fallback";

export async function fetchHomePageData() {
  const fallback = getFallbackHomeData();
  try {
    const data: any = await sanityFetch({ query: homePageQuery });
    if (!data) return fallback;

    // Merge fallback data if essential arrays are missing or empty
    return {
      ...fallback,
      ...data,
      categories: data.categories?.length ? data.categories : fallback.categories,
      heroBanners: data.heroBanners?.length ? data.heroBanners : fallback.heroBanners,
      brandPromoBanners: data.brandPromoBanners?.length ? data.brandPromoBanners : fallback.brandPromoBanners,
      brandShowcase: data.brandShowcase?.brands?.length ? data.brandShowcase : fallback.brandShowcase,
      trendingCategories: data.trendingCategories?.length ? data.trendingCategories : fallback.trendingCategories,
      products: data.products?.length ? data.products : fallback.products,
      featuredProducts: data.featuredProducts?.length ? data.featuredProducts : fallback.featuredProducts,
      newArrivals: data.newArrivals?.length ? data.newArrivals : fallback.newArrivals,
      trendingProducts: data.trendingProducts?.length ? data.trendingProducts : fallback.trendingProducts,
      dealTiles: data.dealTiles?.length ? data.dealTiles : fallback.dealTiles,
      promoBanners: data.promoBanners?.length ? data.promoBanners : fallback.promoBanners,
      homeSettings: data.homeSettings || fallback.homeSettings,
      uiConfig: data.uiConfig || fallback.uiConfig,
      videoSection: data.videoSection || fallback.videoSection,
    };
  } catch (error) {
    console.warn("[Sanity Home] Fetch failed, serving resilient fallback data:", error);
    return fallback;
  }
}

export async function fetchHeroBanners() {
  try { return await sanityFetch({ query: heroBannersQuery }); } catch { return []; }
}

export async function fetchBrandPromoBanners() {
  try { return await sanityFetch({ query: brandPromoBannersQuery }); } catch { return []; }
}

export async function fetchBrandShowcase() {
  try { return await sanityFetch({ query: brandShowcaseQuery }); } catch { return []; }
}

export async function fetchBrandShowcaseSettings() {
  try { return await sanityFetch({ query: brandShowcaseSettingsQuery }); } catch { return null; }
}

export async function fetchTrendingCategories() {
  try { return await sanityFetch({ query: trendingCategoriesQuery }); } catch { return []; }
}

export async function fetchGiveawayBanner() {
  try { return await sanityFetch({ query: giveawayBannerQuery }); } catch { return null; }
}

export async function fetchPromoBanners() {
  try { return await sanityFetch({ query: promoBannersQuery }); } catch { return []; }
}

export async function fetchSectionHeaders() {
  try { return await sanityFetch({ query: sectionHeadersQuery }); } catch { return []; }
}