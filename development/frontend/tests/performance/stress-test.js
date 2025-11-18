import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Counter, Trend } from 'k6/metrics'
import { SharedArray } from 'k6/data'

// Custom metrics
export const errorRate = new Rate('errors')
export const systemErrors = new Counter('system_errors')
export const responseTime = new Trend('response_time')

// Stress test configuration - pushes system beyond normal limits
export const options = {
  stages: [
    // Gradual ramp-up to normal load
    { duration: '2m', target: 50 },
    { duration: '3m', target: 100 },
    
    // Aggressive scaling to stress levels
    { duration: '2m', target: 200 },
    { duration: '2m', target: 400 },
    { duration: '2m', target: 600 },
    
    // Peak stress - beyond expected capacity
    { duration: '5m', target: 800 },
    { duration: '3m', target: 1000 },
    
    // Maintain peak stress
    { duration: '5m', target: 1000 },
    
    // Gradual recovery
    { duration: '3m', target: 500 },
    { duration: '3m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  
  thresholds: {
    // More lenient thresholds for stress testing
    http_req_duration: ['p(90)<5000', 'p(95)<10000'], // Allow higher response times
    http_req_failed: ['rate<0.15'],    // Allow up to 15% error rate at peak stress
    errors: ['rate<0.2'],              // Custom error rate under 20%
    
    // System should recover gracefully
    'http_req_duration{scenario:recovery}': ['p(95)<2000'],
  },
  
  tags: {
    test_type: 'stress_test',
    environment: 'development',
    version: '1.0.0',
  },
}

// Test data for stress scenarios
const testEndpoints = new SharedArray('endpoints', function () {
  return [
    '/api/health',
    '/api/data-sources',
    '/api/users',
    '/studio',
    '/login',
    '/',
  ]
})

const stressPayloads = new SharedArray('payloads', function () {
  return [
    {
      endpoint: '/api/data-sources',
      method: 'POST',
      payload: {
        name: 'Stress Test DB',
        type: 'postgresql',
        configuration: {
          host: 'stress.test.com',
          port: 5432,
          database: 'stress_db',
        },
      },
    },
    {
      endpoint: '/api/data-sources/test/schema',
      method: 'GET',
    },
    {
      endpoint: '/api/audit-logs',
      method: 'GET',
    },
  ]
})

export default function () {
  const baseUrl = __ENV.BASE_URL || 'http://localhost:3000'
  const currentVUs = __ENV.K6_VUS || __VU
  
  // Different behavior based on VU number for realistic stress patterns
  if (currentVUs <= 200) {
    // Normal user behavior
    normalUserStress(baseUrl)
  } else if (currentVUs <= 600) {
    // Heavy API usage
    apiStress(baseUrl)
  } else {
    // Extreme load patterns
    extremeStress(baseUrl)
  }
  
  // Vary think time based on stress level
  const thinkTime = currentVUs > 800 ? 0.1 : (currentVUs > 400 ? 0.3 : 0.5)
  sleep(thinkTime)
}

function normalUserStress(baseUrl) {
  const headers = {
    'Content-Type': 'application/json',
  }
  
  // Simulate normal user patterns under stress
  const endpoints = [
    '/',
    '/studio',
    '/api/data-sources',
    '/api/health',
  ]
  
  endpoints.forEach(endpoint => {
    const startTime = Date.now()
    
    const response = http.get(`${baseUrl}${endpoint}`, {
      headers,
      timeout: '10s', // Increased timeout for stress conditions
      tags: { name: `stress_${endpoint.replace('/', '_')}` },
    })
    
    const duration = Date.now() - startTime
    responseTime.add(duration)
    
    const success = check(response, {
      'status is not 5xx': (r) => r.status < 500,
      'response time acceptable under stress': (r) => r.timings.duration < 10000,
    })
    
    if (!success) {
      errorRate.add(1)
      
      // Track system errors (5xx responses)
      if (response.status >= 500) {
        systemErrors.add(1)
      }
    }
    
    sleep(0.1) // Minimal think time during stress
  })
}

function apiStress(baseUrl) {
  const headers = {
    'Content-Type': 'application/json',
  }
  
  // Heavy API usage patterns
  const payload = stressPayloads[Math.floor(Math.random() * stressPayloads.length)]
  
  let response
  const startTime = Date.now()
  
  if (payload.method === 'POST') {
    response = http.post(
      `${baseUrl}${payload.endpoint}`,
      JSON.stringify(payload.payload),
      {
        headers,
        timeout: '15s',
        tags: { name: 'api_stress_write' },
      }
    )
  } else {
    response = http.get(`${baseUrl}${payload.endpoint}`, {
      headers,
      timeout: '10s',
      tags: { name: 'api_stress_read' },
    })
  }
  
  const duration = Date.now() - startTime
  responseTime.add(duration)
  
  const success = check(response, {
    'API handles stress': (r) => r.status < 500,
    'API responds within timeout': (r) => r.timings.duration < 15000,
  })
  
  if (!success) {
    errorRate.add(1)
    if (response.status >= 500) {
      systemErrors.add(1)
    }
  }
}

function extremeStress(baseUrl) {
  // Extreme stress patterns - rapid fire requests
  const concurrentRequests = 5
  const promises = []
  
  for (let i = 0; i < concurrentRequests; i++) {
    const endpoint = testEndpoints[Math.floor(Math.random() * testEndpoints.length)]
    
    promises.push(
      http.asyncRequest('GET', `${baseUrl}${endpoint}`, null, {
        timeout: '5s',
        tags: { name: 'extreme_stress' },
      })
    )
  }
  
  // Wait for all concurrent requests
  const responses = http.batch(promises)
  
  responses.forEach(response => {
    responseTime.add(response.timings.duration)
    
    const success = check(response, {
      'extreme stress handled': (r) => r.status < 500,
      'system stays responsive': (r) => r.timings.duration < 5000,
    })
    
    if (!success) {
      errorRate.add(1)
      if (response.status >= 500) {
        systemErrors.add(1)
      }
    }
  })
}

export function setup() {
  const baseUrl = __ENV.BASE_URL || 'http://localhost:3000'
  
  console.log('🔥 Starting stress test setup...')
  console.log(`Target URL: ${baseUrl}`)
  console.log('⚠️  WARNING: This test will push the system beyond normal limits!')
  
  // Pre-test health check
  const healthCheck = http.get(`${baseUrl}/api/health`)
  
  if (healthCheck.status !== 200) {
    throw new Error(`System not healthy before stress test: ${healthCheck.status}`)
  }
  
  console.log('✅ System is healthy, starting aggressive stress test')
  console.log('📊 Monitor system resources during this test!')
  
  return { baseUrl }
}

export function teardown(data) {
  console.log('🧹 Stress test completed, running teardown...')
  
  // Post-stress health check
  console.log('🏥 Checking system health after stress test...')
  
  const baseUrl = data.baseUrl
  let healthyAfterStress = false
  let attempts = 0
  const maxAttempts = 5
  
  while (!healthyAfterStress && attempts < maxAttempts) {
    attempts++
    
    try {
      const healthCheck = http.get(`${baseUrl}/api/health`, { timeout: '10s' })
      
      if (healthCheck.status === 200) {
        healthyAfterStress = true
        console.log(`✅ System recovered after stress test (attempt ${attempts})`)
      } else {
        console.log(`⚠️ System still recovering... (attempt ${attempts}/${maxAttempts})`)
        sleep(5) // Wait 5 seconds between health checks
      }
    } catch (error) {
      console.log(`❌ Health check failed: ${error.message}`)
      sleep(5)
    }
  }
  
  if (!healthyAfterStress) {
    console.log('🚨 WARNING: System may not have fully recovered from stress test!')
    console.log('💡 Consider monitoring system resources and restarting if necessary')
  }
  
  // Log stress test summary
  console.log('📊 Stress Test Summary:')
  console.log(`- Peak Load: 1000 virtual users`)
  console.log(`- Test Duration: ~30 minutes`)
  console.log(`- System Recovery: ${healthyAfterStress ? 'SUCCESS' : 'NEEDS ATTENTION'}`)
}

export function handleSummary(data) {
  const summary = {
    testType: 'Stress Test',
    timestamp: new Date().toISOString(),
    duration: data.state.testRunDurationMs / 1000,
    peakVUs: data.metrics.vus_max.values.max,
    totalRequests: data.metrics.http_reqs.values.count,
    requestRate: Math.round(data.metrics.http_reqs.values.rate),
    failureRate: (data.metrics.http_req_failed.values.rate * 100).toFixed(2),
    systemErrors: data.metrics.system_errors ? data.metrics.system_errors.values.count : 0,
    performance: {
      avgDuration: Math.round(data.metrics.http_req_duration.values.avg),
      p90Duration: Math.round(data.metrics.http_req_duration.values['p(90)']),
      p95Duration: Math.round(data.metrics.http_req_duration.values['p(95)']),
      p99Duration: Math.round(data.metrics.http_req_duration.values['p(99)']),
      maxDuration: Math.round(data.metrics.http_req_duration.values.max),
    },
    breakingPoint: analyzeBreakingPoint(data),
    recommendations: generateRecommendations(data),
  }

  return {
    'stress-test-summary.json': JSON.stringify(summary, null, 2),
    'stress-test-report.html': generateStressTestReport(summary),
  }
}

function analyzeBreakingPoint(data) {
  const failureRate = data.metrics.http_req_failed.values.rate
  const avgDuration = data.metrics.http_req_duration.values.avg
  const p95Duration = data.metrics.http_req_duration.values['p(95)']
  
  let breakingPoint = 'Not reached'
  let breakingIndicators = []
  
  if (failureRate > 0.1) {
    breakingIndicators.push(`High failure rate: ${(failureRate * 100).toFixed(2)}%`)
  }
  
  if (avgDuration > 3000) {
    breakingIndicators.push(`High average response time: ${Math.round(avgDuration)}ms`)
  }
  
  if (p95Duration > 10000) {
    breakingIndicators.push(`Very high P95 response time: ${Math.round(p95Duration)}ms`)
    breakingPoint = 'System breaking point reached'
  }
  
  return {
    status: breakingPoint,
    indicators: breakingIndicators,
  }
}

function generateRecommendations(data) {
  const recommendations = []
  const failureRate = data.metrics.http_req_failed.values.rate
  const avgDuration = data.metrics.http_req_duration.values.avg
  
  if (failureRate > 0.05) {
    recommendations.push('Consider implementing rate limiting and circuit breakers')
    recommendations.push('Review error handling and graceful degradation')
  }
  
  if (avgDuration > 2000) {
    recommendations.push('Optimize database queries and add caching')
    recommendations.push('Consider horizontal scaling or load balancing')
  }
  
  recommendations.push('Monitor CPU, memory, and database connections during peak load')
  recommendations.push('Implement auto-scaling based on metrics')
  recommendations.push('Set up alerting for performance degradation')
  
  return recommendations
}

function generateStressTestReport(summary) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Stress Test Report - ${summary.timestamp}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
    .header { background: #f44336; color: white; padding: 20px; border-radius: 5px; }
    .metric { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .warning { background: #ff9800; color: white; padding: 10px; border-radius: 5px; margin: 10px 0; }
    .success { background: #4caf50; color: white; padding: 10px; border-radius: 5px; margin: 10px 0; }
    .recommendation { background: #2196f3; color: white; padding: 10px; margin: 5px 0; border-radius: 3px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔥 Stress Test Report</h1>
    <p>Breaking point analysis and performance under extreme load</p>
  </div>
  
  <div class="metric">
    <h2>Test Overview</h2>
    <p><strong>Test Type:</strong> ${summary.testType}</p>
    <p><strong>Timestamp:</strong> ${summary.timestamp}</p>
    <p><strong>Duration:</strong> ${Math.round(summary.duration / 60)} minutes</p>
    <p><strong>Peak Virtual Users:</strong> ${summary.peakVUs}</p>
  </div>
  
  <div class="metric">
    <h2>Load Statistics</h2>
    <table>
      <tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Total Requests</td><td>${summary.totalRequests}</td></tr>
      <tr><td>Request Rate</td><td>${summary.requestRate} req/s</td></tr>
      <tr><td>Failure Rate</td><td>${summary.failureRate}%</td></tr>
      <tr><td>System Errors (5xx)</td><td>${summary.systemErrors}</td></tr>
    </table>
  </div>
  
  <div class="metric">
    <h2>Performance Metrics</h2>
    <table>
      <tr><th>Percentile</th><th>Response Time (ms)</th></tr>
      <tr><td>Average</td><td>${summary.performance.avgDuration}</td></tr>
      <tr><td>90th Percentile</td><td>${summary.performance.p90Duration}</td></tr>
      <tr><td>95th Percentile</td><td>${summary.performance.p95Duration}</td></tr>
      <tr><td>99th Percentile</td><td>${summary.performance.p99Duration}</td></tr>
      <tr><td>Maximum</td><td>${summary.performance.maxDuration}</td></tr>
    </table>
  </div>
  
  <div class="${summary.breakingPoint.status === 'Not reached' ? 'success' : 'warning'}">
    <h2>Breaking Point Analysis</h2>
    <p><strong>Status:</strong> ${summary.breakingPoint.status}</p>
    ${summary.breakingPoint.indicators.map(indicator => `<p>⚠️ ${indicator}</p>`).join('')}
  </div>
  
  <div class="metric">
    <h2>📋 Recommendations</h2>
    ${summary.recommendations.map(rec => `<div class="recommendation">💡 ${rec}</div>`).join('')}
  </div>
  
  <div class="metric">
    <h2>Next Steps</h2>
    <ol>
      <li>Analyze system logs during peak stress periods</li>
      <li>Monitor resource usage (CPU, memory, database connections)</li>
      <li>Implement recommended optimizations</li>
      <li>Re-run stress test to validate improvements</li>
      <li>Define SLA based on stress test results</li>
    </ol>
  </div>
</body>
</html>
  `
}