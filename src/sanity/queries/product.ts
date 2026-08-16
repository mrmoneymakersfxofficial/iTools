export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  sku,
  description,
  shortDescription,
  price,
  "comparePrice": salePrice,
  "categoryId": category->slug.current,
  "brandId": brand->slug.current,
  brand-> {
    _id,
    name,
    "slug": slug.current,
    logo
  },
  category-> {
    _id,
    "name": title,
    "slug": slug.current
  },
  rating,
  "reviewCount": reviews,
  images,
  image,
  technicalSheetUrl,
  videoUrl
}`;

export const relatedProductsQuery = `*[_type == "product" && category->slug.current == $categorySlug && slug.current != $currentSlug] | order(_createdAt desc)[0...4] {
  _id,
  "id": _id,
  name,
  "slug": slug.current,
  brand->{ name, "slug": slug.current },
  price,
  "comparePrice": salePrice,
  rating,
  "reviewCount": reviews,
  images,
  image
}`;

export const productReviewsQuery = `*[_type == "productReview" && isActive == true && productName == $productSlug] | order(order asc){
  productName,
  author,
  rating,
  title,
  comment,
  isVerified,
  source
}`;
