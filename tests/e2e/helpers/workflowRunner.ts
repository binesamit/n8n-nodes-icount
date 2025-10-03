/**
 * E2E Workflow Test Runner
 *
 * Simulates complete n8n workflows by executing multiple operations in sequence.
 * Each workflow represents a real-world user scenario.
 */

import { createMockExecuteFunctions } from '../../helpers/mockN8nContext';

export interface WorkflowStep {
  name: string;
  resource: string;
  operation: string;
  parameters: Record<string, any>;
  expectedResult?: (result: any) => void;
  captureOutput?: string; // Store output value for next steps
}

export interface WorkflowContext {
  [key: string]: any;
}

export class WorkflowRunner {
  private context: WorkflowContext = {};
  private mockContext: any;
  private mockResponses: any[] = [];

  constructor() {
    this.mockContext = createMockExecuteFunctions();
    this.mockContext.getCredentials = jest.fn().mockResolvedValue({
      token: 'test-token',
    });
    this.mockContext.helpers.requestWithAuthentication = jest.fn();
    this.mockContext.helpers.request = jest.fn();
  }

  /**
   * Set a value in workflow context for use in subsequent steps
   */
  setContextValue(key: string, value: any): void {
    this.context[key] = value;
  }

  /**
   * Get a value from workflow context
   */
  getContextValue(key: string): any {
    return this.context[key];
  }

  /**
   * Replace template variables in parameters with context values
   * Example: { client_id: '{{customer_id}}' } -> { client_id: 12345 }
   */
  private resolveParameters(parameters: Record<string, any>): Record<string, any> {
    const resolved: Record<string, any> = {};

    for (const [key, value] of Object.entries(parameters)) {
      if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
        const contextKey = value.slice(2, -2);
        resolved[key] = this.getContextValue(contextKey);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        resolved[key] = this.resolveParameters(value);
      } else {
        resolved[key] = value;
      }
    }

    return resolved;
  }

  /**
   * Mock API response for a step
   */
  mockResponse(response: any): void {
    this.mockResponses.push(response);
  }

  /**
   * Set up all mock responses before running workflow
   */
  private setupMockResponses(): void {
    this.mockResponses.forEach((response) => {
      // Mock both request and requestWithAuthentication
      this.mockContext.helpers.requestWithAuthentication.mockResolvedValueOnce(response);
      this.mockContext.helpers.request.mockResolvedValueOnce(response);
    });
  }

  /**
   * Execute a single workflow step
   */
  async executeStep(step: WorkflowStep, executor: any): Promise<any> {
    // Resolve parameters with context values
    const resolvedParams = this.resolveParameters(step.parameters);

    // Set parameters in mock context
    this.mockContext.setParameters(resolvedParams);

    // Execute the operation
    const result = await executor.call(this.mockContext, 0);

    // Capture output if specified
    if (step.captureOutput) {
      // Handle both array results and single results
      if (Array.isArray(result)) {
        // For array results (like search), capture the entire array
        this.setContextValue(step.captureOutput, result);
      } else if (result?.json) {
        // For single results with json wrapper
        this.setContextValue(step.captureOutput, result.json);
      } else {
        // Fallback: capture entire result
        this.setContextValue(step.captureOutput, result);
      }
    }

    // Run custom validation if provided
    if (step.expectedResult) {
      step.expectedResult(result);
    }

    return result;
  }

  /**
   * Execute complete workflow with multiple steps
   */
  async runWorkflow(
    steps: WorkflowStep[],
    executors: Map<string, any>
  ): Promise<void> {
    // Set up all mock responses before starting
    this.setupMockResponses();

    for (const step of steps) {
      const operationKey = `${step.resource}:${step.operation}`;
      const executor = executors.get(operationKey);

      if (!executor) {
        throw new Error(`No executor found for ${operationKey}`);
      }

      await this.executeStep(step, executor);
    }
  }

  /**
   * Get the mock context (useful for additional assertions)
   */
  getMockContext(): any {
    return this.mockContext;
  }

  /**
   * Reset workflow for next test
   */
  reset(): void {
    this.context = {};
    this.mockResponses = [];
    this.mockContext = createMockExecuteFunctions();
    this.mockContext.getCredentials = jest.fn().mockResolvedValue({
      token: 'test-token',
    });
    this.mockContext.helpers.requestWithAuthentication = jest.fn();
    this.mockContext.helpers.request = jest.fn();
  }
}

/**
 * Helper to create a workflow step
 */
export function createStep(
  name: string,
  resource: string,
  operation: string,
  parameters: Record<string, any>,
  options?: {
    captureOutput?: string;
    expectedResult?: (result: any) => void;
  }
): WorkflowStep {
  return {
    name,
    resource,
    operation,
    parameters,
    ...options,
  };
}
