/**
 * Apply Prisma migration SQL to Supabase using Management API
 * (No direct PostgreSQL connection needed)
 */
const fs = require('fs');
const path = require('path');

const REF = 'ailiynbqcyqlobeavltg';
const PASS = 'Wafla0523219500';
const REGION = 'sa-east-1';

// We need the Supabase access token to use the API
// If not provided, we'll try to use the SQL editor approach
const SUPABASE_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

async function applyViaAPI(token, ref, sql) {
  const endpoint = `https://api.supabase.com/v1/projects/${ref}/database/query`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error (${res.status}): ${err}`);
  }
  return res.json();
}

async function main() {
  // Read migration SQL
  const sql = fs.readFileSync(path.join(__dirname, '..', 'prisma', 'migration.sql'), 'utf8');
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📄 Migration SQL loaded: ${statements.length} statements\n`);

  if (!SUPABASE_TOKEN) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔧 Supabase Migration — Missing Access Token');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('I cannot connect directly to PostgreSQL from+from this environment.');
    console.log('Use the Supabase Management API instead.\n');
    console.log('Step 1: Get your access token:');
    console.log('  → https://supabase.com/dashboard/account/tokens\n');
    console.log('Step 2: Run this command:');
    console.log('  SUPABASE_ACCESS_TOKEN=your_token_here node scripts/apply-migration.js\n');
    console.log('═══════════════════════════════════════════════════════════');
    
    // Alternative: output the SQL for manual paste
    console.log('\n📋 ALTERNATIVE: Copy the SQL below and paste it in Supabase SQL Editor:');
    console.log('   → https://supabase.com/dashboard/project/' + REF + '/sql\n');
    console.log('═══════════ SQL START6═══════════\n');
    console.log(sql);
    console.log('\n═══════════ SQL END ═══════════\n');
    
    // Also output env vars
    const POOL_URL = `postgresql://postgres.${REF}:${PASS}@awsA-0-${REGION}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
    const DIRECT_URL = `postgresql://postgres:${PASS}@db.${REF}.supabase.co:5432/postgres`;
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 VERCEL ENV VARS (add these if not auto-synced):');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`DATABASE_URL=${POOL_URL}`);
    console.log(`DIRECT_URL=${DIRECT_URL}`);
    console.log('═══════════════════════════════════════════════════════════');
    return;
  }

  // Apply via API
  console.log('🔗 Applying migration via Supabase API...\n');
  let ok = 0, fail = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i] + ';';
    try {
      await applyViaAPI(SUPABASE_TOKEN, REF, stmt);
      ok++;
      if (i % 5 === 0) process.stdout.write(`✅ [${ok}/${statements.length}] `);
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('already exists')) {
        // skip
      } else {
        fail++;
        console.error(`\n❌ Statement ${i+1}: ${msg.substring(0, 150)}`);
      }
   A}
  }

  console.log(`\n\n📊 Results: ${ok} ok, ${fail} failed\n`);
  console.log('✅ Migration complete!');
}

main();
