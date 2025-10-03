# Testing Documentation - n8n-nodes-icount

## 📊 Overview

This document describes the testing infrastructure and strategy for the n8n-nodes-icount package.

## 🎯 Current Status

### Test Coverage Summary

| Component | Tests | Coverage | Status |
|-----------|-------|----------|--------|
| **Utils** | 36 | 100% | ✅ Complete |
| **Load Options** | 107 | 100% | ✅ Complete (5/5) |
| **Integration Tests** | 149 | ~95% | ✅ Complete |
| **E2E Workflow Tests** | 17 | ~90% | ✅ Complete |
| **Overall** | **309** | ~90% | ✅ All Phases Complete |

### Test Results

```
Test Suites: 16 passed, 16 total
Tests:       309 passed, 309 total
Time:        ~5s
```

## 🏗️ Test Structure

```
tests/
├── helpers/                    # Test utilities
│   ├── mockICountApi.ts       # Mock API for testing
│   ├── mockN8nContext.ts      # Mock n8n execution context
│   └── testFixtures.ts        # Test data fixtures
│
├── unit/                       # Unit tests
│   ├── utils/
│   │   ├── idempotency.test.ts    # ✅ 14 tests - 100% coverage
│   │   └── apiRequest.test.ts     # ✅ 22 tests - 100% coverage
│   └── loadOptions/
│       ├── banks.test.ts          # ✅ 13 tests - 100% coverage
│       ├── documentTypes.test.ts  # ✅ 15 tests - 100% coverage
│       ├── users.test.ts          # ✅ 25 tests - 100% coverage
│       ├── clientTypes.test.ts    # ✅ 26 tests - 100% coverage
│       └── contactTypes.test.ts   # ✅ 28 tests - 100% coverage
│
├── integration/                # Integration tests
│   ├── document/
│   │   ├── create.test.ts      # ✅ 16 tests - Document creation
│   │   ├── search.test.ts      # ✅ 18 tests - Document search
│   │   └── cancel.test.ts      # ✅ 20 tests - Document cancellation
│   └── customer/
│       ├── create.test.ts      # ✅ 29 tests - Customer creation
│       ├── update.test.ts      # ✅ 30 tests - Customer updates
│       ├── delete.test.ts      # ✅ 18 tests - Customer deletion
│       └── upsert.test.ts      # ✅ 18 tests - Customer upsert
│
└── e2e/                        # E2E workflow tests
    ├── helpers/
    │   └── workflowRunner.ts       # ✅ Workflow test runner
    └── workflows/
        ├── customerManagement.test.ts  # ✅ 8 tests - Customer workflow
        └── documentLifecycle.test.ts   # ✅ 9 tests - Document workflow
```

## 🚀 Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### With Coverage
```bash
npm run test:coverage
```

### Specific Test Suites
```bash
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only (when available)
npm run test:e2e          # E2E tests only (when available)
```

### Specific Test Files
```bash
npm test -- idempotency.test.ts
npm test -- banks.test.ts
```

## 📝 Test Categories

### 1. Unit Tests - Utils ✅

**File: `tests/unit/utils/idempotency.test.ts`**
- Tests idempotency key generation
- Tests body augmentation with idempotency keys
- 14 tests, 100% coverage

**File: `tests/unit/utils/apiRequest.test.ts`**
- Tests API request wrapper
- Tests error handling (401, 403, 429, 500)
- Tests authentication and headers
- 22 tests, 100% coverage

### 2. Unit Tests - Load Options ✅ Complete!

**File: `tests/unit/loadOptions/banks.test.ts`**
- Tests bank list retrieval
- Tests data transformation
- Tests error handling
- 13 tests, 100% coverage

**File: `tests/unit/loadOptions/documentTypes.test.ts`**
- Tests document types retrieval
- Tests metadata filtering
- Tests Hebrew character support
- 15 tests, 100% coverage

**File: `tests/unit/loadOptions/users.test.ts`**
- Tests user list retrieval (object & array formats)
- Tests field priority (user_name > name > email)
- Tests value extraction and conversion
- 25 tests, 100% coverage

**File: `tests/unit/loadOptions/clientTypes.test.ts`**
- Tests client types from multiple data sources
- Tests type name and ID extraction
- Tests Hebrew text handling
- 26 tests, 100% coverage

**File: `tests/unit/loadOptions/contactTypes.test.ts`**
- Tests contact types retrieval
- Tests object and array formats
- Tests mixed English/Hebrew text
- 28 tests, 100% coverage

### 3. Integration Tests ⏳ (Planned)

Will cover end-to-end operation testing:
- Document operations (create, convert, cancel, etc.)
- Customer operations (create, update, upsert, etc.)

### 4. E2E Tests ⏳ (Planned)

Will cover complete workflow scenarios:
- Invoice creation workflow
- Customer management workflow
- Document lifecycle

## 🛠️ Test Helpers

### MockICountApi

Simulates iCount API responses for testing.

```typescript
import { MockICountApi } from '../helpers/mockICountApi';

const mockApi = new MockICountApi();

// Mock successful response
mockApi.mockResponse('/api/v3.php/client/123', {
  status: true,
  data: { id: 123, name: 'Test' }
});

// Mock error
mockApi.mockError('/api/v3.php/client/999', new Error('Not found'));

// Verify calls
expect(mockApi.wasEndpointCalled('/api/v3.php/client/123')).toBe(true);
```

### MockN8nContext

Simulates n8n execution context.

```typescript
import { createMockExecuteFunctions } from '../helpers/mockN8nContext';

const mockContext = createMockExecuteFunctions();

// Set parameters
mockContext.setParameters({
  resource: 'document',
  operation: 'create',
  doc_type: '320',
});

// Get parameter
const docType = mockContext.getNodeParameter('doc_type', 0);
```

### Test Fixtures

Pre-defined test data for consistent testing.

```typescript
import {
  mockCustomerFixture,
  mockDocumentFixture,
  mockBanksFixture
} from '../helpers/testFixtures';
```

## ✅ Writing Tests

### Test Structure

Follow this pattern for all tests:

```typescript
describe('Component - Function', () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
  });

  describe('Success Cases', () => {
    test('should handle basic case', async () => {
      // Arrange
      mockContext.setParameters({ ... });

      // Act
      const result = await functionUnderTest(mockContext);

      // Assert
      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors', async () => {
      // Test error scenarios
    });
  });

  describe('Edge Cases', () => {
    test('should handle Hebrew characters', async () => {
      // Test edge cases
    });
  });
});
```

### Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Descriptive Names**: Use clear test descriptions
3. **Independent Tests**: Each test should run independently
4. **Mock External Calls**: Never hit real APIs
5. **Test Edge Cases**: Include Hebrew text, empty data, errors
6. **Clean Up**: Reset mocks in `beforeEach`

### Example Test

```typescript
test('should create invoice with minimal data', async () => {
  // Arrange
  mockContext.setParameters({
    resource: 'document',
    operation: 'create',
    doc_type: '320',
    client_name: 'Test Company',
    items: [{ description: 'Service', quantity: 1, unit_price: 100 }],
  });

  mockApi.mockResponse('/api/v3.php/doc/create', {
    status: true,
    data: { doc_id: 'uuid-123', doc_number: 2001 },
  });

  // Act
  const result = await executeCreate.call(mockContext, 0);

  // Assert
  expect(result.json.doc_id).toBe('uuid-123');
  expect(result.json.doc_number).toBe(2001);
});
```

## 🎯 Coverage Goals

| Component | Target | Current | Status |
|-----------|--------|---------|--------|
| Utils | 100% | 100% | ✅ |
| Load Options | 100% | 100% | ✅ |
| Integration Tests | 85% | ~95% | ✅ |
| Overall | 85% | ~85% | ✅ |

## 📦 Dependencies

```json
{
  "jest": "^30.2.0",
  "ts-jest": "^29.4.4",
  "@types/jest": "^30.0.0",
  "@jest/globals": "^30.2.0"
}
```

## ⚙️ Configuration

**File: `jest.config.js`**

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'nodes/**/*.ts',
    'credentials/**/*.ts',
    '!nodes/**/*.node.ts',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
```

## 🐛 Debugging Tests

### Run Single Test
```bash
npm test -- -t "should create invoice"
```

### Debug in VS Code
Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Verbose Output
```bash
npm test -- --verbose
```

## 🔄 Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Pre-publish

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing n8n Nodes](https://docs.n8n.io/integrations/creating-nodes/test/)
- [iCount API Documentation](https://api.icount.co.il/documentation/)

## 🎓 Next Steps

1. ✅ Phase 1: Utils Tests (100% coverage) - DONE
2. ✅ Phase 2-3: Load Options Tests (100% coverage) - DONE
3. ✅ Phase 4: Document Integration Tests - DONE
4. ✅ Phase 5: Customer Integration Tests - DONE
5. ✅ Phase 6: E2E Workflow Tests - DONE
6. ⏳ Future: Set up GitHub Actions CI/CD
7. ⏳ Future: Add coverage badges to README

## 📞 Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass: `npm test`
3. Check coverage: `npm run test:coverage`
4. Aim for 85%+ coverage on new code
5. Update this documentation if needed

---

**Last Updated**: 2025-01-15
**Version**: 1.0.58
**Test Framework**: Jest 30.2.0
**Total Tests**: 309 ✅

## 📋 Complete Test Breakdown

### Phase 1-2: Utils & Load Options (143 tests)
- ✅ Idempotency Utils: 14 tests
- ✅ API Request Utils: 22 tests
- ✅ Banks Load Options: 13 tests
- ✅ Document Types Load Options: 15 tests
- ✅ Users Load Options: 25 tests
- ✅ Client Types Load Options: 26 tests
- ✅ Contact Types Load Options: 28 tests

### Phase 4-5: Integration Tests (149 tests)
- ✅ Document Create: 16 tests
- ✅ Document Search: 18 tests
- ✅ Document Cancel: 20 tests
- ✅ Customer Create: 29 tests
- ✅ Customer Update: 30 tests
- ✅ Customer Delete: 18 tests
- ✅ Customer Upsert: 18 tests

### Phase 6: E2E Workflow Tests (17 tests)
- ✅ Customer Management Workflow: 8 tests
- ✅ Document Lifecycle Workflow: 9 tests
