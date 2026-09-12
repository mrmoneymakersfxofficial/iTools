export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  sku,
  shortDescription,
  description,
  price,
  salePrice,
  discountBadge,
  stock,
  rating,
  "reviewCount": reviews,
  isNewArrival,
  brandLogo { asset-> { url } },
  brand-> {
    _id,
    name,
    "slug": coalesce(slug.current, slug),
    logo { asset-> { url } }
  },
  category-> {
    _id,
    name,
    "slug": slug.current
  },
  image { asset-> { _id, url, metadata { dimensions { width, height }, lqip } } },
  images[] { asset-> { _id, url, metadata { dimensions { width, height }, lqip } } },
  specs[] { key, value },
  features,
  includes,
  recommendations,
  warranty,
  technicalSheetUrl,
  videoUrl
}`;

export const relatedProductsQuery = `*[_type == "product" && isActive == true && category->slug.current == $categorySlug && slug.current != $currentSlug] | order(_createdAt desc)[0...12] {
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
  image { asset-> { _id, url, metadata { dimensions { width, height }, lqip } } },
  images[] { asset-> { _id, url, metadata { dimensions { width, height }, lqip } } }
}`;

export const productReviewsQuery = `*[_type == "productReview" && isActive == true && productName == $productSlug] | order(order asc){
  productName,
  author,
  "authorAvatar": authorAvatar { asset-> { url } },
  rating,
  title,
  comment,
  isVerified,
  isLocalGuide,
  reviewCount,
  datePublished,
  source
}`;
