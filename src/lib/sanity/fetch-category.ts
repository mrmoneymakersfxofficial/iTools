import { sanityFetch } from "@/sanity/lib/sanityFetch";

export const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0] {
  _id,
  "id": _id,
  name,
  "slug": slug.current,
  iconName,
  color,
  description,
  productsLimit,
  bannerTitle,
  bannerSubtitle,
  bannerLink,
  bannerImage { asset-> { url, metadata { dimensions { width, height }, lqip } } }
}`;

export const productsByCategorySlugQuery = `*[_type == "product" && (category->slug.current == $slug || name match $keyword) && isActive == true][0...$limit] | order(stock desc, _createdAt desc) {
  _id,
  "id": _id,
  name,
  "slug": slug.current,
  sku,
  brand->{ name, "slug": slug.current },
  price,
  salePrice,
  discountBadge,
  stock,
  rating,
  reviews,
  "reviewCount": reviews,
  image,
  images
}`;

export async function fetchCategoryBySlug(slug: string) {
  try {
    return await sanityFetch({ query: categoryBySlugQuery, params: { slug } });
  } catch (error) {
    return null;
  }
}

export async function fetchProductsByCategorySlug(slug: string, limit: number = 24) {
  try {
    const rootWord = slug.split("-")[0].replace(/s$/, "");
    const keyword = `*${rootWord}*`;
    const numLimit = Number(limit) > 0 ? Number(limit) : 24;
    return await sanityFetch({ query: productsByCategorySlugQuery, params: { slug, keyword, limit: numLimit } });
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
