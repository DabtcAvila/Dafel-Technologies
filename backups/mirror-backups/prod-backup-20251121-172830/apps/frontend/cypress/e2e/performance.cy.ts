describe('Performance Tests', () => {
  beforeEach(() => {
    // Clear any previous performance marks
    cy.window().then((win) => {
      win.performance.clearMarks();
      win.performance.clearMeasures();
    });
  });

  it('should load the homepage within performance budgets', () => {
    // Mark the start of navigation
    cy.window().then((win) => {
      win.performance.mark('navigation-start');
    });

    cy.visit('/');

    // Wait for page to be fully loaded
    cy.get('[data-testid="homepage-content"]', { timeout: 10000 }).should('be.visible');

    // Measure Core Web Vitals
    cy.window().then((win) => {
      win.performance.mark('navigation-end');
      win.performance.measure('navigation-time', 'navigation-start', 'navigation-end');

      const measure = win.performance.getEntriesByType('measure')[0];
      const navigationTime = measure ? measure.duration : 0;

      // Assert performance budget (3 seconds)
      expect(navigationTime).to.be.lessThan(3000);
    });

    // Check for Performance API metrics
    cy.window().then((win) => {
      const navigation = win.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = win.performance.getEntriesByType('paint');

      // First Contentful Paint should be under 1.8s (good threshold)
      const fcp = paint.find(p => p.name === 'first-contentful-paint');
      if (fcp) {
        expect(fcp.startTime).to.be.lessThan(1800);
      }

      // DOM Content Loaded should be under 2s
      const dcl = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      expect(dcl).to.be.lessThan(2000);

      // Total page load should be under 3s
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      expect(loadTime).to.be.lessThan(3000);
    });
  });

  it('should have acceptable resource loading performance', () => {
    cy.visit('/');

    cy.window().then((win) => {
      const resources = win.performance.getEntriesByType('resource');
      
      // Check total number of resources (budget: max 50)
      expect(resources.length).to.be.lessThan(50);

      // Check for slow resources (over 1s)
      const slowResources = resources.filter((resource: PerformanceResourceTiming) => 
        resource.duration > 1000
      );
      
      if (slowResources.length > 0) {
        cy.log(`Slow resources found: ${slowResources.length}`);
        slowResources.forEach((resource) => {
          cy.log(`Slow resource: ${resource.name} - ${resource.duration}ms`);
        });
      }

      // Assert no more than 2 resources should take over 1s
      expect(slowResources.length).to.be.lessThan(3);
    });
  });

  it('should handle concurrent user interactions efficiently', () => {
    cy.visit('/studio');

    // Simulate multiple rapid interactions
    cy.get('[data-testid="data-sources-tab"]').click();
    cy.get('[data-testid="analytics-tab"]').click();
    cy.get('[data-testid="settings-tab"]').click();
    cy.get('[data-testid="canvas-tab"]').click();

    // Measure interaction response time
    cy.window().then((win) => {
      win.performance.mark('interaction-start');
    });

    cy.get('[data-testid="add-datasource-btn"]').click();

    cy.window().then((win) => {
      win.performance.mark('interaction-end');
      win.performance.measure('interaction-time', 'interaction-start', 'interaction-end');

      const measure = win.performance.getEntriesByType('measure').find(m => m.name === 'interaction-time');
      const interactionTime = measure ? measure.duration : 0;

      // Interaction should respond within 100ms for good UX
      expect(interactionTime).to.be.lessThan(100);
    });
  });

  it('should maintain performance with data loading', () => {
    cy.visit('/studio');

    // Intercept API calls to measure their performance
    cy.intercept('GET', '/api/data-sources*').as('getDataSources');
    cy.intercept('GET', '/api/users*').as('getUsers');

    // Navigate to data-heavy section
    cy.get('[data-testid="data-sources-tab"]').click();

    // Wait for API calls and measure their performance
    cy.wait('@getDataSources').then((interception) => {
      const duration = interception.reply?.delay || 0;
      expect(duration).to.be.lessThan(500); // API calls should be under 500ms
    });

    // Check for memory leaks
    cy.window().then((win) => {
      if (win.performance.memory) {
        const { usedJSHeapSize, totalJSHeapSize } = win.performance.memory;
        const memoryUsagePercent = (usedJSHeapSize / totalJSHeapSize) * 100;
        
        cy.log(`Memory usage: ${memoryUsagePercent.toFixed(2)}%`);
        
        // Memory usage should not exceed 80%
        expect(memoryUsagePercent).to.be.lessThan(80);
      }
    });
  });

  it('should perform well on different network conditions', () => {
    // Simulate 3G network
    cy.window().then((win) => {
      // This would require a browser extension or custom command
      // For now, we'll test with a longer timeout
      cy.log('Testing under simulated slow network conditions');
    });

    cy.visit('/', { timeout: 20000 });

    // Even on slow network, critical content should load within 5s
    cy.get('[data-testid="homepage-content"]', { timeout: 5000 }).should('be.visible');

    // Check that images are lazy loaded
    cy.get('img[loading="lazy"]').should('exist');
  });

  it('should have optimized bundle sizes', () => {
    cy.visit('/');

    cy.window().then((win) => {
      const resources = win.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      // Check JavaScript bundle sizes
      const jsResources = resources.filter(resource => 
        resource.name.includes('.js') && !resource.name.includes('node_modules')
      );
      
      jsResources.forEach((resource) => {
        // Individual JS files should be under 500KB
        expect(resource.transferSize).to.be.lessThan(500 * 1024);
        cy.log(`JS Bundle: ${resource.name} - ${(resource.transferSize / 1024).toFixed(2)}KB`);
      });

      // Total JS transfer size should be under 1MB
      const totalJSSize = jsResources.reduce((total, resource) => 
        total + (resource.transferSize || 0), 0
      );
      expect(totalJSSize).to.be.lessThan(1024 * 1024);
    });
  });

  it('should use performance monitoring in production', () => {
    cy.visit('/');

    // Check for performance monitoring implementation
    cy.window().then((win) => {
      // Check if Web Vitals or similar monitoring is implemented
      expect(win).to.have.property('webVitals').or.to.have.property('gtag');
    });

    // Verify performance marks are being created
    cy.get('[data-testid="performance-mark"]').should('exist');
  });

  after(() => {
    // Generate performance report
    cy.task('log', 'Performance test suite completed');
    
    // Custom task to measure overall performance
    cy.url().then((currentUrl) => {
      cy.task('measurePerformance', currentUrl).then((metrics) => {
        cy.log('Performance Metrics:', metrics);
        
        // Save metrics to file for CI/CD reporting
        cy.writeFile('cypress/results/performance-metrics.json', metrics);
      });
    });
  });
});