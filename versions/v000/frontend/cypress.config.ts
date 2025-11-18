import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Video and screenshot configuration
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    
    // Test configuration
    testIsolation: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Test file patterns
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    
    // Reporter configuration
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      configFile: 'cypress-reporter-config.json',
    },
    
    // Browser configuration
    chromeWebSecurity: false,
    
    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0,
    },
    
    // Environment variables
    env: {
      coverage: true,
      codeCoverageTasksRegistered: true,
      
      // API endpoints
      apiUrl: 'http://localhost:3000/api',
      
      // Test users
      testUser: {
        email: 'test@example.com',
        password: 'TestPassword123!',
      },
      
      // Feature flags for testing
      enablePerformanceTests: true,
      enableAccessibilityTests: true,
      enableVisualTests: true,
    },
    
    setupNodeEvents(on, config) {
      // Code coverage
      require('@cypress/code-coverage/task')(on, config);
      
      // Performance monitoring
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        // Custom task for performance measurement
        measurePerformance: async (url) => {
          const puppeteer = require('puppeteer');
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          
          try {
            await page.goto(url);
            const metrics = await page.evaluate(() => {
              const navigation = performance.getEntriesByType('navigation')[0];
              const paint = performance.getEntriesByType('paint');
              
              return {
                loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                totalResources: performance.getEntriesByType('resource').length,
              };
            });
            
            await browser.close();
            return metrics;
          } catch (error) {
            await browser.close();
            throw error;
          }
        },
        
        // Database seeding for tests
        seedDatabase: async (data) => {
          // Implementation for seeding test database
          console.log('Seeding database with test data:', data);
          return { success: true };
        },
        
        // Cleanup task
        cleanupTestData: async () => {
          // Implementation for cleaning up test data
          console.log('Cleaning up test data');
          return { success: true };
        },
      });
      
      // Accessibility testing
      on('task', require('@cypress/code-coverage/task'));
      
      // Visual regression testing
      const { addMatchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin');
      addMatchImageSnapshotPlugin(on, config);
      
      return config;
    },
  },
  
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    
    // Component testing configuration
    viewportWidth: 1000,
    viewportHeight: 660,
    video: false,
    screenshotOnRunFailure: true,
    
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
    
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
  },
  
  // Global configuration
  experimentalStudio: true,
  experimentalWebKitSupport: true,
  
  // Performance and resource management
  numTestsKeptInMemory: 10,
  
  // Browser launch options
  launchOptions: {
    args: ['--disable-dev-shm-usage'],
  },
});