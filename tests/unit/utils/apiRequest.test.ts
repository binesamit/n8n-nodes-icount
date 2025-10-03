import { iCountApiRequest } from '../../../nodes/ICount/utils/apiRequest';
import { createMockExecuteFunctions } from '../../helpers/mockN8nContext';

describe('API Request Utils', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = createMockExecuteFunctions();
    mockExecuteFunctions.getCredentials = jest.fn().mockResolvedValue({
      token: 'test-token-123',
    });
  });

  describe('iCountApiRequest - Success Cases', () => {
    test('should make successful GET request', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({
        status: true,
        data: { id: 123 },
      });

      const result = await iCountApiRequest.call(
        mockExecuteFunctions,
        'GET',
        '/api/v3.php/client/123'
      );

      expect(result.status).toBe(true);
      expect(result.data).toEqual({ id: 123 });
      expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith({
        method: 'GET',
        body: undefined,
        qs: {},
        uri: 'https://api.icount.co.il/api/v3.php/client/123',
        headers: {
          'Authorization': 'Bearer test-token-123',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    test('should make successful POST request with body', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({ status: true });

      const body = { name: 'Test Company' };
      await iCountApiRequest.call(
        mockExecuteFunctions,
        'POST',
        '/api/v3.php/client/create',
        body
      );

      expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          body: { name: 'Test Company' },
        })
      );
    });

    test('should include query string parameters', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({ status: true });

      await iCountApiRequest.call(
        mockExecuteFunctions,
        'GET',
        '/api/v3.php/client/list',
        {},
        { page: 1, limit: 50 }
      );

      expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: { page: 1, limit: 50 },
        })
      );
    });

    test('should not include body for GET requests with empty body', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({ status: true });

      await iCountApiRequest.call(
        mockExecuteFunctions,
        'GET',
        '/api/v3.php/test',
        {}
      );

      expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: undefined,
        })
      );
    });

    test('should handle PUT request', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({
        status: true,
        data: { updated: true },
      });

      const body = { name: 'Updated Name' };
      const result = await iCountApiRequest.call(
        mockExecuteFunctions,
        'PUT',
        '/api/v3.php/client/update',
        body
      );

      expect(result.status).toBe(true);
      expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          body: { name: 'Updated Name' },
        })
      );
    });

    test('should handle DELETE request', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({
        status: true,
        message: 'Deleted successfully',
      });

      const result = await iCountApiRequest.call(
        mockExecuteFunctions,
        'DELETE',
        '/api/v3.php/client/delete/123'
      );

      expect(result.status).toBe(true);
      expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('iCountApiRequest - Error Handling', () => {
    test('should handle API error response (status: false)', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({
        status: false,
        message: 'Client not found',
      });

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/client/999')
      ).rejects.toThrow('Client not found');
    });

    test('should handle API error with error field', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({
        status: false,
        error: 'Invalid request',
      });

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test')
      ).rejects.toThrow('Invalid request');
    });

    test('should handle API error with JSON response fallback', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({
        status: false,
        someField: 'some value',
      });

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test')
      ).rejects.toThrow();
    });

    test('should handle 401 authentication error', async () => {
      mockExecuteFunctions.helpers.request.mockRejectedValue({
        statusCode: 401,
      });

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test')
      ).rejects.toThrow('Authentication failed. Check your credentials.');
    });

    test('should handle 403 forbidden error', async () => {
      mockExecuteFunctions.helpers.request.mockRejectedValue({
        statusCode: 403,
      });

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test')
      ).rejects.toThrow('Authentication failed. Check your credentials.');
    });

    test('should handle 429 rate limit error', async () => {
      mockExecuteFunctions.helpers.request.mockRejectedValue({
        statusCode: 429,
        response: {
          headers: { 'retry-after': '120' },
        },
      });

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test')
      ).rejects.toThrow('Rate limit exceeded. Retry after 120 seconds');
    });

    test('should use default retry-after if header missing', async () => {
      mockExecuteFunctions.helpers.request.mockRejectedValue({
        statusCode: 429,
        response: { headers: {} },
      });

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test')
      ).rejects.toThrow('Retry after 60 seconds');
    });

    test('should handle 429 without response object', async () => {
      mockExecuteFunctions.helpers.request.mockRejectedValue({
        statusCode: 429,
      });

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test')
      ).rejects.toThrow('Retry after 60 seconds');
    });

    test('should rethrow unknown errors', async () => {
      const networkError = new Error('Network timeout');
      mockExecuteFunctions.helpers.request.mockRejectedValue(networkError);

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test')
      ).rejects.toThrow('Network timeout');
    });

    test('should handle 500 server error', async () => {
      const serverError = new Error('Internal Server Error');
      (serverError as any).statusCode = 500;
      mockExecuteFunctions.helpers.request.mockRejectedValue(serverError);

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test')
      ).rejects.toThrow('Internal Server Error');
    });
  });

  describe('iCountApiRequest - Credentials', () => {
    test('should retrieve credentials from context', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({ status: true });

      await iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test');

      expect(mockExecuteFunctions.getCredentials).toHaveBeenCalledWith('iCountApi');
    });

    test('should include credentials token in Authorization header', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({ status: true });
      mockExecuteFunctions.getCredentials.mockResolvedValue({
        token: 'custom-token-xyz',
      });

      await iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test');

      expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer custom-token-xyz',
          }),
        })
      );
    });

    test('should always include Content-Type header', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({ status: true });

      await iCountApiRequest.call(mockExecuteFunctions, 'POST', '/api/v3.php/test', {});

      expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });

  describe('iCountApiRequest - Edge Cases', () => {
    test('should handle response with nested data', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({
        status: true,
        data: {
          client: { id: 123, name: 'Test' },
          metadata: { total: 1 },
        },
      });

      const result = await iCountApiRequest.call(
        mockExecuteFunctions,
        'GET',
        '/api/v3.php/client/123'
      );

      expect(result.data.client).toEqual({ id: 123, name: 'Test' });
      expect(result.data.metadata).toEqual({ total: 1 });
    });

    test('should construct correct full URI', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({ status: true });

      await iCountApiRequest.call(
        mockExecuteFunctions,
        'GET',
        '/api/v3.php/doc/list'
      );

      expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          uri: 'https://api.icount.co.il/api/v3.php/doc/list',
        })
      );
    });

    test('should set json flag to true', async () => {
      mockExecuteFunctions.helpers.request.mockResolvedValue({ status: true });

      await iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test');

      expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          json: true,
        })
      );
    });
  });
});
