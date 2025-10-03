/**
 * Load Testing - iCount API Operations
 *
 * Tests system behavior under normal and high load conditions
 */

import { runLoadTest, formatMetrics, PerformanceMetrics } from './helpers/performanceUtils';
import { createMockExecuteFunctions } from '../helpers/mockN8nContext';
import { executeCreateCustomer } from '../../nodes/ICount/resources/customer/create.operation';
import { executeSearch as executeSearchDocument } from '../../nodes/ICount/resources/document/search.operation';

describe('Performance - Load Testing', () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockContext.getCredentials = jest.fn().mockResolvedValue({
      token: 'test-token',
    });
    mockContext.helpers.requestWithAuthentication = jest.fn();
  });

  describe('Customer Creation Load', () => {
    test('should handle 50 concurrent customer creations', async () => {
      mockContext.setParameters({
        name: 'Load Test Customer',
        email: 'load@test.com',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'load-test-' + Math.random() },
      });

      const testFunction = async () => {
        return await executeCreateCustomer.call(mockContext, 0);
      };

      const metrics = await runLoadTest(testFunction, {
        concurrency: 10,
        totalRequests: 50,
      });

      console.log('\n' + formatMetrics(metrics));

      // Assertions
      expect(metrics.successfulRequests).toBe(50);
      expect(metrics.failedRequests).toBe(0);
      expect(metrics.averageResponseTime).toBeLessThan(1000); // < 1 second
      expect(metrics.requestsPerSecond).toBeGreaterThan(10); // > 10 req/s
    }, 30000); // 30 second timeout

    test('should handle 100 sequential customer creations', async () => {
      mockContext.setParameters({
        name: 'Sequential Test Customer',
        email: 'sequential@test.com',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'seq-test-' + Math.random() },
      });

      const testFunction = async () => {
        return await executeCreateCustomer.call(mockContext, 0);
      };

      const metrics = await runLoadTest(testFunction, {
        concurrency: 1,
        totalRequests: 100,
      });

      console.log('\n' + formatMetrics(metrics));

      expect(metrics.successfulRequests).toBe(100);
      expect(metrics.failedRequests).toBe(0);
      expect(metrics.averageResponseTime).toBeLessThan(500);
    }, 60000);

    test('should maintain performance with Hebrew data', async () => {
      mockContext.setParameters({
        name: 'לקוח בדיקת עומס',
        email: 'hebrew-load@test.co.il',
        address: 'רחוב הבדיקה 123',
        city: 'תל אביב',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'hebrew-load-' + Math.random() },
      });

      const testFunction = async () => {
        return await executeCreateCustomer.call(mockContext, 0);
      };

      const metrics = await runLoadTest(testFunction, {
        concurrency: 5,
        totalRequests: 25,
      });

      console.log('\n' + formatMetrics(metrics));

      expect(metrics.successfulRequests).toBe(25);
      expect(metrics.averageResponseTime).toBeLessThan(1000);
    }, 30000);
  });

  describe('Document Search Load', () => {
    test('should handle 100 concurrent search requests', async () => {
      mockContext.setParameters({
        returnAll: true,
        detail_level: 1,
        max_results: 10,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: Array(10)
          .fill(null)
          .map((_, i) => ({
            doc_id: `search-load-${i}`,
            doc_number: 3000 + i,
            doc_type: '320',
          })),
      });

      const testFunction = async () => {
        return await executeSearchDocument.call(mockContext, 0);
      };

      const metrics = await runLoadTest(testFunction, {
        concurrency: 20,
        totalRequests: 100,
      });

      console.log('\n' + formatMetrics(metrics));

      expect(metrics.successfulRequests).toBe(100);
      expect(metrics.failedRequests).toBe(0);
      expect(metrics.averageResponseTime).toBeLessThan(800);
      expect(metrics.p95ResponseTime).toBeLessThan(1500);
    }, 60000);

    test('should handle search with large result sets', async () => {
      mockContext.setParameters({
        returnAll: true,
        detail_level: 2,
        max_results: 100,
      });

      // Mock large result set
      const largeResults = Array(100)
        .fill(null)
        .map((_, i) => ({
          doc_id: `large-result-${i}`,
          doc_number: 1000 + i,
          doc_type: '320',
          client_name: `Customer ${i}`,
          amount: Math.random() * 10000,
        }));

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: largeResults,
      });

      const testFunction = async () => {
        return await executeSearchDocument.call(mockContext, 0);
      };

      const metrics = await runLoadTest(testFunction, {
        concurrency: 10,
        totalRequests: 50,
      });

      console.log('\n' + formatMetrics(metrics));

      expect(metrics.successfulRequests).toBe(50);
      expect(metrics.averageResponseTime).toBeLessThan(2000);
    }, 60000);
  });

  describe('Mixed Operations Load', () => {
    test('should handle mixed customer and document operations', async () => {
      let operationCounter = 0;

      const testFunction = async () => {
        const operation = operationCounter++ % 2;

        if (operation === 0) {
          // Customer creation
          mockContext.setParameters({
            name: `Mixed Test Customer ${operationCounter}`,
            email: `mixed-${operationCounter}@test.com`,
          });

          mockContext.helpers.requestWithAuthentication.mockResolvedValueOnce({
            status: true,
            data: { client_id: `mixed-customer-${operationCounter}` },
          });

          return await executeCreateCustomer.call(mockContext, 0);
        } else {
          // Document search
          mockContext.setParameters({
            returnAll: false,
            detail_level: 1,
            max_results: 10,
          });

          mockContext.helpers.requestWithAuthentication.mockResolvedValueOnce({
            status: true,
            data: [{ doc_id: `mixed-doc-${operationCounter}`, doc_number: 2000 + operationCounter }],
          });

          return await executeSearchDocument.call(mockContext, 0);
        }
      };

      const metrics = await runLoadTest(testFunction, {
        concurrency: 10,
        totalRequests: 100,
      });

      console.log('\n' + formatMetrics(metrics));

      expect(metrics.successfulRequests).toBe(100);
      expect(metrics.failedRequests).toBe(0);
      expect(metrics.averageResponseTime).toBeLessThan(1000);
    }, 60000);
  });

  describe('Performance Benchmarks', () => {
    test('should measure baseline performance', async () => {
      mockContext.setParameters({
        name: 'Benchmark Customer',
        email: 'benchmark@test.com',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'benchmark-id' },
      });

      const testFunction = async () => {
        return await executeCreateCustomer.call(mockContext, 0);
      };

      const metrics = await runLoadTest(testFunction, {
        concurrency: 1,
        totalRequests: 10,
      });

      console.log('\n=== Baseline Performance ===');
      console.log(formatMetrics(metrics));

      // Store baseline for comparison
      expect(metrics.averageResponseTime).toBeLessThan(200);
      expect(metrics.p99ResponseTime).toBeLessThan(500);
    });

    test('should compare concurrent vs sequential performance', async () => {
      mockContext.setParameters({
        name: 'Comparison Test',
        email: 'compare@test.com',
      });

      // Add small delay to make timing differences more measurable
      mockContext.helpers.requestWithAuthentication.mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1));
        return {
          status: true,
          data: { client_id: 'compare-id' },
        };
      });

      const testFunction = async () => {
        return await executeCreateCustomer.call(mockContext, 0);
      };

      // Sequential
      const sequentialMetrics = await runLoadTest(testFunction, {
        concurrency: 1,
        totalRequests: 50,
      });

      // Concurrent
      const concurrentMetrics = await runLoadTest(testFunction, {
        concurrency: 10,
        totalRequests: 50,
      });

      console.log('\n=== Sequential vs Concurrent ===');
      console.log('\nSequential:');
      console.log(formatMetrics(sequentialMetrics));
      console.log('\nConcurrent:');
      console.log(formatMetrics(concurrentMetrics));

      // Concurrent should be faster overall (or at least as fast)
      expect(concurrentMetrics.duration).toBeLessThanOrEqual(sequentialMetrics.duration * 1.1);
      expect(concurrentMetrics.requestsPerSecond).toBeGreaterThanOrEqual(
        sequentialMetrics.requestsPerSecond * 0.9
      );
    }, 60000);
  });
});
