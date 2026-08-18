import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import fs from "fs";
import path from "path";

/**
 * POST /api/migrate
 *
 * Database migration endpoint using pg directly (Vercel-compatible).
 * Reads the Prisma migration SQL and applies it using the pg client.
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

  const pool = new Pool({
    connectionString: directUrl,
    ssl: { rejectUnauthorized: false },
    max: 1,
  });

  try {
    // Check if _prisma_migrations table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = '_prisma_migrations'
      )
    `);

    const migrationsTableExists = tableCheck.rows[0].exists;

    if (!migrationsTableExists) {
      // Create the _prisma_migrations table (Prisma's internal tracking)
      await pool.query(`
        CREATE TABLE "_prisma_migrations" (
          "id" TEXT NOT NULL,
          "checksum" TEXT NOT NULL,
          "finished_at" TIMESTAMP(3),
          "migration_name" TEXT NOT NULL,
          "logs" TEXT,
          "rolled_back_at" TIMESTAMP(3),
          "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
          CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
        )
      `);
    }

    // Check if the init migration has already been applied
    const migrationCheck = await pool.query(`
      SELECT COUNT(*) as count FROM "_prisma_migrations"
      WHERE "migration_name" = '20260815_init' AND "finished_at" IS NOT NULL
    `);

    const alreadyApplied = parseInt(migrationCheck.rows[0].count) > 0;

    if (alreadyApplied) {
      await pool.end();
      return NextResponse.json({
        success: true,
        message: "Migration already applied, nothing to do",
        migration: "20260815_init",
        status: "already_applied",
      });
    }

    // Read and execute the migration SQL
    const migrationSqlPath = path.join(
      process.cwd(),
      "prisma",
      "migrations",
      "20260815_init",
      "migration.sql"
    );

    if (!fs.existsSync(migrationSqlPath)) {
      await pool.end();
      return NextResponse.json(
        { error: "Migration SQL file not found", path: migrationSqlPath },
        { status: 500 }
      );
    }

    const migrationSql = fs.readFileSync(migrationSqlPath, "utf-8");

    // Execute the migration in a transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Record migration start
      const migrationId = `mig_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await client.query(
        `INSERT INTO "_prisma_migrations" ("id", "checksum", "migration_name", "started_at", "applied_steps_count")
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 1)`,
        [migrationId, "init-checksum", "20260815_init"]
      );

      // Apply the migration SQL
      await client.query(migrationSql);

      // Mark migration as finished
      await client.query(
        `UPDATE "_prisma_migrations" SET "finished_at" = CURRENT_TIMESTAMP WHERE "id" = $1`,
        [migrationId]
      );

      await client.query("COMMIT");
    } catch (txError) {
      await client.query("ROLLBACK");
      throw txError;
    } finally {
      client.release();
    }

    await pool.end();

    return NextResponse.json({
      success: true,
      message: "Migration applied successfully using pg client",
      migration: "20260815_init",
      status: "applied",
    });
  } catch (error: unknown) {
    await pool.end().catch(() => {});
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
  const directUrl = process.env.DIRECT_URL;
  if (!directUrl) {
    return NextResponse.json(
      { status: "error", error: "DIRECT_URL environment variable is not set" },
      { status: 500 }
    );
  }

  const pool = new Pool({
    connectionString: directUrl,
    ssl: { rejectUnauthorized: false },
    max: 1,
  });

  try {
    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    // Check _prisma_migrations status
    const migrationResult = await pool.query(`
      SELECT "migration_name", "finished_at", "started_at"
      FROM "_prisma_migrations"
      ORDER BY "started_at" DESC
    `).catch(() => ({ rows: [] }));

    await pool.end();

    return NextResponse.json({
      status: "connected",
      tables: result.rows.map((r: { table_name: string }) => r.table_name),
      tableCount: result.rows.length,
      migrations: migrationResult.rows,
    });
  } catch (error: unknown) {
    await pool.end().catch(() => {});
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
