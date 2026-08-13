export const allPackoutComponentsQuery = `*[_type == "packoutComponent" && isActive == true] | order(order asc){
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

export const packoutBasesQuery = `*[_type == "packoutComponent" && isActive == true && componentType == "base"] | order(order asc){
  name,
  "slug": slug.current,
  componentType,
  "image": image { asset-> { url, metadata { dimensions { width, height }, lqip } } },
  price,
  salePrice,
  dimensions,
  productId,
  order
}`;

export const packoutStackablesQuery = `*[_type == "packoutComponent" && isActive == true && componentType == "stackable"] | order(order asc){
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
