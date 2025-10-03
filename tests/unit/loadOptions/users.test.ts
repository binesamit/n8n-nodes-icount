import { ICount } from '../../../nodes/ICount/ICount.node';
import { createMockLoadOptionsFunctions } from '../../helpers/mockN8nContext';
import { mockUsersFixture } from '../../helpers/testFixtures';

describe('LoadOptions - getUsers', () => {
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
    test('should load users from object with string values', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: {
          '1': 'Admin User',
          '2': 'Sales User',
          '3': 'Support User',
        },
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(3);
      expect(options).toContainEqual({
        name: 'Admin User',
        value: '1',
      });
      expect(options).toContainEqual({
        name: 'Sales User',
        value: '2',
      });
    });

    test('should load users from object with user objects', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: {
          '1': {
            user_id: 1,
            user_name: 'Admin User',
            email: 'admin@company.com',
          },
          '2': {
            user_id: 2,
            user_name: 'Sales User',
            email: 'sales@company.com',
          },
        },
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options[0]).toEqual({
        name: 'Admin User',
        value: '1',
      });
      expect(options[1]).toEqual({
        name: 'Sales User',
        value: '2',
      });
    });

    test('should prefer user_name over name over email', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: {
          '1': {
            user_id: 1,
            user_name: 'User Name',
            name: 'Name',
            email: 'email@test.com',
          },
        },
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('User Name');
    });

    test('should use name if user_name is missing', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: {
          '1': {
            user_id: 1,
            name: 'Just Name',
            email: 'email@test.com',
          },
        },
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('Just Name');
    });

    test('should use email if both user_name and name are missing', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: {
          '1': {
            user_id: 1,
            email: 'email@test.com',
          },
        },
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('email@test.com');
    });

    test('should use user ID as fallback for name', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: {
          '999': {
            user_id: 999,
          },
        },
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('999');
    });
  });

  describe('Success Cases - Array Format', () => {
    test('should load users from array', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: mockUsersFixture,
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options[0]).toEqual({
        name: 'Admin User',
        value: '1',
      });
      expect(options[1]).toEqual({
        name: 'Sales User',
        value: '2',
      });
    });

    test('should handle array with user_name field', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: [
          { user_id: 10, user_name: 'User 10' },
          { user_id: 20, user_name: 'User 20' },
        ],
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options[0].value).toBe('10');
      expect(options[1].value).toBe('20');
    });

    test('should handle array with id instead of user_id', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: [
          { id: 5, name: 'User 5' },
          { id: 6, name: 'User 6' },
        ],
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
      expect(options[0].value).toBe('5');
      expect(options[1].value).toBe('6');
    });
  });

  describe('Response Data Sources', () => {
    test('should load from data key', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: {
          '1': 'User 1',
        },
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(1);
    });

    test('should load from users key', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        users: {
          '1': 'User 1',
        },
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(1);
    });

    test('should load from direct response', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        '1': 'User 1',
        '2': 'User 2',
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
    });
  });

  describe('Error Handling', () => {
    test('should return empty array on API error', async () => {
      mockLoadOptionsFunctions.helpers.request.mockRejectedValue(
        new Error('API Error')
      );

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should return empty array when response is null', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue(null);

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should return empty array when data is null', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: null,
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should handle network timeout', async () => {
      mockLoadOptionsFunctions.helpers.request.mockRejectedValue(
        new Error('ETIMEDOUT')
      );

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });
  });

  describe('API Integration', () => {
    test('should use correct API endpoint', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({ data: {} });

      await icount.methods.loadOptions.getUsers.call(mockLoadOptionsFunctions);

      expect(mockLoadOptionsFunctions.helpers.request).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/user/get_list',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    test('should retrieve credentials', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({ data: {} });

      await icount.methods.loadOptions.getUsers.call(mockLoadOptionsFunctions);

      expect(mockLoadOptionsFunctions.getCredentials).toHaveBeenCalledWith('iCountApi');
    });
  });

  describe('Output Format', () => {
    test('should return proper INodePropertyOptions format', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: mockUsersFixture,
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      options.forEach(option => {
        expect(option).toHaveProperty('name');
        expect(option).toHaveProperty('value');
        expect(typeof option.name).toBe('string');
        expect(typeof option.value).toBe('string');
      });
    });

    test('should convert user_id to string value', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: [
          { user_id: 123, user_name: 'Test User' },
        ],
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].value).toBe('123');
      expect(typeof options[0].value).toBe('string');
    });

    test('should handle Hebrew characters in user names', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: {
          '1': 'משתמש ראשי',
          '2': 'משתמש מכירות',
        },
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options[0].name).toBe('משתמש ראשי');
      expect(options[0].name).toMatch(/[\u0590-\u05FF]/); // Hebrew Unicode
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty object', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: {},
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should handle empty array', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: [],
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toEqual([]);
    });

    test('should filter out null values in array', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: [
          { user_id: 1, user_name: 'User 1' },
          null,
          { user_id: 2, user_name: 'User 2' },
        ],
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      expect(options).toHaveLength(2);
    });

    test('should handle mixed valid and invalid entries', async () => {
      mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
        data: {
          '1': { user_id: 1, user_name: 'Valid User' },
          '2': 'String User',
          '3': null,
          '4': undefined,
          '5': { user_id: 5, user_name: 'Another Valid' },
        },
      });

      const options = await icount.methods.loadOptions.getUsers.call(
        mockLoadOptionsFunctions
      );

      // Should include objects and strings, skip null/undefined
      expect(options.length).toBeGreaterThanOrEqual(2);
    });
  });
});
