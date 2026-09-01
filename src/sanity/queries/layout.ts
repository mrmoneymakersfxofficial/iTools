export const headerConfigQuery = `*[_type == "headerConfig"][0] {
  _id,
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

export const footerConfigQuery = `*[_type == "footerConfig"][0] {
  _id,
  aboutText,
  contactInfo,
  columns,
  socialLinks,
  bottomLinks
}`;

export const uiConfigQuery = `*[_type == "uiConfig"][0] {
  addToCartText,
  viewDetailsText,
  outOfStockText,
  searchPlaceholder,
  shippingBadgeText,
  securePaymentText,
  warrantyText,
  returnsText
}`;

export const categoriesQuery = `*[_type == "category" && isActive == true] | order(order asc) {
  _id,
  name,
  "slug": slug.current,
  iconName,
  "parentId": parent->_id,
  "id": _id
}`;

export const layoutQuery = `{
  "header": ${headerConfigQuery},
  "footer": ${footerConfigQuery},
  "uiConfig": ${uiConfigQuery},
  "categories": ${categoriesQuery}
}`;
