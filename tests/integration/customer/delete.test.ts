import { executeDelete } from '../../../nodes/ICount/resources/customer/delete.operation';
import { createMockExecuteFunctions } from '../../helpers/mockN8nContext';

describe('Integration - Customer Delete', () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockContext.getCredentials = jest.fn().mockResolvedValue({
      token: 'test-token',
    });
    mockContext.helpers.requestWithAuthentication = jest.fn();
  });

  describe('Basic Delete', () => {
    test('should delete customer with minimal response', async () => {
      mockContext.setParameters({
        client_id: 12345,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      const result = await executeDelete.call(mockContext, 0);

      expect(result.json.success).toBe(true);
      expect(result.json.client_id).toBe(12345);
      expect(result.json.status).toBe(true);

      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledWith(
        'iCountApi',
        {
          method: 'POST',
          url: 'https://api.icount.co.il/api/v3.php/client/delete',
          body: {
            client_id: 12345,
          },
          json: true,
        }
      );
    });

    test('should delete customer with detailed response', async () => {
      mockContext.setParameters({
        client_id: 54321,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        message: 'Customer deleted successfully',
        deleted_at: '2025-01-15T10:00:00Z',
      });

      const result = await executeDelete.call(mockContext, 0);

      expect(result.json.success).toBe(true);
      expect(result.json.client_id).toBe(54321);
      expect(result.json.message).toBe('Customer deleted successfully');
      expect(result.json.deleted_at).toBe('2025-01-15T10:00:00Z');
    });

    test('should delete customer with small ID', async () => {
      mockContext.setParameters({
        client_id: 1,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      const result = await executeDelete.call(mockContext, 0);

      expect(result.json.client_id).toBe(1);
    });

    test('should delete customer with large ID', async () => {
      mockContext.setParameters({
        client_id: 999999,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      const result = await executeDelete.call(mockContext, 0);

      expect(result.json.client_id).toBe(999999);
    });
  });

  describe('Response Format', () => {
    test('should include all response fields', async () => {
      mockContext.setParameters({
        client_id: 100,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        message: 'Deleted',
        archived: true,
        deleted_by: 'user@example.com',
      });

      const result = await executeDelete.call(mockContext, 0);

      expect(result.json).toMatchObject({
        success: true,
        client_id: 100,
        status: true,
        message: 'Deleted',
        archived: true,
        deleted_by: 'user@example.com',
      });
    });

    test('should return success with status true', async () => {
      mockContext.setParameters({
        client_id: 200,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      const result = await executeDelete.call(mockContext, 0);

      expect(result).toHaveProperty('json');
      expect(result.json.success).toBe(true);
      expect(result.json.status).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should throw error when API returns status: false', async () => {
      mockContext.setParameters({
        client_id: 9999,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        message: 'Customer not found',
      });

      await expect(executeDelete.call(mockContext, 0)).rejects.toThrow(
        'iCount API Error: Customer not found'
      );
    });

    test('should throw error with error field', async () => {
      mockContext.setParameters({
        client_id: 9998,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        error: 'Cannot delete customer with active invoices',
      });

      await expect(executeDelete.call(mockContext, 0)).rejects.toThrow(
        'Cannot delete customer with active invoices'
      );
    });

    test('should throw error with JSON response fallback', async () => {
      mockContext.setParameters({
        client_id: 9997,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        someField: 'error data',
      });

      await expect(executeDelete.call(mockContext, 0)).rejects.toThrow(
        'iCount API Error'
      );
    });

    test('should handle network errors', async () => {
      mockContext.setParameters({
        client_id: 9996,
      });

      mockContext.helpers.requestWithAuthentication.mockRejectedValue(
        new Error('Network timeout')
      );

      await expect(executeDelete.call(mockContext, 0)).rejects.toThrow(
        'Network timeout'
      );
    });

    test('should handle customer not found error', async () => {
      mockContext.setParameters({
        client_id: 8888,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        message: 'Customer ID does not exist',
      });

      await expect(executeDelete.call(mockContext, 0)).rejects.toThrow(
        'Customer ID does not exist'
      );
    });

    test('should handle customer already deleted error', async () => {
      mockContext.setParameters({
        client_id: 7777,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        error: 'Customer already deleted',
      });

      await expect(executeDelete.call(mockContext, 0)).rejects.toThrow(
        'Customer already deleted'
      );
    });

    test('should handle permission errors', async () => {
      mockContext.setParameters({
        client_id: 6666,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        message: 'No permission to delete this customer',
      });

      await expect(executeDelete.call(mockContext, 0)).rejects.toThrow(
        'No permission to delete this customer'
      );
    });

    test('should handle customer with active documents error', async () => {
      mockContext.setParameters({
        client_id: 5555,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        error: 'Cannot delete customer with active documents',
      });

      await expect(executeDelete.call(mockContext, 0)).rejects.toThrow(
        'Cannot delete customer with active documents'
      );
    });

    test('should handle invalid customer ID error', async () => {
      mockContext.setParameters({
        client_id: 0,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        message: 'Invalid customer ID',
      });

      await expect(executeDelete.call(mockContext, 0)).rejects.toThrow(
        'Invalid customer ID'
      );
    });
  });

  describe('Delete Confirmation', () => {
    test('should successfully delete and confirm', async () => {
      mockContext.setParameters({
        client_id: 300,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        message: 'Customer successfully removed',
      });

      const result = await executeDelete.call(mockContext, 0);

      expect(result.json.success).toBe(true);
      expect(result.json.client_id).toBe(300);
      expect(result.json.message).toBe('Customer successfully removed');
    });

    test('should return deletion timestamp', async () => {
      mockContext.setParameters({
        client_id: 400,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        deleted_at: '2025-01-15T11:30:00Z',
      });

      const result = await executeDelete.call(mockContext, 0);

      expect(result.json.deleted_at).toBe('2025-01-15T11:30:00Z');
    });

    test('should handle soft delete response', async () => {
      mockContext.setParameters({
        client_id: 500,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        message: 'Customer archived',
        archived: true,
        can_restore: true,
      });

      const result = await executeDelete.call(mockContext, 0);

      expect(result.json.archived).toBe(true);
      expect(result.json.can_restore).toBe(true);
    });
  });
});
