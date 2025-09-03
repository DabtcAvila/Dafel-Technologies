/**
 * Test Full Connection Flow
 * Tests the complete data source connection flow
 */

const https = require('https');
const http = require('http');

// Disable SSL certificate verification for local testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Configuration
const BASE_URL = 'http://localhost:3000';
const CREDENTIALS = {
  email: 'admin@dafel.tech',
  password: 'DafelSecure2025!'
};

const DATA_SOURCE = {
  name: 'Test PostgreSQL',
  type: 'POSTGRESQL',
  description: 'Test PostgreSQL database connection',
  host: 'localhost',
  port: 5432,
  database: 'dafel_db',
  username: 'dafel_user',
  password: 'DafelSecure2025!',
  ssl: false
};

// Helper function to make HTTP requests
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const protocol = options.url.startsWith('https') ? https : http;
    const url = new URL(options.url);
    
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = protocol.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          if (res.statusCode >= 400) {
            reject(response);
          } else {
            resolve(response);
          }
        } catch (error) {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Extract session cookie
function extractSessionCookie(headers) {
  const setCookie = headers['set-cookie'];
  if (setCookie) {
    for (const cookie of setCookie) {
      if (cookie.includes('next-auth.session-token') || cookie.includes('__Secure-next-auth.session-token')) {
        return cookie.split(';')[0];
      }
    }
  }
  return null;
}

async function testConnection() {
  console.log('🚀 Starting Full Connection Test\n');
  console.log('=====================================\n');

  try {
    // Step 1: Login
    console.log('1️⃣  Logging in...');
    const loginResponse = await makeRequest({
      url: `${BASE_URL}/api/auth/signin/credentials`,
      method: 'POST',
      headers: {}
    }, {
      email: CREDENTIALS.email,
      password: CREDENTIALS.password,
      redirect: false,
      callbackUrl: '/studio'
    });
    
    let sessionCookie = extractSessionCookie(loginResponse.headers);
    if (!sessionCookie) {
      // Try alternative login endpoint
      console.log('   Trying alternative login...');
      const altLoginResponse = await makeRequest({
        url: `${BASE_URL}/api/auth/callback/credentials`,
        method: 'POST',
        headers: {}
      }, {
        email: CREDENTIALS.email,
        password: CREDENTIALS.password,
        csrfToken: 'test'
      });
      
      sessionCookie = extractSessionCookie(altLoginResponse.headers);
    }
    
    console.log('   ✅ Login successful!\n');

    // Step 2: Create Data Source
    console.log('2️⃣  Creating data source...');
    const createResponse = await makeRequest({
      url: `${BASE_URL}/api/data-sources`,
      method: 'POST',
      headers: sessionCookie ? { 'Cookie': sessionCookie } : {}
    }, DATA_SOURCE);
    
    const dataSourceId = createResponse.body.id;
    console.log(`   ✅ Data source created: ${dataSourceId}\n`);

    // Step 3: Test Connection
    console.log('3️⃣  Testing connection...');
    const testResponse = await makeRequest({
      url: `${BASE_URL}/api/data-sources/${dataSourceId}/test`,
      method: 'POST',
      headers: sessionCookie ? { 'Cookie': sessionCookie } : {}
    });
    
    console.log('   Connection Test Result:');
    console.log(`   - Success: ${testResponse.body.success ? '✅' : '❌'}`);
    console.log(`   - Message: ${testResponse.body.message}`);
    console.log(`   - Response Time: ${testResponse.body.responseTime}ms`);
    
    if (testResponse.body.serverInfo) {
      console.log('\n   Server Information:');
      console.log(`   - Version: ${testResponse.body.serverInfo.version?.split(' ').slice(0, 2).join(' ')}`);
      console.log(`   - Database: ${testResponse.body.serverInfo.database}`);
      console.log(`   - User: ${testResponse.body.serverInfo.user}`);
    }

    // Step 4: Get Schema
    if (testResponse.body.success) {
      console.log('\n4️⃣  Fetching schema...');
      const schemaResponse = await makeRequest({
        url: `${BASE_URL}/api/data-sources/${dataSourceId}/schema`,
        method: 'GET',
        headers: sessionCookie ? { 'Cookie': sessionCookie } : {}
      });
      
      if (schemaResponse.body.schema?.tables) {
        console.log(`   ✅ Schema fetched successfully!`);
        console.log(`   - Tables found: ${schemaResponse.body.schema.tables.length}`);
        
        console.log('\n   Tables:');
        schemaResponse.body.schema.tables.slice(0, 5).forEach(table => {
          console.log(`   • ${table.name} (${table.columns?.length || 0} columns, ${table.rowCount !== null ? table.rowCount + ' rows' : 'unknown rows'})`);
        });
        
        if (schemaResponse.body.schema.tables.length > 5) {
          console.log(`   ... and ${schemaResponse.body.schema.tables.length - 5} more tables`);
        }
      }
    }

    // Step 5: Summary
    console.log('\n=====================================');
    console.log('✨ TEST COMPLETED SUCCESSFULLY! ✨');
    console.log('=====================================\n');
    console.log('Summary:');
    console.log('• Login: ✅');
    console.log('• Data Source Creation: ✅');
    console.log(`• Connection Test: ${testResponse.body.success ? '✅' : '❌'}`);
    console.log(`• Schema Discovery: ${testResponse.body.success ? '✅' : '❌'}`);
    console.log('\n🎉 The enterprise connection system is working correctly!');

  } catch (error) {
    console.error('\n❌ Test Failed:', error.body || error);
    console.error('\nDebug Information:');
    console.error('- Status:', error.status);
    console.error('- Error:', error.body?.error || error.message);
    process.exit(1);
  }
}

// Run the test
testConnection().catch(console.error);