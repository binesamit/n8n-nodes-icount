import { ICount } from '../../../nodes/ICount/ICount.node';
import { createMockLoadOptionsFunctions } from '../../helpers/mockN8nContext';
import { mockClientTypesFixture } from '../../helpers/testFixtures';

describe('LoadOptions - getClientTypes', () => {
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
    test('should load client types from client_types key', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: mockClientTypesFixture,
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(3);
      expect(options).toContainEqual({
        name: 'לקוח פרטי',
        value: '1',
      });
      expect(options).toContainEqual({
        name: 'חברה',
        value: '2',
      });
      expect(options).toContainEqual({
        name: 'עוסק מורשה',
        value: '3',
      });
    });

    test('should load client types from data key', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: mockClientTypesFixture,
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(3);
    });

    test('should load client types from types key', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        types: {
          '1': { client_type_id: 1, client_type_name: 'לקוח פרטי' },
        },
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(1);
      expect(options[0].name).toBe('לקוח פרטי');
    });

    test('should handle string values directly', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: {
          '1': 'לקוח פרטי',
          '2': 'חברה',
        },
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options[0]).toEqual({
        name: 'לקוח פרטי',
        value: '1',
      });
    });

    test('should extract client_type_name from objects', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: {
          '1': {
            client_type_id: 1,
            client_type_name: 'לקוח פרטי',
            other_field: 'value',
          },
        },
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('לקוח פרטי');
      expect(options[0].value).toBe('1');
    });

    test('should prefer client_type_name over name', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: {
          '1': {
            client_type_id: 1,
            client_type_name: 'Preferred Name',
            name: 'Alternative Name',
          },
        },
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('Preferred Name');
    });

    test('should use name if client_type_name is missing', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: {
          '1': {
            client_type_id: 1,
            name: 'Name Only',
          },
        },
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('Name Only');
    });

    test('should use type ID as fallback for name', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: {
          '99': {
            client_type_id: 99,
          },
        },
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('99');
    });
  });

  describe('Success Cases - Array Format', () => {
    test('should load client types from array', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: [
          { client_type_id: 1, client_type_name: 'לקוח פרטי' },
          { client_type_id: 2, client_type_name: 'חברה' },
        ],
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options[0].value).toBe('1');
      expect(options[1].value).toBe('2');
    });

    test('should handle array with id instead of client_type_id', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: [
          { id: 5, name: 'Type 5' },
          { id: 6, name: 'Type 6' },
        ],
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options[0].value).toBe('5');
    });

    test('should filter out null values in array', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: [
          { client_type_id: 1, client_type_name: 'Type 1' },
          null,
          { client_type_id: 2, client_type_name: 'Type 2' },
        ],
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
    });
  });

  describe('Value Extraction', () => {
    test('should prefer client_type_id over id', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: {
          '10': {
            client_type_id: 10,
            id: 999,
            client_type_name: 'Test',
          },
        },
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].value).toBe('10');
    });

    test('should use id if client_type_id is missing', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: {
          '10': {
            id: 777,
            name: 'Test',
          },
        },
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].value).toBe('777');
    });

    test('should use object key as fallback for value', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: {
          '88': {
            name: 'Test',
          },
        },
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].value).toBe('88');
    });

    test('should convert all values to strings', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: {
          '1': {
            client_type_id: 123,
            client_type_name: 'Test',
          },
        },
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(typeof options[0].value).toBe('string');
      expect(options[0].value).toBe('123');
    });
  });

  describe('Error Handling', () => {
    test('should return empty array on API error', async () => {
      mockLoadOptionsFunctions.helpers.request.mockRejectedValue(
        new Error('API Error')
      );

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should return empty array when response is null', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue(null);

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should return empty array when data is null', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: null,
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should handle authentication error', async () => {
      mockLoadOptionsFunctions.helpers.request.mockRejectedValue({
        statusCode: 401,
        message: 'Unauthorized',
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });
  });

  describe('API Integration', () => {
    test('should use correct API endpoint', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: {},
      });

      await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(mockLoadOptionsFunctions.helpers.request).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/client/types',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    test('should retrieve credentials', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: {},
      });

      await icount.methods.loadOptions.getClientTypes.call(
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
        client_types: mockClientTypesFixture,
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
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
        client_types: {
          '1': 'לקוח פרטי',
        },
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('לקוח פרטי');
      expect(options[0].name).toMatch(/[\u0590-\u05FF]/); // Hebrew Unicode
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty object', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: {},
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should handle empty array', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        client_types: [],
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should handle direct response without wrapper', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        '1': { client_type_id: 1, client_type_name: 'Type 1' },
        '2': { client_type_id: 2, client_type_name: 'Type 2' },
      });

      const options = await icount.methods.loadOptions.getClientTypes.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
    });
  });
});
