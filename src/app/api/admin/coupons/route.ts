import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { id, code, type, value, minOrder, maxUses, expiresAt } = body;

    // Check for duplicate code (when creating new)
    const existing = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un cupón con ese código" },
        { status: 400 }
      );
    }

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase(),
        type: type || "PERCENTAGE",
        value: parseFloat(value) || 0,
        minOrder: minOrder ? parseFloat(minOrder) : null,
        maxUses: maxUses ? parseInt(maxUses, 10) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({
      success: true,
      coupon: {
        ...coupon,
        createdAt: coupon.createdAt.toISOString(),
        expiresAt: coupon.expiresAt?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const body = await req.json();
    const { code, type, value, minOrder, maxUses, expiresAt } = body;

    // Check duplicate code (exclude current)
    if (code) {
      const existing = await db.coupon.findFirst({
        where: {
          code: code.toUpperCase(),
          NOT: { id },
        },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Ya existe un cupón con ese código" },
          { status: 400 }
        );
      }
    }

    const coupon = await db.coupon.update({
      where: { id },
      data: {
        ...(code ? { code: code.toUpperCase() } : {}),
        ...(type ? { type } : {}),
        ...(value !== undefined ? { value: parseFloat(value) } : {}),
        ...(minOrder !== undefined
          ? { minOrder: minOrder ? parseFloat(minOrder) : null }
          : {}),
        ...(maxUses !== undefined
          ? { maxUses: maxUses ? parseInt(maxUses, 10) : null }
          : {}),
        ...(expiresAt !== undefined
          ? { expiresAt: expiresAt ? new Date(expiresAt) : null }
          : {}),
      },
    });

    return NextResponse.json({
      success: true,
      coupon: {
        ...coupon,
        createdAt: coupon.createdAt.toISOString(),
        expiresAt: coupon.expiresAt?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    await db.coupon.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );
  }
}