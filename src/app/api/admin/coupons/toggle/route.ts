import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const coupon = await db.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return NextResponse.json({ error: "Cupón no encontrado" }, { status: 404 });
    }

    await db.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling coupon:", error);
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );
  }
}