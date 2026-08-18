import { sanityFetch } from "@/sanity/lib/sanityFetch";
import { layoutQuery } from "@/sanity/queries/layout";

export async function fetchLayoutData() {
  try {
    return await sanityFetch({ query: layoutQuery });
  } catch (error) {
    console.error("Error fetching layout data:", error);
    return null;
  }
}
