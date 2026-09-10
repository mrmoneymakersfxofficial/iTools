import { sanityFetch } from "@/sanity/lib/sanityFetch";
import { productBySlugQuery, relatedProductsQuery, productReviewsQuery } from "@/sanity/queries/product";

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
    let results: any[] = [];
    if (categorySlug) {
      results = (await sanityFetch({ 
        query: relatedProductsQuery, 
        params: { categorySlug, currentSlug } 
      })) || [];
    }
    if (results.length < 4) {
      const fallbackQuery = `*[_type == "product" && isActive == true && slug.current != $currentSlug] | order(_createdAt desc)[0...12] {
        _id,
        "id": _id,
        name,
        "slug": slug.current,
        sku,
        brand-> { _id, name, "slug": coalesce(slug.current, slug), logo { asset-> { url } } },
        price,
        salePrice,
        "comparePrice": salePrice,
        discountBadge,
        rating,
        "reviewCount": reviews,
        image { asset-> { url, metadata { dimensions { width, height }, lqip } } },
        images[] { asset-> { url, metadata { dimensions { width, height }, lqip } } }
      }`;
      const more: any = await sanityFetch({ query: fallbackQuery, params: { currentSlug } });
      const existingIds = new Set(results.map((r: any) => r._id || r.id));
      if (Array.isArray(more)) {
        for (const item of more) {
          if (!existingIds.has(item._id || item.id)) {
            results.push(item);
            existingIds.add(item._id || item.id);
          }
        }
      }
    }
    return results;
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

export async function fetchProductReviews(productSlug: string) {
  try {
    return await sanityFetch({ query: productReviewsQuery, params: { productSlug } });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }
}
