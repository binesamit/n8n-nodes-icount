/**
 * Stress Testing - Find System Limits
 *
 * Gradually increase load to find breaking points and maximum capacity
 */

import { runStressTest, formatMetrics } from './helpers/performanceUtils';
import { createMockExecuteFunctions } from '../helpers/mockN8nContext';
import { executeCreateCustomer } from '../../nodes/ICount/resources/customer/create.operation';
import { executeCreate as executeCreateDocument } from '../../nodes/ICount/resources/document/create.operation';

describe('Performance - Stress Testing', () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockContext.getCredentials = jest.fn().mockResolvedValue({
      token: 'test-token',
    });
    mockContext.helpers.requestWithAuthentication = jest.fn();
    mockContext.helpers.request = jest.fn();
  });

  describe('Customer Creation Stress', () => {
    test('should find maximum concurrent customer creations', async () => {
      mockContext.setParameters({
        name: 'Stress Test Customer',
        email: 'stress@test.com',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'stress-' + Math.random() },
      });

      const testFunction = async () => {
        return await executeCreateCustomer.call(mockContext, 0);
      };

      const result = await runStressTest(testFunction, {
        startConcurrency: 5,
        maxConcurrency: 50,
        stepSize: 5,
        requestsPerStep: 25,
      });

      console.log('\n=== Customer Creation Stress Test ===');
      console.log(`Max Successful Concurrency: ${result.maxSuccessfulConcurrency}`);
      if (result.failurePoint > 0) {
        console.log(`Failure Point: ${result.failurePoint}`);
      } else {
        console.log('No failure found within test range');
      }

      console.log('\nMetrics per concurrency level:');
      result.metrics.forEach((metrics, index) => {
        const concurrency = 5 + index * 5;
        console.log(`\nConcurrency ${concurrency}:`);
        console.log(formatMetrics(metrics));
      });

      // Should handle at least 10 concurrent requests
      expect(result.maxSuccessfulConcurrency).toBeGreaterThanOrEqual(10);
    }, 300000); // 5 minute timeout

    test('should handle gradual load increase', async () => {
      mockContext.setParameters({
        name: 'Gradual Load Test',
        email: 'gradual@test.com',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'gradual-' + Math.random() },
      });

      const testFunction = async () => {
        return await executeCreateCustomer.call(mockContext, 0);
      };

      const result = await runStressTest(testFunction, {
        startConcurrency: 1,
        maxConcurrency: 20,
        stepSize: 2,
        requestsPerStep: 20,
      });

      console.log('\n=== Gradual Load Increase ===');
      result.metrics.forEach((metrics, index) => {
        const concurrency = 1 + index * 2;
        console.log(`\nLoad Level ${concurrency}:`);
        console.log(`  Success Rate: ${((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(1)}%`);
        console.log(`  Avg Response: ${metrics.averageResponseTime.toFixed(2)}ms`);
        console.log(`  Throughput: ${metrics.requestsPerSecond.toFixed(2)} req/s`);
      });

      // All steps should succeed
      const allSuccessful = result.metrics.every((m) => m.failedRequests === 0);
      expect(allSuccessful).toBe(true);
    }, 180000);
  });

  describe('Document Creation Stress', () => {
    test('should find limits for document creation with items', async () => {
      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Stress Doc Customer',
        client_email: 'stressdoc@test.com',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Stress Test Item 1', quantity: 1, unit_price: 100 },
          { description: 'Stress Test Item 2', quantity: 2, unit_price: 200 },
          { description: 'Stress Test Item 3', quantity: 3, unit_price: 300 },
        ]),
      });

      mockContext.helpers.request.mockResolvedValue({
        status: true,
        data: { doc_id: 'stress-doc-' + Math.random(), doc_number: 5000 + Math.floor(Math.random() * 1000) },
      });

      const testFunction = async () => {
        return await executeCreateDocument.call(mockContext, 0);
      };

      const result = await runStressTest(testFunction, {
        startConcurrency: 3,
        maxConcurrency: 30,
        stepSize: 3,
        requestsPerStep: 15,
      });

      console.log('\n=== Document Creation Stress Test ===');
      console.log(`Max Successful Concurrency: ${result.maxSuccessfulConcurrency}`);

      console.log('\nPerformance degradation:');
      result.metrics.forEach((metrics, index) => {
        const concurrency = 3 + index * 3;
        const failRate = ((metrics.failedRequests / metrics.totalRequests) * 100).toFixed(1);
        console.log(
          `Concurrency ${concurrency}: ${metrics.averageResponseTime.toFixed(0)}ms avg, ${failRate}% fail`
        );
      });

      // Should handle at least 6 concurrent document creations
      expect(result.maxSuccessfulConcurrency).toBeGreaterThanOrEqual(6);
    }, 300000);
  });

  describe('Memory and Resource Stress', () => {
    test('should handle large number of sequential operations', async () => {
      const TOTAL_OPERATIONS = 500;

      mockContext.setParameters({
        name: 'Memory Test Customer',
        email: 'memory@test.com',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'memory-' + Math.random() },
      });

      let completedOperations = 0;
      const startMemory = process.memoryUsage();

      for (let i = 0; i < TOTAL_OPERATIONS; i++) {
        await executeCreateCustomer.call(mockContext, 0);
        completedOperations++;

        // Check memory every 100 operations
        if (i % 100 === 0) {
          const currentMemory = process.memoryUsage();
          const heapUsedMB = (currentMemory.heapUsed / 1024 / 1024).toFixed(2);
          console.log(`Operations ${i}/${TOTAL_OPERATIONS} - Heap: ${heapUsedMB}MB`);
        }
      }

      const endMemory = process.memoryUsage();
      const heapGrowth = (endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024;

      console.log('\n=== Memory Stress Test ===');
      console.log(`Completed Operations: ${completedOperations}`);
      console.log(`Heap Growth: ${heapGrowth.toFixed(2)}MB`);
      console.log(`Final Heap Usage: ${(endMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);

      // All operations should complete
      expect(completedOperations).toBe(TOTAL_OPERATIONS);

      // Memory growth should be reasonable (< 100MB for 500 operations)
      expect(heapGrowth).toBeLessThan(100);
    }, 180000);

    test('should handle operations with large payloads', async () => {
      // Create customer with very long fields
      const longString = 'a'.repeat(1000);

      mockContext.setParameters({
        name: `Large Payload Customer ${longString}`,
        email: 'large@test.com',
        notes: longString.repeat(5), // 5000 characters
        address: longString,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'large-payload-' + Math.random() },
      });

      const testFunction = async () => {
        return await executeCreateCustomer.call(mockContext, 0);
      };

      const result = await runStressTest(testFunction, {
        startConcurrency: 2,
        maxConcurrency: 10,
        stepSize: 2,
        requestsPerStep: 10,
      });

      console.log('\n=== Large Payload Stress Test ===');
      console.log(`Max Successful Concurrency: ${result.maxSuccessfulConcurrency}`);

      result.metrics.forEach((metrics, index) => {
        const concurrency = 2 + index * 2;
        console.log(`Concurrency ${concurrency}: ${metrics.averageResponseTime.toFixed(0)}ms avg`);
      });

      // Should handle at least 4 concurrent large payloads
      expect(result.maxSuccessfulConcurrency).toBeGreaterThanOrEqual(4);
    }, 180000);
  });

  describe('Recovery and Resilience', () => {
    test('should recover from temporary failures', async () => {
      let callCount = 0;

      mockContext.setParameters({
        name: 'Recovery Test Customer',
        email: 'recovery@test.com',
      });

      // Simulate intermittent failures
      mockContext.helpers.requestWithAuthentication.mockImplementation(async () => {
        callCount++;
        // Fail every 5th request
        if (callCount % 5 === 0) {
          return { status: false, error: 'Simulated failure' };
        }
        return {
          status: true,
          data: { client_id: 'recovery-' + callCount },
        };
      });

      const testFunction = async () => {
        return await executeCreateCustomer.call(mockContext, 0);
      };

      const result = await runStressTest(testFunction, {
        startConcurrency: 3,
        maxConcurrency: 15,
        stepSize: 3,
        requestsPerStep: 30,
      });

      console.log('\n=== Recovery Test (20% Failure Rate) ===');
      result.metrics.forEach((metrics, index) => {
        const concurrency = 3 + index * 3;
        const successRate = ((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(1);
        console.log(`Concurrency ${concurrency}: ${successRate}% success`);
      });

      // Should still handle some concurrent requests despite failures
      expect(result.maxSuccessfulConcurrency).toBeGreaterThan(0);
    }, 180000);
  });
});
