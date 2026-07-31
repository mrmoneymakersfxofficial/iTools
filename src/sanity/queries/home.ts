export const heroBannersQuery = `*[_type == "heroSlide" && isActive == true] | order(order asc) {
  _id,
  title,
  subtitle,
  cta,
  link,
  image { asset-> { url, metadata { dimensions { width, height }, lqip } } },
  bgGradient,
  order
}`;

export const brandPromoBannersQuery = `*[_type == "brandPromoSlide" && isActive == true] | order(order asc) {
  _id,
  brandName,
  brandSlug,
  image { asset-> { url, metadata { dimensions { width, height }, lqip } } },
  order
}`;

export const brandShowcaseQuery = `*[_type == "brandShowcaseItem" && isActive == true] | order(order asc) {
  _id,
  name,
  "slug": slug.current,
  showInGrid,
  logo { asset-> { url, metadata { dimensions { width, height } } } },
  order
}`;

export const trendingCategoriesQuery = `*[_type == "trendingCategory" && isActive == true] | order(order asc) {
  _id,
  name,
  "slug": slug.current,
  viewCount,
  iconType,
  order
}`;

export const categoriesQuery = `*[_type == "category" && isActive == true] | order(order asc) {
  _id,
  name,
  "slug": slug.current,
  viewCount,
  iconName,
  color,
  showInSidebar,
  showInGrid,
  order
}`;

export const productsQuery = `*[_type == "product" && isActive == true] | order(order asc) {
  _id,
  name,
  "slug": slug.current,
  brand,
  price,
  salePrice,
  discountBadge,
  rating,
  reviews,
  showInTrending,
  showInToolCrib,
  showInFeatured,
  showInNewArrivals,
  images,
  image
}`;

export const dealTilesQuery = `*[_type == "dealTile" && isActive == true] | order(order asc) {
  _id,
  brand,
  brandColor,
  textColor,
  title,
  subtitle,
  href,
  image { asset-> { url, metadata { dimensions { width, height }, lqip } } }
}`;

export const homeSettingsQuery = `*[_type == "homeSettings"][0] {
  _id,
  toolCribTitle,
  toolCribLink,
  exploreProductsTitle,
  exploreProductsSubtitle
}`;

export const giveawayBannerQuery = `*[_type == "giveawayBanner" && isActive == true][0] {
  _id,
  heading,
  preTitle,
  prize,
  ctaText,
  ctaLink,
  smsText,
  smsKeyword,
  smsNumber,
  finePrint,
  bgGradient
}`;

export const promoBannersQuery = `*[_type == "promoBanner" && isActive == true] | order(order asc) {
  _id,
  title,
  headline,
  description,
  ctaText,
  link,
  bgGradient,
  order
}`;

export const sectionHeadersQuery = `*[_type == "sectionHeader"] {
  _id,
  sectionId,
  title,
  subtitle,
  ctaText,
  ctaLink
}`;

export const homePageQuery = `{
  "homeSettings": ${homeSettingsQuery},
  "heroBanners": ${heroBannersQuery},
  "brandPromoBanners": ${brandPromoBannersQuery},
  "brandShowcase": ${brandShowcaseQuery},
  "trendingCategories": ${trendingCategoriesQuery},
  "categories": ${categoriesQuery},
  "products": ${productsQuery},
  "dealTiles": ${dealTilesQuery},
  "giveawayBanner": ${giveawayBannerQuery},
  "promoBanners": ${promoBannersQuery},
  "sectionHeaders": ${sectionHeadersQuery}
}`;