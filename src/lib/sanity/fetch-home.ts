import { client } from "@/sanity/client";
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
    return await client.fetch(homePageQuery);
  } catch {
    return null;
  }
}

export async function fetchHeroBanners() {
  try { return await client.fetch(heroBannersQuery); } catch { return []; }
}

export async function fetchBrandPromoBanners() {
  try { return await client.fetch(brandPromoBannersQuery); } catch { return []; }
}

export async function fetchBrandShowcase() {
  try { return await client.fetch(brandShowcaseQuery); } catch { return []; }
}

export async function fetchTrendingCategories() {
  try { return await client.fetch(trendingCategoriesQuery); } catch { return []; }
}

export async function fetchGiveawayBanner() {
  try { return await client.fetch(giveawayBannerQuery); } catch { return null; }
}

export async function fetchPromoBanners() {
  try { return await client.fetch(promoBannersQuery); } catch { return []; }
}

export async function fetchSectionHeaders() {
  try { return await client.fetch(sectionHeadersQuery); } catch { return []; }
}