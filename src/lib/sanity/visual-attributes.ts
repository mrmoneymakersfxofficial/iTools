import { createDataAttribute } from "@sanity/visual-editing";

/**
 * Returns the data-sanity attribute object so Sanity Visual Editing overlay
 * ("Open in Studio") automatically binds to the element in Presentation Tool.
 */
export function getSanityAttr(id?: string, type?: string, path: string = "image"): { "data-sanity"?: string } {
  if (!id || !type) return {};
  try {
    const attr = createDataAttribute({
      id,
      type,
      path,
      baseUrl: "/cms",
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "kytfgk41",
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    });
    return { "data-sanity": attr.toString() };
  } catch {
    return { "data-sanity": `id=${id};type=${type};path=${path};base=%2Fcms` };
  }
}
