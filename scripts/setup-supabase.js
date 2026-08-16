/**
 * Quick setup script for Supabase + Vercel
 * 
 * This script:
 * 1. Creates a Supabase project via API (if SUPABASE_ACCESS_TOKEN is set)
 * 2. Applies the Prisma migration SQL
 * 3. Outputs all env vars needed for Vercel
 * 
 * OR: If you already have a Supabase project, just provide:
 *   SUPABASE_PROJECT_REF and SUPABASE_DB_PASSWORD
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ───
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF;
const SUPABASE_DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD || 'itools-db-2024';

const API_BASE = 'https://api.supabase.com/v1';

async function api(endpoint, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${endpoint}`, opts);
  const data = await res.text();
  if (!res.ok) throw new Error(`API ${res.status}: ${data}`);
  try { return JSON.parse(data); } catch { return data; }
}

async function runSQL(ref, sql) {
  const res = await fetch(`${API_BASE}/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`SQL error (${res.status}): ${err}`);
  }
  return res.json();
}

async function createProject() {
  console.log('📦 Creating Supabase project "iTools-DB"...\n');
  const project = await api('/projects', 'POST', {
    name: 'itools-db',
    db_password: SUPABASE_DB_PASSWORD,
    region: 'sa-east-1',
    plan: 'free',
  });
  console.log(`✅ Project created!`);
  console.log(`   Ref: ${project.id}`);
  console.log(`   Region: ${project.region}`);
  console.log(`   Status: ${project.status}\n`);
  return project;
}

async function waitForProject(ref) {
  console.log('⏳ Waiting for project to be ready...');
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 5000));
    try {
      const p = await api(`/projects/${ref}`);
      if (p.status === 'ACTIVE_HEALTHY') {
        console.log('✅ Project is ready!\n');
        return p;
      }
      process.stdout.write('.');
    } catch { process.stdout.write('.'); }
  }
  throw new Error('Project did not become ready in time');
}

async function applyMigration(ref) {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'prisma', 'migration.sql'), 'utf8');
  console.log(`📄 Applying migration SQL (${sql.length} chars)...\n`);
  
  // Execute in batches (Supabase API has limits)
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0 && !s.startsWith('--'));
  
  let ok = 0, fail = 0;
  for (const stmt of statements) {
    try {
      await runSQL(ref, stmt + ';');
      ok++;
      process.stdout.write('✅');
    } catch (e) {
      fail++;
      // Ignore "already exists" errors
      if (!e.message.includes('already exists')) {
        console.error(`\n❌ ${stmt.substring(0, 50)}... → ${e.message}`);
      }
    }
  }
  console.log(`\n\n📊 Migration: ${ok} ok, ${fail} failed\n`);
}

async function main() {
  if (!SUPABASE_ACCESS_TOKEN) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔧 iTools — Supabase + Vercel Setup');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('You need a Supabase Access Token to proceed.\n');
    console.log('1️⃣  Go to: https://supabase.com/dashboard/account/tokens');
    console.log('2️⃣  Generate a new token');
    console.log('3️⃣  Run this script with:\n');
    console.log('   SUPABASE_ACCESS_TOKEN=your_token node scripts/setup-supabase.js\n');
    console.log('OR if you already have a project:\n');
    console.log('   SUPABASE_ACCESS_TOKEN=xxx SUPABASE_PROJECT_REF=xxx SUPABASE_DB_PASSWORD=xxx node scripts/setup-supabase.js\n');
    console.log('═══════════════════════════════════════════════════════════');
    process.exit(0);
  }

  let ref = SUPABASE_PROJECT_REF;
  let region = 'sa-east-1';

  // Create project if no ref provided
  if (!ref) {
    const project = await createProject();
    ref = project.id;
    region = project.region;
    await waitForProject(ref);
  } else {
    // Get existing project info
    try {
      const project = await api(`/projects/${ref}`);
      region = project.region || region;
      console.log(`📦 Using existing project: ${project.name} (${ref}) in ${region}\n`);
    } catch (e) {
      console.log(`📦 Using project ref: ${ref}\n`);
    }
  }

  // Apply migration
  await applyMigration(ref);

  // Seed: create admin user
  console.log('👤 Creating admin user...');
  try {
    await runSQL(ref, `
      INSERT INTO "User" (id, name, email, "passwordHash", role, "createdAt", "updatedAt")
      VALUES ('admin-001', 'Admin iTools', 'admin@itools.pe', '', 'ADMIN', NOW(), NOW())
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('✅ Admin user created (admin@itools.pe)\n');
  } catch (e) {
    console.log('⚠️  Could not create admin user (may already exist)\n');
  }

  // Output Vercel env vars
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🚀 VERCEL ENVIRONMENT VARIABLES');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const envVars = {
    DATABASE_URL: `postgresql://postgres.${ref}:${SUPABASE_DB_PASSWORD}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`,
    DIRECT_URL: `postgresql://postgres.${ref}:${SUPABASE_DB_PASSWORD}@aws-0-${region}.pooler.supabase.com:5432/postgres`,
    NEXT_PUBLIC_SANITY_PROJECT_ID: 'kytfgk41',
    NEXT_PUBLIC_SANITY_DATASET: 'production',
    SANITY_REVALIDATE_SECRET: 'itools2024',
    NEXTAUTH_SECRET: 'itools-nextauth-secret-prod-' + Date.now(),
    NEXTAUTH_URL: 'https://i-tools-steel.vercel.app',
  };

  for (const [key, value] of Object.entries(envVars)) {
    console.log(`${key}=${value}`);
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📋 NEXT STEPS:\n');
  console.log('1. Go to Vercel → Project Settings → Environment Variables');
  console.log('2. Add ALL the variables above');
  console.log('3. Redeploy (push to GitHub or manually trigger)');
  console.log('4. Visit /api/seed to populate Sanity with sample data');
  console.log('5. Visit /cms to manage content with Stega visual editing');
  console.log('\n═══════════════════════════════════════════════════════════');
}

main().catch(console.error);
