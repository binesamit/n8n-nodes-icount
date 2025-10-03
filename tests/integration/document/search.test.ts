import { executeSearch } from '../../../nodes/ICount/resources/document/search.operation';
import { createMockExecuteFunctions } from '../../helpers/mockN8nContext';

describe('Integration - Document Search', () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockContext.getCredentials = jest.fn().mockResolvedValue({
      token: 'test-token',
    });
    mockContext.helpers.requestWithAuthentication = jest.fn();
  });

  describe('Basic Search', () => {
    test('should search with default parameters', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 1,
        max_results: 100,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: [
          { doc_id: 'doc1', doc_number: 2001 },
          { doc_id: 'doc2', doc_number: 2002 },
        ],
      });

      const result = await executeSearch.call(mockContext, 0);

      expect(result).toHaveLength(2);
      expect(result[0].json.doc_id).toBe('doc1');
      expect(result[1].json.doc_id).toBe('doc2');

      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledWith(
        'iCountApi',
        {
          method: 'POST',
          url: 'https://api.icount.co.il/api/v3.php/doc/search',
          body: {
            detail_level: 1,
            max_results: 100,
          },
          json: true,
        }
      );
    });

    test('should return all documents when returnAll is true', async () => {
      mockContext.setParameters({
        returnAll: true,
        detail_level: 2,
      });

      const mockDocs = Array.from({ length: 50 }, (_, i) => ({
        doc_id: `doc${i}`,
        doc_number: 2000 + i,
      }));

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: mockDocs,
      });

      const result = await executeSearch.call(mockContext, 0);

      expect(result).toHaveLength(50);
      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledWith(
        'iCountApi',
        expect.objectContaining({
          body: expect.objectContaining({
            max_results: 1000,
          }),
        })
      );
    });

    test('should limit results when returnAll is false', async () => {
      mockContext.setParameters({
        returnAll: false,
        max_results: 10,
        detail_level: 1,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: Array.from({ length: 10 }, (_, i) => ({ doc_id: `doc${i}` })),
      });

      const result = await executeSearch.call(mockContext, 0);

      expect(result).toHaveLength(10);
      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledWith(
        'iCountApi',
        expect.objectContaining({
          body: expect.objectContaining({
            max_results: 10,
          }),
        })
      );
    });
  });

  describe('Filters', () => {
    test('should search by client_id', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 1,
        max_results: 100,
        filters: {
          client_id: '123',
        },
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: [{ doc_id: 'client-doc', client_id: '123' }],
      });

      await executeSearch.call(mockContext, 0);

      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledWith(
        'iCountApi',
        expect.objectContaining({
          body: expect.objectContaining({
            client_id: '123',
          }),
        })
      );
    });

    test('should search by document type', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 1,
        max_results: 100,
        filters: {
          doc_type: '320',
        },
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: [{ doc_id: 'invoice', doc_type: '320' }],
      });

      await executeSearch.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.doc_type).toBe('320');
    });

    test('should search by date range', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 1,
        max_results: 100,
        filters: {
          from_date: '2025-01-01',
          to_date: '2025-01-31',
        },
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: [{ doc_id: 'dated-doc' }],
      });

      await executeSearch.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.from_date).toBe('2025-01-01');
      expect(callBody.to_date).toBe('2025-01-31');
    });

    test('should search with multiple filters', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 2,
        max_results: 50,
        filters: {
          client_id: '456',
          doc_type: '320',
          status: 'open',
        },
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: [{ doc_id: 'filtered-doc' }],
      });

      await executeSearch.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody).toMatchObject({
        detail_level: 2,
        max_results: 50,
        client_id: '456',
        doc_type: '320',
        status: 'open',
      });
    });
  });

  describe('Detail Levels', () => {
    test('should use detail level 1 (minimal)', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 1,
        max_results: 100,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: [{ doc_id: 'doc1', doc_number: 2001 }],
      });

      await executeSearch.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.detail_level).toBe(1);
    });

    test('should use detail level 2 (full)', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 2,
        max_results: 100,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: [
          {
            doc_id: 'doc1',
            doc_number: 2001,
            items: [{ description: 'Item 1' }],
            client: { name: 'Client Name' },
          },
        ],
      });

      const result = await executeSearch.call(mockContext, 0);

      expect(result[0].json.items).toBeDefined();
      expect(result[0].json.client).toBeDefined();

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.detail_level).toBe(2);
    });
  });

  describe('Empty Results', () => {
    test('should handle no documents found', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 1,
        max_results: 100,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: [],
      });

      const result = await executeSearch.call(mockContext, 0);

      expect(result).toHaveLength(1);
      expect(result[0].json.debug).toBe('No documents found');
      expect(result[0].json.response).toBeDefined();
    });

    test('should handle missing data array', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 1,
        max_results: 100,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      const result = await executeSearch.call(mockContext, 0);

      expect(result).toHaveLength(1);
      expect(result[0].json.debug).toBe('No documents found');
    });

    test('should handle non-array data', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 1,
        max_results: 100,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: 'invalid',
      });

      const result = await executeSearch.call(mockContext, 0);

      expect(result).toHaveLength(1);
      expect(result[0].json.debug).toBe('No documents found');
    });
  });

  describe('Error Handling', () => {
    test('should throw error when API returns status: false', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 1,
        max_results: 100,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        message: 'Invalid search parameters',
      });

      await expect(executeSearch.call(mockContext, 0)).rejects.toThrow(
        'iCount API Error: Invalid search parameters'
      );
    });

    test('should throw error with error field', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 1,
        max_results: 100,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        error: 'Search failed',
      });

      await expect(executeSearch.call(mockContext, 0)).rejects.toThrow(
        'Search failed'
      );
    });

    test('should handle network errors', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 1,
        max_results: 100,
      });

      mockContext.helpers.requestWithAuthentication.mockRejectedValue(
        new Error('Connection timeout')
      );

      await expect(executeSearch.call(mockContext, 0)).rejects.toThrow(
        'Connection timeout'
      );
    });
  });

  describe('Large Result Sets', () => {
    test('should handle large number of documents', async () => {
      mockContext.setParameters({
        returnAll: true,
        detail_level: 1,
      });

      const largeDocs = Array.from({ length: 500 }, (_, i) => ({
        doc_id: `doc${i}`,
        doc_number: 1000 + i,
      }));

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: largeDocs,
      });

      const result = await executeSearch.call(mockContext, 0);

      expect(result).toHaveLength(500);
      expect(result[0].json.doc_id).toBe('doc0');
      expect(result[499].json.doc_id).toBe('doc499');
    });
  });

  describe('Response Format', () => {
    test('should return documents in correct format', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 2,
        max_results: 100,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: [
          {
            doc_id: 'uuid-123',
            doc_number: 2001,
            client_id: '456',
            client_name: 'Test Client',
            total: 5000,
            currency: 'ILS',
          },
        ],
      });

      const result = await executeSearch.call(mockContext, 0);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('json');
      expect(result[0].json).toMatchObject({
        doc_id: 'uuid-123',
        doc_number: 2001,
        client_id: '456',
        client_name: 'Test Client',
        total: 5000,
        currency: 'ILS',
      });
    });

    test('should handle Hebrew content in documents', async () => {
      mockContext.setParameters({
        returnAll: false,
        detail_level: 1,
        max_results: 100,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: [
          {
            doc_id: 'hebrew-doc',
            client_name: 'חברת בדיקה בע"מ',
            description: 'חשבונית לתשלום',
          },
        ],
      });

      const result = await executeSearch.call(mockContext, 0);

      expect(result[0].json.client_name).toBe('חברת בדיקה בע"מ');
      expect(result[0].json.description).toBe('חשבונית לתשלום');
    });
  });
});
