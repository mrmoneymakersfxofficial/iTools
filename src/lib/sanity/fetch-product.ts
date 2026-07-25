import { sanityFetch } from "@/sanity/lib/sanityFetch";
import { productBySlugQuery, relatedProductsQuery } from "@/sanity/queries/product";

export async function fetchProductBySlug(slug: string) {
  try {
    return await sanityFetch({ query: productBySlugQuery, params: { slug } });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export async function fetchRelatedProducts(categorySlug: string, currentSlug: string) {
  try {
    return await sanityFetch({ 
      query: relatedProductsQuery, 
      params: { categorySlug, currentSlug } 
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function fetchAllProductSlugs() {
  try {
    return await sanityFetch({ query: `*[_type == "product" && isActive == true] { "slug": slug.current }` });
  } catch (error) {
    return [];
  }
}
