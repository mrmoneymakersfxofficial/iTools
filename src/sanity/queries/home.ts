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
  slug,
  logo { asset-> { url, metadata { dimensions { width, height } } } },
  order
}`;

export const trendingCategoriesQuery = `*[_type == "trendingCategory" && isActive == true] | order(order asc) {
  _id,
  name,
  slug,
  viewCount,
  iconType,
  order
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
  "heroBanners": ${heroBannersQuery},
  "brandPromoBanners": ${brandPromoBannersQuery},
  "brandShowcase": ${brandShowcaseQuery},
  "trendingCategories": ${trendingCategoriesQuery},
  "giveawayBanner": ${giveawayBannerQuery},
  "promoBanners": ${promoBannersQuery},
  "sectionHeaders": ${sectionHeadersQuery},
}`;