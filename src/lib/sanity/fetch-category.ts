import { sanityFetch } from "@/sanity/lib/sanityFetch";

export const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0] {
  _id,
  "id": _id,
  "name": title,
  "slug": slug.current,
  iconName,
  color,
  description
}`;

export const productsByCategorySlugQuery = `*[_type == "product" && category->slug.current == $slug && isActive == true] | order(_createdAt desc) {
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

export async function fetchCategoryBySlug(slug: string) {
  try {
    return await sanityFetch({ query: categoryBySlugQuery, params: { slug } });
  } catch (error) {
    return null;
  }
}

export async function fetchProductsByCategorySlug(slug: string) {
  try {
    return await sanityFetch({ query: productsByCategorySlugQuery, params: { slug } });
  } catch (error) {
    return [];
  }
}

export async function fetchAllCategorySlugs() {
  try {
    return await sanityFetch({ query: `*[_type == "category"] { "slug": slug.current }` });
  } catch (error) {
    return [];
  }
}
