// Global test setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  // Cleanup
});

// Global mocks
global.console = {
  ...console,
  // Suppress console.log in tests
  log: jest.fn(),
  // Keep errors and warnings
  error: console.error,
  warn: console.warn,
};
