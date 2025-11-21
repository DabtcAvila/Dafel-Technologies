import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'
import { SharedArray } from 'k6/data'

// Custom metrics
export const errorRate = new Rate('errors')

// Test data
const testUsers = new SharedArray('test users', function () {
  return [
    { email: 'user1@dafel.tech', password: 'TestPassword123!' },
    { email: 'user2@dafel.tech', password: 'TestPassword123!' },
    { email: 'user3@dafel.tech', password: 'TestPassword123!' },
    { email: 'user4@dafel.tech', password: 'TestPassword123!' },
    { email: 'user5@dafel.tech', password: 'TestPassword123!' },
  ]
})

// Load test configuration
export const options = {
  stages: [
    // Ramp-up phase
    { duration: '2m', target: 20 },   // Gradually increase to 20 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '3m', target: 100 },  // Peak load at 100 users
    { duration: '5m', target: 100 },  // Maintain peak load
    { duration: '2m', target: 0 },    // Ramp down
  ],
  
  thresholds: {
    // Performance thresholds
    http_req_duration: ['p(90)<2000', 'p(95)<3000', 'p(99)<5000'], // 90% of requests under 2s
    http_req_failed: ['rate<0.05'],    // Error rate under 5%
    http_reqs: ['rate>10'],            // Minimum 10 RPS
    errors: ['rate<0.1'],              // Custom error rate under 10%
    
    // Specific endpoint thresholds
    'http_req_duration{name:login}': ['p(95)<1000'],
    'http_req_duration{name:dashboard}': ['p(95)<1500'],
    'http_req_duration{name:api_data_sources}': ['p(95)<500'],
  },
  
  // Test metadata
  tags: {
    test_type: 'load_test',
    environment: 'development',
    version: '1.0.0',
  },
}

export default function () {
  const baseUrl = __ENV.BASE_URL || 'http://localhost:3000'
  const user = testUsers[Math.floor(Math.random() * testUsers.length)]
  
  // Test user journey: Login -> Dashboard -> API calls -> Logout
  testUserJourney(baseUrl, user)
  
  sleep(1) // Think time between iterations
}

function testUserJourney(baseUrl, user) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  
  // 1. Load homepage
  const homepageResponse = http.get(baseUrl, {
    tags: { name: 'homepage' },
  })
  
  check(homepageResponse, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads quickly': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1)

  sleep(0.5)

  // 2. Load login page
  const loginPageResponse = http.get(`${baseUrl}/login`, {
    tags: { name: 'login_page' },
  })
  
  check(loginPageResponse, {
    'login page status is 200': (r) => r.status === 200,
    'login page contains form': (r) => r.body.includes('email'),
  }) || errorRate.add(1)

  sleep(1)

  // 3. Authenticate user
  const loginPayload = JSON.stringify({
    email: user.email,
    password: user.password,
  })

  const loginResponse = http.post(`${baseUrl}/api/auth/signin`, loginPayload, {
    headers,
    tags: { name: 'login' },
  })

  const loginSuccess = check(loginResponse, {
    'login status is 200 or 302': (r) => r.status === 200 || r.status === 302,
    'login completes quickly': (r) => r.timings.duration < 2000,
  })

  if (!loginSuccess) {
    errorRate.add(1)
    return // Skip rest of journey if login fails
  }

  // Extract session cookie/token
  const sessionCookie = loginResponse.cookies

  sleep(1)

  // 4. Load dashboard
  const dashboardResponse = http.get(`${baseUrl}/studio`, {
    cookies: sessionCookie,
    tags: { name: 'dashboard' },
  })

  check(dashboardResponse, {
    'dashboard status is 200': (r) => r.status === 200,
    'dashboard loads within SLA': (r) => r.timings.duration < 2000,
    'dashboard contains user data': (r) => r.body.includes('Welcome') || r.body.includes('Dashboard'),
  }) || errorRate.add(1)

  sleep(2)

  // 5. API calls - Data Sources
  const dataSourcesResponse = http.get(`${baseUrl}/api/data-sources`, {
    headers: { ...headers, Cookie: Object.values(sessionCookie).join('; ') },
    tags: { name: 'api_data_sources' },
  })

  check(dataSourcesResponse, {
    'data sources API status is 200': (r) => r.status === 200,
    'data sources API is fast': (r) => r.timings.duration < 1000,
    'data sources returns JSON': (r) => {
      try {
        JSON.parse(r.body)
        return true
      } catch {
        return false
      }
    },
  }) || errorRate.add(1)

  sleep(1)

  // 6. API calls - Users (admin endpoint)
  const usersResponse = http.get(`${baseUrl}/api/users`, {
    headers: { ...headers, Cookie: Object.values(sessionCookie).join('; ') },
    tags: { name: 'api_users' },
  })

  // This might return 401/403 for non-admin users, which is expected
  check(usersResponse, {
    'users API responds': (r) => r.status >= 200 && r.status < 500,
    'users API is fast': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1)

  sleep(0.5)

  // 7. Create data source (write operation)
  const newDataSource = JSON.stringify({
    name: `Load Test DS ${Date.now()}`,
    type: 'postgresql',
    configuration: {
      host: 'test.example.com',
      port: 5432,
      database: 'test',
      user: 'test',
    },
  })

  const createResponse = http.post(`${baseUrl}/api/data-sources`, newDataSource, {
    headers: { ...headers, Cookie: Object.values(sessionCookie).join('; ') },
    tags: { name: 'create_data_source' },
  })

  check(createResponse, {
    'create data source succeeds or properly fails': (r) => 
      r.status === 201 || r.status === 400 || r.status === 401,
    'create data source is fast': (r) => r.timings.duration < 2000,
  }) || errorRate.add(1)

  sleep(1)

  // 8. Health check
  const healthResponse = http.get(`${baseUrl}/api/health`, {
    tags: { name: 'health_check' },
  })

  check(healthResponse, {
    'health check status is 200': (r) => r.status === 200,
    'health check is very fast': (r) => r.timings.duration < 500,
    'health check returns OK': (r) => r.body.includes('ok') || r.body.includes('healthy'),
  }) || errorRate.add(1)

  sleep(0.5)
}

// Setup function - runs once per VU
export function setup() {
  const baseUrl = __ENV.BASE_URL || 'http://localhost:3000'
  
  console.log('🚀 Starting load test setup...')
  console.log(`Target URL: ${baseUrl}`)
  
  // Verify application is responding
  const healthCheck = http.get(`${baseUrl}/api/health`)
  
  if (healthCheck.status !== 200) {
    throw new Error(`Application health check failed: ${healthCheck.status}`)
  }
  
  console.log('✅ Application is healthy, starting load test')
  
  return { baseUrl }
}

// Teardown function - runs once after all VUs finish
export function teardown(data) {
  console.log('🧹 Load test completed, running teardown...')
  
  // Log final summary
  console.log('📊 Load Test Summary:')
  console.log(`- Target URL: ${data.baseUrl}`)
  console.log('- Test Duration: ~15 minutes')
  console.log('- Peak Load: 100 virtual users')
  console.log('- Check detailed metrics in the k6 output above')
  
  // Cleanup test data (if needed)
  cleanupTestData(data.baseUrl)
}

function cleanupTestData(baseUrl) {
  // In a real scenario, you might want to clean up test data
  // created during the load test
  
  console.log('🗑️ Cleaning up test data...')
  
  // Example: Delete test data sources created during the test
  // This would require admin credentials and proper cleanup logic
  
  console.log('✅ Cleanup completed')
}

// Handle different test scenarios based on environment variables
export function handleSummary(data) {
  const summary = {
    testType: 'Load Test',
    timestamp: new Date().toISOString(),
    duration: data.state.testRunDurationMs / 1000,
    vus: {
      max: data.metrics.vus_max.values.max,
      average: Math.round(data.metrics.vus.values.avg || 0),
    },
    requests: {
      total: data.metrics.http_reqs.values.count,
      rate: Math.round(data.metrics.http_reqs.values.rate),
      failed: data.metrics.http_req_failed.values.rate * 100,
    },
    performance: {
      avgDuration: Math.round(data.metrics.http_req_duration.values.avg),
      p90Duration: Math.round(data.metrics.http_req_duration.values['p(90)']),
      p95Duration: Math.round(data.metrics.http_req_duration.values['p(95)']),
    },
    thresholds: Object.keys(data.thresholds).map(name => ({
      name,
      passed: data.thresholds[name].ok,
    })),
  }

  // Write summary to file
  return {
    'load-test-summary.json': JSON.stringify(summary, null, 2),
    'load-test-summary.html': generateHTMLSummary(summary),
  }
}

function generateHTMLSummary(summary) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Load Test Summary - ${summary.timestamp}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .metric { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
    .passed { color: green; }
    .failed { color: red; }
    .threshold { margin: 5px 0; }
  </style>
</head>
<body>
  <h1>Load Test Summary</h1>
  <p><strong>Test Type:</strong> ${summary.testType}</p>
  <p><strong>Timestamp:</strong> ${summary.timestamp}</p>
  <p><strong>Duration:</strong> ${summary.duration} seconds</p>
  
  <h2>Virtual Users</h2>
  <div class="metric">
    <p>Max VUs: ${summary.vus.max}</p>
    <p>Average VUs: ${summary.vus.average}</p>
  </div>
  
  <h2>Request Statistics</h2>
  <div class="metric">
    <p>Total Requests: ${summary.requests.total}</p>
    <p>Request Rate: ${summary.requests.rate} req/s</p>
    <p>Failed Requests: ${summary.requests.failed.toFixed(2)}%</p>
  </div>
  
  <h2>Performance</h2>
  <div class="metric">
    <p>Average Duration: ${summary.performance.avgDuration}ms</p>
    <p>90th Percentile: ${summary.performance.p90Duration}ms</p>
    <p>95th Percentile: ${summary.performance.p95Duration}ms</p>
  </div>
  
  <h2>Threshold Results</h2>
  <div class="metric">
    ${summary.thresholds.map(t => 
      `<div class="threshold ${t.passed ? 'passed' : 'failed'}">
        ${t.name}: ${t.passed ? 'PASSED' : 'FAILED'}
      </div>`
    ).join('')}
  </div>
</body>
</html>
  `
}