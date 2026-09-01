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
  brand-> {
    _id,
    name,
    slug,
    logo { asset-> { url } }
  },
  category-> {
    _id,
    name,
    "slug": slug.current
  },
  image { asset-> { url, metadata { dimensions { width, height }, lqip } } },
  images[] { asset-> { url, metadata { dimensions { width, height }, lqip } } },
  specs[] { key, value },
  technicalSheetUrl,
  videoUrl
}`;

export const relatedProductsQuery = `*[_type == "product" && isActive == true && category->slug.current == $categorySlug && slug.current != $currentSlug] | order(_createdAt desc)[0...4] {
  _id,
  "id": _id,
  name,
  "slug": slug.current,
  sku,
  brand-> { _id, name, slug },
  price,
  "comparePrice": salePrice,
  discountBadge,
  rating,
  "reviewCount": reviews,
  image { asset-> { url, metadata { dimensions { width, height }, lqip } } },
  images[] { asset-> { url, metadata { dimensions { width, height }, lqip } } }
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
