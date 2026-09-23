import { NextResponse } from "next/server";
import { client } from "@/sanity/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const sanitized = q.replace(/[*"'\\]/g, "");
    const wildcard = `*${sanitized}*`;

    const groqQuery = `*[_type == "product" && (
      sku match $wildcard || 
      name match $wildcard || 
      brand->name match $wildcard || 
      category->name match $wildcard ||
      shortDescription match $wildcard
    )][0...12] {
      _id,
      name,
      "slug": slug.current,
      sku,
      price,
      salePrice,
      comparePrice,
      "brand": brand->name,
      image {
        asset-> {
          url
        }
      }
    }`;

    let results = await client.fetch(groqQuery, { wildcard });

    // Fallback si no hay resultados directos (ej: ADK2101 -> AKD2101 o por código numérico)
    if ((!results || results.length === 0) && sanitized.length >= 3) {
      const candidates: string[] = [];
      if (/adk/i.test(sanitized)) {
        candidates.push(`*${sanitized.replace(/adk/gi, "AKD")}*`);
      }
      const numberMatch = sanitized.match(/\d{3,}/);
      if (numberMatch) {
        candidates.push(`*${numberMatch[0]}*`);
      }
      for (const cand of candidates) {
        const fallbackRes = await client.fetch(groqQuery, { wildcard: cand });
        if (fallbackRes && fallbackRes.length > 0) {
          results = fallbackRes;
          break;
        }
      }
    }

    return NextResponse.json({
      results: (results || []).map((p: any) => {
        const hasExplicitCompare = Boolean(p.comparePrice && p.comparePrice > (p.price || 0));
        const price = hasExplicitCompare
          ? (p.price || 0)
          : (p.salePrice && p.salePrice < (p.price || 0) ? p.salePrice : (p.price || 0));
        const comparePrice = hasExplicitCompare
          ? p.comparePrice
          : (p.salePrice && p.salePrice < (p.price || 0) ? p.price : null);

        return {
          id: p._id,
          name: p.name,
          slug: p.slug,
          sku: p.sku || "",
          price,
          comparePrice,
          brand: p.brand ? { name: p.brand } : undefined,
          image: p.image?.asset?.url || null,
        };
      }),
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
  }
}
