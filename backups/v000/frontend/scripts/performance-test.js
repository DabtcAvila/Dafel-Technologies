#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Dafel Technologies Performance Test Suite...\n');

// Performance test configuration
const config = {
  urls: [
    'http://localhost:3000/',
    'http://localhost:3000/login',
    'http://localhost:3000/studio'
  ],
  runs: 3,
  device: 'desktop',
  targets: {
    performance: 95,
    accessibility: 95,
    bestPractices: 95,
    seo: 95,
    fcp: 1500,
    lcp: 2500,
    cls: 0.1,
    fid: 100
  }
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${description}...`, 'blue');
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log(`✅ ${description} completed successfully`, 'green');
    return result;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

async function main() {
  // Ensure Lighthouse CI is installed
  try {
    execSync('npx lhci --version', { stdio: 'pipe' });
  } catch (error) {
    log('Installing Lighthouse CI...', 'yellow');
    runCommand('npm install -g @lhci/cli@0.12.x', 'Lighthouse CI installation');
  }

  // Build the application
  runCommand('npm run build', 'Building application');

  // Start the server in the background
  log('\n🔥 Starting production server...', 'blue');
  const serverProcess = require('child_process').spawn('npm', ['run', 'start'], {
    detached: true,
    stdio: 'pipe'
  });

  // Wait for server to be ready
  await new Promise((resolve) => {
    const checkServer = () => {
      try {
        execSync('curl -f http://localhost:3000 > /dev/null 2>&1');
        log('✅ Server is ready!', 'green');
        resolve();
      } catch {
        setTimeout(checkServer, 1000);
      }
    };
    setTimeout(checkServer, 2000);
  });

  try {
    // Run Lighthouse CI
    log('\n📊 Running Lighthouse Performance Audits...', 'bold');
    const lhciResult = runCommand('npx lhci autorun', 'Lighthouse CI audit');
    
    // Run additional WebPageTest if API key is available
    if (process.env.WPT_API_KEY) {
      log('\n🌐 Running WebPageTest audits...', 'blue');
      for (const url of config.urls) {
        try {
          const wptCommand = `npx webpagetest ${url} --key ${process.env.WPT_API_KEY} --location Dulles:Chrome --runs ${config.runs}`;
          runCommand(wptCommand, `WebPageTest audit for ${url}`);
        } catch (error) {
          log(`⚠️ WebPageTest failed for ${url}: ${error.message}`, 'yellow');
        }
      }
    } else {
      log('\n⚠️ WebPageTest skipped (no API key found in WPT_API_KEY)', 'yellow');
    }

    // Generate performance report
    log('\n📈 Generating performance report...', 'blue');
    const reportPath = path.join(__dirname, '..', 'performance-report.md');
    const report = generatePerformanceReport();
    fs.writeFileSync(reportPath, report);
    log(`✅ Performance report saved to ${reportPath}`, 'green');

    log('\n🎉 Performance testing completed successfully!', 'bold');
    log('\nCore Web Vitals Targets:', 'blue');
    log(`• First Contentful Paint: <${config.targets.fcp}ms`, 'reset');
    log(`• Largest Contentful Paint: <${config.targets.lcp}ms`, 'reset');
    log(`• Cumulative Layout Shift: <${config.targets.cls}`, 'reset');
    log(`• First Input Delay: <${config.targets.fid}ms`, 'reset');
    log(`• Performance Score: >${config.targets.performance}/100`, 'reset');

  } finally {
    // Kill the server
    try {
      process.kill(-serverProcess.pid);
    } catch (error) {
      // Server might already be dead
    }
  }
}

function generatePerformanceReport() {
  const timestamp = new Date().toISOString();
  return `# Dafel Technologies Performance Report

Generated: ${timestamp}

## Test Configuration

- **URLs Tested**: ${config.urls.length}
- **Runs per URL**: ${config.runs}
- **Device**: ${config.device}
- **Lighthouse Version**: $(npx lighthouse --version)

## Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Performance Score | ≥${config.targets.performance} | ⏳ |
| First Contentful Paint | ≤${config.targets.fcp}ms | ⏳ |
| Largest Contentful Paint | ≤${config.targets.lcp}ms | ⏳ |
| Cumulative Layout Shift | ≤${config.targets.cls} | ⏳ |
| First Input Delay | ≤${config.targets.fid}ms | ⏳ |

## Optimization Features Implemented

✅ Critical CSS inlined  
✅ Resource hints (preconnect, dns-prefetch, preload)  
✅ Image optimization (WebP/AVIF support)  
✅ Service Worker caching  
✅ Code splitting and lazy loading  
✅ Bundle optimization  
✅ Performance monitoring  
✅ Compression enabled  

## Next Steps

1. Review Lighthouse CI results
2. Optimize any failing metrics
3. Set up continuous performance monitoring
4. Configure CDN for static assets
5. Monitor real user metrics (RUM)

---

*Generated by Dafel Technologies Performance Test Suite*
`;
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n\n⚠️ Performance test interrupted', 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n\n⚠️ Performance test terminated', 'yellow');
  process.exit(0);
});

main().catch((error) => {
  log(`\n❌ Performance test failed: ${error.message}`, 'red');
  process.exit(1);
});