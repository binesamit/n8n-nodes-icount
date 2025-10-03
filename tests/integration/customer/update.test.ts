import { executeUpdateCustomer } from '../../../nodes/ICount/resources/customer/update.operation';
import { createMockExecuteFunctions } from '../../helpers/mockN8nContext';

describe('Integration - Customer Update', () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockContext.getCredentials = jest.fn().mockResolvedValue({
      token: 'test-token',
    });
    mockContext.helpers.requestWithAuthentication = jest.fn();
  });

  describe('Basic Update', () => {
    test('should update customer with minimal parameters', async () => {
      mockContext.setParameters({
        client_id: 12345,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: {
          client_id: 12345,
          updated: true,
        },
      });

      const result = await executeUpdateCustomer.call(mockContext, 0);

      expect(result.json.action).toBe('updated');
      expect(result.json.customer_id).toBe(12345);

      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledWith(
        'iCountApi',
        {
          method: 'POST',
          url: 'https://api.icount.co.il/api/v3.php/client/update',
          body: {
            client_id: 12345,
          },
          json: true,
        }
      );
    });

    test('should update customer name', async () => {
      mockContext.setParameters({
        client_id: 100,
        name: 'Updated Company Name',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      const result = await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.client_name).toBe('Updated Company Name');
    });

    test('should update customer with Hebrew name', async () => {
      mockContext.setParameters({
        client_id: 200,
        name: 'חברה מעודכנת בע"מ',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.client_name).toBe('חברה מעודכנת בע"מ');
    });

    test('should update multiple basic fields', async () => {
      mockContext.setParameters({
        client_id: 300,
        name: 'Multi Field Update',
        email: 'updated@example.com',
        phone: '03-9999999',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.client_id).toBe(300);
      expect(callBody.client_name).toBe('Multi Field Update');
      expect(callBody.email).toBe('updated@example.com');
      expect(callBody.client_email).toBe('updated@example.com');
      expect(callBody.phone).toBe('03-9999999');
      expect(callBody.client_phone).toBe('03-9999999');
    });
  });

  describe('Contact Information', () => {
    test('should update email', async () => {
      mockContext.setParameters({
        client_id: 400,
        email: 'newemail@test.com',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.email).toBe('newemail@test.com');
      expect(callBody.client_email).toBe('newemail@test.com');
    });

    test('should update all contact fields', async () => {
      mockContext.setParameters({
        client_id: 500,
        phone: '03-1111111',
        mobile: '050-2222222',
        fax: '03-3333333',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.phone).toBe('03-1111111');
      expect(callBody.client_phone).toBe('03-1111111');
      expect(callBody.mobile).toBe('050-2222222');
      expect(callBody.fax).toBe('03-3333333');
    });
  });

  describe('HP and VAT Updates', () => {
    test('should update HP number', async () => {
      mockContext.setParameters({
        client_id: 600,
        id_number: '987654321',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.hp).toBe('987654321');
      expect(callBody.vat_id).toBe('987654321');
    });

    test('should override HP with separate VAT ID', async () => {
      mockContext.setParameters({
        client_id: 700,
        id_number: '111111111',
        vat_id: '999888777',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.hp).toBe('111111111');
      expect(callBody.vat_id).toBe('999888777');
    });
  });

  describe('Address Updates', () => {
    test('should update simple address', async () => {
      mockContext.setParameters({
        client_id: 800,
        address: 'New Street 123',
        city: 'Haifa',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.address).toBe('New Street 123');
      expect(callBody.client_address).toBe('New Street 123');
      expect(callBody.city).toBe('Haifa');
      expect(callBody.client_city).toBe('Haifa');
    });

    test('should update business address', async () => {
      mockContext.setParameters({
        client_id: 900,
        bus_country: 'Israel',
        bus_city: 'Ramat Gan',
        bus_street: 'Diamond Exchange',
        bus_no: '7',
        bus_zip: '5252244',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.bus_country).toBe('Israel');
      expect(callBody.bus_city).toBe('Ramat Gan');
      expect(callBody.bus_street).toBe('Diamond Exchange');
      expect(callBody.bus_no).toBe('7');
      expect(callBody.bus_zip).toBe('5252244');
    });

    test('should update home address', async () => {
      mockContext.setParameters({
        client_id: 1000,
        home_country: 'Israel',
        home_city: 'Netanya',
        home_street: 'Beach Road',
        home_no: '99',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.home_country).toBe('Israel');
      expect(callBody.home_city).toBe('Netanya');
      expect(callBody.home_street).toBe('Beach Road');
      expect(callBody.home_no).toBe('99');
    });

    test('should update Hebrew address', async () => {
      mockContext.setParameters({
        client_id: 1100,
        address: 'רחוב הרצל 50',
        city: 'ירושלים',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.address).toBe('רחוב הרצל 50');
      expect(callBody.city).toBe('ירושלים');
    });
  });

  describe('Bank Details Updates', () => {
    test('should update bank details', async () => {
      mockContext.setParameters({
        client_id: 1200,
        bank: '10',
        branch: '555',
        account: '999888',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.bank).toBe('10');
      expect(callBody.branch).toBe('555');
      expect(callBody.account).toBe('999888');
    });

    test('should update foreign account', async () => {
      mockContext.setParameters({
        client_id: 1300,
        faccount: 'GB29NWBK60161331926819',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.faccount).toBe('GB29NWBK60161331926819');
    });
  });

  describe('Personal Name Updates', () => {
    test('should update first and last name', async () => {
      mockContext.setParameters({
        client_id: 1400,
        first_name: 'David',
        last_name: 'Cohen',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.first_name).toBe('David');
      expect(callBody.last_name).toBe('Cohen');
    });

    test('should update Hebrew names', async () => {
      mockContext.setParameters({
        client_id: 1500,
        first_name: 'דוד',
        last_name: 'כהן',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.first_name).toBe('דוד');
      expect(callBody.last_name).toBe('כהן');
    });
  });

  describe('Additional Field Updates', () => {
    test('should update notes', async () => {
      mockContext.setParameters({
        client_id: 1600,
        notes: 'Updated customer notes - payment delay expected',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.notes).toBe('Updated customer notes - payment delay expected');
    });

    test('should update custom fields', async () => {
      mockContext.setParameters({
        client_id: 1700,
        custom_client_id: 'NEW-CRM-999',
        custom_info: 'Updated metadata',
        digsig: 'new-signature-hash',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.custom_client_id).toBe('NEW-CRM-999');
      expect(callBody.custom_info).toBe('Updated metadata');
      expect(callBody.digsig).toBe('new-signature-hash');
    });

    test('should update employee assignment', async () => {
      mockContext.setParameters({
        client_id: 1800,
        employee_assigned: '15',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.employee_assigned).toBe('15');
    });

    test('should update client type', async () => {
      mockContext.setParameters({
        client_id: 1900,
        client_type_id: '8',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.client_type_id).toBe('8');
    });

    test('should update payment terms', async () => {
      mockContext.setParameters({
        client_id: 2000,
        payment_terms: 60,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.payment_terms).toBe(60);
    });

    test('should update client type discount', async () => {
      mockContext.setParameters({
        client_id: 2100,
        client_type_discount: 25,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeUpdateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.client_type_discount).toBe(25);
    });
  });

  describe('Complete Update', () => {
    test('should update all customer fields', async () => {
      mockContext.setParameters({
        client_id: 5000,
        name: 'Fully Updated Ltd',
        id_number: '555555555',
        vat_id: '666666666',
        email: 'fully@updated.com',
        first_name: 'Full',
        last_name: 'Update',
        phone: '03-5555555',
        mobile: '050-6666666',
        fax: '03-7777777',
        address: 'Updated Address 1',
        city: 'Updated City',
        bus_country: 'Israel',
        bus_city: 'Updated Business City',
        bus_street: 'Business St',
        bus_no: '10',
        home_country: 'Israel',
        home_city: 'Updated Home City',
        bank: '31',
        branch: '999',
        account: '888777',
        notes: 'Fully updated customer',
        payment_terms: 90,
        client_type_discount: 30,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: {
          client_id: 5000,
          updated_at: '2025-01-15T14:00:00Z',
        },
      });

      const result = await executeUpdateCustomer.call(mockContext, 0);

      expect(result.json.action).toBe('updated');
      expect(result.json.customer_id).toBe(5000);
      expect(result.json.updated_at).toBe('2025-01-15T14:00:00Z');

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.client_id).toBe(5000);
      expect(callBody.client_name).toBe('Fully Updated Ltd');
      expect(callBody.hp).toBe('555555555');
      expect(callBody.vat_id).toBe('666666666');
      expect(callBody.email).toBe('fully@updated.com');
      expect(callBody.payment_terms).toBe(90);
      expect(callBody.client_type_discount).toBe(30);
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

      await expect(executeUpdateCustomer.call(mockContext, 0)).rejects.toThrow(
        'iCount API Error: Customer not found'
      );
    });

    test('should throw error with error field', async () => {
      mockContext.setParameters({
        client_id: 9998,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        error: 'Invalid customer ID',
      });

      await expect(executeUpdateCustomer.call(mockContext, 0)).rejects.toThrow(
        'Invalid customer ID'
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

      await expect(executeUpdateCustomer.call(mockContext, 0)).rejects.toThrow(
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

      await expect(executeUpdateCustomer.call(mockContext, 0)).rejects.toThrow(
        'Network timeout'
      );
    });

    test('should handle permission errors', async () => {
      mockContext.setParameters({
        client_id: 9995,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        message: 'No permission to update this customer',
      });

      await expect(executeUpdateCustomer.call(mockContext, 0)).rejects.toThrow(
        'No permission to update this customer'
      );
    });
  });

  describe('Response Format', () => {
    test('should return formatted response with data wrapper', async () => {
      mockContext.setParameters({
        client_id: 6000,
        name: 'Response Test',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: {
          client_id: 6000,
          client_name: 'Response Test',
          updated_at: '2025-01-15T15:00:00Z',
        },
      });

      const result = await executeUpdateCustomer.call(mockContext, 0);

      expect(result.json).toMatchObject({
        action: 'updated',
        customer_id: 6000,
        client_id: 6000,
        client_name: 'Response Test',
        updated_at: '2025-01-15T15:00:00Z',
      });
    });

    test('should return formatted response without data wrapper', async () => {
      mockContext.setParameters({
        client_id: 7000,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        client_id: 7000,
        success: true,
      });

      const result = await executeUpdateCustomer.call(mockContext, 0);

      expect(result.json).toMatchObject({
        action: 'updated',
        customer_id: 7000,
        client_id: 7000,
        success: true,
      });
    });
  });
});
