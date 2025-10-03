import { generateIdempotencyKey, addIdempotencyToBody } from '../../../nodes/ICount/utils/idempotency';
import { createMockContext } from '../../helpers/mockN8nContext';

describe('Idempotency Utils', () => {
  describe('generateIdempotencyKey', () => {
    test('should generate unique key with all context parts', () => {
      const mockContext = createMockContext({
        workflowId: 'wf-123',
        executionId: 'exec-456',
        nodeId: 'node-789',
        itemIndex: 0,
      });

      const key = generateIdempotencyKey(mockContext, 'create');

      expect(key).toBe('wf-123-exec-456-node-789-create-0');
    });

    test('should generate different keys for different items', () => {
      const mockContext1 = createMockContext({ itemIndex: 0 });
      const mockContext2 = createMockContext({ itemIndex: 1 });

      const key1 = generateIdempotencyKey(mockContext1, 'create');
      const key2 = generateIdempotencyKey(mockContext2, 'create');

      expect(key1).not.toBe(key2);
      expect(key1).toContain('-0');
      expect(key2).toContain('-1');
    });

    test('should generate different keys for different operations', () => {
      const mockContext = createMockContext();

      const key1 = generateIdempotencyKey(mockContext, 'create');
      const key2 = generateIdempotencyKey(mockContext, 'update');

      expect(key1).not.toBe(key2);
      expect(key1).toContain('-create-');
      expect(key2).toContain('-update-');
    });

    test('should handle missing itemIndex gracefully', () => {
      const mockContext = {
        getWorkflow: () => ({ id: 'wf-123' }),
        getExecutionId: () => 'exec-456',
        getNode: () => ({ id: 'node-789' }),
        // No getItemIndex method
      };

      const key = generateIdempotencyKey(mockContext, 'create');

      expect(key).toContain('-0'); // Should default to 0
      expect(key).toBe('wf-123-exec-456-node-789-create-0');
    });

    test('should generate consistent keys for same context', () => {
      const mockContext = createMockContext();

      const key1 = generateIdempotencyKey(mockContext, 'create');
      const key2 = generateIdempotencyKey(mockContext, 'create');

      expect(key1).toBe(key2);
    });

    test('should generate different keys for different workflow IDs', () => {
      const mockContext1 = createMockContext({ workflowId: 'wf-111' });
      const mockContext2 = createMockContext({ workflowId: 'wf-222' });

      const key1 = generateIdempotencyKey(mockContext1, 'create');
      const key2 = generateIdempotencyKey(mockContext2, 'create');

      expect(key1).not.toBe(key2);
    });

    test('should generate different keys for different execution IDs', () => {
      const mockContext1 = createMockContext({ executionId: 'exec-111' });
      const mockContext2 = createMockContext({ executionId: 'exec-222' });

      const key1 = generateIdempotencyKey(mockContext1, 'create');
      const key2 = generateIdempotencyKey(mockContext2, 'create');

      expect(key1).not.toBe(key2);
    });

    test('should generate different keys for different node IDs', () => {
      const mockContext1 = createMockContext({ nodeId: 'node-111' });
      const mockContext2 = createMockContext({ nodeId: 'node-222' });

      const key1 = generateIdempotencyKey(mockContext1, 'create');
      const key2 = generateIdempotencyKey(mockContext2, 'create');

      expect(key1).not.toBe(key2);
    });
  });

  describe('addIdempotencyToBody', () => {
    test('should add idempotency key to empty body', () => {
      const mockContext = createMockContext();
      const body = {};

      const result = addIdempotencyToBody(mockContext, body, 'create');

      expect(result).toHaveProperty('idempotency_key');
      expect(typeof result.idempotency_key).toBe('string');
      expect(result.idempotency_key).toContain('create');
    });

    test('should preserve existing body fields', () => {
      const mockContext = createMockContext();
      const body = { name: 'Test', email: 'test@example.com' };

      const result = addIdempotencyToBody(mockContext, body, 'create');

      expect(result.name).toBe('Test');
      expect(result.email).toBe('test@example.com');
      expect(result.idempotency_key).toBeDefined();
    });

    test('should not mutate original body', () => {
      const mockContext = createMockContext();
      const body = { name: 'Test' };

      const result = addIdempotencyToBody(mockContext, body, 'create');

      expect(body).not.toHaveProperty('idempotency_key');
      expect(result).toHaveProperty('idempotency_key');
    });

    test('should handle complex nested objects', () => {
      const mockContext = createMockContext();
      const body = {
        name: 'Test',
        items: [
          { description: 'Item 1', price: 100 },
          { description: 'Item 2', price: 200 },
        ],
        metadata: {
          source: 'api',
          version: '1.0',
        },
      };

      const result = addIdempotencyToBody(mockContext, body, 'create');

      expect(result.name).toBe('Test');
      expect(result.items).toEqual(body.items);
      expect(result.metadata).toEqual(body.metadata);
      expect(result.idempotency_key).toBeDefined();
    });

    test('should generate unique keys for different operations on same body', () => {
      const mockContext = createMockContext();
      const body = { name: 'Test' };

      const result1 = addIdempotencyToBody(mockContext, body, 'create');
      const result2 = addIdempotencyToBody(mockContext, body, 'update');

      expect(result1.idempotency_key).not.toBe(result2.idempotency_key);
      expect(result1.idempotency_key).toContain('create');
      expect(result2.idempotency_key).toContain('update');
    });

    test('should override existing idempotency_key if present', () => {
      const mockContext = createMockContext();
      const body = { name: 'Test', idempotency_key: 'old-key' };

      const result = addIdempotencyToBody(mockContext, body, 'create');

      expect(result.idempotency_key).not.toBe('old-key');
      expect(result.idempotency_key).toContain('wf-123');
    });
  });
});
