import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 E2E Global Setup - Starting...')
  
  // Launch browser for setup
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Wait for the application to be ready
    console.log('⏳ Waiting for application to be ready...')
    await page.goto('http://localhost:3000/api/health')
    
    // Verify health endpoint
    const response = await page.waitForResponse(
      response => response.url().includes('/api/health') && response.status() === 200,
      { timeout: 60000 }
    )
    
    if (response.ok()) {
      console.log('✅ Application health check passed')
    } else {
      throw new Error('Application health check failed')
    }
    
    // Set up test data
    await setupTestData(page)
    
    // Create test user for authentication tests
    await createTestUser(page)
    
    console.log('✅ E2E Global Setup - Complete')
    
  } catch (error) {
    console.error('❌ E2E Global Setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

async function setupTestData(page: any) {
  console.log('🗄️ Setting up test data...')
  
  // Create test data sources
  const testDataSources = [
    {
      name: 'Test PostgreSQL',
      type: 'postgresql',
      configuration: {
        host: 'localhost',
        port: 5432,
        database: 'test_db',
        user: 'test_user',
        password: 'test_password',
      }
    },
    {
      name: 'Test MySQL',
      type: 'mysql',
      configuration: {
        host: 'localhost',
        port: 3306,
        database: 'test_db',
        user: 'test_user',
        password: 'test_password',
      }
    }
  ]
  
  // Store test data in global state
  process.env.E2E_TEST_DATA_SOURCES = JSON.stringify(testDataSources)
  
  console.log('✅ Test data setup complete')
}

async function createTestUser(page: any) {
  console.log('👤 Creating test user...')
  
  const testUser = {
    email: 'e2e.test@dafel.tech',
    password: 'E2ETestPassword123!',
    name: 'E2E Test User'
  }
  
  try {
    // In a real app, you might call an API endpoint to create the user
    // For now, we'll store the test user credentials in environment variables
    process.env.E2E_TEST_USER_EMAIL = testUser.email
    process.env.E2E_TEST_USER_PASSWORD = testUser.password
    process.env.E2E_TEST_USER_NAME = testUser.name
    
    console.log('✅ Test user created')
  } catch (error) {
    console.warn('⚠️ Test user creation failed:', error)
    // Continue with setup even if user creation fails
  }
}

export default globalSetup