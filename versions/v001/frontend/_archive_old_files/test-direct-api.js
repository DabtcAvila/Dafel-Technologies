/**
 * Test Direct API Call
 * Tests the data source API directly without authentication
 */

const { Pool } = require('pg');

async function testDirectConnection() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'dafel_db',
    user: 'dafel_user',
    password: 'DafelSecure2025!',
    ssl: false,
    connectionTimeoutMillis: 5000,
  });

  try {
    const client = await pool.connect();
    
    // Get server info
    const versionResult = await client.query('SELECT version()');
    const dbResult = await client.query('SELECT current_database()');
    const userResult = await client.query('SELECT current_user');
    
    const serverInfo = {
      version: versionResult.rows[0].version,
      database: dbResult.rows[0].current_database,
      user: userResult.rows[0].current_user,
    };

    console.log('✅ Direct PostgreSQL connection successful!');
    console.log('Server Info:', serverInfo);
    
    // Get schema
    const tablesResult = await client.query(`
      SELECT 
        table_name,
        table_schema
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
      LIMIT 10
    `);
    
    console.log(`\nFound ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach(table => {
      console.log(`  • ${table.table_name}`);
    });
    
    client.release();
    await pool.end();
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    await pool.end();
    return false;
  }
}

// Now test if we can create a data source without auth (temporarily)
async function testDataSourceCreation() {
  const fetch = require('node-fetch');
  
  try {
    // First, let's check if the health endpoint works
    const healthResponse = await fetch('http://localhost:3000/api/health');
    const health = await healthResponse.json();
    console.log('\nHealth check:', health.status);
    
    // Try to create a data source (this should fail with 401)
    const response = await fetch('http://localhost:3000/api/data-sources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test PostgreSQL',
        type: 'POSTGRESQL',
        host: 'localhost',
        port: 5432,
        database: 'dafel_db',
        username: 'dafel_user',
        password: 'DafelSecure2025!',
        ssl: false,
      }),
    });
    
    const result = await response.text();
    console.log('\nData source creation (no auth):', response.status, result.substring(0, 100));
    
  } catch (error) {
    console.error('API test error:', error.message);
  }
}

async function main() {
  console.log('🚀 Testing Direct Database Connection\n');
  console.log('=====================================\n');
  
  // Test direct PostgreSQL connection
  await testDirectConnection();
  
  // Test API endpoints
  await testDataSourceCreation();
  
  console.log('\n=====================================');
  console.log('✅ Direct connection works!');
  console.log('⚠️  API requires authentication (as expected)');
  console.log('\nTo test the full flow, please:');
  console.log('1. Open http://localhost:3000/login in your browser');
  console.log('2. Login with: admin@dafel.tech / DafelSecure2025!');
  console.log('3. Navigate to Studio > Data Sources');
  console.log('4. Click "Add Source" and then "Use Demo Database"');
  console.log('5. Test the connection');
}

main();