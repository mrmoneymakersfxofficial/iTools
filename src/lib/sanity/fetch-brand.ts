import { sanityFetch } from "@/sanity/lib/sanityFetch";

export const brandBySlugQuery = `*[_type == "brandShowcaseItem" && slug.current == $slug][0] {
  _id,
  "id": _id,
  name,
  "slug": slug.current,
  logo { asset-> { url } }
}`;

export const productsByBrandSlugQuery = `*[_type == "product" && brand->slug.current == $slug && isActive == true] | order(_createdAt desc) {
  _id,
  "id": _id,
  name,
  "slug": slug.current,
  brand->{ name, "slug": slug.current },
  price,
  "comparePrice": salePrice,
  rating,
  "reviewCount": reviews,
  "images": [image.asset->url],
  isFeatured,
  isNewArrival,
  isOnSale
}`;

export async function fetchBrandBySlug(slug: string) {
  try {
    return await sanityFetch({ query: brandBySlugQuery, params: { slug } });
  } catch (error) {
    return null;
  }
}

export async function fetchProductsByBrandSlug(slug: string) {
  try {
    return await sanityFetch({ query: productsByBrandSlugQuery, params: { slug } });
  } catch (error) {
    return [];
  }
}

export async function fetchAllBrandSlugs() {
  try {
    return await sanityFetch({ query: `*[_type == "brandShowcaseItem"] { "slug": slug.current }` });
  } catch (error) {
    return [];
  }
}
