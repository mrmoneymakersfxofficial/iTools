import { sanityFetch } from "@/sanity/lib/sanityFetch";
import { productReviewsQuery } from "@/sanity/queries/product";

export async function fetchProductReviews(productSlug: string) {
  try {
    return await sanityFetch({ query: productReviewsQuery, params: { productSlug } });
  } catch {
    return [];
  }
}
