export const headerConfigQuery = `*[_type == "headerConfig"][0] {
  _id,
  phone,
  phoneUrl,
  location,
  badge1,
  badge2,
  announcementBar
}`;

export const footerConfigQuery = `*[_type == "footerConfig"][0] {
  _id,
  aboutText,
  contactInfo,
  columns,
  socialLinks,
  bottomLinks
}`;

export const layoutQuery = `{
  "header": ${headerConfigQuery},
  "footer": ${footerConfigQuery}
}`;
