const { execSync } = require('child_process');
const { createClient } = require('@libsql/client');
const fs = require('fs');

const TURSO_URL = 'libsql://itools-peru-fast-page-pro.aws-us-east-1.turso.io';
const TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTIwMDA4MzIsImlkIjoiMDFhMTNiOTItOGUwMS03OTA1LWIzOTUtODI5YWIyMzI5OTZjIiwia2lkIjoiUjVpeUVVSFE2SUpEYUFGLU01YjVHMmt2WnZXX2RWZnFwandDejZoeE15YyIsInJpZCI6ImUzMDA1YzVjLTNjMzktNDU0Ni04NTQ2LTkzOWFiODNmOWRkNiJ9.DrS6PegeM4QbPEG2OzPpCFcLKdfvWLy6WREc0sWIz2-dxXGpCH7GIwJd_L6z57Fss5kt-G0nX8Hw65zToShaAw';

async function migrate() {
  console.log('Generating migration SQL from schema...');
  let schemaContent = fs.readFileSync('prisma/schema.prisma', 'utf8')
    .replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"')
    .replace(/url\s*=\s*env\("DATABASE_URL"\)/g, 'url = "file:./dev.db"')
    .replace(/directUrl\s*=\s*env\("DIRECT_URL"\)\r?\n/g, '');

  if (!schemaContent.includes('previewFeatures')) {
    schemaContent = schemaContent.replace('generator client {', 'generator client {\n  previewFeatures = ["driverAdapters"]');
  }

  console.log('Provider in temp schema:', schemaContent.match(/provider\s*=\s*"[^"]+"/g));
  fs.writeFileSync('prisma/turso-temp.prisma', schemaContent);

  const sqlScript = execSync('npx prisma migrate diff --from-empty --to-schema-datamodel prisma/turso-temp.prisma --script', { stdio: 'pipe' }).toString();
  console.log('SQL script starts with:\n', sqlScript.substring(0, 300));
  fs.unlinkSync('prisma/turso-temp.prisma');

  console.log('Connecting to Turso...');
  const client = createClient({
    url: TURSO_URL,
    authToken: TURSO_AUTH_TOKEN
  });

  console.log('Executing migration script on Turso...');
  // Strip single-line comments (-- ...) from the SQL script
  const cleanSql = sqlScript
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n');

  const statements = cleanSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (let i = 0; i < statements.length; i++) {
    let statement = statements[i];
    if (statement.trim()) {
      // Fix Prisma SQLite JSONB unquoted syntax
      statement = statement.replace(/JSONB NOT NULL DEFAULT \[\]/g, "TEXT NOT NULL DEFAULT '[]'");
      statement = statement.replace(/JSONB NOT NULL DEFAULT \{\}/g, "TEXT NOT NULL DEFAULT '{}'");
      statement = statement.replace(/JSONB DEFAULT \[\]/g, "TEXT DEFAULT '[]'");
      statement = statement.replace(/JSONB DEFAULT \{\}/g, "TEXT DEFAULT '{}'");

      // Add IF NOT EXISTS for tables and indexes
      statement = statement.replace(/^CREATE TABLE\s+/i, 'CREATE TABLE IF NOT EXISTS ');
      statement = statement.replace(/^CREATE UNIQUE INDEX\s+/i, 'CREATE UNIQUE INDEX IF NOT EXISTS ');
      statement = statement.replace(/^CREATE INDEX\s+/i, 'CREATE INDEX IF NOT EXISTS ');

      try {
        console.log(`Executing [${i + 1}/${statements.length}]: ${statement.substring(0, 50)}...`);
        await client.execute(statement);
      } catch (err) {
        if (err.message && (err.message.includes('already exists') || err.message.includes('duplicate column'))) {
          console.log(`Notice: [${i + 1}] skipped (already exists).`);
        } else {
          console.error(`Error on statement [${i + 1}]:\n${statement}\n`);
          throw err;
        }
      }
    }
  }

  console.log(`Executed ${statements.length} SQL statements successfully!`);

  // Verify created tables
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
  console.log('Tables created on Turso:', tables.rows.map(r => r.name));
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
