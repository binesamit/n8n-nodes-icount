/**
 * E2E Test: Customer Management Workflow
 *
 * This test simulates a complete customer management workflow:
 * 1. Create a new customer
 * 2. Update customer details
 * 3. Verify customer was updated
 * 4. Delete customer
 */

import { WorkflowRunner, createStep } from '../helpers/workflowRunner';
import { executeCreateCustomer } from '../../../nodes/ICount/resources/customer/create.operation';
import { executeUpdateCustomer } from '../../../nodes/ICount/resources/customer/update.operation';
import { executeDelete } from '../../../nodes/ICount/resources/customer/delete.operation';

describe('E2E - Customer Management Workflow', () => {
  let runner: WorkflowRunner;

  beforeEach(() => {
    runner = new WorkflowRunner();
  });

  test('should create, update, and delete customer', async () => {
    const steps = [
      // Step 1: Create customer
      createStep('Create Customer', 'customer', 'create', {
        name: 'E2E Test Customer Ltd',
        email: 'e2e-customer@test.com',
        phone: '03-1234567',
        address: 'Test Street 10',
        city: 'Tel Aviv',
        payment_terms: 30,
      }, {
        captureOutput: 'customer',
        expectedResult: (result) => {
          expect(result.json.action).toBe('created');
          expect(result.json.customer_id).toBe('customer-123');
        },
      }),

      // Step 2: Update customer
      createStep('Update Customer', 'customer', 'update', {
        client_id: '{{customer.customer_id}}',
        name: 'E2E Test Customer Ltd - Updated',
        email: 'updated@test.com',
        payment_terms: 60,
        notes: 'Customer updated during E2E test',
      }, {
        expectedResult: (result) => {
          expect(result.json.action).toBe('updated');
        },
      }),

      // Step 3: Delete customer
      createStep('Delete Customer', 'customer', 'delete', {
        client_id: '{{customer.customer_id}}',
      }, {
        expectedResult: (result) => {
          expect(result.json.success).toBe(true);
        },
      }),
    ];

    // Mock API responses in order
    runner.mockResponse({
      status: true,
      data: { client_id: 'customer-123' },
    });

    runner.mockResponse({
      status: true,
      data: { client_id: 'customer-123', updated_at: '2025-01-15T10:00:00Z' },
    });

    runner.mockResponse({
      status: true,
      message: 'Customer deleted successfully',
    });

    // Execute workflow
    const executors = new Map([
      ['customer:create', executeCreateCustomer],
      ['customer:update', executeUpdateCustomer],
      ['customer:delete', executeDelete],
    ]);

    await runner.runWorkflow(steps, executors);

    // Verify context
    expect(runner.getContextValue('customer').customer_id).toBe('customer-123');
  });

  test('should create and update customer with Hebrew data', async () => {
    const steps = [
      createStep('Create Hebrew Customer', 'customer', 'create', {
        name: 'חברת E2E בע"מ',
        email: 'hebrew@test.co.il',
        address: 'רחוב הבדיקה 50',
        city: 'תל אביב',
      }, {
        captureOutput: 'customer',
      }),

      createStep('Update Hebrew Customer', 'customer', 'update', {
        client_id: '{{customer.customer_id}}',
        address: 'רחוב מעודכן 100',
        notes: 'הערות מעודכנות',
      }),
    ];

    runner.mockResponse({
      status: true,
      data: { client_id: 'hebrew-customer-456' },
    });

    runner.mockResponse({
      status: true,
    });

    const executors = new Map([
      ['customer:create', executeCreateCustomer],
      ['customer:update', executeUpdateCustomer],
    ]);

    await runner.runWorkflow(steps, executors);

    expect(runner.getContextValue('customer').customer_id).toBe('hebrew-customer-456');
  });

  test('should create customer with full details', async () => {
    const steps = [
      createStep('Create Full Customer', 'customer', 'create', {
        name: 'Complete Customer Ltd',
        email: 'complete@customer.com',
        id_number: '123456789',
        phone: '03-9999999',
        mobile: '050-8888888',
        address: 'Complete Street 25',
        city: 'Haifa',
        bus_country: 'Israel',
        bus_city: 'Haifa',
        bus_street: 'Business Avenue',
        bus_no: '30',
        bank: '12',
        branch: '345',
        account: '123456',
        payment_terms: 45,
        client_type_discount: 15,
        notes: 'VIP Customer - full details',
      }, {
        captureOutput: 'customer',
      }),
    ];

    runner.mockResponse({
      status: true,
      data: { client_id: 'full-customer-789' },
    });

    const executors = new Map([
      ['customer:create', executeCreateCustomer],
    ]);

    await runner.runWorkflow(steps, executors);

    expect(runner.getContextValue('customer').customer_id).toBe('full-customer-789');
  });

  test('should handle multiple customer updates', async () => {
    const steps = [
      createStep('Create Customer', 'customer', 'create', {
        name: 'Multi Update Customer',
        email: 'multi@test.com',
      }, {
        captureOutput: 'customer',
      }),

      createStep('First Update', 'customer', 'update', {
        client_id: '{{customer.customer_id}}',
        phone: '03-1111111',
      }),

      createStep('Second Update', 'customer', 'update', {
        client_id: '{{customer.customer_id}}',
        address: 'New Address 10',
      }),

      createStep('Third Update', 'customer', 'update', {
        client_id: '{{customer.customer_id}}',
        notes: 'Final notes after multiple updates',
      }),
    ];

    runner.mockResponse({
      status: true,
      data: { client_id: 'multi-update-999' },
    });

    runner.mockResponse({ status: true });
    runner.mockResponse({ status: true });
    runner.mockResponse({ status: true });

    const executors = new Map([
      ['customer:create', executeCreateCustomer],
      ['customer:update', executeUpdateCustomer],
    ]);

    await runner.runWorkflow(steps, executors);

    expect(runner.getContextValue('customer').customer_id).toBe('multi-update-999');
  });

  test('should create multiple customers sequentially', async () => {
    const steps = [
      createStep('Create Customer 1', 'customer', 'create', {
        name: 'Customer One',
        email: 'one@test.com',
      }, {
        captureOutput: 'customer1',
      }),

      createStep('Create Customer 2', 'customer', 'create', {
        name: 'Customer Two',
        email: 'two@test.com',
      }, {
        captureOutput: 'customer2',
      }),

      createStep('Create Customer 3', 'customer', 'create', {
        name: 'Customer Three',
        email: 'three@test.com',
      }, {
        captureOutput: 'customer3',
      }),
    ];

    runner.mockResponse({
      status: true,
      data: { client_id: 'seq-customer-1' },
    });

    runner.mockResponse({
      status: true,
      data: { client_id: 'seq-customer-2' },
    });

    runner.mockResponse({
      status: true,
      data: { client_id: 'seq-customer-3' },
    });

    const executors = new Map([
      ['customer:create', executeCreateCustomer],
    ]);

    await runner.runWorkflow(steps, executors);

    expect(runner.getContextValue('customer1').customer_id).toBe('seq-customer-1');
    expect(runner.getContextValue('customer2').customer_id).toBe('seq-customer-2');
    expect(runner.getContextValue('customer3').customer_id).toBe('seq-customer-3');
  });

  test('should handle customer creation error', async () => {
    const steps = [
      createStep('Create Customer with Error', 'customer', 'create', {
        name: 'Error Customer',
        email: 'error@test.com',
      }),
    ];

    runner.mockResponse({
      status: false,
      message: 'Email already exists',
    });

    const executors = new Map([
      ['customer:create', executeCreateCustomer],
    ]);

    await expect(runner.runWorkflow(steps, executors)).rejects.toThrow(
      'Email already exists'
    );
  });

  test('should handle customer update error', async () => {
    const steps = [
      createStep('Create Customer', 'customer', 'create', {
        name: 'Update Error Customer',
        email: 'update-error@test.com',
      }, {
        captureOutput: 'customer',
      }),

      createStep('Update with Error', 'customer', 'update', {
        client_id: '{{customer.customer_id}}',
        name: 'Should Fail',
      }),
    ];

    runner.mockResponse({
      status: true,
      data: { client_id: 'error-update-111' },
    });

    runner.mockResponse({
      status: false,
      error: 'Customer not found',
    });

    const executors = new Map([
      ['customer:create', executeCreateCustomer],
      ['customer:update', executeUpdateCustomer],
    ]);

    await expect(runner.runWorkflow(steps, executors)).rejects.toThrow(
      'Customer not found'
    );
  });

  test('should handle customer delete error', async () => {
    const steps = [
      createStep('Create Customer', 'customer', 'create', {
        name: 'Delete Error Customer',
        email: 'delete-error@test.com',
      }, {
        captureOutput: 'customer',
      }),

      createStep('Delete with Error', 'customer', 'delete', {
        client_id: '{{customer.customer_id}}',
      }),
    ];

    runner.mockResponse({
      status: true,
      data: { client_id: 'error-delete-222' },
    });

    runner.mockResponse({
      status: false,
      message: 'Cannot delete customer with active documents',
    });

    const executors = new Map([
      ['customer:create', executeCreateCustomer],
      ['customer:delete', executeDelete],
    ]);

    await expect(runner.runWorkflow(steps, executors)).rejects.toThrow(
      'Cannot delete customer with active documents'
    );
  });
});
