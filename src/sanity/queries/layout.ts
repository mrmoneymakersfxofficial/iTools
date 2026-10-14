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

export const footerConfigQuery = `*[_type == "footerConfig" && _id in ["footerConfig", "drafts.footerConfig", "footer-config", "drafts.footer-config"]] | order(_updatedAt desc)[0] {
  _id,
  aboutText,
  companyAddress,
  companyPhone,
  companyEmail,
  workingHours,
  contactInfo,
  columns,
  socialLinks,
  bottomLinks,
  trustFeatures,
  socialBarTitle,
  paymentMethodsTitle,
  secureStoreTitle
}`;

export const uiConfigQuery = `*[_type == "uiConfig"][0] {
  "aiAssistantIconUrl": aiAssistantIcon.asset->url,
  aiAssistantTitle,
  aiAssistantWelcome,
  addToCartText,
  viewDetailsText,
  outOfStockText,
  searchPlaceholder,
  shippingBadgeText,
  securePaymentText,
  warrantyText,
  returnsText,
  marqueeBtn1Text,
  marqueeBtn1Link,
  marqueeBtn2Text,
  marqueeBtn2Link,
  marqueeBtn3Text,
  marqueeBtn3Link,
  marqueeBtn4Text,
  marqueeBtn4Link,
  marqueeBtn5Text,
  marqueeBtn5Link,
  marqueeBtn6Text,
  marqueeBtn6Link,
  marqueeBtn7Text,
  marqueeBtn7Link
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
