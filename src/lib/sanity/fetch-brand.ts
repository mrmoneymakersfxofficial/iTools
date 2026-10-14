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

export async function fetchBrandBySlug(slug: string): Promise<any> {
  try {
    return (await sanityFetch({ query: brandBySlugQuery, params: { slug } })) as any;
  } catch (error) {
    return null;
  }
}

export async function fetchProductsByBrandSlug(slug: string): Promise<any[]> {
  try {
    const res = await sanityFetch({ query: productsByBrandSlugQuery, params: { slug } });
    return (Array.isArray(res) ? res : []) as any[];
  } catch (error) {
    return [];
  }
}

export async function fetchAllBrandSlugs(): Promise<{ slug: string }[]> {
  try {
    const res = await sanityFetch({ query: `*[_type == "brandShowcaseItem"] { "slug": slug.current }` });
    return (Array.isArray(res) ? res : []) as { slug: string }[];
  } catch (error) {
    return [];
  }
}
