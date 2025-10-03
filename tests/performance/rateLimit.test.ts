/**
 * Rate Limit Testing - API Throttling Behavior
 *
 * Tests how the system handles rate limiting and request throttling
 */

import { testRateLimit, sleep } from './helpers/performanceUtils';
import { createMockExecuteFunctions } from '../helpers/mockN8nContext';
import { executeCreateCustomer } from '../../nodes/ICount/resources/customer/create.operation';
import { executeSearch as executeSearchDocument } from '../../nodes/ICount/resources/document/search.operation';

describe('Performance - Rate Limit Testing', () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockContext.getCredentials = jest.fn().mockResolvedValue({
      token: 'test-token',
    });
    mockContext.helpers.requestWithAuthentication = jest.fn();
  });

  describe('API Rate Limit Detection', () => {
    test('should detect rate limiting at 100 requests/second', async () => {
      let requestCount = 0;
      const RATE_LIMIT = 50; // Simulate 50 req/s limit

      mockContext.setParameters({
        name: 'Rate Limit Test',
        email: 'ratelimit@test.com',
      });

      mockContext.helpers.requestWithAuthentication.mockImplementation(async () => {
        requestCount++;

        // Simulate rate limit after 50 requests in a second
        if (requestCount > RATE_LIMIT) {
          throw new Error('429 - Rate limit exceeded');
        }

        return {
          status: true,
          data: { client_id: `rate-${requestCount}` },
        };
      });

      const testFunction = async () => {
        return await executeCreateCustomer.call(mockContext, 0);
      };

      const result = await testRateLimit(testFunction, {
        requestsPerSecond: 100,
        duration: 1,
      });

      console.log('\n=== Rate Limit Detection Test ===');
      console.log(`Total Requests: ${result.totalRequests}`);
      console.log(`Successful: ${result.successfulRequests}`);
      console.log(`Rate Limited: ${result.rateLimitedRequests}`);
      console.log(`Average Delay: ${result.averageDelay.toFixed(2)}ms`);

      // Should hit rate limit
      expect(result.rateLimitedRequests).toBeGreaterThan(0);
      expect(result.successfulRequests).toBeLessThanOrEqual(RATE_LIMIT);
    }, 30000);

    test('should stay under rate limit with controlled requests', async () => {
      let requestCount = 0;
      const RATE_LIMIT = 30; // 30 req/s limit

      mockContext.setParameters({
        name: 'Controlled Rate Test',
        email: 'controlled@test.com',
      });

      mockContext.helpers.requestWithAuthentication.mockImplementation(async () => {
        requestCount++;

        if (requestCount > RATE_LIMIT) {
          throw new Error('429 - Rate limit exceeded');
        }

        return {
          status: true,
          data: { client_id: `controlled-${requestCount}` },
        };
      });

      const testFunction = async () => {
        return await executeCreateCustomer.call(mockContext, 0);
      };

      // Request at 25 req/s - below the limit
      const result = await testRateLimit(testFunction, {
        requestsPerSecond: 25,
        duration: 1,
      });

      console.log('\n=== Controlled Rate Test (Under Limit) ===');
      console.log(`Requested Rate: 25 req/s`);
      console.log(`Total Requests: ${result.totalRequests}`);
      console.log(`Successful: ${result.successfulRequests}`);
      console.log(`Rate Limited: ${result.rateLimitedRequests}`);

      // Should not hit rate limit
      expect(result.rateLimitedRequests).toBe(0);
      expect(result.successfulRequests).toBe(result.totalRequests);
    }, 30000);
  });

  describe('Burst Handling', () => {
    test('should handle burst of requests followed by normal rate', async () => {
      let requestCount = 0;

      mockContext.setParameters({
        name: 'Burst Test Customer',
        email: 'burst@test.com',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'burst-' + Math.random() },
      });

      // Burst: 50 requests quickly
      const startTime = Date.now();
      const burstPromises: Promise<any>[] = [];

      for (let i = 0; i < 50; i++) {
        burstPromises.push(executeCreateCustomer.call(mockContext, 0));
      }

      await Promise.all(burstPromises);
      const burstDuration = Date.now() - startTime;

      console.log('\n=== Burst Test ===');
      console.log(`Burst Size: 50 requests`);
      console.log(`Burst Duration: ${burstDuration}ms`);
      console.log(`Burst Rate: ${((50 / burstDuration) * 1000).toFixed(2)} req/s`);

      // Wait a bit
      await sleep(1000);

      // Normal rate: 10 requests over 1 second
      const normalStart = Date.now();
      for (let i = 0; i < 10; i++) {
        await executeCreateCustomer.call(mockContext, 0);
        await sleep(100); // 10 req/s
      }
      const normalDuration = Date.now() - normalStart;

      console.log(`Normal Rate: ${((10 / normalDuration) * 1000).toFixed(2)} req/s`);

      // Both should succeed
      expect(burstDuration).toBeLessThan(5000);
      expect(normalDuration).toBeGreaterThan(900);
    }, 30000);

    test('should recover after hitting rate limit', async () => {
      let requestCount = 0;
      const resetTime = Date.now() + 2000; // Reset after 2 seconds

      mockContext.setParameters({
        name: 'Recovery Test',
        email: 'recovery@test.com',
      });

      mockContext.helpers.requestWithAuthentication.mockImplementation(async () => {
        requestCount++;

        // Rate limit first 30 requests, then allow after reset
        if (requestCount <= 30 && Date.now() < resetTime) {
          if (requestCount > 20) {
            throw new Error('429 - Rate limit exceeded - wait and retry');
          }
        }

        return {
          status: true,
          data: { client_id: `recovery-${requestCount}` },
        };
      });

      const testFunction = async () => {
        return await executeCreateCustomer.call(mockContext, 0);
      };

      // First wave - will hit limit
      const firstWave = await testRateLimit(testFunction, {
        requestsPerSecond: 30,
        duration: 1,
      });

      console.log('\n=== Rate Limit Recovery Test ===');
      console.log('\nFirst Wave (Will Hit Limit):');
      console.log(`Successful: ${firstWave.successfulRequests}`);
      console.log(`Rate Limited: ${firstWave.rateLimitedRequests}`);

      // Wait for rate limit to reset
      await sleep(2500);

      // Second wave - should succeed
      requestCount = 0; // Reset counter
      const secondWave = await testRateLimit(testFunction, {
        requestsPerSecond: 15,
        duration: 1,
      });

      console.log('\nSecond Wave (After Recovery):');
      console.log(`Successful: ${secondWave.successfulRequests}`);
      console.log(`Rate Limited: ${secondWave.rateLimitedRequests}`);

      // Second wave should not hit rate limit
      expect(secondWave.rateLimitedRequests).toBe(0);
    }, 30000);
  });

  describe('Concurrent User Simulation', () => {
    test('should simulate multiple users hitting rate limit', async () => {
      const USER_COUNT = 5;
      const REQUESTS_PER_USER = 20;
      let totalRequests = 0;

      mockContext.helpers.requestWithAuthentication.mockImplementation(async () => {
        totalRequests++;

        // Simulate shared rate limit of 50 req/s across all users
        if (totalRequests > 50) {
          throw new Error('429 - Shared rate limit exceeded');
        }

        return {
          status: true,
          data: { client_id: `user-${Math.random()}` },
        };
      });

      // Simulate multiple users making requests concurrently
      const userPromises = Array(USER_COUNT)
        .fill(null)
        .map(async (_, userId) => {
          mockContext.setParameters({
            name: `User ${userId} Customer`,
            email: `user${userId}@test.com`,
          });

          const testFunction = async () => {
            return await executeCreateCustomer.call(mockContext, 0);
          };

          return await testRateLimit(testFunction, {
            requestsPerSecond: REQUESTS_PER_USER,
            duration: 1,
          });
        });

      const results = await Promise.all(userPromises);

      console.log('\n=== Multi-User Rate Limit Test ===');
      console.log(`Users: ${USER_COUNT}`);
      console.log(`Requests per User: ${REQUESTS_PER_USER}`);
      console.log(`Total Attempted: ${USER_COUNT * REQUESTS_PER_USER}`);

      let totalSuccessful = 0;
      let totalLimited = 0;

      results.forEach((result, userId) => {
        console.log(`\nUser ${userId}:`);
        console.log(`  Successful: ${result.successfulRequests}`);
        console.log(`  Rate Limited: ${result.rateLimitedRequests}`);

        totalSuccessful += result.successfulRequests;
        totalLimited += result.rateLimitedRequests;
      });

      console.log(`\nTotal Successful: ${totalSuccessful}`);
      console.log(`Total Limited: ${totalLimited}`);

      // Some requests should be rate limited due to shared limit
      expect(totalLimited).toBeGreaterThan(0);
    }, 60000);
  });

  describe('Throttling Strategies', () => {
    test('should demonstrate exponential backoff', async () => {
      let attemptCount = 0;
      let backoffDelays: number[] = [];

      mockContext.setParameters({
        name: 'Backoff Test',
        email: 'backoff@test.com',
      });

      mockContext.helpers.requestWithAuthentication.mockImplementation(async () => {
        attemptCount++;

        // Fail first 3 attempts to trigger backoff
        if (attemptCount <= 3) {
          throw new Error('429 - Rate limit - please retry');
        }

        return {
          status: true,
          data: { client_id: 'backoff-success' },
        };
      });

      // Implement exponential backoff
      let delay = 100; // Start with 100ms
      let success = false;

      while (!success && attemptCount < 10) {
        try {
          await executeCreateCustomer.call(mockContext, 0);
          success = true;
          console.log(`Success on attempt ${attemptCount}`);
        } catch (error) {
          backoffDelays.push(delay);
          console.log(`Attempt ${attemptCount} failed, waiting ${delay}ms`);
          await sleep(delay);
          delay *= 2; // Exponential backoff
        }
      }

      console.log('\n=== Exponential Backoff Test ===');
      console.log(`Total Attempts: ${attemptCount}`);
      console.log(`Backoff Delays: ${backoffDelays.join(', ')}ms`);

      expect(success).toBe(true);
      expect(backoffDelays).toEqual([100, 200, 400]);
    }, 30000);

    test('should demonstrate request queuing', async () => {
      const QUEUE_SIZE = 50;
      const PROCESS_RATE = 10; // Process 10 per second

      let processedCount = 0;

      mockContext.setParameters({
        name: 'Queue Test',
        email: 'queue@test.com',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'queued-' + Math.random() },
      });

      const startTime = Date.now();

      // Process requests at controlled rate
      for (let i = 0; i < QUEUE_SIZE; i++) {
        const requestStart = Date.now();
        await executeCreateCustomer.call(mockContext, 0);
        processedCount++;

        // Wait to maintain rate (100ms between requests = 10 req/s)
        const elapsed = Date.now() - requestStart;
        const targetDelay = 1000 / PROCESS_RATE; // 100ms for 10 req/s
        const waitTime = Math.max(0, targetDelay - elapsed);
        if (waitTime > 0 && i < QUEUE_SIZE - 1) {
          await sleep(waitTime);
        }
      }

      const duration = (Date.now() - startTime) / 1000;

      console.log('\n=== Request Queuing Test ===');
      console.log(`Queue Size: ${QUEUE_SIZE}`);
      console.log(`Process Rate: ${PROCESS_RATE} req/s`);
      console.log(`Processed: ${processedCount}`);
      console.log(`Duration: ${duration.toFixed(2)}s`);
      console.log(`Actual Rate: ${(processedCount / duration).toFixed(2)} req/s`);

      expect(processedCount).toBe(QUEUE_SIZE);
      // Actual rate should be close to target rate (within 20%)
      const actualRate = processedCount / duration;
      expect(actualRate).toBeGreaterThan(PROCESS_RATE * 0.8);
      expect(actualRate).toBeLessThan(PROCESS_RATE * 1.2);
    }, 60000);
  });
});
