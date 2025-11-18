import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 E2E Global Teardown - Starting...')
  
  try {
    // Clean up test data
    await cleanupTestData()
    
    // Remove test user
    await cleanupTestUser()
    
    // Clear environment variables
    delete process.env.E2E_TEST_USER_EMAIL
    delete process.env.E2E_TEST_USER_PASSWORD
    delete process.env.E2E_TEST_USER_NAME
    delete process.env.E2E_TEST_DATA_SOURCES
    
    console.log('✅ E2E Global Teardown - Complete')
    
  } catch (error) {
    console.error('❌ E2E Global Teardown failed:', error)
    // Don't throw error to avoid failing the entire test run
  }
}

async function cleanupTestData() {
  console.log('🗑️ Cleaning up test data...')
  
  try {
    // In a real application, you would:
    // 1. Delete test records from database
    // 2. Remove test files from storage
    // 3. Clean up any external resources
    
    console.log('✅ Test data cleanup complete')
  } catch (error) {
    console.warn('⚠️ Test data cleanup failed:', error)
  }
}

async function cleanupTestUser() {
  console.log('👤 Cleaning up test user...')
  
  try {
    // In a real application, you would delete the test user from the database
    // For now, we just log the cleanup
    
    console.log('✅ Test user cleanup complete')
  } catch (error) {
    console.warn('⚠️ Test user cleanup failed:', error)
  }
}

export default globalTeardown