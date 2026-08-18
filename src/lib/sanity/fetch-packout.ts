import { sanityFetch } from "@/sanity/lib/sanityFetch";
import { allPackoutComponentsQuery, packoutBasesQuery, packoutStackablesQuery } from "@/sanity/queries/packout";

export async function fetchAllPackoutComponents() {
  try {
    return await sanityFetch({ query: allPackoutComponentsQuery });
  } catch {
    return [];
  }
}

export async function fetchPackoutBases() {
  try {
    return await sanityFetch({ query: packoutBasesQuery });
  } catch {
    return [];
  }
}

export async function fetchPackoutStackables() {
  try {
    return await sanityFetch({ query: packoutStackablesQuery });
  } catch {
    return [];
  }
}
