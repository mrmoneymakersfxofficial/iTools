import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { productSlug, author, rating, title, comment } = body;

    if (!productSlug || !author || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const writeClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
      apiVersion: "2025-01-01",
    });

    await writeClient.create({
      _type: "productReview",
      productName: productSlug,
      author,
      rating: Number(rating),
      title: title || "",
      comment: comment || "",
      isVerified: false,
      source: "website",
      isActive: true,
      order: 0,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
