import { executeCreate } from '../../../nodes/ICount/resources/document/create.operation';
import { createMockExecuteFunctions } from '../../helpers/mockN8nContext';

describe('Integration - Document Create', () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockContext.getCredentials = jest.fn().mockResolvedValue({
      token: 'test-token',
    });
    mockContext.helpers.request = jest.fn();
  });

  describe('Minimal Invoice Creation', () => {
    test('should create invoice with minimal required fields', async () => {
      // Arrange
      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test Company Ltd',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Service', quantity: 1, unit_price: 100 },
        ]),
      });

      mockContext.helpers.request.mockResolvedValue({
        status: true,
        data: {
          doc_id: 'uuid-12345',
          doc_number: 2001,
          pdf_link: 'https://icount.co.il/pdf/12345',
        },
      });

      // Act
      const result = await executeCreate.call(mockContext, 0);

      // Assert
      expect(result.json.doc_id).toBe('uuid-12345');
      expect(result.json.doc_number).toBe(2001);
      expect(result.json.pdf_url).toBe('https://icount.co.il/pdf/12345');

      // Verify API call
      expect(mockContext.helpers.request).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/doc/create',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        body: expect.objectContaining({
          doctype: '320',
          lang: 'he',
          currency_code: 'ILS',
          client_name: 'Test Company Ltd',
          items: [
            { description: 'Service', quantity: 1, unitprice: 100 },
          ],
        }),
        json: true,
      });
    });

    test('should create invoice with existing client ID', async () => {
      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: true,
        client_id: '123',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Product', quantity: 2, unit_price: 50 },
        ]),
      });

      mockContext.helpers.request.mockResolvedValue({
        status: true,
        data: { doc_id: 'uuid-xyz', doc_number: 2002 },
      });

      const result = await executeCreate.call(mockContext, 0);

      expect(result.json.doc_id).toBe('uuid-xyz');
      expect(mockContext.helpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            client_id: '123',
          }),
        })
      );
    });
  });

  describe('Full Invoice with All Fields', () => {
    test('should create invoice with complete client details', async () => {
      mockContext.setParameters({
        doc_type: '320',
        issue_date: '2025-01-15',
        due_date: '2025-02-15',
        currency_code: 'USD',
        lang: 'en',
        use_existing_client: false,
        client_name: 'Complete Company Ltd',
        client_id_number: '123456789',
        client_email: 'test@example.com',
        client_address: '123 Main St',
        client_city: 'Tel Aviv',
        client_phone: '03-1234567',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Service A', quantity: 1, unit_price: 500 },
          { description: 'Service B', quantity: 2, unit_price: 250 },
        ]),
        comments: 'Test invoice with all details',
        send_email: true,
      });

      mockContext.helpers.request.mockResolvedValue({
        status: true,
        data: {
          doc_id: 'full-invoice-id',
          doc_number: 2003,
          pdf_link: 'https://icount.co.il/pdf/2003',
        },
      });

      const result = await executeCreate.call(mockContext, 0);

      expect(result.json.doc_number).toBe(2003);

      const requestBody = mockContext.helpers.request.mock.calls[0][0].body;
      expect(requestBody).toMatchObject({
        doctype: '320',
        lang: 'en',
        currency_code: 'USD',
        doc_date: '2025-01-15',
        duedate: '2025-02-15',
        client_name: 'Complete Company Ltd',
        vat_id: '123456789',
        email: 'test@example.com',
        client_address: '123 Main St',
        client_city: 'Tel Aviv',
        client_phone: '03-1234567',
        hwc: 'Test invoice with all details',
        send_email: 1,
        items: [
          { description: 'Service A', quantity: 1, unitprice: 500 },
          { description: 'Service B', quantity: 2, unitprice: 250 },
        ],
      });
    });

    test('should handle Hebrew client name and items', async () => {
      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: false,
        client_name: 'חברת בדיקה בע"מ',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'שירות ייעוץ', quantity: 1, unit_price: 1000 },
        ]),
      });

      mockContext.helpers.request.mockResolvedValue({
        status: true,
        data: { doc_id: 'hebrew-doc', doc_number: 2004 },
      });

      const result = await executeCreate.call(mockContext, 0);

      expect(result.json.doc_id).toBe('hebrew-doc');

      const requestBody = mockContext.helpers.request.mock.calls[0][0].body;
      expect(requestBody.client_name).toBe('חברת בדיקה בע"מ');
      expect(requestBody.items[0].description).toBe('שירות ייעוץ');
    });
  });

  describe('Items Handling', () => {
    test('should support both unit_price and unitprice in JSON', async () => {
      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Item 1', quantity: 1, unit_price: 100 },
          { description: 'Item 2', quantity: 2, unitprice: 50 },
        ]),
      });

      mockContext.helpers.request.mockResolvedValue({
        status: true,
        data: { doc_id: 'test', doc_number: 2005 },
      });

      await executeCreate.call(mockContext, 0);

      const requestBody = mockContext.helpers.request.mock.calls[0][0].body;
      expect(requestBody.items).toEqual([
        { description: 'Item 1', quantity: 1, unitprice: 100 },
        { description: 'Item 2', quantity: 2, unitprice: 50 },
      ]);
    });

    test('should handle manual items input', async () => {
      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items_input_type: 'manual',
        items: {
          item: [
            { description: 'Manual Item', quantity: 3, unit_price: 200 },
          ],
        },
      });

      mockContext.helpers.request.mockResolvedValue({
        status: true,
        data: { doc_id: 'manual', doc_number: 2006 },
      });

      await executeCreate.call(mockContext, 0);

      const requestBody = mockContext.helpers.request.mock.calls[0][0].body;
      expect(requestBody.items).toEqual([
        { description: 'Manual Item', quantity: 3, unitprice: 200 },
      ]);
    });

    test('should handle multiple items', async () => {
      const items = Array.from({ length: 10 }, (_, i) => ({
        description: `Item ${i + 1}`,
        quantity: i + 1,
        unit_price: (i + 1) * 10,
      }));

      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items_input_type: 'json',
        items_json: JSON.stringify(items),
      });

      mockContext.helpers.request.mockResolvedValue({
        status: true,
        data: { doc_id: 'multi', doc_number: 2007 },
      });

      const result = await executeCreate.call(mockContext, 0);

      expect(result.json.doc_number).toBe(2007);

      const requestBody = mockContext.helpers.request.mock.calls[0][0].body;
      expect(requestBody.items).toHaveLength(10);
    });
  });

  describe('Optional Fields', () => {
    test('should omit optional date fields when not provided', async () => {
      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Service', quantity: 1, unit_price: 100 },
        ]),
      });

      mockContext.helpers.request.mockResolvedValue({
        status: true,
        data: { doc_id: 'test', doc_number: 2008 },
      });

      await executeCreate.call(mockContext, 0);

      const requestBody = mockContext.helpers.request.mock.calls[0][0].body;
      expect(requestBody.doc_date).toBeUndefined();
      expect(requestBody.duedate).toBeUndefined();
    });

    test('should include dates when provided', async () => {
      mockContext.setParameters({
        doc_type: '320',
        issue_date: '2025-01-01',
        due_date: '2025-02-01',
        use_existing_client: false,
        client_name: 'Test',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Service', quantity: 1, unit_price: 100 },
        ]),
      });

      mockContext.helpers.request.mockResolvedValue({
        status: true,
        data: { doc_id: 'test', doc_number: 2009 },
      });

      await executeCreate.call(mockContext, 0);

      const requestBody = mockContext.helpers.request.mock.calls[0][0].body;
      expect(requestBody.doc_date).toBe('2025-01-01');
      expect(requestBody.duedate).toBe('2025-02-01');
    });

    test('should include comments when provided', async () => {
      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Service', quantity: 1, unit_price: 100 },
        ]),
        comments: 'Important notes here',
      });

      mockContext.helpers.request.mockResolvedValue({
        status: true,
        data: { doc_id: 'test', doc_number: 2010 },
      });

      await executeCreate.call(mockContext, 0);

      const requestBody = mockContext.helpers.request.mock.calls[0][0].body;
      expect(requestBody.hwc).toBe('Important notes here');
    });

    test('should set send_email flag when enabled', async () => {
      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Service', quantity: 1, unit_price: 100 },
        ]),
        send_email: true,
      });

      mockContext.helpers.request.mockResolvedValue({
        status: true,
        data: { doc_id: 'test', doc_number: 2011 },
      });

      await executeCreate.call(mockContext, 0);

      const requestBody = mockContext.helpers.request.mock.calls[0][0].body;
      expect(requestBody.send_email).toBe(1);
    });
  });

  describe('Error Handling', () => {
    test('should throw error when API returns status: false', async () => {
      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Service', quantity: 1, unit_price: 100 },
        ]),
      });

      mockContext.helpers.request.mockResolvedValue({
        status: false,
        message: 'Invalid document type',
      });

      await expect(executeCreate.call(mockContext, 0)).rejects.toThrow(
        'iCount API Error: Invalid document type'
      );
    });

    test('should throw error with error field', async () => {
      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Service', quantity: 1, unit_price: 100 },
        ]),
      });

      mockContext.helpers.request.mockResolvedValue({
        status: false,
        error: 'Missing required field',
      });

      await expect(executeCreate.call(mockContext, 0)).rejects.toThrow(
        'Missing required field'
      );
    });

    test('should handle network errors', async () => {
      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Service', quantity: 1, unit_price: 100 },
        ]),
      });

      mockContext.helpers.request.mockRejectedValue(new Error('Network timeout'));

      await expect(executeCreate.call(mockContext, 0)).rejects.toThrow(
        'Network timeout'
      );
    });
  });

  describe('Response Formatting', () => {
    test('should handle response with data wrapper', async () => {
      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Service', quantity: 1, unit_price: 100 },
        ]),
      });

      mockContext.helpers.request.mockResolvedValue({
        status: true,
        data: {
          doc_id: 'wrapped-id',
          doc_number: 3001,
          pdf_link: 'https://link.com',
        },
      });

      const result = await executeCreate.call(mockContext, 0);

      expect(result.json.doc_id).toBe('wrapped-id');
      expect(result.json.doc_number).toBe(3001);
      expect(result.json.pdf_url).toBe('https://link.com');
    });

    test('should handle response without data wrapper', async () => {
      mockContext.setParameters({
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Service', quantity: 1, unit_price: 100 },
        ]),
      });

      mockContext.helpers.request.mockResolvedValue({
        status: true,
        doc_id: 'direct-id',
        doc_number: 3002,
        pdf_link: 'https://direct.com',
      });

      const result = await executeCreate.call(mockContext, 0);

      expect(result.json.doc_id).toBe('direct-id');
      expect(result.json.doc_number).toBe(3002);
    });
  });
});
