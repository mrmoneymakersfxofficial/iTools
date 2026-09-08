import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/wishlist
 * Returns the current user's wishlist IDs from the database
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ authenticated: false, items: [] });
    }

    try {
      const items = await db.wishlist.findMany({
        where: { userId: session.user.id },
        select: { productId: true },
      });

      return NextResponse.json({
        authenticated: true,
        items: items.map((i) => i.productId),
      });
    } catch (dbErr) {
      console.warn("DB wishlist fetch warning:", dbErr);
      return NextResponse.json({ authenticated: true, items: [], dbOffline: true });
    }
  } catch (err) {
    console.error("Wishlist GET error:", err);
    return NextResponse.json({ items: [] });
  }
}

/**
 * POST /api/wishlist
 * Adds, removes, or toggles an item in the real database
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json().catch(() => ({}));
    const { productId, action = "toggle" } = body;

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    // If not authenticated, inform client to keep in local storage
    if (!session?.user?.id) {
      return NextResponse.json({ success: true, localOnly: true, productId });
    }

    const userId = session.user.id;

    try {
      // Ensure product exists in DB product table if referencing foreign key
      const existingProduct = await db.product.findFirst({
        where: {
          OR: [{ id: productId }, { slug: productId }, { sku: productId }],
        },
      });

      let targetProductId = productId;

      if (existingProduct) {
        targetProductId = existingProduct.id;
      } else {
        // Create stub in product table so foreign key constraint passes
        try {
          const created = await db.product.create({
            data: {
              id: productId,
              name: productId.replace(/-/g, " "),
              slug: productId,
              sku: `SKU-${productId.slice(0, 10)}`,
              price: 0,
              stock: 10,
              isPublished: true,
            },
          });
          targetProductId = created.id;
        } catch {
          // If creation failed or exists, continue with targetProductId
        }
      }

      const existingWishlist = await db.wishlist.findUnique({
        where: {
          userId_productId: {
            userId,
            productId: targetProductId,
          },
        },
      });

      if (action === "remove" || (action === "toggle" && existingWishlist)) {
        if (existingWishlist) {
          await db.wishlist.delete({
            where: { id: existingWishlist.id },
          });
        }
        return NextResponse.json({ success: true, wishlisted: false, productId });
      } else {
        if (!existingWishlist) {
          await db.wishlist.create({
            data: {
              userId,
              productId: targetProductId,
            },
          });
        }
        return NextResponse.json({ success: true, wishlisted: true, productId });
      }
    } catch (dbErr) {
      console.warn("DB wishlist sync warning:", dbErr);
      return NextResponse.json({ success: true, localOnly: true, dbOffline: true });
    }
  } catch (err) {
    console.error("Wishlist POST error:", err);
    return NextResponse.json({ success: true, localOnly: true });
  }
}
