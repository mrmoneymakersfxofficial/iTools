import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/sanity/client.server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    
    if (!query || query.length < 3) {
      return NextResponse.json({ products: [] });
    }

    // Tokenize the query into words, filter out short/common stop words
    const stopWords = ["el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "para", "por", "con", "cual", "es", "que"];
    const tokens = query.toLowerCase()
      .replace(/[^\w\sñáéíóú]/gi, "") // remove punctuation
      .split(/\s+/)
      .filter(t => t.length > 2 && !stopWords.includes(t));
      
    if (tokens.length === 0) {
      return NextResponse.json({ products: [] });
    }

    // Build dynamic GROQ match string: (name match "*word1*" && name match "*word2*")
    const nameMatchConditions = tokens.map((token, i) => `name match $token${i}`).join(" && ");
    const skuMatchConditions = tokens.map((token, i) => `sku match $token${i}`).join(" && ");
    
    const groqQuery = `*[_type == "product" && isActive == true && ((${nameMatchConditions}) || (${skuMatchConditions}))][0...5] {
      _id,
      name,
      "slug": slug.current,
      sku,
      price,
      salePrice,
      stock,
      "image": image.asset->url
    }`;

    // Prepare params dynamically
    const params: Record<string, string> = {};
    tokens.forEach((token, i) => {
      params[`token${i}`] = `*${token}*`;
    });

    const products = await serverClient.fetch(groqQuery, params);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("[Catalog AI] Error fetching products", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
