import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/migrate
 * 
 * One-time database migration endpoint.
 * Connects to Supabase PostgreSQL and runs the Prisma migration SQL.
 * 
 * Security: Requires a secret token to prevent unauthorized access.
 * Usage: curl -X POST https://i-tools-steel.vercel.app/api/migrate -H "Authorization: Bearer <MIGRATE_SECRET>"
 * 
 * After successful migration, this endpoint can be disabled or removed.
 */

export async function POST(request: NextRequest) {
  // Security check - require a secret to prevent unauthorized migration
  const authHeader = request.headers.get("authorization");
  const migrateSecret = process.env.SANITY_REVALIDATE_SECRET || "itools2024";
  
  if (authHeader !== `Bearer ${migrateSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const directUrl = process.env.DIRECT_URL;
  if (!directUrl) {
    return NextResponse.json(
      { error: "DIRECT_URL environment variable is not set" },
      { status: 500 }
    );
  }

  try {
    // Use Prisma's migrate deploy programmatically
    const { execSync } = await import("child_process");
    
    const output = execSync("npx prisma migrate deploy", {
      cwd: process.cwd(),
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
        DIRECT_URL: process.env.DIRECT_URL,
      },
      encoding: "utf-8",
      timeout: 60000,
      stdio: "pipe",
    });

    return NextResponse.json({
      success: true,
      message: "Migration executed successfully",
      output: output,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        error: "Migration failed",
        details: message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/migrate
 * Check migration status - list existing tables
 */
export async function GET() {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    
    // Try a simple query to check if tables exist
    const result = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      status: "connected",
      tables: result,
      tableCount: Array.isArray(result) ? result.length : 0,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        status: "error",
        error: message,
      },
      { status: 500 }
    );
  }
}
