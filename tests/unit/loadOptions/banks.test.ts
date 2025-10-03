import { ICount } from '../../../nodes/ICount/ICount.node';
import { createMockLoadOptionsFunctions } from '../../helpers/mockN8nContext';
import { mockBanksFixture } from '../../helpers/testFixtures';

describe('LoadOptions - getBanks', () => {
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
    test('should load banks as object and convert to options', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: mockBanksFixture,
      });

      const options = await icount.methods.loadOptions.getBanks.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(4);
      expect(options).toContainEqual({
        name: '10 - בנק לאומי',
        value: '10',
      });
      expect(options).toContainEqual({
        name: '11 - בנק דיסקונט',
        value: '11',
      });
      expect(options).toContainEqual({
        name: '12 - בנק הפועלים',
        value: '12',
      });
    });

    test('should handle response with banks key', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        banks: {
          '11': 'בנק דיסקונט',
        },
      });

      const options = await icount.methods.loadOptions.getBanks.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(1);
      expect(options[0]).toEqual({
        name: '11 - בנק דיסקונט',
        value: '11',
      });
    });

    test('should handle direct response (no data wrapper)', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        '10': 'בנק לאומי',
        '11': 'בנק דיסקונט',
      });

      const options = await icount.methods.loadOptions.getBanks.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options[0].name).toContain('בנק');
    });
  });

  describe('Error Handling', () => {
    test('should return empty array on API error', async () => {
      mockLoadOptionsFunctions.helpers.request.mockRejectedValue(
        new Error('API Error')
      );

      const options = await icount.methods.loadOptions.getBanks.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should return empty array when response is null', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue(null);

      const options = await icount.methods.loadOptions.getBanks.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should return empty array when data is not an object', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: 'invalid',
      });

      const options = await icount.methods.loadOptions.getBanks.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });
  });

  describe('Data Filtering', () => {
    test('should filter out non-string values', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: {
          '11': 'בנק דיסקונט',
          'metadata': { someField: 'value' },
          '12': 'בנק הפועלים',
          'status': 1,
          'api': true,
        },
      });

      const options = await icount.methods.loadOptions.getBanks.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options.every(opt => typeof opt.name === 'string')).toBe(true);
      expect(options.every(opt => typeof opt.value === 'string')).toBe(true);
    });

    test('should handle empty response', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({});

      const options = await icount.methods.loadOptions.getBanks.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should handle response with empty data object', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: {},
      });

      const options = await icount.methods.loadOptions.getBanks.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });
  });

  describe('API Integration', () => {
    test('should use correct API endpoint and headers', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({ data: {} });

      await icount.methods.loadOptions.getBanks.call(mockLoadOptionsFunctions);

      expect(mockLoadOptionsFunctions.helpers.request).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/bank/get_list',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    test('should retrieve credentials', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({ data: {} });

      await icount.methods.loadOptions.getBanks.call(mockLoadOptionsFunctions);

      expect(mockLoadOptionsFunctions.getCredentials).toHaveBeenCalledWith('iCountApi');
    });
  });

  describe('Output Format', () => {
    test('should format bank name with ID prefix', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: {
          '10': 'בנק לאומי',
        },
      });

      const options = await icount.methods.loadOptions.getBanks.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('10 - בנק לאומי');
      expect(options[0].value).toBe('10');
    });

    test('should return array of INodePropertyOptions format', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: mockBanksFixture,
      });

      const options = await icount.methods.loadOptions.getBanks.call(
        mockLoadOptionsFunctions
      );

      options.forEach(option => {
        expect(option).toHaveProperty('name');
        expect(option).toHaveProperty('value');
        expect(typeof option.name).toBe('string');
        expect(typeof option.value).toBe('string');
      });
    });
  });
});
