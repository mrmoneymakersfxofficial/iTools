export const heroBannersQuery = `*[_type == "heroSlide" && isActive == true] | order(order asc) {
  _id,
  title,
  subtitle,
  cta,
  link,
  image { asset-> { url, metadata { dimensions { width, height }, lqip } } },
  bgGradient,
  countdownEnd,
  order
}`;

export const brandPromoBannersQuery = `*[_type == "brandPromoSlide" && isActive == true] | order(order asc) {
  _id,
  brandName,
  brandSlug,
  image { asset-> { url, metadata { dimensions { width, height }, lqip } } },
  order
}`;

export const brandShowcaseSettingsQuery = `*[_type == "brandShowcaseSettings"][0] {
  brands[]->{
    _id,
    name,
    "slug": slug.current,
    showInGrid,
    logo { asset-> { url, metadata { dimensions { width, height } } } }
  }
}`;

export const brandShowcaseQuery = `*[_type == "brandShowcaseItem" && isActive == true] | order(order asc) {
  _id,
  name,
  slug,
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

export const productsQuery = `*[_type == "product" && isActive == true && (showInTrending == true || showInFeatured == true || showInToolCrib == true || showInNewArrivals == true || defined(salePrice))][0...60] | order(order asc) {
  _id,
  name,
  "slug": slug.current,
  sku,
  brand-> { _id, name, slug, logo { asset-> { url } } },
  category-> { _id, name, "slug": slug.current },
  shortDescription,
  description,
  image { asset-> { url, metadata { dimensions { width, height }, lqip } } },
  images[] { asset-> { url, metadata { dimensions { width, height }, lqip } } },
  price,
  salePrice,
  discountBadge,
  stock,
  rating,
  reviews,
  isNewArrival,
  specs[] { key, value },
  showInTrending,
  showInToolCrib,
  showInFeatured,
  showInNewArrivals,
  technicalSheetUrl,
  videoUrl
}`;

export const dealTilesQuery = `*[_type == "dealTile" && isActive == true] | order(order asc) {
  _id,
  brand,
  brandColor,
  textColor,
  title,
  subtitle,
  href,
  countdownEnd,
  discountPercentage,
  originalPrice,
  promoPrice,
  productSlug,
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

// Promo Popup - enhanced with new fields
export const promoPopupQuery = `*[_type == "promoPopup" && isActive == true][0]{
  title,
  subtitle,
  "image": image { asset-> { url, metadata { dimensions { width, height }, lqip } } },
  originalPrice,
  promoPrice,
  discountText,
  ctaText,
  ctaLink,
  countdownEnd,
  showOnEntry,
  delaySeconds
}`;

// Video Section - enhanced with TikTok/social support
export const videoSectionQuery = `*[_type == "videoSection" && isActive == true][0]{
  sectionTitle,
  sectionSubtitle,
  videoSourceType,
  ctaText,
  ctaLink,
  videos[] {
    title,
    videoUrl,
    googleDriveUrl,
    "thumbnail": thumbnail { asset-> { url, metadata { dimensions { width, height }, lqip } } },
    isVertical,
    productSlug,
    order
  }
}`;

// Header Config
export const headerConfigQuery = `*[_type == "headerConfig"][0]{
  phone,
  phoneUrl,
  location,
  badge1,
  badge2,
  announcementBar,
  showBrandLogos,
  brandLogos[] {
    name,
    slug,
    "logo": logo { asset-> { url, metadata { dimensions { width, height } } } },
    order
  }
}`;

// Footer Config
export const footerConfigQuery = `*[_type == "footerConfig"][0]{
  aboutText,
  contactInfo {
    address,
    phone,
    email,
    hours
  },
  columns[] {
    title,
    links[] {
      label,
      href
    }
  },
  socialLinks[] {
    platform,
    url
  },
  bottomLinks[] {
    label,
    href
  }
}`;

// Packout Components
export const packoutComponentsQuery = `*[_type == "packoutComponent" && isActive == true] | order(order asc){
  name,
  "slug": slug.current,
  componentType,
  "image": image { asset-> { url, metadata { dimensions { width, height }, lqip } } },
  price,
  salePrice,
  compatibleBases,
  dimensions,
  productId,
  order
}`;

// Product Reviews (for homepage display)
export const featuredReviewsQuery = `*[_type == "productReview" && isActive == true] | order(order asc)[0..5]{
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

export const homePageQuery = `{
  "homeSettings": ${homeSettingsQuery},
  "heroBanners": ${heroBannersQuery},
  "brandPromoBanners": ${brandPromoBannersQuery},
  "brandShowcase": ${brandShowcaseSettingsQuery},
  "trendingCategories": ${trendingCategoriesQuery},
  "categories": ${categoriesQuery},
  "products": ${productsQuery},
  "dealTiles": ${dealTilesQuery},
  "giveawayBanner": ${giveawayBannerQuery},
  "promoBanners": ${promoBannersQuery},
  "sectionHeaders": ${sectionHeadersQuery},
  "promoPopup": ${promoPopupQuery},
  "videoSection": ${videoSectionQuery},
  "headerConfig": ${headerConfigQuery},
  "footerConfig": ${footerConfigQuery},
  "packoutComponents": ${packoutComponentsQuery},
  "featuredReviews": ${featuredReviewsQuery}
}`;
