import { executeCreateCustomer } from '../../../nodes/ICount/resources/customer/create.operation';
import { createMockExecuteFunctions } from '../../helpers/mockN8nContext';

describe('Integration - Customer Create', () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockContext.getCredentials = jest.fn().mockResolvedValue({
      token: 'test-token',
    });
    mockContext.helpers.requestWithAuthentication = jest.fn();
  });

  describe('Basic Create', () => {
    test('should create customer with minimal required fields', async () => {
      mockContext.setParameters({
        name: 'Test Company Ltd',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: {
          client_id: 'uuid-123',
        },
      });

      const result = await executeCreateCustomer.call(mockContext, 0);

      expect(result.json.action).toBe('created');
      expect(result.json.customer_id).toBe('uuid-123');

      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledWith(
        'iCountApi',
        {
          method: 'POST',
          url: 'https://api.icount.co.il/api/v3.php/client/create',
          body: {
            client_name: 'Test Company Ltd',
          },
          json: true,
        }
      );
    });

    test('should create customer with Hebrew name', async () => {
      mockContext.setParameters({
        name: 'חברת בדיקה בע"מ',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'hebrew-uuid' },
      });

      const result = await executeCreateCustomer.call(mockContext, 0);

      expect(result.json.customer_id).toBe('hebrew-uuid');

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.client_name).toBe('חברת בדיקה בע"מ');
    });

    test('should create customer with full contact info', async () => {
      mockContext.setParameters({
        name: 'Full Contact Inc',
        email: 'contact@example.com',
        phone: '03-1234567',
        mobile: '050-1234567',
        fax: '03-7654321',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'full-contact-uuid' },
      });

      const result = await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.client_email).toBe('contact@example.com');
      expect(callBody.email).toBe('contact@example.com');
      expect(callBody.client_phone).toBe('03-1234567');
      expect(callBody.phone).toBe('03-1234567');
      expect(callBody.mobile).toBe('050-1234567');
      expect(callBody.fax).toBe('03-7654321');
    });
  });

  describe('HP and VAT', () => {
    test('should create customer with HP number', async () => {
      mockContext.setParameters({
        name: 'HP Test Company',
        id_number: '123456789',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'hp-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.hp).toBe('123456789');
      expect(callBody.vat_id).toBe('123456789');
    });

    test('should override HP with separate VAT ID', async () => {
      mockContext.setParameters({
        name: 'VAT Company',
        id_number: '111111111',
        vat_id: '999999999',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'vat-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.hp).toBe('111111111');
      expect(callBody.vat_id).toBe('999999999');
    });
  });

  describe('Address Fields', () => {
    test('should create customer with simple address', async () => {
      mockContext.setParameters({
        name: 'Address Company',
        address: 'Rothschild 1',
        city: 'Tel Aviv',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'address-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.client_address).toBe('Rothschild 1');
      expect(callBody.address).toBe('Rothschild 1');
      expect(callBody.client_city).toBe('Tel Aviv');
      expect(callBody.city).toBe('Tel Aviv');
    });

    test('should create customer with full business address', async () => {
      mockContext.setParameters({
        name: 'Business Address Co',
        bus_country: 'Israel',
        bus_state: 'Tel Aviv District',
        bus_city: 'Tel Aviv',
        bus_zip: '6801296',
        bus_street: 'Rothschild Boulevard',
        bus_no: '1',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'bus-address-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.bus_country).toBe('Israel');
      expect(callBody.bus_state).toBe('Tel Aviv District');
      expect(callBody.bus_city).toBe('Tel Aviv');
      expect(callBody.bus_zip).toBe('6801296');
      expect(callBody.bus_street).toBe('Rothschild Boulevard');
      expect(callBody.bus_no).toBe('1');
    });

    test('should create customer with full home address', async () => {
      mockContext.setParameters({
        name: 'Home Address Person',
        home_country: 'Israel',
        home_state: 'Jerusalem District',
        home_city: 'Jerusalem',
        home_zip: '9101001',
        home_street: 'King George Street',
        home_no: '15',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'home-address-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.home_country).toBe('Israel');
      expect(callBody.home_state).toBe('Jerusalem District');
      expect(callBody.home_city).toBe('Jerusalem');
      expect(callBody.home_zip).toBe('9101001');
      expect(callBody.home_street).toBe('King George Street');
      expect(callBody.home_no).toBe('15');
    });

    test('should create customer with Hebrew address', async () => {
      mockContext.setParameters({
        name: 'Hebrew Address',
        address: 'רחוב רוטשילד 1',
        city: 'תל אביב',
        bus_street: 'שדרות רוטשילד',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'hebrew-address-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.address).toBe('רחוב רוטשילד 1');
      expect(callBody.city).toBe('תל אביב');
      expect(callBody.bus_street).toBe('שדרות רוטשילד');
    });
  });

  describe('Bank Details', () => {
    test('should create customer with bank details', async () => {
      mockContext.setParameters({
        name: 'Bank Customer',
        bank: '12',
        branch: '345',
        account: '123456',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'bank-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.bank).toBe('12');
      expect(callBody.branch).toBe('345');
      expect(callBody.account).toBe('123456');
    });

    test('should create customer with foreign account', async () => {
      mockContext.setParameters({
        name: 'Foreign Account Customer',
        faccount: 'IBAN-123456789',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'foreign-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.faccount).toBe('IBAN-123456789');
    });
  });

  describe('Personal Names', () => {
    test('should create customer with first and last name', async () => {
      mockContext.setParameters({
        name: 'John Doe Personal',
        first_name: 'John',
        last_name: 'Doe',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'personal-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.first_name).toBe('John');
      expect(callBody.last_name).toBe('Doe');
    });

    test('should create customer with Hebrew names', async () => {
      mockContext.setParameters({
        name: 'ישראל ישראלי',
        first_name: 'ישראל',
        last_name: 'ישראלי',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'hebrew-name-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.first_name).toBe('ישראל');
      expect(callBody.last_name).toBe('ישראלי');
    });
  });

  describe('Additional Fields', () => {
    test('should create customer with notes', async () => {
      mockContext.setParameters({
        name: 'Notes Customer',
        notes: 'Important client - VIP discount',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'notes-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.notes).toBe('Important client - VIP discount');
    });

    test('should create customer with Hebrew notes', async () => {
      mockContext.setParameters({
        name: 'Hebrew Notes',
        notes: 'לקוח חשוב - הנחת VIP',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'hebrew-notes-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.notes).toBe('לקוח חשוב - הנחת VIP');
    });

    test('should create customer with custom fields', async () => {
      mockContext.setParameters({
        name: 'Custom Fields Customer',
        custom_client_id: 'CRM-12345',
        custom_info: 'Extra metadata',
        digsig: 'digital-signature-hash',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'custom-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.custom_client_id).toBe('CRM-12345');
      expect(callBody.custom_info).toBe('Extra metadata');
      expect(callBody.digsig).toBe('digital-signature-hash');
    });

    test('should create customer with employee assigned', async () => {
      mockContext.setParameters({
        name: 'Assigned Customer',
        employee_assigned: '42',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'assigned-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.employee_assigned).toBe(42);
      expect(typeof callBody.employee_assigned).toBe('number');
    });

    test('should create customer with client type', async () => {
      mockContext.setParameters({
        name: 'Typed Customer',
        client_type_id: '5',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'typed-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.client_type_id).toBe(5);
      expect(typeof callBody.client_type_id).toBe('number');
    });

    test('should create customer with payment terms', async () => {
      mockContext.setParameters({
        name: 'Payment Terms Customer',
        payment_terms: 30,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'payment-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.payment_terms).toBe(30);
    });

    test('should create customer with client type discount', async () => {
      mockContext.setParameters({
        name: 'Discount Customer',
        client_type_discount: 15,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: { client_id: 'discount-uuid' },
      });

      await executeCreateCustomer.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.client_type_discount).toBe(15);
    });
  });

  describe('Complete Customer', () => {
    test('should create customer with all fields', async () => {
      mockContext.setParameters({
        name: 'Complete Customer Ltd',
        id_number: '123456789',
        vat_id: '999999999',
        email: 'info@complete.com',
        first_name: 'John',
        last_name: 'Complete',
        phone: '03-9999999',
        mobile: '050-9999999',
        fax: '03-8888888',
        address: 'Complete Street 10',
        city: 'Tel Aviv',
        bus_country: 'Israel',
        bus_state: 'Tel Aviv District',
        bus_city: 'Tel Aviv',
        bus_zip: '6801296',
        bus_street: 'Business Boulevard',
        bus_no: '20',
        home_country: 'Israel',
        home_state: 'Center District',
        home_city: 'Rishon LeZion',
        home_zip: '7501234',
        home_street: 'Home Street',
        home_no: '5',
        bank: '12',
        branch: '345',
        account: '123456',
        faccount: 'IBAN-ABC123',
        notes: 'VIP customer with complete details',
        digsig: 'signature-hash-123',
        custom_client_id: 'EXT-12345',
        custom_info: 'Additional metadata',
        employee_assigned: '7',
        client_type_id: '3',
        payment_terms: 45,
        client_type_discount: 20,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: {
          client_id: 'complete-uuid-123',
          client_name: 'Complete Customer Ltd',
        },
      });

      const result = await executeCreateCustomer.call(mockContext, 0);

      expect(result.json.action).toBe('created');
      expect(result.json.customer_id).toBe('complete-uuid-123');
      expect(result.json.client_name).toBe('Complete Customer Ltd');

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody).toMatchObject({
        client_name: 'Complete Customer Ltd',
        hp: '123456789',
        vat_id: '999999999',
        client_email: 'info@complete.com',
        email: 'info@complete.com',
        first_name: 'John',
        last_name: 'Complete',
        client_phone: '03-9999999',
        phone: '03-9999999',
        mobile: '050-9999999',
        fax: '03-8888888',
        client_address: 'Complete Street 10',
        address: 'Complete Street 10',
        client_city: 'Tel Aviv',
        city: 'Tel Aviv',
        bus_country: 'Israel',
        bus_city: 'Tel Aviv',
        bus_zip: '6801296',
        home_country: 'Israel',
        bank: '12',
        branch: '345',
        account: '123456',
        faccount: 'IBAN-ABC123',
        notes: 'VIP customer with complete details',
        employee_assigned: 7,
        client_type_id: 3,
        payment_terms: 45,
        client_type_discount: 20,
      });
    });
  });

  describe('Error Handling', () => {
    test('should throw error when API returns status: false', async () => {
      mockContext.setParameters({
        name: 'Error Customer',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        message: 'Customer name already exists',
      });

      await expect(executeCreateCustomer.call(mockContext, 0)).rejects.toThrow(
        'iCount API Error: Customer name already exists'
      );
    });

    test('should throw error with error field', async () => {
      mockContext.setParameters({
        name: 'Error Customer',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        error: 'Invalid customer data',
      });

      await expect(executeCreateCustomer.call(mockContext, 0)).rejects.toThrow(
        'Invalid customer data'
      );
    });

    test('should throw error with JSON response fallback', async () => {
      mockContext.setParameters({
        name: 'Error Customer',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        someField: 'some error data',
      });

      await expect(executeCreateCustomer.call(mockContext, 0)).rejects.toThrow(
        'iCount API Error'
      );
    });

    test('should handle network errors', async () => {
      mockContext.setParameters({
        name: 'Network Error Customer',
      });

      mockContext.helpers.requestWithAuthentication.mockRejectedValue(
        new Error('Connection timeout')
      );

      await expect(executeCreateCustomer.call(mockContext, 0)).rejects.toThrow(
        'Connection timeout'
      );
    });

    test('should handle duplicate HP error', async () => {
      mockContext.setParameters({
        name: 'Duplicate HP',
        id_number: '123456789',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        message: 'HP number already exists',
      });

      await expect(executeCreateCustomer.call(mockContext, 0)).rejects.toThrow(
        'HP number already exists'
      );
    });

    test('should handle invalid email error', async () => {
      mockContext.setParameters({
        name: 'Invalid Email',
        email: 'not-an-email',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        error: 'Invalid email format',
      });

      await expect(executeCreateCustomer.call(mockContext, 0)).rejects.toThrow(
        'Invalid email format'
      );
    });
  });

  describe('Response Format', () => {
    test('should return formatted response with data wrapper', async () => {
      mockContext.setParameters({
        name: 'Response Test',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        data: {
          client_id: 'response-uuid',
          client_name: 'Response Test',
          created_at: '2025-01-15T12:00:00Z',
        },
      });

      const result = await executeCreateCustomer.call(mockContext, 0);

      expect(result.json).toMatchObject({
        action: 'created',
        customer_id: 'response-uuid',
        client_id: 'response-uuid',
        client_name: 'Response Test',
        created_at: '2025-01-15T12:00:00Z',
      });
    });

    test('should return formatted response without data wrapper', async () => {
      mockContext.setParameters({
        name: 'Direct Response',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        client_id: 'direct-uuid',
        client_name: 'Direct Response',
      });

      const result = await executeCreateCustomer.call(mockContext, 0);

      expect(result.json).toMatchObject({
        action: 'created',
        customer_id: 'direct-uuid',
        client_id: 'direct-uuid',
        client_name: 'Direct Response',
      });
    });
  });
});
