import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Faltan parámetros" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Estado no válido" },
        { status: 400 }
      );
    }

    await db.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );
  }
}