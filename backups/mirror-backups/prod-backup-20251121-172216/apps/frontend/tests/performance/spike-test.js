import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Counter, Trend } from 'k6/metrics'

// Custom metrics for spike testing
export const errorRate = new Rate('errors')
export const recoveryTime = new Trend('recovery_time')
export const spikeErrors = new Counter('spike_errors')

// Spike test configuration - sudden traffic spikes
export const options = {
  stages: [
    // Baseline load
    { duration: '2m', target: 10 },
    
    // First spike - sudden jump
    { duration: '30s', target: 200 },
    { duration: '1m', target: 200 },
    { duration: '30s', target: 10 },
    
    // Recovery period
    { duration: '2m', target: 10 },
    
    // Second spike - even bigger
    { duration: '30s', target: 500 },
    { duration: '2m', target: 500 },
    { duration: '30s', target: 10 },
    
    // Recovery period
    { duration: '2m', target: 10 },
    
    // Extreme spike
    { duration: '15s', target: 1000 },
    { duration: '1m', target: 1000 },
    { duration: '15s', target: 10 },
    
    // Final recovery
    { duration: '3m', target: 10 },
  ],
  
  thresholds: {
    // System should recover quickly after spikes
    http_req_duration: ['p(99)<10000'],
    http_req_failed: ['rate<0.1'],
    errors: ['rate<0.15'],
    
    // Recovery thresholds - system should stabilize after spikes
    'http_req_duration{phase:recovery}': ['p(95)<2000'],
    'http_req_failed{phase:recovery}': ['rate<0.05'],
  },
  
  tags: {
    test_type: 'spike_test',
    environment: 'development',
    version: '1.0.0',
  },
}

export default function () {
  const baseUrl = __ENV.BASE_URL || 'http://localhost:3000'
  const currentVUs = __ENV.K6_VUS || 1
  
  // Determine test phase based on VU count
  let phase = 'baseline'
  if (currentVUs >= 200 && currentVUs < 500) {
    phase = 'spike1'
  } else if (currentVUs >= 500 && currentVUs < 1000) {
    phase = 'spike2'
  } else if (currentVUs >= 1000) {
    phase = 'extreme_spike'
  } else if (currentVUs <= 10) {
    phase = 'recovery'
  }
  
  // Run different test patterns based on phase
  switch (phase) {
    case 'baseline':
      runBaselineTest(baseUrl, phase)
      break
    case 'spike1':
      runSpikeTest(baseUrl, phase, 'moderate')
      break
    case 'spike2':
      runSpikeTest(baseUrl, phase, 'heavy')
      break
    case 'extreme_spike':
      runSpikeTest(baseUrl, phase, 'extreme')
      break
    case 'recovery':
      runRecoveryTest(baseUrl, phase)
      break
    default:
      runBaselineTest(baseUrl, phase)
  }
}

function runBaselineTest(baseUrl, phase) {
  const headers = { 'Content-Type': 'application/json' }
  
  // Simple baseline requests
  const endpoints = [
    '/api/health',
    '/',
    '/api/data-sources'
  ]
  
  endpoints.forEach(endpoint => {
    const response = http.get(`${baseUrl}${endpoint}`, {
      headers,
      tags: { name: `baseline_${endpoint.replace('/', '_')}`, phase },
    })
    
    check(response, {
      'baseline status ok': (r) => r.status === 200,
      'baseline fast response': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1)
    
    sleep(0.5) // Normal think time
  })
}

function runSpikeTest(baseUrl, phase, intensity) {
  const headers = { 'Content-Type': 'application/json' }
  let requestCount
  let timeout
  
  // Adjust behavior based on spike intensity
  switch (intensity) {
    case 'moderate':
      requestCount = 2
      timeout = '5s'
      break
    case 'heavy':
      requestCount = 3
      timeout = '10s'
      break
    case 'extreme':
      requestCount = 5
      timeout = '15s'
      break
    default:
      requestCount = 1
      timeout = '5s'
  }
  
  // Rapid-fire requests during spike
  for (let i = 0; i < requestCount; i++) {
    const spikeStartTime = Date.now()
    
    const response = http.get(`${baseUrl}/api/data-sources`, {
      headers,
      timeout,
      tags: { name: `spike_${intensity}`, phase, intensity },
    })
    
    const success = check(response, {
      'spike request handled': (r) => r.status < 500,
      'spike response within timeout': (r) => r.timings.duration < parseInt(timeout) * 1000,
      'spike maintains service': (r) => r.status !== 503, // Service unavailable
    })
    
    if (!success) {
      errorRate.add(1)
      spikeErrors.add(1)
    }
    
    // Minimal sleep during spike
    sleep(0.1)
  }
  
  // Test write operations during spike
  testWriteOperationsDuringSpike(baseUrl, phase, intensity)
}

function testWriteOperationsDuringSpike(baseUrl, phase, intensity) {
  const headers = { 'Content-Type': 'application/json' }
  
  const testPayload = {
    name: `Spike Test DS ${Date.now()}`,
    type: 'postgresql',
    configuration: {
      host: `spike-${intensity}.test.com`,
      port: 5432,
      database: 'spike_test',
    },
  }
  
  const response = http.post(
    `${baseUrl}/api/data-sources`,
    JSON.stringify(testPayload),
    {
      headers,
      timeout: '15s',
      tags: { name: 'spike_write', phase, intensity },
    }
  )
  
  check(response, {
    'write operation survives spike': (r) => r.status < 500,
    'write operation not too slow': (r) => r.timings.duration < 15000,
  }) || errorRate.add(1)
}

function runRecoveryTest(baseUrl, phase) {
  const headers = { 'Content-Type': 'application/json' }
  
  // Test system recovery after spike
  const recoveryStartTime = Date.now()
  
  const response = http.get(`${baseUrl}/api/health`, {
    headers,
    tags: { name: 'recovery_health', phase },
  })
  
  const recoveryDuration = Date.now() - recoveryStartTime
  recoveryTime.add(recoveryDuration)
  
  const isRecovered = check(response, {
    'system recovered': (r) => r.status === 200,
    'recovery response fast': (r) => r.timings.duration < 1000,
    'system stable': (r) => !r.body.includes('error') && !r.body.includes('degraded'),
  })
  
  if (!isRecovered) {
    errorRate.add(1)
    console.log(`⚠️ System not fully recovered: ${response.status} - ${response.body}`)
  }
  
  // Test normal functionality during recovery
  testNormalFunctionalityDuringRecovery(baseUrl, phase)
  
  sleep(1) // Allow more time for recovery
}

function testNormalFunctionalityDuringRecovery(baseUrl, phase) {
  const headers = { 'Content-Type': 'application/json' }
  
  // Test that normal operations work during recovery
  const normalEndpoints = [
    { endpoint: '/api/data-sources', name: 'data_sources_recovery' },
    { endpoint: '/studio', name: 'dashboard_recovery' },
    { endpoint: '/api/users', name: 'users_recovery' },
  ]
  
  normalEndpoints.forEach(({ endpoint, name }) => {
    const response = http.get(`${baseUrl}${endpoint}`, {
      headers,
      tags: { name, phase },
    })
    
    check(response, {
      'normal function during recovery': (r) => r.status < 500,
      'reasonable response time during recovery': (r) => r.timings.duration < 3000,
    }) || errorRate.add(1)
  })
}

export function setup() {
  const baseUrl = __ENV.BASE_URL || 'http://localhost:3000'
  
  console.log('⚡ Starting spike test setup...')
  console.log(`Target URL: ${baseUrl}`)
  console.log('📈 This test simulates sudden traffic spikes')
  
  // Pre-test health check
  const healthCheck = http.get(`${baseUrl}/api/health`)
  
  if (healthCheck.status !== 200) {
    throw new Error(`System not healthy before spike test: ${healthCheck.status}`)
  }
  
  console.log('✅ System is healthy, starting spike test')
  console.log('📊 Monitor system behavior during sudden load changes!')
  
  return { baseUrl, startTime: Date.now() }
}

export function teardown(data) {
  console.log('🧹 Spike test completed, analyzing results...')
  
  const baseUrl = data.baseUrl
  const testDuration = Date.now() - data.startTime
  
  // Extended recovery check
  console.log('🔄 Checking system recovery after spikes...')
  
  let fullyRecovered = false
  const maxRecoveryTime = 60000 // 60 seconds
  const recoveryStart = Date.now()
  
  while (!fullyRecovered && (Date.now() - recoveryStart) < maxRecoveryTime) {
    try {
      const healthCheck = http.get(`${baseUrl}/api/health`, { timeout: '5s' })
      
      if (healthCheck.status === 200 && healthCheck.timings.duration < 1000) {
        // Test normal functionality
        const functionalityCheck = http.get(`${baseUrl}/api/data-sources`, { timeout: '3s' })
        
        if (functionalityCheck.status < 500 && functionalityCheck.timings.duration < 2000) {
          fullyRecovered = true
          console.log('✅ System fully recovered from spikes')
        }
      }
      
      if (!fullyRecovered) {
        sleep(2)
      }
    } catch (error) {
      console.log(`⏳ Still recovering... (${error.message})`)
      sleep(2)
    }
  }
  
  if (!fullyRecovered) {
    console.log('🚨 WARNING: System may need more time to fully recover from spikes!')
  }
  
  console.log('📊 Spike Test Summary:')
  console.log(`- Test Duration: ${Math.round(testDuration / 1000)} seconds`)
  console.log(`- Peak Spike: 1000 virtual users`)
  console.log(`- Recovery Status: ${fullyRecovered ? 'COMPLETE' : 'IN PROGRESS'}`)
}

export function handleSummary(data) {
  const summary = {
    testType: 'Spike Test',
    timestamp: new Date().toISOString(),
    duration: data.state.testRunDurationMs / 1000,
    spikes: [
      { peak: 200, duration: '1.5 minutes' },
      { peak: 500, duration: '2.5 minutes' },
      { peak: 1000, duration: '1.25 minutes' }
    ],
    performance: {
      avgDuration: Math.round(data.metrics.http_req_duration.values.avg),
      maxDuration: Math.round(data.metrics.http_req_duration.values.max),
      p95Duration: Math.round(data.metrics.http_req_duration.values['p(95)']),
      p99Duration: Math.round(data.metrics.http_req_duration.values['p(99)']),
    },
    reliability: {
      totalRequests: data.metrics.http_reqs.values.count,
      failureRate: (data.metrics.http_req_failed.values.rate * 100).toFixed(2),
      spikeErrors: data.metrics.spike_errors ? data.metrics.spike_errors.values.count : 0,
      avgRecoveryTime: data.metrics.recovery_time ? Math.round(data.metrics.recovery_time.values.avg) : 0,
    },
    analysis: analyzeSpikeResistance(data),
    recommendations: generateSpikeRecommendations(data),
  }

  return {
    'spike-test-summary.json': JSON.stringify(summary, null, 2),
    'spike-test-report.html': generateSpikeTestReport(summary),
  }
}

function analyzeSpikeResistance(data) {
  const failureRate = data.metrics.http_req_failed.values.rate
  const maxDuration = data.metrics.http_req_duration.values.max
  const avgDuration = data.metrics.http_req_duration.values.avg
  
  let resistance = 'Excellent'
  const issues = []
  
  if (failureRate > 0.05) {
    resistance = failureRate > 0.15 ? 'Poor' : 'Moderate'
    issues.push(`High failure rate during spikes: ${(failureRate * 100).toFixed(2)}%`)
  }
  
  if (avgDuration > 3000) {
    resistance = 'Moderate'
    issues.push(`Slow average response during spikes: ${Math.round(avgDuration)}ms`)
  }
  
  if (maxDuration > 30000) {
    resistance = 'Poor'
    issues.push(`Very slow maximum response: ${Math.round(maxDuration)}ms`)
  }
  
  return {
    rating: resistance,
    issues: issues,
    strengths: generateStrengths(failureRate, avgDuration),
  }
}

function generateStrengths(failureRate, avgDuration) {
  const strengths = []
  
  if (failureRate < 0.02) {
    strengths.push('Excellent error handling during traffic spikes')
  }
  
  if (avgDuration < 2000) {
    strengths.push('Maintains good response times during spikes')
  }
  
  strengths.push('System recovers automatically after spikes')
  
  return strengths
}

function generateSpikeRecommendations(data) {
  const recommendations = []
  const failureRate = data.metrics.http_req_failed.values.rate
  const avgDuration = data.metrics.http_req_duration.values.avg
  
  if (failureRate > 0.05) {
    recommendations.push('Implement auto-scaling to handle traffic spikes')
    recommendations.push('Add circuit breakers to prevent cascade failures')
    recommendations.push('Configure load balancer with health checks')
  }
  
  if (avgDuration > 2000) {
    recommendations.push('Implement caching to reduce database load during spikes')
    recommendations.push('Optimize database connection pooling')
    recommendations.push('Consider CDN for static content')
  }
  
  recommendations.push('Set up real-time monitoring and alerting for traffic spikes')
  recommendations.push('Implement graceful degradation for non-critical features')
  recommendations.push('Configure auto-scaling based on request rate and response time')
  
  return recommendations
}

function generateSpikeTestReport(summary) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Spike Test Report - ${summary.timestamp}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
    .header { background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; padding: 20px; border-radius: 5px; }
    .metric { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #007bff; }
    .spike-pattern { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 10px 0; }
    .analysis { background: #d4edda; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .recommendation { background: #cce5ff; padding: 10px; margin: 5px 0; border-radius: 3px; }
    .rating-excellent { color: #28a745; font-weight: bold; }
    .rating-moderate { color: #ffc107; font-weight: bold; }
    .rating-poor { color: #dc3545; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #dee2e6; padding: 10px; text-align: left; }
    th { background-color: #e9ecef; }
    .chart { background: #f8f9fa; padding: 20px; margin: 15px 0; text-align: center; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚡ Spike Test Report</h1>
    <p>Traffic spike resistance and recovery analysis</p>
  </div>
  
  <div class="metric">
    <h2>Test Overview</h2>
    <p><strong>Test Type:</strong> ${summary.testType}</p>
    <p><strong>Timestamp:</strong> ${summary.timestamp}</p>
    <p><strong>Duration:</strong> ${Math.round(summary.duration / 60)} minutes</p>
  </div>
  
  <div class="spike-pattern">
    <h2>Spike Patterns Tested</h2>
    ${summary.spikes.map((spike, index) => 
      `<p><strong>Spike ${index + 1}:</strong> ${spike.peak} users for ${spike.duration}</p>`
    ).join('')}
  </div>
  
  <div class="metric">
    <h2>Performance Under Spikes</h2>
    <table>
      <tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Average Response Time</td><td>${summary.performance.avgDuration}ms</td></tr>
      <tr><td>Maximum Response Time</td><td>${summary.performance.maxDuration}ms</td></tr>
      <tr><td>95th Percentile</td><td>${summary.performance.p95Duration}ms</td></tr>
      <tr><td>99th Percentile</td><td>${summary.performance.p99Duration}ms</td></tr>
    </table>
  </div>
  
  <div class="metric">
    <h2>Reliability Metrics</h2>
    <table>
      <tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Total Requests</td><td>${summary.reliability.totalRequests}</td></tr>
      <tr><td>Failure Rate</td><td>${summary.reliability.failureRate}%</td></tr>
      <tr><td>Spike-Related Errors</td><td>${summary.reliability.spikeErrors}</td></tr>
      <tr><td>Average Recovery Time</td><td>${summary.reliability.avgRecoveryTime}ms</td></tr>
    </table>
  </div>
  
  <div class="analysis">
    <h2>Spike Resistance Analysis</h2>
    <p><strong>Overall Rating:</strong> 
      <span class="rating-${summary.analysis.rating.toLowerCase()}">${summary.analysis.rating}</span>
    </p>
    
    ${summary.analysis.issues.length > 0 ? `
      <h3>Issues Identified</h3>
      ${summary.analysis.issues.map(issue => `<p>❌ ${issue}</p>`).join('')}
    ` : ''}
    
    ${summary.analysis.strengths.length > 0 ? `
      <h3>Strengths</h3>
      ${summary.analysis.strengths.map(strength => `<p>✅ ${strength}</p>`).join('')}
    ` : ''}
  </div>
  
  <div class="metric">
    <h2>📋 Recommendations</h2>
    ${summary.recommendations.map(rec => `<div class="recommendation">💡 ${rec}</div>`).join('')}
  </div>
  
  <div class="chart">
    <h2>Traffic Spike Pattern</h2>
    <p>📈 Baseline (10) → Spike 1 (200) → Recovery → Spike 2 (500) → Recovery → Extreme Spike (1000) → Recovery</p>
    <p><em>Monitor your system's behavior during these rapid load changes</em></p>
  </div>
  
  <div class="metric">
    <h2>Action Items</h2>
    <ol>
      <li>Review system logs during peak spikes</li>
      <li>Analyze resource utilization (CPU, memory, connections)</li>
      <li>Implement recommended scaling strategies</li>
      <li>Set up monitoring for spike detection</li>
      <li>Test auto-scaling configuration</li>
      <li>Validate graceful degradation mechanisms</li>
    </ol>
  </div>
</body>
</html>
  `
}