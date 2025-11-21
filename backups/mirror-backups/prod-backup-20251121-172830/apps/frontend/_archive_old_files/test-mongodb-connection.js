/**
 * Test MongoDB Connection
 * Script to test the MongoDB connector implementation
 */

import { MongoDBConnector } from './src/lib/connections/connectors/MongoDBConnector.js';

// MongoDB test configuration
// You can use either a local MongoDB or a remote one
const TEST_CONFIG = {
  // Option 1: Local MongoDB (if you have MongoDB installed locally)
  local: {
    id: 'test_mongodb_local',
    name: 'Test MongoDB Local',
    type: 'MONGODB',
    host: 'localhost',
    port: 27017,
    database: 'test_db', // Change to your database name
    username: '', // Optional
    password: '', // Optional
    ssl: false,
    configuration: {
      retryWrites: true,
      retryReads: true,
    }
  },
  
  // Option 2: Docker MongoDB (if you want to use Docker)
  docker: {
    id: 'test_mongodb_docker',
    name: 'Test MongoDB Docker',
    type: 'MONGODB',
    host: 'localhost',
    port: 27018, // Different port to avoid conflict
    database: 'testdb',
    username: 'testuser',
    password: 'testpass',
    ssl: false,
    configuration: {
      authSource: 'admin',
      retryWrites: true,
      retryReads: true,
    }
  },

  // Option 3: MongoDB Atlas (cloud)
  atlas: {
    id: 'test_mongodb_atlas',
    name: 'Test MongoDB Atlas',
    type: 'MONGODB',
    connectionString: 'mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority',
    ssl: true,
    configuration: {
      retryWrites: true,
      retryReads: true,
    }
  }
};

// Choose which configuration to use
const CONFIG_TO_USE = 'docker'; // Change to 'local' or 'atlas' as needed

async function testMongoDBConnection() {
  console.log('\n=================================');
  console.log('MongoDB Connector Test');
  console.log('=================================\n');

  const config = TEST_CONFIG[CONFIG_TO_USE];
  
  // Display configuration (without password)
  console.log('📋 Configuration:');
  console.log(`   Type: ${config.type}`);
  if (config.connectionString) {
    console.log(`   Connection String: ***`);
  } else {
    console.log(`   Host: ${config.host}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   Username: ${config.username || '(none)'}`);
  }
  console.log(`   SSL: ${config.ssl}`);
  console.log('\n');

  let connector;

  try {
    // Create connector instance
    console.log('1️⃣ Creating MongoDB connector...');
    connector = new MongoDBConnector(config);
    console.log('   ✅ Connector created\n');

    // Connect to database
    console.log('2️⃣ Connecting to MongoDB database...');
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
    console.log(`   📋 Collections: ${schema.collections.length}\n`);
    
    // Display collection information
    if (schema.collections.length > 0) {
      console.log('   📊 Collection Information:');
      schema.collections.forEach(collection => {
        console.log(`      - ${collection.name}: ${collection.documentCount} documents`);
        if (collection.indexes && collection.indexes.length > 0) {
          console.log(`        Indexes: ${collection.indexes.map(idx => idx.name).join(', ')}`);
        }
      });
      console.log('');
    }

    // Test a simple query
    console.log('5️⃣ Testing a simple query...');
    const queryResult = await connector.query({
      collection: 'test_collection',
      operation: 'insert',
      document: {
        test: 'value',
        timestamp: new Date(),
        number: 42
      }
    });
    
    if (queryResult.success) {
      console.log(`   ✅ Document inserted successfully`);
      console.log(`   📊 Insert ID:`, queryResult.data);
      console.log('');
    } else {
      console.log(`   ❌ Query failed: ${queryResult.error}\n`);
    }

    // Test finding documents
    console.log('6️⃣ Finding documents...');
    const findResult = await connector.query({
      collection: 'test_collection',
      operation: 'find',
      filter: { test: 'value' }
    });
    
    if (findResult.success) {
      console.log(`   ✅ Found ${findResult.data.length} document(s)`);
      if (findResult.data.length > 0) {
        console.log(`   📊 First document:`, findResult.data[0]);
      }
      console.log('');
    } else {
      console.log(`   ❌ Find failed: ${findResult.error}\n`);
    }

    // Test aggregation
    console.log('7️⃣ Testing aggregation...');
    const aggResult = await connector.query({
      collection: 'test_collection',
      operation: 'aggregate',
      pipeline: [
        { $match: { test: 'value' } },
        { $count: 'total' }
      ]
    });
    
    if (aggResult.success) {
      console.log(`   ✅ Aggregation completed`);
      console.log(`   📊 Result:`, aggResult.data);
      console.log('');
    } else {
      console.log(`   ❌ Aggregation failed: ${aggResult.error}\n`);
    }

    // Test transaction
    console.log('8️⃣ Testing transaction...');
    const transactionQueries = [
      {
        collection: 'test_collection',
        operation: 'insertMany',
        document: [
          { name: 'Transaction Test 1', value: 100 },
          { name: 'Transaction Test 2', value: 200 }
        ]
      },
      {
        collection: 'test_collection', 
        operation: 'update',
        filter: { name: 'Transaction Test 1' },
        update: { $inc: { value: 50 } }
      }
    ];

    try {
      const txResults = await connector.transaction(transactionQueries);
      const allSuccess = txResults.every(r => r.success);
      
      if (allSuccess) {
        console.log('   ✅ Transaction completed successfully');
        console.log(`   📊 Results: ${txResults.length} operations executed\n`);
      } else {
        console.log('   ⚠️ Some operations in transaction failed\n');
      }
    } catch (error) {
      console.log(`   ❌ Transaction failed: ${error.message}\n`);
    }

    // Get metrics
    console.log('9️⃣ Connection Metrics:');
    const metrics = connector.getMetrics();
    console.log(`   📊 Total Queries: ${metrics.totalQueries}`);
    console.log(`   📊 Failed Queries: ${metrics.failedQueries}`);
    console.log(`   📊 Avg Response Time: ${metrics.avgResponseTime.toFixed(2)}ms`);
    console.log(`   📊 Active Connections: ${metrics.activeConnections}`);
    console.log(`   📊 Uptime: ${(metrics.uptime / 1000).toFixed(2)}s\n`);

    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    await connector.query({
      collection: 'test_collection',
      operation: 'deleteMany',
      filter: {}
    });
    console.log('   ✅ Test collection cleared\n');

    console.log('=================================');
    console.log('✅ MongoDB Connector Test Complete!');
    console.log('=================================\n');

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);
    console.error('\nError details:', error);
  } finally {
    // Disconnect
    if (connector && connector.isConnected()) {
      console.log('🔌 Disconnecting from MongoDB...');
      await connector.disconnect();
      console.log('   ✅ Disconnected successfully\n');
    }
  }
}

// Docker setup instructions
function showDockerInstructions() {
  console.log('\n📦 To run MongoDB in Docker (if needed):');
  console.log('=====================================');
  console.log('Run this command to start a MongoDB container:\n');
  console.log(`docker run --name mongodb-test \\
  -e MONGO_INITDB_ROOT_USERNAME=testuser \\
  -e MONGO_INITDB_ROOT_PASSWORD=testpass \\
  -e MONGO_INITDB_DATABASE=testdb \\
  -p 27018:27017 \\
  -d mongo:latest`);
  console.log('\nThen wait a few seconds for MongoDB to start.');
  console.log('To check if it\'s ready: docker logs mongodb-test');
  console.log('To stop it later: docker stop mongodb-test');
  console.log('To remove it: docker rm mongodb-test');
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

  await testMongoDBConnection();
  process.exit(0);
}

// Run the test
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});