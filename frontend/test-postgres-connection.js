const { Pool } = require('pg');

async function testConnection() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'dafel_db',
    user: 'dafel_user',
    password: 'DafelSecure2025!',
    ssl: false,
  });

  try {
    console.log('Testing PostgreSQL connection...');
    const client = await pool.connect();
    
    const result = await client.query('SELECT version()');
    console.log('✅ Connection successful!');
    console.log('Version:', result.rows[0].version);
    
    const dbResult = await client.query('SELECT current_database()');
    console.log('Database:', dbResult.rows[0].current_database);
    
    const userResult = await client.query('SELECT current_user');
    console.log('User:', userResult.rows[0].current_user);
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();