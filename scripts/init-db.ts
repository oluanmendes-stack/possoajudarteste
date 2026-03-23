#!/usr/bin/env node

/**
 * Database Initialization Script for Cloudflare D1
 * 
 * This script initializes the D1 database with the required schema and default data.
 * 
 * Usage:
 *   npx ts-node scripts/init-db.ts
 *   
 * Environment Variables:
 *   CLOUDFLARE_API_TOKEN - Your Cloudflare API token
 *   ACCOUNT_ID - Your Cloudflare Account ID
 *   DATABASE_ID - Your D1 Database ID
 */

import * as fs from 'fs';
import * as path from 'path';

const SCHEMA_FILE = path.join(__dirname, '../schema.sql');

interface D1Response {
  success: boolean;
  errors?: Array<{ message: string }>;
  result?: {
    success: boolean;
    meta?: {
      duration: number;
      served_by: string;
      internal_stats: string;
    };
  };
}

async function executeD1Query(
  databaseId: string,
  query: string,
  apiToken: string,
  accountId: string
): Promise<D1Response> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: query }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API Error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

async function initializeDatabase() {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.ACCOUNT_ID;
  const databaseId = process.env.DATABASE_ID;

  if (!apiToken || !accountId || !databaseId) {
    console.error('❌ Missing required environment variables:');
    if (!apiToken) console.error('   - CLOUDFLARE_API_TOKEN');
    if (!accountId) console.error('   - ACCOUNT_ID');
    if (!databaseId) console.error('   - DATABASE_ID');
    process.exit(1);
  }

  try {
    console.log('📚 Reading schema file...');
    const schema = fs.readFileSync(SCHEMA_FILE, 'utf-8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📊 Found ${statements.length} SQL statements`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\n[${i + 1}/${statements.length}] Executing:`, statement.substring(0, 50) + '...');

      try {
        const result = await executeD1Query(databaseId, statement, apiToken, accountId);

        if (result.success && result.result?.success) {
          console.log('✅ Success');
        } else {
          console.warn('⚠️ Warning:', result);
        }
      } catch (error) {
        console.error('❌ Error executing statement:', error);
        throw error;
      }
    }

    console.log('\n✅ Database initialization completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Deploy your Cloudflare Worker: npm run build && wrangler deploy');
    console.log('   2. Test your API endpoints');
    console.log('   3. Update your frontend API_BASE_URL if needed');

  } catch (error) {
    console.error('\n❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
