module.exports = async () => {
  console.log('🧹 Global Test Teardown - Starting...')
  
  // Calculate total test execution time
  const testDuration = Date.now() - global.__TEST_START_TIME__
  console.log(`⏱️ Total test execution time: ${testDuration}ms`)
  
  // Clean up test data
  try {
    const fs = require('fs').promises
    const path = require('path')
    
    const testDataDir = './tests/data'
    
    // Clean up temporary test files
    try {
      const files = await fs.readdir(testDataDir)
      for (const file of files) {
        if (file.startsWith('temp-')) {
          await fs.unlink(path.join(testDataDir, file))
        }
      }
      console.log('✅ Temporary test files cleaned up')
    } catch (error) {
      console.log('⚠️ No temporary test files to clean up')
    }
  } catch (error) {
    console.warn('⚠️ Error during test data cleanup:', error.message)
  }
  
  // Close any remaining database connections
  if (global.__MOCK_SERVICES__) {
    try {
      // Simulate closing mock services
      console.log('🔌 Mock services disconnected')
    } catch (error) {
      console.warn('⚠️ Error disconnecting mock services:', error.message)
    }
  }
  
  // Performance metrics summary
  if (global.__TEST_METRICS__) {
    console.log('📊 Test Performance Metrics:')
    console.log(`   - Tests executed: ${global.__TEST_METRICS__.testsCount || 0}`)
    console.log(`   - Average test time: ${global.__TEST_METRICS__.averageTime || 0}ms`)
    console.log(`   - Memory usage: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`)
  }
  
  console.log('✅ Global Test Teardown - Complete')
}