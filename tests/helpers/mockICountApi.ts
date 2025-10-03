export class MockICountApi {
  private responses: Map<string, any> = new Map();
  private errors: Map<string, any> = new Map();
  private multiResponses: any[] = [];
  private multiResponseIndex = 0;

  public callCount = 0;
  public requests: any[] = [];
  public lastRequest: any = null;

  /**
   * Mock a successful API response
   */
  mockResponse(endpoint: string, response: any): this {
    this.responses.set(endpoint, response);
    return this;
  }

  /**
   * Mock an API error
   */
  mockError(endpoint: string, error: any): this {
    this.errors.set(endpoint, error);
    return this;
  }

  /**
   * Mock multiple sequential responses (for batch operations)
   */
  mockMultipleResponses(responses: Array<{ endpoint: string; response: any }>): this {
    this.multiResponses = responses;
    this.multiResponseIndex = 0;
    return this;
  }

  /**
   * Simulate API request
   */
  async request(options: any): Promise<any> {
    this.callCount++;
    this.lastRequest = {
      method: options.method,
      endpoint: options.uri || options.url,
      body: options.body,
      qs: options.qs,
      headers: options.headers,
    };
    this.requests.push(this.lastRequest);

    const endpoint = this.extractEndpoint(options.uri || options.url);

    // Check for error first
    if (this.errors.has(endpoint)) {
      const error = this.errors.get(endpoint);
      if (error instanceof Error) {
        throw error;
      }
      throw error;
    }

    // Check for multi-responses
    if (this.multiResponses.length > 0) {
      const response = this.multiResponses[this.multiResponseIndex];
      this.multiResponseIndex++;
      return response.response;
    }

    // Return mocked response
    if (this.responses.has(endpoint)) {
      return this.responses.get(endpoint);
    }

    // Default response
    return { status: true, data: {} };
  }

  /**
   * Extract endpoint from full URL
   */
  private extractEndpoint(url: string): string {
    return url.replace('https://api.icount.co.il', '');
  }

  /**
   * Reset all mocks
   */
  reset(): void {
    this.responses.clear();
    this.errors.clear();
    this.multiResponses = [];
    this.multiResponseIndex = 0;
    this.callCount = 0;
    this.requests = [];
    this.lastRequest = null;
  }

  /**
   * Get request by index
   */
  getRequest(index: number): any {
    return this.requests[index];
  }

  /**
   * Verify endpoint was called
   */
  wasEndpointCalled(endpoint: string): boolean {
    return this.requests.some((req) => req.endpoint.includes(endpoint));
  }

  /**
   * Get call count for specific endpoint
   */
  getCallCountForEndpoint(endpoint: string): number {
    return this.requests.filter((req) => req.endpoint.includes(endpoint)).length;
  }
}
