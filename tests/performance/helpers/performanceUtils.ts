/**
 * Performance Testing Utilities
 *
 * Helpers for load testing, stress testing, and performance monitoring
 */

export interface PerformanceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  requestsPerSecond: number;
  duration: number;
}

export interface LoadTestConfig {
  concurrency: number;
  totalRequests: number;
  rampUpTime?: number;
  maxDuration?: number;
}

export interface RateLimitConfig {
  requestsPerSecond: number;
  duration: number;
  burstSize?: number;
}

/**
 * Execute load test with controlled concurrency
 */
export async function runLoadTest(
  testFunction: () => Promise<any>,
  config: LoadTestConfig
): Promise<PerformanceMetrics> {
  const startTime = Date.now();
  const responseTimes: number[] = [];
  let successCount = 0;
  let failureCount = 0;

  const { concurrency, totalRequests } = config;
  const batches = Math.ceil(totalRequests / concurrency);

  for (let batch = 0; batch < batches; batch++) {
    const batchSize = Math.min(concurrency, totalRequests - batch * concurrency);
    const promises: Promise<void>[] = [];

    for (let i = 0; i < batchSize; i++) {
      const promise = (async () => {
        const requestStart = Date.now();
        try {
          await testFunction();
          successCount++;
        } catch (error) {
          failureCount++;
        } finally {
          const requestEnd = Date.now();
          responseTimes.push(requestEnd - requestStart);
        }
      })();

      promises.push(promise);
    }

    await Promise.all(promises);
  }

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000; // seconds

  return calculateMetrics(responseTimes, successCount, failureCount, duration);
}

/**
 * Run stress test - gradually increase load until failure
 */
export async function runStressTest(
  testFunction: () => Promise<any>,
  options: {
    startConcurrency: number;
    maxConcurrency: number;
    stepSize: number;
    requestsPerStep: number;
  }
): Promise<{
  maxSuccessfulConcurrency: number;
  failurePoint: number;
  metrics: PerformanceMetrics[];
}> {
  const { startConcurrency, maxConcurrency, stepSize, requestsPerStep } = options;
  const metrics: PerformanceMetrics[] = [];
  let currentConcurrency = startConcurrency;
  let maxSuccessful = startConcurrency;

  while (currentConcurrency <= maxConcurrency) {
    const result = await runLoadTest(testFunction, {
      concurrency: currentConcurrency,
      totalRequests: requestsPerStep,
    });

    metrics.push(result);

    // If more than 10% failures or average response time > 5 seconds, we've hit the limit
    const failureRate = result.failedRequests / result.totalRequests;
    if (failureRate > 0.1 || result.averageResponseTime > 5000) {
      return {
        maxSuccessfulConcurrency: maxSuccessful,
        failurePoint: currentConcurrency,
        metrics,
      };
    }

    maxSuccessful = currentConcurrency;
    currentConcurrency += stepSize;
  }

  return {
    maxSuccessfulConcurrency: maxSuccessful,
    failurePoint: -1, // No failure found
    metrics,
  };
}

/**
 * Test rate limiting behavior
 */
export async function testRateLimit(
  testFunction: () => Promise<any>,
  config: RateLimitConfig
): Promise<{
  totalRequests: number;
  successfulRequests: number;
  rateLimitedRequests: number;
  averageDelay: number;
}> {
  const { requestsPerSecond, duration } = config;
  const delayBetweenRequests = 1000 / requestsPerSecond;
  const totalRequests = Math.floor(requestsPerSecond * duration);

  let successCount = 0;
  let rateLimitCount = 0;
  const delays: number[] = [];

  const startTime = Date.now();

  for (let i = 0; i < totalRequests; i++) {
    const requestStart = Date.now();

    try {
      await testFunction();
      successCount++;
    } catch (error: any) {
      // Check if it's a rate limit error (429)
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        rateLimitCount++;
      }
    }

    const requestEnd = Date.now();
    const elapsed = requestEnd - requestStart;
    delays.push(elapsed);

    // Wait for next request according to rate
    const nextRequestTime = startTime + (i + 1) * delayBetweenRequests;
    const waitTime = Math.max(0, nextRequestTime - Date.now());
    if (waitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  const averageDelay = delays.reduce((sum, d) => sum + d, 0) / delays.length;

  return {
    totalRequests,
    successfulRequests: successCount,
    rateLimitedRequests: rateLimitCount,
    averageDelay,
  };
}

/**
 * Calculate performance metrics from response times
 */
function calculateMetrics(
  responseTimes: number[],
  successCount: number,
  failureCount: number,
  duration: number
): PerformanceMetrics {
  const sorted = [...responseTimes].sort((a, b) => a - b);
  const total = responseTimes.length;

  return {
    totalRequests: total,
    successfulRequests: successCount,
    failedRequests: failureCount,
    averageResponseTime: responseTimes.reduce((sum, t) => sum + t, 0) / total,
    minResponseTime: Math.min(...responseTimes),
    maxResponseTime: Math.max(...responseTimes),
    p95ResponseTime: sorted[Math.floor(total * 0.95)] || 0,
    p99ResponseTime: sorted[Math.floor(total * 0.99)] || 0,
    requestsPerSecond: total / duration,
    duration,
  };
}

/**
 * Format metrics for display
 */
export function formatMetrics(metrics: PerformanceMetrics): string {
  return `
Performance Metrics:
  Total Requests: ${metrics.totalRequests}
  Successful: ${metrics.successfulRequests} (${((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(1)}%)
  Failed: ${metrics.failedRequests} (${((metrics.failedRequests / metrics.totalRequests) * 100).toFixed(1)}%)

  Response Times:
    Average: ${metrics.averageResponseTime.toFixed(2)}ms
    Min: ${metrics.minResponseTime.toFixed(2)}ms
    Max: ${metrics.maxResponseTime.toFixed(2)}ms
    P95: ${metrics.p95ResponseTime.toFixed(2)}ms
    P99: ${metrics.p99ResponseTime.toFixed(2)}ms

  Throughput:
    Requests/sec: ${metrics.requestsPerSecond.toFixed(2)}
    Duration: ${metrics.duration.toFixed(2)}s
  `.trim();
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a throttled version of a function
 */
export function throttle<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  limit: number
): T {
  let running = 0;
  const queue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
    args: any[];
  }> = [];

  const processQueue = () => {
    if (queue.length === 0 || running >= limit) return;

    running++;
    const { resolve, reject, args } = queue.shift()!;

    fn(...args)
      .then((result) => {
        resolve(result);
        running--;
        processQueue();
      })
      .catch((error) => {
        reject(error);
        running--;
        processQueue();
      });
  };

  return ((...args: any[]) => {
    return new Promise((resolve, reject) => {
      queue.push({ resolve, reject, args });
      processQueue();
    });
  }) as T;
}
