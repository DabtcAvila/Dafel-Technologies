#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Dafel Technologies for CDN Distribution...\n');

// CDN Configuration
const CDN_CONFIG = {
  baseURL: process.env.CDN_BASE_URL || 'https://cdn.dafel-technologies.com',
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  staticDir: '.next/static',
  outputDir: 'dist-cdn'
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
  log(`${description}...`, 'blue');
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
    return result;
  } catch (error) {
    log(`❌ ${description} failed`, 'red');
    process.exit(1);
  }
}

function createCDNOptimizedBuild() {
  // Clean previous build
  if (fs.existsSync(CDN_CONFIG.outputDir)) {
    runCommand(`rm -rf ${CDN_CONFIG.outputDir}`, 'Cleaning previous CDN build');
  }

  // Set environment for CDN build
  process.env.NEXT_PUBLIC_ASSET_PREFIX = CDN_CONFIG.assetPrefix;
  process.env.NODE_ENV = 'production';
  
  // Build the application
  runCommand('npm run build', 'Building optimized application');
  
  // Create CDN distribution directory
  fs.mkdirSync(CDN_CONFIG.outputDir, { recursive: true });
  
  // Copy static assets
  const staticPath = path.join('.next', 'static');
  if (fs.existsSync(staticPath)) {
    runCommand(`cp -r ${staticPath} ${CDN_CONFIG.outputDir}/`, 'Copying static assets');
  }
  
  // Copy public assets
  const publicPath = 'public';
  if (fs.existsSync(publicPath)) {
    runCommand(`cp -r ${publicPath}/* ${CDN_CONFIG.outputDir}/`, 'Copying public assets');
  }
  
  // Generate manifest for CDN
  generateCDNManifest();
  
  // Generate compression for all assets
  compressAssets();
  
  log('\n🎉 CDN build completed successfully!', 'bold');
  log(`\n📦 CDN assets ready in: ${CDN_CONFIG.outputDir}`, 'green');
  log(`🌐 Configure your CDN to serve from: ${CDN_CONFIG.baseURL}`, 'blue');
}

function generateCDNManifest() {
  log('Generating CDN manifest...', 'blue');
  
  const manifest = {
    version: require('../package.json').version,
    buildTime: new Date().toISOString(),
    baseURL: CDN_CONFIG.baseURL,
    assets: {},
    compression: {
      gzip: true,
      brotli: true
    },
    caching: {
      static: '1y',
      images: '1y',
      fonts: '1y',
      html: '1d'
    }
  };
  
  // Scan for assets and generate hashes
  function scanDirectory(dir, prefix = '') {
    const items = fs.readdirSync(path.join(CDN_CONFIG.outputDir, dir), { withFileTypes: true });
    
    for (const item of items) {
      if (item.isDirectory()) {
        scanDirectory(path.join(dir, item.name), prefix);
      } else {
        const filePath = path.join(dir, item.name);
        const fullPath = path.join(CDN_CONFIG.outputDir, filePath);
        const stats = fs.statSync(fullPath);
        
        manifest.assets[filePath] = {
          size: stats.size,
          lastModified: stats.mtime.toISOString(),
          contentType: getContentType(item.name),
          cacheable: isCacheable(item.name)
        };
      }
    }
  }
  
  try {
    scanDirectory('.');
  } catch (error) {
    log(`Warning: Could not scan all directories: ${error.message}`, 'yellow');
  }
  
  fs.writeFileSync(
    path.join(CDN_CONFIG.outputDir, 'manifest.json'), 
    JSON.stringify(manifest, null, 2)
  );
  
  log('✅ CDN manifest generated', 'green');
}

function compressAssets() {
  log('Compressing assets for CDN...', 'blue');
  
  try {
    // Gzip compression
    runCommand(
      `find ${CDN_CONFIG.outputDir} -type f \\( -name "*.js" -o -name "*.css" -o -name "*.html" -o -name "*.json" -o -name "*.svg" \\) -exec gzip -k -9 {} \\;`,
      'Gzip compression'
    );
    
    // Brotli compression (if available)
    try {
      runCommand('which brotli', 'Checking for brotli');
      runCommand(
        `find ${CDN_CONFIG.outputDir} -type f \\( -name "*.js" -o -name "*.css" -o -name "*.html" -o -name "*.json" -o -name "*.svg" \\) -exec brotli -k -Z {} \\;`,
        'Brotli compression'
      );
    } catch (error) {
      log('⚠️ Brotli not available, skipping brotli compression', 'yellow');
    }
    
  } catch (error) {
    log(`⚠️ Asset compression failed: ${error.message}`, 'yellow');
  }
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
  };
  
  return types[ext] || 'application/octet-stream';
}

function isCacheable(filename) {
  const ext = path.extname(filename).toLowerCase();
  const nonCacheable = ['.html'];
  return !nonCacheable.includes(ext);
}

function generateDeploymentGuide() {
  const guide = `
# CDN Deployment Guide for Dafel Technologies

## 1. Upload Assets to CDN

Upload all files from \`${CDN_CONFIG.outputDir}/\` to your CDN provider:

### AWS CloudFront + S3
\`\`\`bash
aws s3 sync ${CDN_CONFIG.outputDir}/ s3://your-bucket-name/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
\`\`\`

### Cloudflare
\`\`\`bash
# Use Wrangler or upload via dashboard
wrangler publish
\`\`\`

### Vercel
\`\`\`bash
vercel --prod
\`\`\`

## 2. Configure Cache Headers

Set these cache headers on your CDN:

### Static Assets (*.js, *.css, *.png, *.webp, *.avif, *.woff2)
- Cache-Control: \`public, max-age=31536000, immutable\`
- Content-Encoding: \`gzip, br\` (serve compressed versions)

### HTML Files
- Cache-Control: \`public, max-age=86400, must-revalidate\`

### Service Worker
- Cache-Control: \`public, max-age=0, must-revalidate\`

## 3. Performance Optimizations

✅ Gzip/Brotli compression enabled
✅ Long-term caching for static assets
✅ Proper content types set
✅ Image optimization (WebP/AVIF)
✅ Critical CSS inlined
✅ Resource hints configured

## 4. Monitoring

Monitor these metrics:
- Cache Hit Ratio (target: >95%)
- Edge Response Time (target: <100ms)
- Origin Shield Hit Ratio
- Bandwidth savings from compression

## 5. Security Headers

Ensure these headers are set:
- Strict-Transport-Security
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- Content-Security-Policy (see next.config.js)

---
Build completed: ${new Date().toISOString()}
Total assets: ${Object.keys(require(path.join(CDN_CONFIG.outputDir, 'manifest.json')).assets || {}).length}
`;

  fs.writeFileSync(path.join(CDN_CONFIG.outputDir, 'DEPLOYMENT.md'), guide);
  log('📋 Deployment guide created', 'green');
}

// Main execution
try {
  createCDNOptimizedBuild();
  generateDeploymentGuide();
  
  log('\n🌟 CDN build process completed successfully!', 'bold');
  log('\nNext steps:', 'blue');
  log('1. Review the generated manifest.json', 'reset');
  log('2. Upload assets to your CDN provider', 'reset');
  log('3. Configure cache headers as specified', 'reset');
  log('4. Test the deployment with Lighthouse', 'reset');
  log('5. Monitor performance metrics', 'reset');
  
} catch (error) {
  log(`\n❌ CDN build failed: ${error.message}`, 'red');
  process.exit(1);
}