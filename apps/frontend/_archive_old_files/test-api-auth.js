/**
 * Test API Authentication Flow
 * Tests authentication and data source creation
 */

const fetch = require('node-fetch');

// Configuration
const BASE_URL = 'http://localhost:3000';

async function getCsrfToken() {
  const response = await fetch(`${BASE_URL}/api/auth/csrf`);
  const data = await response.json();
  return data.csrfToken;
}

async function signIn(email, password) {
  const csrfToken = await getCsrfToken();
  
  const response = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      email,
      password,
      csrfToken,
      callbackUrl: '/studio',
      json: 'true',
    }),
    redirect: 'manual',
  });

  const cookies = response.headers.raw()['set-cookie'];
  if (cookies) {
    const sessionCookie = cookies.find(c => 
      c.includes('next-auth.session-token') || 
      c.includes('__Secure-next-auth.session-token')
    );
    return sessionCookie ? sessionCookie.split(';')[0] : null;
  }
  
  return null;
}

async function testDataSource(sessionCookie) {
  // Create data source
  const createResponse = await fetch(`${BASE_URL}/api/data-sources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie,
    },
    body: JSON.stringify({
      name: 'Test PostgreSQL',
      type: 'POSTGRESQL',
      description: 'Test connection',
      host: 'localhost',
      port: 5432,
      database: 'dafel_db',
      username: 'dafel_user',
      password: 'DafelSecure2025!',
      ssl: false,
    }),
  });

  if (!createResponse.ok) {
    const error = await createResponse.text();
    console.error('Create failed:', createResponse.status, error);
    return false;
  }

  const dataSource = await createResponse.json();
  console.log('✅ Data source created:', dataSource.id);

  // Test connection
  const testResponse = await fetch(`${BASE_URL}/api/data-sources/${dataSource.id}/test`, {
    method: 'POST',
    headers: {
      'Cookie': sessionCookie,
    },
  });

  const testResult = await testResponse.json();
  console.log('Connection test:', testResult.success ? '✅' : '❌', testResult.message);
  
  if (testResult.serverInfo) {
    console.log('Server info:', testResult.serverInfo);
  }

  // Get schema
  if (testResult.success) {
    const schemaResponse = await fetch(`${BASE_URL}/api/data-sources/${dataSource.id}/schema`, {
      headers: {
        'Cookie': sessionCookie,
      },
    });

    const schemaResult = await schemaResponse.json();
    if (schemaResult.schema?.tables) {
      console.log(`Schema: ${schemaResult.schema.tables.length} tables found`);
    }
  }

  return true;
}

async function main() {
  console.log('🚀 Testing API Authentication\n');
  
  try {
    // Sign in
    console.log('1. Signing in...');
    const sessionCookie = await signIn('admin@dafel.tech', 'DafelSecure2025!');
    
    if (!sessionCookie) {
      console.error('❌ Failed to sign in');
      process.exit(1);
    }
    
    console.log('✅ Signed in successfully\n');
    
    // Test data source
    console.log('2. Testing data source operations...');
    const success = await testDataSource(sessionCookie);
    
    if (success) {
      console.log('\n✅ All tests passed!');
    } else {
      console.log('\n❌ Some tests failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();