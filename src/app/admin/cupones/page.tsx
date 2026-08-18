import { db } from "@/lib/db";
import { CouponManager } from "./CuponesClient";

// Force dynamic rendering — this page queries the DB and must not be prerendered at build time
export const dynamic = "force-dynamic";

export default async function CuponesPage() {
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = coupons.map((c) => ({
    id: c.id,
    code: c.code,
    type: c.type,
    value: c.value,
    minOrder: c.minOrder,
    maxUses: c.maxUses,
    usedCount: c.usedCount,
    expiresAt: c.expiresAt?.toISOString() || null,
    isActive: c.isActive,
    createdAt: c.createdAt.toISOString(),
  }));

  return <CouponManager coupons={serialized} />;
}