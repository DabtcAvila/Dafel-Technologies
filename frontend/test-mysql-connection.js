/**
 * Test MySQL Connection
 * Script to test the MySQL connector implementation
 */

import { MySQLConnector } from './src/lib/connections/connectors/MySQLConnector.js';

// MySQL test configuration
// You can use either a local MySQL or a remote one
const TEST_CONFIG = {
  // Option 1: Local MySQL (if you have MySQL installed locally)
  local: {
    id: 'test_mysql_local',
    name: 'Test MySQL Local',
    type: 'MYSQL',
    host: 'localhost',
    port: 3306,
    database: 'test_db', // Change to your database name
    username: 'root',    // Change to your username
    password: 'password', // Change to your password
    ssl: false,
    configuration: {
      poolConfig: {
        min: 2,
        max: 5
      }
    }
  },
  
  // Option 2: Docker MySQL (if you want to use Docker)
  docker: {
    id: 'test_mysql_docker',
    name: 'Test MySQL Docker',
    type: 'MYSQL',
    host: 'localhost',
    port: 3307, // Different port to avoid conflict
    database: 'testdb',
    username: 'testuser',
    password: 'testpass',
    ssl: false,
    configuration: {
      poolConfig: {
        min: 2,
        max: 5
      }
    }
  },

  // Option 3: Remote MySQL (example with a cloud provider)
  remote: {
    id: 'test_mysql_remote',
    name: 'Test MySQL Remote',
    type: 'MYSQL',
    host: 'your-mysql-host.com',
    port: 3306,
    database: 'your_database',
    username: 'your_username',
    password: 'your_password',
    ssl: true,
    configuration: {
      poolConfig: {
        min: 2,
        max: 5
      }
    }
  }
};

// Choose which configuration to use
const CONFIG_TO_USE = 'docker'; // Change to 'local' or 'remote' as needed

async function testMySQLConnection() {
  console.log('\n=================================');
  console.log('MySQL Connector Test');
  console.log('=================================\n');

  const config = TEST_CONFIG[CONFIG_TO_USE];
  
  // Display configuration (without password)
  console.log('📋 Configuration:');
  console.log(`   Type: ${config.type}`);
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   Username: ${config.username}`);
  console.log(`   SSL: ${config.ssl}`);
  console.log('\n');

  let connector;

  try {
    // Create connector instance
    console.log('1️⃣ Creating MySQL connector...');
    connector = new MySQLConnector(config);
    console.log('   ✅ Connector created\n');

    // Connect to database
    console.log('2️⃣ Connecting to MySQL database...');
    const connectStart = Date.now();
    await connector.connect();
    const connectTime = Date.now() - connectStart;
    console.log(`   ✅ Connected successfully (${connectTime}ms)\n`);

    // Test connection
    console.log('3️⃣ Testing connection...');
    const testResult = await connector.testConnection();
    
    if (testResult.success) {
      console.log(`   ✅ Connection test passed (${testResult.responseTime}ms)`);
      console.log('\n   📊 Server Information:');
      console.log(`      Version: ${testResult.serverInfo.version}`);
      console.log(`      Database: ${testResult.serverInfo.database}`);
      console.log(`      User: ${testResult.serverInfo.user}`);
      console.log(`      Host: ${testResult.serverInfo.host}`);
      console.log(`      Port: ${testResult.serverInfo.port}\n`);
    } else {
      console.log(`   ❌ Connection test failed: ${testResult.error}\n`);
      return;
    }

    // Get schema information
    console.log('4️⃣ Getting database schema...');
    const schemaStart = Date.now();
    const schema = await connector.getSchema();
    const schemaTime = Date.now() - schemaStart;
    
    console.log(`   ✅ Schema retrieved (${schemaTime}ms)`);
    console.log(`\n   📋 Database: ${schema.database}`);
    console.log(`   📋 Version: ${schema.version}`);
    console.log(`   📋 Tables: ${schema.tables.length}\n`);
    
    // Display table information
    if (schema.tables.length > 0) {
      console.log('   📊 Table Information:');
      schema.tables.forEach(table => {
        console.log(`      - ${table.name}: ${table.columns.length} columns, ${table.rowCount} rows`);
        if (table.indexes && table.indexes.length > 0) {
          console.log(`        Indexes: ${table.indexes.map(idx => idx.name).join(', ')}`);
        }
      });
      console.log('');
    }

    // Test a simple query
    console.log('5️⃣ Testing a simple query...');
    const queryResult = await connector.query('SELECT 1 + 1 as result, NOW() as current_time');
    
    if (queryResult.success) {
      console.log(`   ✅ Query executed successfully`);
      console.log(`   📊 Result:`, queryResult.data[0]);
      console.log('');
    } else {
      console.log(`   ❌ Query failed: ${queryResult.error}\n`);
    }

    // Create a test table (if it doesn't exist)
    console.log('6️⃣ Creating test table...');
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS dafel_test (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        value INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    const createResult = await connector.query(createTableQuery);
    if (createResult.success) {
      console.log('   ✅ Test table created or already exists\n');
    } else {
      console.log(`   ❌ Failed to create table: ${createResult.error}\n`);
    }

    // Test transaction
    console.log('7️⃣ Testing transaction...');
    const transactionQueries = [
      {
        query: 'INSERT INTO dafel_test (name, value) VALUES (?, ?)',
        params: ['Transaction Test 1', 100]
      },
      {
        query: 'INSERT INTO dafel_test (name, value) VALUES (?, ?)',
        params: ['Transaction Test 2', 200]
      },
      {
        query: 'UPDATE dafel_test SET value = value + 50 WHERE name = ?',
        params: ['Transaction Test 1']
      }
    ];

    try {
      const txResults = await connector.transaction(transactionQueries);
      const allSuccess = txResults.every(r => r.success);
      
      if (allSuccess) {
        console.log('   ✅ Transaction completed successfully');
        console.log(`   📊 Results: ${txResults.length} queries executed\n`);
      } else {
        console.log('   ⚠️ Some queries in transaction failed\n');
      }
    } catch (error) {
      console.log(`   ❌ Transaction failed: ${error.message}\n`);
    }

    // Get metrics
    console.log('8️⃣ Connection Metrics:');
    const metrics = connector.getMetrics();
    console.log(`   📊 Total Queries: ${metrics.totalQueries}`);
    console.log(`   📊 Failed Queries: ${metrics.failedQueries}`);
    console.log(`   📊 Avg Response Time: ${metrics.avgResponseTime.toFixed(2)}ms`);
    console.log(`   📊 Active Connections: ${metrics.activeConnections}`);
    console.log(`   📊 Uptime: ${(metrics.uptime / 1000).toFixed(2)}s\n`);

    // Clean up test table
    console.log('9️⃣ Cleaning up test data...');
    await connector.query('DROP TABLE IF EXISTS dafel_test');
    console.log('   ✅ Test table dropped\n');

    console.log('=================================');
    console.log('✅ MySQL Connector Test Complete!');
    console.log('=================================\n');

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);
    console.error('\nError details:', error);
  } finally {
    // Disconnect
    if (connector && connector.isConnected()) {
      console.log('🔌 Disconnecting from MySQL...');
      await connector.disconnect();
      console.log('   ✅ Disconnected successfully\n');
    }
  }
}

// Docker setup instructions
function showDockerInstructions() {
  console.log('\n📦 To run MySQL in Docker (if needed):');
  console.log('=====================================');
  console.log('Run this command to start a MySQL container:\n');
  console.log(`docker run --name mysql-test \\
  -e MYSQL_ROOT_PASSWORD=rootpass \\
  -e MYSQL_DATABASE=testdb \\
  -e MYSQL_USER=testuser \\
  -e MYSQL_PASSWORD=testpass \\
  -p 3307:3306 \\
  -d mysql:8.0`);
  console.log('\nThen wait a few seconds for MySQL to start.');
  console.log('To check if it\'s ready: docker logs mysql-test');
  console.log('To stop it later: docker stop mysql-test');
  console.log('To remove it: docker rm mysql-test');
  console.log('=====================================\n');
}

// Main execution
async function main() {
  // Show Docker instructions if using docker config
  if (CONFIG_TO_USE === 'docker') {
    showDockerInstructions();
    
    // For non-interactive testing, skip the wait
    console.log('Starting test...\n');
  }

  await testMySQLConnection();
  process.exit(0);
}

// Run the test
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});