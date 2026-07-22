import { sanityFetch } from "@/sanity/lib/sanityFetch";
import {
  heroBannersQuery,
  brandPromoBannersQuery,
  brandShowcaseQuery,
  trendingCategoriesQuery,
  giveawayBannerQuery,
  promoBannersQuery,
  sectionHeadersQuery,
  homePageQuery,
} from "@/sanity/queries/home";

export async function fetchHomePageData() {
  try {
    return await sanityFetch({ query: homePageQuery });
  } catch {
    return null;
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