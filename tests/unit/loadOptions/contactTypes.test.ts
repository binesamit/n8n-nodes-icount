import { ICount } from '../../../nodes/ICount/ICount.node';
import { createMockLoadOptionsFunctions } from '../../helpers/mockN8nContext';
import { mockContactTypesFixture } from '../../helpers/testFixtures';

describe('LoadOptions - getContactTypes', () => {
  let icount: ICount;
  let mockLoadOptionsFunctions: any;

  beforeEach(() => {
    icount = new ICount();
    mockLoadOptionsFunctions = createMockLoadOptionsFunctions();
    mockLoadOptionsFunctions.getCredentials = jest.fn().mockResolvedValue({
      token: 'test-token',
    });
  });

  describe('Success Cases - Object Format', () => {
    test('should load contact types from contact_types key', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: mockContactTypesFixture,
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options).toContainEqual({
        name: 'מנהל',
        value: '1',
      });
      expect(options).toContainEqual({
        name: 'כספים',
        value: '2',
      });
    });

    test('should load contact types from data key', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: mockContactTypesFixture,
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
    });

    test('should load from direct response', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue(
        mockContactTypesFixture
      );

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
    });

    test('should handle string values directly', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: {
          '1': 'מנהל',
          '2': 'כספים',
        },
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options[0]).toEqual({
        name: 'מנהל',
        value: '1',
      });
    });

    test('should extract contact_type_name from objects', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: {
          '1': {
            contact_type_id: 1,
            contact_type_name: 'מנהל',
            other_field: 'value',
          },
        },
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('מנהל');
      expect(options[0].value).toBe('1');
    });

    test('should prefer contact_type_name over name', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: {
          '1': {
            contact_type_id: 1,
            contact_type_name: 'Preferred Name',
            name: 'Alternative Name',
          },
        },
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('Preferred Name');
    });

    test('should use name if contact_type_name is missing', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: {
          '1': {
            contact_type_id: 1,
            name: 'Name Only',
          },
        },
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('Name Only');
    });

    test('should use type ID as fallback for name', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: {
          '99': {
            contact_type_id: 99,
          },
        },
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('99');
    });
  });

  describe('Success Cases - Array Format', () => {
    test('should load contact types from array', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: [
          { contact_type_id: 1, contact_type_name: 'מנהל' },
          { contact_type_id: 2, contact_type_name: 'כספים' },
        ],
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options[0].value).toBe('1');
      expect(options[1].value).toBe('2');
    });

    test('should handle array with id instead of contact_type_id', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: [
          { id: 5, name: 'Type 5' },
          { id: 6, name: 'Type 6' },
        ],
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options[0].value).toBe('5');
    });

    test('should filter out null values in array', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: [
          { contact_type_id: 1, contact_type_name: 'Type 1' },
          null,
          { contact_type_id: 2, contact_type_name: 'Type 2' },
        ],
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
    });
  });

  describe('Value Extraction', () => {
    test('should use contact_type_id for value', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: {
          '10': {
            contact_type_id: 123,
            contact_type_name: 'Test',
          },
        },
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].value).toBe('123');
    });

    test('should use object key as fallback for value', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: {
          '88': {
            name: 'Test',
          },
        },
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].value).toBe('88');
    });

    test('should convert all values to strings', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: {
          '1': {
            contact_type_id: 456,
            contact_type_name: 'Test',
          },
        },
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(typeof options[0].value).toBe('string');
      expect(options[0].value).toBe('456');
    });
  });

  describe('Error Handling', () => {
    test('should return empty array on API error', async () => {
      mockLoadOptionsFunctions.helpers.request.mockRejectedValue(
        new Error('API Error')
      );

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should return empty array when response is null', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue(null);

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should return empty array when data is null', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: null,
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should handle network timeout', async () => {
      mockLoadOptionsFunctions.helpers.request.mockRejectedValue(
        new Error('ETIMEDOUT')
      );

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should handle server error', async () => {
      mockLoadOptionsFunctions.helpers.request.mockRejectedValue({
        statusCode: 500,
        message: 'Internal Server Error',
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });
  });

  describe('API Integration', () => {
    test('should use correct API endpoint', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: {},
      });

      await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(mockLoadOptionsFunctions.helpers.request).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/client/contact_types',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    test('should retrieve credentials', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: {},
      });

      await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(mockLoadOptionsFunctions.getCredentials).toHaveBeenCalledWith(
        'iCountApi'
      );
    });
  });

  describe('Output Format', () => {
    test('should return proper INodePropertyOptions format', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: mockContactTypesFixture,
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
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
        contact_types: {
          '1': 'מנהל ראשי',
        },
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('מנהל ראשי');
      expect(options[0].name).toMatch(/[\u0590-\u05FF]/); // Hebrew Unicode
    });

    test('should handle mixed English and Hebrew', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: {
          '1': 'Manager - מנהל',
        },
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('Manager - מנהל');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty object', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: {},
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should handle empty array', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: [],
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should handle undefined response', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue(undefined);

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should filter out invalid entries', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        contact_types: {
          '1': { contact_type_id: 1, contact_type_name: 'Valid' },
          '2': null,
          '3': undefined,
          '4': { contact_type_id: 4, contact_type_name: 'Also Valid' },
        },
      });

      const options = await icount.methods.loadOptions.getContactTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options.length).toBeGreaterThanOrEqual(2);
      expect(options.every(opt => opt.name && opt.value)).toBe(true);
    });
  });
});
