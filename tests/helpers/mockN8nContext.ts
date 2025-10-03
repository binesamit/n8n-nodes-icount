export class MockExecuteFunctions {
  private parameters: Map<string, any> = new Map();
  private credentials: any = { token: 'mock-token' };
  private workflowData = {
    id: 'workflow-123',
  };
  private executionId = 'execution-456';
  private nodeData = {
    id: 'node-789',
    name: 'ICount',
  };
  private itemIndex = 0;

  public helpers: any = {
    request: jest.fn(),
  };

  constructor(config?: Partial<MockExecuteFunctions>) {
    Object.assign(this, config);
  }

  getNodeParameter(paramName: string, itemIndex: number, fallback?: any): any {
    const key = `${paramName}-${itemIndex}`;
    return this.parameters.get(key) ?? fallback;
  }

  setParameter(paramName: string, value: any, itemIndex: number = 0): void {
    const key = `${paramName}-${itemIndex}`;
    this.parameters.set(key, value);
  }

  setParameters(params: Record<string, any>, itemIndex: number = 0): void {
    Object.entries(params).forEach(([key, value]) => {
      this.setParameter(key, value, itemIndex);
    });
  }

  async getCredentials(credentialType: string): Promise<any> {
    return this.credentials;
  }

  setCredentials(creds: any): void {
    this.credentials = creds;
  }

  getWorkflow(): any {
    return this.workflowData;
  }

  getExecutionId(): string {
    return this.executionId;
  }

  getNode(): any {
    return this.nodeData;
  }

  getItemIndex(): number {
    return this.itemIndex;
  }

  setItemIndex(index: number): void {
    this.itemIndex = index;
  }

  continueOnFail(): boolean {
    return false;
  }

  getInputData(): any[] {
    return [{ json: {} }];
  }
}

export class MockLoadOptionsFunctions {
  private credentials: any = { token: 'mock-token' };

  public helpers: any = {
    request: jest.fn(),
  };

  async getCredentials(credentialType: string): Promise<any> {
    return this.credentials;
  }

  setCredentials(creds: any): void {
    this.credentials = creds;
  }
}

export function createMockExecuteFunctions(
  config?: Partial<MockExecuteFunctions>
): MockExecuteFunctions {
  return new MockExecuteFunctions(config);
}

export function createMockLoadOptionsFunctions(): MockLoadOptionsFunctions {
  return new MockLoadOptionsFunctions();
}

export function createMockContext(config?: any): any {
  return {
    getWorkflow: () => ({ id: config?.workflowId || 'wf-123' }),
    getExecutionId: () => config?.executionId || 'exec-456',
    getNode: () => ({ id: config?.nodeId || 'node-789' }),
    getItemIndex: () => config?.itemIndex ?? 0,
  };
}
