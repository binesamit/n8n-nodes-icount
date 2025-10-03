/**
 * E2E Test: Document Lifecycle
 *
 * This test simulates a complete document lifecycle workflow:
 * 1. Create a document (invoice)
 * 2. Search for the document
 * 3. Cancel the document
 * 4. Verify all operations work together
 */

import { WorkflowRunner, createStep } from '../helpers/workflowRunner';
import { executeCreate as executeCreateDocument } from '../../../nodes/ICount/resources/document/create.operation';
import { executeSearch as executeSearchDocument } from '../../../nodes/ICount/resources/document/search.operation';
import { executeCancel as executeCancelDocument } from '../../../nodes/ICount/resources/document/cancel.operation';
import { executeCreateCustomer } from '../../../nodes/ICount/resources/customer/create.operation';

describe('E2E - Document Lifecycle', () => {
  let runner: WorkflowRunner;

  beforeEach(() => {
    runner = new WorkflowRunner();
  });

  test('should create invoice with new customer', async () => {
    const steps = [
      createStep('Create Invoice', 'document', 'create', {
        doc_type: '320',
        use_existing_client: false,
        client_name: 'E2E Invoice Customer',
        client_email: 'invoice@e2e.com',
        items_input_type: 'json',
        items_json: JSON.stringify([
          {
            description: 'Service Item',
            quantity: 1,
            unit_price: 1000,
          },
        ]),
      }, {
        captureOutput: 'invoice',
      }),
    ];

    runner.mockResponse({
      status: true,
      data: { doc_id: 'invoice-001', doc_number: 5001 },
    });

    const executors = new Map([
      ['document:create', executeCreateDocument],
    ]);

    await runner.runWorkflow(steps, executors);

    expect(runner.getContextValue('invoice').doc_id).toBe('invoice-001');
    expect(runner.getContextValue('invoice').doc_number).toBe(5001);
  });

  test('should create invoice with Hebrew data', async () => {
    const steps = [
      createStep('Create Hebrew Invoice', 'document', 'create', {
        doc_type: '320',
        use_existing_client: false,
        client_name: 'לקוח E2E',
        client_email: 'hebrew@e2e.co.il',
        items_input_type: 'json',
        items_json: JSON.stringify([
          {
            description: 'שירותי ייעוץ',
            quantity: 2,
            unit_price: 500,
          },
        ]),
        comments: 'חשבונית E2E בעברית',
      }, {
        captureOutput: 'invoice',
      }),
    ];

    runner.mockResponse({
      status: true,
      data: { doc_id: 'hebrew-invoice-002', doc_number: 5002 },
    });

    const executors = new Map([
      ['document:create', executeCreateDocument],
    ]);

    await runner.runWorkflow(steps, executors);

    expect(runner.getContextValue('invoice').doc_number).toBe(5002);
  });

  test('should search documents by client ID', async () => {
    const steps = [
      createStep('Search Documents', 'document', 'search', {
        returnAll: true,
        detail_level: 2,
        client_id: 12345,
        doc_type: '320',
      }, {
        captureOutput: 'documents',
      }),
    ];

    runner.mockResponse({
      status: true,
      data: [
        { doc_id: 'doc-1', doc_number: 3001, doc_type: '320' },
        { doc_id: 'doc-2', doc_number: 3002, doc_type: '320' },
      ],
    });

    const executors = new Map([
      ['document:search', executeSearchDocument],
    ]);

    await runner.runWorkflow(steps, executors);

    const docs = runner.getContextValue('documents');
    expect(Array.isArray(docs)).toBe(true);
    expect(docs.length).toBe(2);
  });

  test('should cancel invoice', async () => {
    const steps = [
      createStep('Cancel Invoice', 'document', 'cancel', {
        doc_type: '320',
        doc_num: 5001,
        cc_refund: false,
      }, {
        captureOutput: 'cancelResult',
      }),
    ];

    runner.mockResponse({
      status: true,
      message: 'Document cancelled successfully',
    });

    const executors = new Map([
      ['document:cancel', executeCancelDocument],
    ]);

    await runner.runWorkflow(steps, executors);

    expect(runner.getContextValue('cancelResult').success).toBe(true);
  });

  test('should cancel invoice with reason', async () => {
    const steps = [
      createStep('Cancel with Reason', 'document', 'cancel', {
        doc_type: '320',
        doc_num: 5002,
        cc_refund: false,
        cancel_reason: 'Customer requested cancellation',
      }),
    ];

    runner.mockResponse({
      status: true,
    });

    const executors = new Map([
      ['document:cancel', executeCancelDocument],
    ]);

    await runner.runWorkflow(steps, executors);
  });

  test('should handle invoice creation error', async () => {
    const steps = [
      createStep('Create Invalid Invoice', 'document', 'create', {
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Error Customer',
        items_input_type: 'json',
        items_json: JSON.stringify([]),  // Empty items - should fail
      }),
    ];

    runner.mockResponse({
      status: false,
      error: 'Items array cannot be empty',
    });

    const executors = new Map([
      ['document:create', executeCreateDocument],
    ]);

    await expect(runner.runWorkflow(steps, executors)).rejects.toThrow(
      'Items array cannot be empty'
    );
  });

  test('should handle document not found when cancelling', async () => {
    const steps = [
      createStep('Cancel Non-existent Document', 'document', 'cancel', {
        doc_type: '320',
        doc_num: 99999,
        cc_refund: false,
      }),
    ];

    runner.mockResponse({
      status: false,
      message: 'Document not found',
    });

    const executors = new Map([
      ['document:cancel', executeCancelDocument],
    ]);

    await expect(runner.runWorkflow(steps, executors)).rejects.toThrow(
      'Document not found'
    );
  });

  test('should create multiple invoices sequentially', async () => {
    const steps = [
      createStep('Create Invoice 1', 'document', 'create', {
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Customer 1',
        client_email: 'customer1@test.com',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Item 1', quantity: 1, unit_price: 100 },
        ]),
      }, {
        captureOutput: 'invoice1',
      }),

      createStep('Create Invoice 2', 'document', 'create', {
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Customer 2',
        client_email: 'customer2@test.com',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Item 2', quantity: 2, unit_price: 200 },
        ]),
      }, {
        captureOutput: 'invoice2',
      }),

      createStep('Create Invoice 3', 'document', 'create', {
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Customer 3',
        client_email: 'customer3@test.com',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Item 3', quantity: 3, unit_price: 300 },
        ]),
      }, {
        captureOutput: 'invoice3',
      }),
    ];

    runner.mockResponse({
      status: true,
      data: { doc_id: 'multi-inv-1', doc_number: 6001 },
    });

    runner.mockResponse({
      status: true,
      data: { doc_id: 'multi-inv-2', doc_number: 6002 },
    });

    runner.mockResponse({
      status: true,
      data: { doc_id: 'multi-inv-3', doc_number: 6003 },
    });

    const executors = new Map([
      ['document:create', executeCreateDocument],
    ]);

    await runner.runWorkflow(steps, executors);

    expect(runner.getContextValue('invoice1').doc_number).toBe(6001);
    expect(runner.getContextValue('invoice2').doc_number).toBe(6002);
    expect(runner.getContextValue('invoice3').doc_number).toBe(6003);
  });

  test('should create invoice with multiple items', async () => {
    const steps = [
      createStep('Create Multi-Item Invoice', 'document', 'create', {
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Multi-Item Customer',
        client_email: 'multi@test.com',
        items_input_type: 'json',
        items_json: JSON.stringify([
          { description: 'Product A', quantity: 5, unit_price: 100 },
          { description: 'Product B', quantity: 3, unit_price: 250 },
          { description: 'Service C', quantity: 1, unit_price: 1000 },
          { description: 'Product D', quantity: 10, unit_price: 50 },
        ]),
        comments: 'Multi-item invoice',
      }, {
        captureOutput: 'invoice',
      }),
    ];

    runner.mockResponse({
      status: true,
      data: { doc_id: 'multi-item-inv', doc_number: 7001 },
    });

    const executors = new Map([
      ['document:create', executeCreateDocument],
    ]);

    await runner.runWorkflow(steps, executors);

    expect(runner.getContextValue('invoice').doc_number).toBe(7001);
  });
});
