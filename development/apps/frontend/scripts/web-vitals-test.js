#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3000';

async function measureWebVitals() {
  console.log(`🔍 Measuring Web Vitals for: ${TARGET_URL}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Enable performance monitoring
    await page.evaluateOnNewDocument(() => {
      window.webVitalsResults = {};

      // Web Vitals measurement script
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js';
      script.onload = () => {
        webVitals.getCLS(console.log);
        webVitals.getFID(console.log);
        webVitals.getFCP(console.log);
        webVitals.getLCP(console.log);
        webVitals.getTTFB(console.log);
      };
      document.head.appendChild(script);
    });

    // Navigate to the page
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });

    // Wait for page to be fully loaded
    await page.waitForTimeout(3000);

    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');

      return {
        // Navigation timing
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,

        // Core Web Vitals approximation
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,

        // Other metrics
        domInteractive: navigation.domInteractive - navigation.navigationStart,
        domComplete: navigation.domComplete - navigation.navigationStart,

        // Resource timing
        totalResources: performance.getEntriesByType('resource').length,

        // Memory (if available)
        usedJSHeapSize: performance.memory?.usedJSHeapSize || 0,
        totalJSHeapSize: performance.memory?.totalJSHeapSize || 0
      };
    });

    // Get Lighthouse performance score approximation
    const lighthouseScore = calculatePerformanceScore(performanceMetrics);

    const results = {
      timestamp: new Date().toISOString(),
      url: TARGET_URL,
      metrics: performanceMetrics,
      scores: {
        performance: lighthouseScore,
        accessibility: 90, // Placeholder - would need actual audit
        bestPractices: 85, // Placeholder - would need actual audit
        seo: 90 // Placeholder - would need actual audit
      },
      thresholds: {
        fcp: { good: 1800, poor: 3000 },
        lcp: { good: 2500, poor: 4000 },
        cls: { good: 0.1, poor: 0.25 },
        fid: { good: 100, poor: 300 }
      }
    };

    // Check if metrics pass thresholds
    const checks = {
      fcp: performanceMetrics.firstContentfulPaint <= 1800 ? 'good' :
        performanceMetrics.firstContentfulPaint <= 3000 ? 'needs-improvement' : 'poor',
      domComplete: performanceMetrics.domComplete <= 3000 ? 'good' : 'poor',
      resources: performanceMetrics.totalResources <= 50 ? 'good' : 'poor'
    };

    results.checks = checks;
    results.passed = Object.values(checks).every(check => check === 'good');

    console.log('📊 Web Vitals Results:');
    console.log(`  First Contentful Paint: ${performanceMetrics.firstContentfulPaint.toFixed(2)}ms`);
    console.log(`  DOM Content Loaded: ${performanceMetrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`  Load Complete: ${performanceMetrics.loadComplete.toFixed(2)}ms`);
    console.log(`  DOM Interactive: ${performanceMetrics.domInteractive.toFixed(2)}ms`);
    console.log(`  DOM Complete: ${performanceMetrics.domComplete.toFixed(2)}ms`);
    console.log(`  Total Resources: ${performanceMetrics.totalResources}`);
    console.log(`  JS Heap Used: ${(performanceMetrics.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Performance Score: ${lighthouseScore}/100`);

    console.log('\n✅ Status Checks:');
    Object.entries(checks).forEach(([metric, status]) => {
      const emoji = status === 'good' ? '✅' : status === 'needs-improvement' ? '⚠️' : '❌';
      console.log(`  ${emoji} ${metric}: ${status}`);
    });

    if (results.passed) {
      console.log('\n🎉 All Web Vitals checks passed!');
      process.exit(0);
    } else {
      console.log('\n⚠️ Some Web Vitals checks failed. Review the metrics above.');
      process.exit(1);
    }

    // Save results to file
    fs.writeFileSync('web-vitals-results.json', JSON.stringify(results, null, 2));

    return results;

  } finally {
    await browser.close();
  }
}

function calculatePerformanceScore(metrics) {
  // Simplified performance score calculation based on key metrics
  let score = 100;

  // First Contentful Paint weight
  if (metrics.firstContentfulPaint > 3000) score -= 30;
  else if (metrics.firstContentfulPaint > 1800) score -= 15;

  // DOM Complete weight
  if (metrics.domComplete > 5000) score -= 25;
  else if (metrics.domComplete > 3000) score -= 10;

  // Resource count weight
  if (metrics.totalResources > 100) score -= 20;
  else if (metrics.totalResources > 50) score -= 10;

  // Load Complete weight
  if (metrics.loadComplete > 2000) score -= 15;
  else if (metrics.loadComplete > 1000) score -= 5;

  return Math.max(0, score);
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the measurement
measureWebVitals().catch(error => {
  console.error('❌ Error measuring Web Vitals:', error);
  process.exit(1);
});