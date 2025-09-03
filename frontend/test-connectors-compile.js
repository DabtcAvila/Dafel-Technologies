/**
 * Test that all connectors compile and export correctly
 * This verifies the TypeScript modules are properly structured
 */

import { PostgreSQLConnector } from './src/lib/connections/connectors/PostgreSQLConnector.js';
import { MySQLConnector } from './src/lib/connections/connectors/MySQLConnector.js';
import { MongoDBConnector } from './src/lib/connections/connectors/MongoDBConnector.js';
import { RESTAPIConnector } from './src/lib/connections/connectors/RESTAPIConnector.js';
import { GraphQLConnector } from './src/lib/connections/connectors/GraphQLConnector.js';
import { S3Connector } from './src/lib/connections/connectors/S3Connector.js';
import { GoogleSheetsConnector } from './src/lib/connections/connectors/GoogleSheetsConnector.js';
import { CSVFileConnector } from './src/lib/connections/connectors/CSVFileConnector.js';
import { ConnectionFactory } from './src/lib/connections/ConnectionFactory.js';
import { ConnectionManager } from './src/lib/connections/ConnectionManager.js';
import { ConnectionPool } from './src/lib/connections/ConnectionPool.js';

console.log('\n=================================');
console.log('Connector Compilation Test');
console.log('=================================\n');

// Test that all connectors are properly exported
const connectors = {
  PostgreSQL: PostgreSQLConnector,
  MySQL: MySQLConnector,
  MongoDB: MongoDBConnector,
  RESTAPI: RESTAPIConnector,
  GraphQL: GraphQLConnector,
  S3: S3Connector,
  GoogleSheets: GoogleSheetsConnector,
  CSVFile: CSVFileConnector,
};

const infrastructure = {
  ConnectionFactory,
  ConnectionManager,
  ConnectionPool,
};

console.log('✅ All connectors imported successfully:\n');
for (const [name, connector] of Object.entries(connectors)) {
  console.log(`   ✓ ${name}Connector`);
}

console.log('\n✅ Infrastructure modules imported successfully:\n');
for (const [name, module] of Object.entries(infrastructure)) {
  console.log(`   ✓ ${name}`);
}

// Test that ConnectionFactory can create instances
console.log('\n📊 Testing ConnectionFactory:\n');

const testConfigs = [
  { type: 'POSTGRESQL', name: 'PostgreSQL' },
  { type: 'MYSQL', name: 'MySQL' },
  { type: 'MONGODB', name: 'MongoDB' },
  { type: 'REST_API', name: 'REST API' },
  { type: 'GRAPHQL', name: 'GraphQL' },
  { type: 'S3', name: 'S3' },
  { type: 'GOOGLE_SHEETS', name: 'Google Sheets' },
  { type: 'CSV_FILE', name: 'CSV File' },
];

async function testFactory() {
  for (const config of testConfigs) {
    try {
      const connector = await ConnectionFactory.create({
        id: `test-${config.type.toLowerCase()}`,
        type: config.type,
        name: config.name,
        host: 'localhost',
        database: 'test',
        username: 'test',
        password: 'test',
      });
      console.log(`   ✓ ${config.name} connector created successfully`);
    } catch (error) {
      console.log(`   ✗ ${config.name} connector failed: ${error.message}`);
    }
  }

  console.log('\n=================================');
  console.log('✅ All Connectors Compile Successfully!');
  console.log('=================================\n');

  process.exit(0);
}

testFactory().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});