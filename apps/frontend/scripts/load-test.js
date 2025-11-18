import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');
const failureCount = new Counter('failures');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 50 }, // Stay at peak
    { duration: '2m', target: 100 }, // Spike
    { duration: '3m', target: 50 }, // Scale back
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.05'], // Error rate under 5%
    errors: ['rate<0.05'],
    response_time: ['p(95)<2000'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';

// Test scenarios
const scenarios = [
  {
    name: 'homepage',
    url: '/',
    weight: 40,
  },
  {
    name: 'login_page',
    url: '/login',
    weight: 20,
  },
  {
    name: 'studio',
    url: '/studio',
    weight: 15,
  },
  {
    name: 'api_health',
    url: '/api/health',
    weight: 10,
  },
  {
    name: 'static_assets',
    url: '/favicon.ico',
    weight: 15,
  },
];

export default function () {
  // Select random scenario based on weight
  const scenario = selectWeightedScenario(scenarios);
  const url = BASE_URL + scenario.url;
  
  console.log(`Testing ${scenario.name}: ${url}`);
  
  const params = {
    headers: {
      'User-Agent': 'K6 Load Test',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
    },
    timeout: '30s',
  };
  
  const response = http.get(url, params);
  
  // Record custom metrics
  responseTime.add(response.timings.duration);
  
  // Checks
  const checkResult = check(response, {
    'status is 200': (r) => r.status === 200,
    'status is not 404': (r) => r.status !== 404,
    'status is not 500': (r) => r.status !== 500,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
    'response time < 5000ms': (r) => r.timings.duration < 5000,
    'body contains expected content': (r) => {
      if (scenario.name === 'api_health') {
        return r.body.includes('healthy') || r.body.includes('ok');
      }
      return r.body.length > 0;
    },
  });
  
  // Record errors
  if (!checkResult['status is 200']) {
    errorRate.add(1);
    failureCount.add(1);
    console.error(`❌ Request failed: ${scenario.name} - Status: ${response.status}`);
  } else {
    errorRate.add(0);
  }
  
  // API-specific tests
  if (scenario.name === 'api_health') {
    check(response, {
      'health endpoint returns JSON': (r) => {
        try {
          JSON.parse(r.body);
          return true;
        } catch {
          return false;
        }
      },
    });
  }
  
  // Performance regression detection
  if (response.timings.duration > 5000) {
    console.warn(`⚠️ Slow response detected: ${scenario.name} took ${response.timings.duration}ms`);
  }
  
  // Simulate user think time
  sleep(Math.random() * 2 + 1);
}

export function handleSummary(data) {
  const summary = {
    timestamp: new Date().toISOString(),
    duration: data.metrics.iteration_duration.avg,
    requests: {
      total: data.metrics.http_reqs.count,
      rate: data.metrics.http_req_rate.rate,
      failed: data.metrics.http_req_failed.rate,
    },
    response_times: {
      avg: data.metrics.http_req_duration.avg,
      min: data.metrics.http_req_duration.min,
      max: data.metrics.http_req_duration.max,
      p90: data.metrics.http_req_duration['p(90)'],
      p95: data.metrics.http_req_duration['p(95)'],
      p99: data.metrics.http_req_duration['p(99)'],
    },
    virtual_users: {
      max: data.metrics.vus_max.max,
    },
    custom_metrics: {
      error_rate: data.metrics.errors ? data.metrics.errors.rate : 0,
      failure_count: data.metrics.failures ? data.metrics.failures.count : 0,
    },
    thresholds: data.thresholds,
  };
  
  // Performance evaluation
  const performance = evaluatePerformance(summary);
  summary.performance_grade = performance.grade;
  summary.recommendations = performance.recommendations;
  
  console.log('\n📊 Load Test Summary:');
  console.log(`   Duration: ${summary.duration.toFixed(2)}ms avg iteration`);
  console.log(`   Requests: ${summary.requests.total} total (${summary.requests.rate.toFixed(2)}/s)`);
  console.log(`   Failed: ${(summary.requests.failed * 100).toFixed(2)}%`);
  console.log(`   Response Times:`);
  console.log(`     Average: ${summary.response_times.avg.toFixed(2)}ms`);
  console.log(`     95th percentile: ${summary.response_times.p95.toFixed(2)}ms`);
  console.log(`     99th percentile: ${summary.response_times.p99.toFixed(2)}ms`);
  console.log(`   Performance Grade: ${performance.grade}`);
  
  if (performance.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    performance.recommendations.forEach(rec => console.log(`   - ${rec}`));
  }
  
  return {
    'load-test-summary.json': JSON.stringify(summary, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function selectWeightedScenario(scenarios) {
  const totalWeight = scenarios.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const scenario of scenarios) {
    random -= scenario.weight;
    if (random <= 0) {
      return scenario;
    }
  }
  
  return scenarios[0]; // Fallback
}

function evaluatePerformance(summary) {
  let grade = 'A';
  const recommendations = [];
  
  // Check response times
  if (summary.response_times.p95 > 2000) {
    grade = grade === 'A' ? 'B' : grade;
    recommendations.push('95th percentile response time is above 2 seconds');
  }
  
  if (summary.response_times.p95 > 5000) {
    grade = 'D';
    recommendations.push('Critical: 95th percentile response time is above 5 seconds');
  }
  
  // Check error rate
  if (summary.requests.failed > 0.05) {
    grade = grade === 'A' ? 'C' : 'D';
    recommendations.push('Error rate is above 5%');
  }
  
  // Check failure count
  if (summary.custom_metrics.failure_count > 0) {
    recommendations.push(`${summary.custom_metrics.failure_count} requests failed`);
  }
  
  // Performance recommendations
  if (summary.response_times.avg > 1000) {
    recommendations.push('Average response time could be improved');
  }
  
  if (summary.requests.rate < 50) {
    recommendations.push('Request rate is lower than expected - check for bottlenecks');
  }
  
  return { grade, recommendations };
}