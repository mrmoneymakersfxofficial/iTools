/**
 * Script to apply Prisma migration to Supabase using the Management API.
 * 
 * Usage:
 *   node scripts/migrate-supabase.js
 * 
 * Required env vars:
 *   SUPABASE_ACCESS_TOKEN - Personal access token from https://supabase.com/dashboard/account/tokens
 *   SUPABASE_PROJECT_REF - Project reference ID (found in project settings)
 *   SUPABASE_DB_PASSWORD - Database password
 * 
 * This script:
 *   1. Reads the SQL migration from prisma/migration.sql
 *   2. Executes it via Supabase REST API
 *   3. Outputs the DATABASE_URL and DIRECT_URL for Vercel
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF;
const SUPABASE_DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

if (!SUPABASE_ACCESS_TOKEN || !SUPABASE_PROJECT_REF || !SUPABASE_DB_PASSWORD) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_ACCESS_TOKEN - Get from https://supabase.com/dashboard/account/tokens');
  console.error('   SUPABASE_PROJECT_REF - Found in Project Settings → General');
  console.error('   SUPABASE_DB_PASSWORD - Your database password');
  console.error('\nUsage: SUPABASE_ACCESS_TOKEN=xxx SUPABASE_PROJECT_REF=xxx SUPABASE_DB_PASSWORD=xxx node scripts/migrate-supabase.js');
  process.exit(1);
}

const API_BASE = `https://api.supabase.com/v1`;

async function supabaseAPI(endpoint, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);
  
  const res = await fetch(`${API_BASE}${endpoint}`, opts);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase API error (${res.status}): ${err}`);
  }
  return res.json();
}

async function runSQL(sql) {
  // Use the query endpoint to execute SQL
  const res = await fetch(`${API_BASE}/projects/${SUPABASE_PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`SQL execution error (${res.status}): ${err}`);
  }
  return res.json();
}

async function main() {
  console.log('🚀 Starting Supabase migration...\n');

  // 1. Read migration SQL
  const sqlPath = path.join(__dirname, '..', 'prisma', 'migration.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log(`📄 Read migration SQL (${sql.length} chars)\n`);

  // 2. Split into individual statements and execute
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📊 Executing ${statements.length} SQL statements...\n`);

  let success = 0;
  let errors = 0;

  for (const stmt of statements) {
    try {
      await runSQL(stmt + ';');
      success++;
      process.stdout.write('✅');
    } catch (err) {
      errors++;
      const preview = stmt.substring(0, 60).replace(/\n/g, ' ');
      console.error(`\n❌ Error on: ${preview}...`);
      console.error(`   ${err.message}`);
    }
  }

  console.log(`\n\n📊 Results: ${success} succeeded, ${errors} failed\n`);

  // 3. Output connection strings for Vercel
  console.log('═══════════════════════════════════════════════════');
  console.log('🔗 Add these environment variables to Vercel:\n');
  console.log(`DATABASE_URL=postgresql://postgres.${SUPABASE_PROJECT_REF}:${SUPABASE_DB_PASSWORD}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true`);
  console.log(`\nDIRECT_URL=postgresql://postgres.${SUPABASE_PROJECT_REF}:${SUPABASE_DB_PASSWORD}@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`);
  console.log('\n═══════════════════════════════════════════════════');

  // 4. Try to get the actual region
  try {
    const project = await supabaseAPI(`/projects/${SUPABASE_PROJECT_REF}`);
    const region = project.region || 'sa-east-1';
    console.log(`\n🌍 Project region detected: ${region}`);
    console.log(`\nUpdated URLs with correct region:`);
    console.log(`DATABASE_URL=postgresql://postgres.${SUPABASE_PROJECT_REF}:${SUPABASE_DB_PASSWORD}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`);
    console.log(`DIRECT_URL=postgresql://postgres.${SUPABASE_PROJECT_REF}:${SUPABASE_DB_PASSWORD}@aws-0-${region}.pooler.supabase.com:5432/postgres`);
  } catch (e) {
    // Non-critical, skip
  }

  console.log('\n✅ Done! Now set these env vars in Vercel and redeploy.');
}

main().catch(console.error);
