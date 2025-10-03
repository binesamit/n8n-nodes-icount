import { ICount } from '../../../nodes/ICount/ICount.node';
import { createMockLoadOptionsFunctions } from '../../helpers/mockN8nContext';
import { mockDocumentTypesFixture } from '../../helpers/testFixtures';

describe('LoadOptions - getDocumentTypes', () => {
  let icount: ICount;
  let mockLoadOptionsFunctions: any;

  beforeEach(() => {
    icount = new ICount();
    mockLoadOptionsFunctions = createMockLoadOptionsFunctions();
    mockLoadOptionsFunctions.getCredentials = jest.fn().mockResolvedValue({
      token: 'test-token',
    });
  });

  describe('Success Cases', () => {
    test('should load document types from doctypes key', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        doctypes: mockDocumentTypesFixture,
      });

      const options = await icount.methods.loadOptions.getDocumentTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(5);
      expect(options).toContainEqual({
        name: 'הצעת מחיר',
        value: '300',
      });
      expect(options).toContainEqual({
        name: 'חשבונית מס',
        value: '320',
      });
    });

    test('should load document types from data key', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: {
          '320': 'חשבונית מס',
          '300': 'הצעת מחיר',
        },
      });

      const options = await icount.methods.loadOptions.getDocumentTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options.some(opt => opt.value === '320')).toBe(true);
    });

    test('should load document types from direct response', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        '320': 'חשבונית מס',
        '405': 'קבלה',
      });

      const options = await icount.methods.loadOptions.getDocumentTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
    });

    test('should handle object format with nested properties', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        doctypes: {
          '320': {
            id: '320',
            name: 'חשבונית מס',
            doc_type_id: '320',
            doc_type_name: 'חשבונית מס',
          },
        },
      });

      const options = await icount.methods.loadOptions.getDocumentTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(1);
      expect(options[0]).toEqual({
        name: 'חשבונית מס',
        value: '320',
      });
    });

    test('should handle array format', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: [
          { id: '320', name: 'חשבונית מס' },
          { id: '300', name: 'הצעת מחיר' },
        ],
      });

      const options = await icount.methods.loadOptions.getDocumentTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options[0].name).toBe('חשבונית מס');
    });
  });

  describe('Metadata Filtering', () => {
    test('should skip api metadata field', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        doctypes: {
          '320': 'חשבונית מס',
          'api': 'some-value',
          '300': 'הצעת מחיר',
        },
      });

      const options = await icount.methods.loadOptions.getDocumentTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options.some(opt => opt.value === 'api')).toBe(false);
    });

    test('should skip status metadata field', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        doctypes: {
          '320': 'חשבונית מס',
          'status': true,
          '300': 'הצעת מחיר',
        },
      });

      const options = await icount.methods.loadOptions.getDocumentTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options.some(opt => opt.value === 'status')).toBe(false);
    });

    test('should filter out invalid type values', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        doctypes: {
          '320': 'חשבונית מס',
          'invalid': 123,
          'another': null,
          '300': 'הצעת מחיר',
        },
      });

      const options = await icount.methods.loadOptions.getDocumentTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options.every(opt => typeof opt.name === 'string')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should return empty array on API error', async () => {
      mockLoadOptionsFunctions.helpers.request.mockRejectedValue(
        new Error('API Error')
      );

      const options = await icount.methods.loadOptions.getDocumentTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should return empty array when response is null', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue(null);

      const options = await icount.methods.loadOptions.getDocumentTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should return empty array for invalid response', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue('invalid');

      const options = await icount.methods.loadOptions.getDocumentTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });
  });

  describe('API Integration', () => {
    test('should use correct API endpoint', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({ doctypes: {} });

      await icount.methods.loadOptions.getDocumentTypes.call(mockLoadOptionsFunctions);

      expect(mockLoadOptionsFunctions.helpers.request).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/doc/types',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    test('should retrieve credentials', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({ doctypes: {} });

      await icount.methods.loadOptions.getDocumentTypes.call(mockLoadOptionsFunctions);

      expect(mockLoadOptionsFunctions.getCredentials).toHaveBeenCalledWith('iCountApi');
    });
  });

  describe('Output Format', () => {
    test('should return proper INodePropertyOptions format', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        doctypes: mockDocumentTypesFixture,
      });

      const options = await icount.methods.loadOptions.getDocumentTypes.call(
        mockLoadOptionsFunctions
      );

      options.forEach(option => {
        expect(option).toHaveProperty('name');
        expect(option).toHaveProperty('value');
        expect(typeof option.name).toBe('string');
        expect(typeof option.value).toBe('string');
      });
    });

    test('should handle Hebrew characters correctly', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        doctypes: {
          '320': 'חשבונית מס',
        },
      });

      const options = await icount.methods.loadOptions.getDocumentTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('חשבונית מס');
      expect(options[0].name).toMatch(/[\u0590-\u05FF]/); // Hebrew Unicode range
    });
  });
});
