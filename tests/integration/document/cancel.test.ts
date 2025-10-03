import { executeCancel } from '../../../nodes/ICount/resources/document/cancel.operation';
import { createMockExecuteFunctions } from '../../helpers/mockN8nContext';

describe('Integration - Document Cancel', () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockContext.getCredentials = jest.fn().mockResolvedValue({
      token: 'test-token',
    });
    mockContext.helpers.requestWithAuthentication = jest.fn();
  });

  describe('Basic Cancel', () => {
    test('should cancel document with minimal parameters', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 2001,
        refund_cc: false,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        message: 'Document cancelled successfully',
      });

      const result = await executeCancel.call(mockContext, 0);

      expect(result.json.success).toBe(true);
      expect(result.json.doctype).toBe('320');
      expect(result.json.docnum).toBe(2001);

      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledWith(
        'iCountApi',
        {
          method: 'POST',
          url: 'https://api.icount.co.il/api/v3.php/doc/cancel',
          body: {
            doctype: '320',
            docnum: 2001,
            refund_cc: 0,
          },
          json: true,
        }
      );
    });

    test('should cancel invoice (doctype 320)', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 3001,
        refund_cc: false,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      const result = await executeCancel.call(mockContext, 0);

      expect(result.json.doctype).toBe('320');
      expect(result.json.docnum).toBe(3001);
    });

    test('should cancel receipt (doctype 405)', async () => {
      mockContext.setParameters({
        doctype: '405',
        docnum: 5001,
        refund_cc: false,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      const result = await executeCancel.call(mockContext, 0);

      expect(result.json.doctype).toBe('405');
      expect(result.json.docnum).toBe(5001);
    });
  });

  describe('Credit Card Refund', () => {
    test('should cancel with credit card refund disabled', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 2002,
        refund_cc: false,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeCancel.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.refund_cc).toBe(0);
    });

    test('should cancel with credit card refund enabled', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 2003,
        refund_cc: true,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        refund_processed: true,
      });

      const result = await executeCancel.call(mockContext, 0);

      expect(result.json.refund_processed).toBe(true);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.refund_cc).toBe(1);
    });
  });

  describe('Cancellation Reason', () => {
    test('should cancel without reason', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 2004,
        refund_cc: false,
        reason: '',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeCancel.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.reason).toBeUndefined();
    });

    test('should cancel with reason', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 2005,
        refund_cc: false,
        reason: 'Customer requested cancellation',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeCancel.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.reason).toBe('Customer requested cancellation');
    });

    test('should cancel with Hebrew reason', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 2006,
        refund_cc: false,
        reason: 'ביטול לבקשת הלקוח',
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeCancel.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.reason).toBe('ביטול לבקשת הלקוח');
    });

    test('should cancel with long reason', async () => {
      const longReason = 'This is a very long cancellation reason that explains in detail why the document needs to be cancelled, including multiple factors and considerations.';

      mockContext.setParameters({
        doctype: '320',
        docnum: 2007,
        refund_cc: false,
        reason: longReason,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      await executeCancel.call(mockContext, 0);

      const callBody = mockContext.helpers.requestWithAuthentication.mock.calls[0][1].body;
      expect(callBody.reason).toBe(longReason);
    });
  });

  describe('Error Handling', () => {
    test('should throw error when API returns status: false', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 9999,
        refund_cc: false,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        message: 'Document not found',
      });

      await expect(executeCancel.call(mockContext, 0)).rejects.toThrow(
        'iCount API Error: Document not found'
      );
    });

    test('should throw error when document already cancelled', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 2008,
        refund_cc: false,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        error: 'Document already cancelled',
      });

      await expect(executeCancel.call(mockContext, 0)).rejects.toThrow(
        'Document already cancelled'
      );
    });

    test('should throw error with JSON response fallback', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 2009,
        refund_cc: false,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        someField: 'some error data',
      });

      await expect(executeCancel.call(mockContext, 0)).rejects.toThrow(
        'iCount API Error'
      );
    });

    test('should handle network errors', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 2010,
        refund_cc: false,
      });

      mockContext.helpers.requestWithAuthentication.mockRejectedValue(
        new Error('Network timeout')
      );

      await expect(executeCancel.call(mockContext, 0)).rejects.toThrow(
        'Network timeout'
      );
    });

    test('should handle invalid document type', async () => {
      mockContext.setParameters({
        doctype: '999',
        docnum: 2011,
        refund_cc: false,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: false,
        message: 'Invalid document type',
      });

      await expect(executeCancel.call(mockContext, 0)).rejects.toThrow(
        'Invalid document type'
      );
    });
  });

  describe('Response Format', () => {
    test('should return formatted success response', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 3001,
        refund_cc: false,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        message: 'Cancelled',
        cancelled_at: '2025-01-15T10:30:00Z',
      });

      const result = await executeCancel.call(mockContext, 0);

      expect(result).toHaveProperty('json');
      expect(result.json).toMatchObject({
        success: true,
        doctype: '320',
        docnum: 3001,
        status: true,
        message: 'Cancelled',
        cancelled_at: '2025-01-15T10:30:00Z',
      });
    });

    test('should include all response fields', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 3002,
        refund_cc: true,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
        credit_doc_id: 'credit-uuid-123',
        credit_doc_number: 4001,
        refund_amount: 5000,
      });

      const result = await executeCancel.call(mockContext, 0);

      expect(result.json.credit_doc_id).toBe('credit-uuid-123');
      expect(result.json.credit_doc_number).toBe(4001);
      expect(result.json.refund_amount).toBe(5000);
    });
  });

  describe('Document Numbers', () => {
    test('should handle small document numbers', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 1,
        refund_cc: false,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      const result = await executeCancel.call(mockContext, 0);

      expect(result.json.docnum).toBe(1);
    });

    test('should handle large document numbers', async () => {
      mockContext.setParameters({
        doctype: '320',
        docnum: 999999,
        refund_cc: false,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      const result = await executeCancel.call(mockContext, 0);

      expect(result.json.docnum).toBe(999999);
    });
  });

  describe('Different Document Types', () => {
    test('should cancel quote (doctype 300)', async () => {
      mockContext.setParameters({
        doctype: '300',
        docnum: 1001,
        refund_cc: false,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      const result = await executeCancel.call(mockContext, 0);

      expect(result.json.doctype).toBe('300');
    });

    test('should cancel credit note (doctype 400)', async () => {
      mockContext.setParameters({
        doctype: '400',
        docnum: 6001,
        refund_cc: false,
      });

      mockContext.helpers.requestWithAuthentication.mockResolvedValue({
        status: true,
      });

      const result = await executeCancel.call(mockContext, 0);

      expect(result.json.doctype).toBe('400');
    });
  });
});
