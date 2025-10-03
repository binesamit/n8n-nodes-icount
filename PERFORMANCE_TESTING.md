# Performance Testing Guide

This guide explains how to use the performance testing infrastructure in the n8n-nodes-icount package.

## Overview

The performance testing suite includes three types of tests:
- **Load Testing**: Tests system behavior under normal and high load conditions
- **Stress Testing**: Gradually increases load to find breaking points and maximum capacity
- **Rate Limit Testing**: Tests API throttling behavior and recovery mechanisms

## Running Performance Tests

```bash
# Run all performance tests
npm run test:performance

# Run specific test suites
npm test tests/performance/load.test.ts
npm test tests/performance/stress.test.ts
npm test tests/performance/rateLimit.test.ts

# Run with verbose output
npm test -- tests/performance --verbose
```

## Test Types

### 1. Load Testing (`load.test.ts`)

Tests how the system handles various load levels with controlled concurrency.

**Test Scenarios:**
- **Customer Creation Load**: 50 concurrent requests, 100 sequential requests
- **Hebrew Data Support**: Tests with Hebrew customer data
- **Document Search Load**: 100 concurrent search requests
- **Large Result Sets**: Handling 100-item responses
- **Mixed Operations**: Alternating customer and document operations
- **Performance Benchmarks**: Baseline measurements and comparisons

**Key Metrics:**
```typescript
Performance Metrics:
  Total Requests: 50
  Successful: 50 (100.0%)
  Failed: 0 (0.0%)

  Response Times:
    Average: 45.23ms
    Min: 12.34ms
    Max: 123.45ms
    P95: 98.76ms
    P99: 115.43ms

  Throughput:
    Requests/sec: 125.34
    Duration: 0.40s
```

**Example:**
```typescript
const metrics = await runLoadTest(testFunction, {
  concurrency: 10,      // 10 concurrent requests
  totalRequests: 50,    // 50 total requests
});

expect(metrics.successfulRequests).toBe(50);
expect(metrics.averageResponseTime).toBeLessThan(1000);
expect(metrics.requestsPerSecond).toBeGreaterThan(10);
```

### 2. Stress Testing (`stress.test.ts`)

Gradually increases load until the system reaches its limits.

**Test Scenarios:**
- **Customer Creation Stress**: 5 → 50 concurrent requests (step: 5)
- **Gradual Load Increase**: 1 → 20 concurrent requests (step: 2)
- **Document Creation Stress**: 3 → 30 concurrent requests (step: 3)
- **Memory Stress**: 500 sequential operations with heap tracking
- **Large Payload Stress**: 5000-character fields, 2 → 10 concurrent
- **Recovery Testing**: 20% simulated failure rate

**Key Metrics:**
```typescript
Max Successful Concurrency: 45
Failure Point: 50

Metrics per concurrency level:
Concurrency 5:
  Success Rate: 100.0%
  Avg Response: 42ms
  Throughput: 118.5 req/s

Concurrency 50:
  Success Rate: 82.0%
  Avg Response: 5234ms
  Throughput: 9.2 req/s
```

**Example:**
```typescript
const result = await runStressTest(testFunction, {
  startConcurrency: 5,      // Start with 5 concurrent
  maxConcurrency: 50,       // Max 50 concurrent
  stepSize: 5,              // Increase by 5 each step
  requestsPerStep: 25,      // 25 requests per level
});

console.log(`Max Successful: ${result.maxSuccessfulConcurrency}`);
console.log(`Failure Point: ${result.failurePoint}`);
```

**Failure Criteria:**
- More than 10% failures
- Average response time > 5 seconds

### 3. Rate Limit Testing (`rateLimit.test.ts`)

Tests API rate limiting detection and recovery mechanisms.

**Test Scenarios:**
- **Rate Limit Detection**: Detect 429 errors at 100 req/s
- **Controlled Rate**: Stay under limit at 25 req/s
- **Burst Handling**: 50 requests quickly, then normal rate
- **Recovery**: Wait for rate limit reset and retry
- **Multi-User Simulation**: 5 concurrent users sharing limit
- **Exponential Backoff**: 100ms → 200ms → 400ms delays
- **Request Queuing**: 10 req/s controlled processing

**Key Metrics:**
```typescript
Rate Limit Detection Test:
  Total Requests: 100
  Successful: 50
  Rate Limited: 50
  Average Delay: 12.34ms

Exponential Backoff Test:
  Total Attempts: 4
  Backoff Delays: 100, 200, 400ms
  Success on attempt 4
```

**Example:**
```typescript
const result = await testRateLimit(testFunction, {
  requestsPerSecond: 100,   // Request rate
  duration: 1,              // Duration in seconds
});

expect(result.rateLimitedRequests).toBeGreaterThan(0);
expect(result.successfulRequests).toBeLessThanOrEqual(50);
```

## Performance Utilities

### `runLoadTest(testFunction, config)`

Execute controlled load testing with batched concurrency.

```typescript
interface LoadTestConfig {
  concurrency: number;      // Concurrent requests per batch
  totalRequests: number;    // Total number of requests
  rampUpTime?: number;      // Optional ramp-up period
  maxDuration?: number;     // Optional max duration
}
```

### `runStressTest(testFunction, options)`

Gradually increase load to find system limits.

```typescript
interface StressTestOptions {
  startConcurrency: number;   // Starting concurrency level
  maxConcurrency: number;     // Maximum to test
  stepSize: number;           // Increment per step
  requestsPerStep: number;    // Requests at each level
}
```

### `testRateLimit(testFunction, config)`

Test rate limiting behavior with precise timing.

```typescript
interface RateLimitConfig {
  requestsPerSecond: number;  // Target request rate
  duration: number;           // Test duration (seconds)
  burstSize?: number;         // Optional burst size
}
```

### Helper Functions

```typescript
// Sleep for specified milliseconds
await sleep(1000);

// Format metrics for console output
console.log(formatMetrics(metrics));

// Create throttled function with concurrency limit
const throttled = throttle(fn, 10); // Max 10 concurrent
```

## Understanding Metrics

### Response Times

- **Average**: Mean response time across all requests
- **Min/Max**: Fastest and slowest response times
- **P95**: 95th percentile - 95% of requests were faster than this
- **P99**: 99th percentile - 99% of requests were faster than this

**Why P95/P99 matter:** They show worst-case scenarios better than averages.

### Throughput

- **Requests/sec**: How many requests completed per second
- **Duration**: Total test duration in seconds

### Success Rates

- **Successful Requests**: Completed without errors
- **Failed Requests**: Threw exceptions or returned errors
- **Rate Limited Requests**: Received 429 status codes

## Performance Benchmarks

Expected performance for mock tests (no real API calls):

| Test Type | Concurrency | Requests | Avg Response | Throughput |
|-----------|-------------|----------|--------------|------------|
| Load - Sequential | 1 | 100 | < 200ms | > 5 req/s |
| Load - Concurrent | 10 | 50 | < 1000ms | > 10 req/s |
| Stress - Low | 5 | 25 | < 500ms | > 50 req/s |
| Stress - Medium | 20 | 25 | < 1500ms | > 13 req/s |
| Search - Concurrent | 20 | 100 | < 800ms | > 25 req/s |

**Note:** Real API performance will be slower due to network latency and actual processing time.

## Best Practices

### 1. Start Small
Begin with low concurrency and gradually increase:
```typescript
// Good
startConcurrency: 1,
stepSize: 2,

// Risky
startConcurrency: 100,
stepSize: 100,
```

### 2. Monitor Memory
Check heap usage for long-running tests:
```typescript
const startMemory = process.memoryUsage();
// ... run tests ...
const endMemory = process.memoryUsage();
const heapGrowth = (endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024;
console.log(`Heap Growth: ${heapGrowth.toFixed(2)}MB`);
```

### 3. Use Appropriate Timeouts
Performance tests need longer timeouts:
```typescript
test('stress test', async () => {
  // ... test code ...
}, 300000); // 5 minutes for stress test
```

### 4. Interpret Results Carefully
Mock tests show code performance, not API performance:
- Mock tests: Test your code's overhead
- Real API tests: Add network + processing time
- Use mocks for regression testing
- Use real API for capacity planning

### 5. Handle Rate Limits Gracefully
Implement exponential backoff for production code:
```typescript
let delay = 100;
while (!success && attempts < maxAttempts) {
  try {
    await apiCall();
    success = true;
  } catch (error) {
    if (error.statusCode === 429) {
      await sleep(delay);
      delay *= 2; // Exponential backoff
    }
  }
}
```

## Troubleshooting

### Tests Timing Out

Increase timeout or reduce test size:
```typescript
test('large test', async () => {
  // ... test code ...
}, 600000); // 10 minutes
```

### Memory Issues

Reduce concurrency or total requests:
```typescript
// Before
totalRequests: 1000,
concurrency: 100,

// After
totalRequests: 100,
concurrency: 10,
```

### Inconsistent Results

Run multiple times and average results:
```bash
for i in {1..5}; do npm test tests/performance/load.test.ts; done
```

### Mock Responses Not Working

Verify mock setup in beforeEach:
```typescript
beforeEach(() => {
  mockContext = createMockExecuteFunctions();
  mockContext.helpers.requestWithAuthentication = jest.fn()
    .mockResolvedValue({ status: true, data: {...} });
});
```

## CI/CD Integration

Performance tests are excluded from standard CI runs due to long duration.

To run in CI:
```yaml
- name: Run Performance Tests
  run: npm run test:performance
  timeout-minutes: 30
  if: github.event_name == 'schedule' # Run nightly
```

## Real API Testing

To test against real iCount API (use with caution):

1. Create `.env.test` with real credentials
2. Update mock implementations to use real API
3. Add rate limiting to avoid hitting API limits
4. Run during off-peak hours
5. Monitor API usage carefully

**Warning:** Performance testing with real API can:
- Consume API quota
- Create test data that needs cleanup
- Trigger rate limiting
- Cost money

## Further Reading

- [Jest Configuration](https://jestjs.io/docs/configuration)
- [iCount API Documentation](https://api.icount.co.il/api/documentation)
- [Performance Testing Best Practices](https://github.com/goldbergyoni/nodebestpractices#-83-performance-testing)

## Support

For issues or questions:
1. Check existing test examples in `tests/performance/`
2. Review performance utilities in `tests/performance/helpers/performanceUtils.ts`
3. Open an issue on GitHub
