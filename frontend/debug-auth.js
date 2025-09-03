const { getToken } = require('next-auth/jwt');

// Debug function to test authentication
async function debugAuth() {
  console.log('=== Authentication Debug ===');
  
  // Check environment variables
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET');
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'NOT SET');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // Test JWT secret
  try {
    const jwt = require('jsonwebtoken');
    const testToken = jwt.sign({ test: 'data' }, process.env.NEXTAUTH_SECRET || 'fallback');
    console.log('JWT signing works:', !!testToken);
  } catch (error) {
    console.log('JWT signing error:', error.message);
  }
}

debugAuth().catch(console.error);