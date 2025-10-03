# 📋 אפיון מלא ומקיף לבדיקות Testing - n8n-nodes-icount

## 📊 סקירה כללית

מסמך זה מכיל אפיון מלא ומפורט לכל בדיקות ה-Testing הנדרשות עבור הפרויקט n8n-nodes-icount, כולל:
- **2 Resources**: Document, Customer
- **22 Operations** בסך הכל
- **5 Load Options Methods**
- **2 Utility Functions**
- **1 Credentials System**

---

## 🏗️ ארכיטקטורת הבדיקות

```
tests/
├── unit/                           # Unit Tests - בדיקות רכיבים בודדים
│   ├── utils/
│   │   ├── idempotency.test.ts    # בדיקת יצירת מפתחות אידמפוטנטיות
│   │   └── apiRequest.test.ts     # בדיקת פונקציות API Request
│   ├── validation/
│   │   ├── email.test.ts          # בדיקת ולידציה של אימייל
│   │   ├── phone.test.ts          # בדיקת ולידציה של טלפון
│   │   ├── vatId.test.ts          # בדיקת ולידציה של ח.פ / עוסק מורשה
│   │   └── documentType.test.ts   # בדיקת ולידציה של סוגי מסמכים
│   └── loadOptions/
│       ├── banks.test.ts          # בדיקת טעינת רשימת בנקים
│       ├── users.test.ts          # בדיקת טעינת רשימת משתמשים
│       ├── clientTypes.test.ts    # בדיקת טעינת סוגי לקוחות
│       ├── contactTypes.test.ts   # בדיקת טעינת סוגי אנשי קשר
│       └── documentTypes.test.ts  # בדיקת טעינת סוגי מסמכים
│
├── integration/                    # Integration Tests - בדיקות אינטגרציה
│   ├── document/
│   │   ├── create.test.ts         # יצירת מסמך
│   │   ├── convert.test.ts        # המרת מסמך
│   │   ├── updateIncomeType.test.ts  # עדכון סוג הכנסה
│   │   ├── cancel.test.ts         # ביטול מסמך
│   │   ├── close.test.ts          # סגירת מסמך
│   │   ├── get.test.ts            # שליפת מסמך
│   │   ├── search.test.ts         # חיפוש מסמכים
│   │   ├── list.test.ts           # רשימת מסמכים
│   │   └── getDocUrl.test.ts      # קבלת URL של מסמך
│   ├── customer/
│   │   ├── create.test.ts         # יצירת לקוח
│   │   ├── update.test.ts         # עדכון לקוח
│   │   ├── upsert.test.ts         # Upsert לקוח
│   │   ├── get.test.ts            # שליפת לקוח
│   │   ├── list.test.ts           # רשימת לקוחות
│   │   ├── delete.test.ts         # מחיקת לקוח
│   │   ├── getOpenDocs.test.ts    # מסמכים פתוחים
│   │   ├── getContacts.test.ts    # שליפת אנשי קשר
│   │   ├── addContact.test.ts     # הוספת איש קשר
│   │   ├── updateContact.test.ts  # עדכון איש קשר
│   │   └── deleteContact.test.ts  # מחיקת איש קשר
│   └── credentials/
│       └── iCountApi.test.ts      # בדיקת מערכת ה-Credentials
│
├── e2e/                            # E2E Tests - בדיקות מקצה לקצה
│   ├── workflows/
│   │   ├── invoice-creation.test.ts       # תרחיש מלא: יצירת חשבונית
│   │   ├── customer-management.test.ts    # תרחיש מלא: ניהול לקוחות
│   │   └── document-lifecycle.test.ts     # מחזור חיים של מסמך
│   └── error-handling/
│       ├── network-errors.test.ts         # טיפול בשגיאות רשת
│       ├── api-errors.test.ts             # טיפול בשגיאות API
│       └── validation-errors.test.ts      # טיפול בשגיאות ולידציה
│
├── helpers/                        # עזרים לבדיקות
│   ├── mockICountApi.ts           # Mock של iCount API
│   ├── mockN8nContext.ts          # Mock של n8n context
│   ├── testFixtures.ts            # נתוני בדיקה קבועים
│   └── testUtils.ts               # פונקציות עזר
│
└── setup/                          # הגדרות בדיקות
    ├── jest.config.js             # הגדרת Jest
    ├── jest.setup.ts              # Setup גלובלי
    └── globalTeardown.ts          # Teardown גלובלי
```

---

## 📦 1. Unit Tests - בדיקות יחידה

### 1.1 Utility Functions

#### `tests/unit/utils/idempotency.test.ts`

**מטרה**: בדיקת פונקציות יצירת מפתחות אידמפוטנטיות

```typescript
describe('Idempotency Utils', () => {
  describe('generateIdempotencyKey', () => {
    test('should generate unique key with all context parts', () => {
      const mockContext = createMockContext({
        workflowId: 'wf-123',
        executionId: 'exec-456',
        nodeId: 'node-789',
        itemIndex: 0,
      });

      const key = generateIdempotencyKey(mockContext, 'create');

      expect(key).toBe('wf-123-exec-456-node-789-create-0');
    });

    test('should generate different keys for different items', () => {
      const mockContext1 = createMockContext({ itemIndex: 0 });
      const mockContext2 = createMockContext({ itemIndex: 1 });

      const key1 = generateIdempotencyKey(mockContext1, 'create');
      const key2 = generateIdempotencyKey(mockContext2, 'create');

      expect(key1).not.toBe(key2);
    });

    test('should generate different keys for different operations', () => {
      const mockContext = createMockContext();

      const key1 = generateIdempotencyKey(mockContext, 'create');
      const key2 = generateIdempotencyKey(mockContext, 'update');

      expect(key1).not.toBe(key2);
    });

    test('should handle missing itemIndex gracefully', () => {
      const mockContext = createMockContext({ itemIndex: undefined });

      const key = generateIdempotencyKey(mockContext, 'create');

      expect(key).toContain('-0'); // Should default to 0
    });

    test('should generate consistent keys for same context', () => {
      const mockContext = createMockContext();

      const key1 = generateIdempotencyKey(mockContext, 'create');
      const key2 = generateIdempotencyKey(mockContext, 'create');

      expect(key1).toBe(key2);
    });
  });

  describe('addIdempotencyToBody', () => {
    test('should add idempotency key to empty body', () => {
      const mockContext = createMockContext();
      const body = {};

      const result = addIdempotencyToBody(mockContext, body, 'create');

      expect(result).toHaveProperty('idempotency_key');
      expect(typeof result.idempotency_key).toBe('string');
    });

    test('should preserve existing body fields', () => {
      const mockContext = createMockContext();
      const body = { name: 'Test', email: 'test@example.com' };

      const result = addIdempotencyToBody(mockContext, body, 'create');

      expect(result.name).toBe('Test');
      expect(result.email).toBe('test@example.com');
      expect(result.idempotency_key).toBeDefined();
    });

    test('should not mutate original body', () => {
      const mockContext = createMockContext();
      const body = { name: 'Test' };

      addIdempotencyToBody(mockContext, body, 'create');

      expect(body).not.toHaveProperty('idempotency_key');
    });
  });
});
```

**Coverage Target**: 100%

---

#### `tests/unit/utils/apiRequest.test.ts`

**מטרה**: בדיקת פונקציית API Request וטיפול בשגיאות

```typescript
describe('API Request Utils', () => {
  let mockExecuteFunctions: MockExecuteFunctions;
  let mockHelpers: any;

  beforeEach(() => {
    mockExecuteFunctions = createMockExecuteFunctions();
    mockHelpers = mockExecuteFunctions.helpers;
  });

  describe('iCountApiRequest - Success Cases', () => {
    test('should make successful GET request', async () => {
      mockHelpers.request.mockResolvedValue({
        status: true,
        data: { id: 123 },
      });

      const result = await iCountApiRequest.call(
        mockExecuteFunctions,
        'GET',
        '/api/v3.php/client/123'
      );

      expect(result.status).toBe(true);
      expect(result.data).toEqual({ id: 123 });
      expect(mockHelpers.request).toHaveBeenCalledWith({
        method: 'GET',
        uri: 'https://api.icount.co.il/api/v3.php/client/123',
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-token',
          'Content-Type': 'application/json',
        }),
        json: true,
      });
    });

    test('should make successful POST request with body', async () => {
      mockHelpers.request.mockResolvedValue({ status: true });

      const body = { name: 'Test Company' };
      await iCountApiRequest.call(
        mockExecuteFunctions,
        'POST',
        '/api/v3.php/client/create',
        body
      );

      expect(mockHelpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          body: { name: 'Test Company' },
        })
      );
    });

    test('should include query string parameters', async () => {
      mockHelpers.request.mockResolvedValue({ status: true });

      await iCountApiRequest.call(
        mockExecuteFunctions,
        'GET',
        '/api/v3.php/client/list',
        {},
        { page: 1, limit: 50 }
      );

      expect(mockHelpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: { page: 1, limit: 50 },
        })
      );
    });

    test('should not include body for GET requests', async () => {
      mockHelpers.request.mockResolvedValue({ status: true });

      await iCountApiRequest.call(
        mockExecuteFunctions,
        'GET',
        '/api/v3.php/test',
        {}
      );

      expect(mockHelpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: undefined,
        })
      );
    });
  });

  describe('iCountApiRequest - Error Handling', () => {
    test('should handle API error response (status: false)', async () => {
      mockHelpers.request.mockResolvedValue({
        status: false,
        message: 'Client not found',
      });

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/client/999')
      ).rejects.toThrow('Client not found');
    });

    test('should handle 401 authentication error', async () => {
      mockHelpers.request.mockRejectedValue({
        statusCode: 401,
      });

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test')
      ).rejects.toThrow('Authentication failed');
    });

    test('should handle 403 forbidden error', async () => {
      mockHelpers.request.mockRejectedValue({
        statusCode: 403,
      });

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test')
      ).rejects.toThrow('Authentication failed');
    });

    test('should handle 429 rate limit error', async () => {
      mockHelpers.request.mockRejectedValue({
        statusCode: 429,
        response: {
          headers: { 'retry-after': '120' },
        },
      });

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test')
      ).rejects.toThrow('Rate limit exceeded. Retry after 120 seconds');
    });

    test('should use default retry-after if header missing', async () => {
      mockHelpers.request.mockRejectedValue({
        statusCode: 429,
        response: { headers: {} },
      });

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test')
      ).rejects.toThrow('Retry after 60 seconds');
    });

    test('should rethrow unknown errors', async () => {
      mockHelpers.request.mockRejectedValue(new Error('Network error'));

      await expect(
        iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test')
      ).rejects.toThrow('Network error');
    });
  });

  describe('iCountApiRequest - Credentials', () => {
    test('should retrieve credentials from context', async () => {
      mockHelpers.request.mockResolvedValue({ status: true });

      await iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test');

      expect(mockExecuteFunctions.getCredentials).toHaveBeenCalledWith('iCountApi');
    });

    test('should include credentials token in Authorization header', async () => {
      mockHelpers.request.mockResolvedValue({ status: true });
      mockExecuteFunctions.getCredentials.mockResolvedValue({
        token: 'custom-token-123',
      });

      await iCountApiRequest.call(mockExecuteFunctions, 'GET', '/api/v3.php/test');

      expect(mockHelpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer custom-token-123',
          }),
        })
      );
    });
  });
});
```

**Coverage Target**: 100%

---

### 1.2 Load Options Methods

#### `tests/unit/loadOptions/banks.test.ts`

```typescript
describe('LoadOptions - Banks', () => {
  let mockLoadOptionsFunctions: MockLoadOptionsFunctions;

  beforeEach(() => {
    mockLoadOptionsFunctions = createMockLoadOptionsFunctions();
  });

  test('should load banks as object and convert to options', async () => {
    mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
      data: {
        '11': 'בנק דיסקונט',
        '12': 'בנק הפועלים',
        '10': 'בנק לאומי',
      },
    });

    const icount = new ICount();
    const options = await icount.methods.loadOptions.getBanks.call(
      mockLoadOptionsFunctions
    );

    expect(options).toHaveLength(3);
    expect(options).toContainEqual({
      name: '11 - בנק דיסקונט',
      value: '11',
    });
    expect(options).toContainEqual({
      name: '12 - בנק הפועלים',
      value: '12',
    });
  });

  test('should handle response with banks key', async () => {
    mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
      banks: {
        '11': 'בנק דיסקונט',
      },
    });

    const icount = new ICount();
    const options = await icount.methods.loadOptions.getBanks.call(
      mockLoadOptionsFunctions
    );

    expect(options).toHaveLength(1);
  });

  test('should return empty array on API error', async () => {
    mockLoadOptionsFunctions.helpers.request.mockRejectedValue(
      new Error('API Error')
    );

    const icount = new ICount();
    const options = await icount.methods.loadOptions.getBanks.call(
      mockLoadOptionsFunctions
    );

    expect(options).toEqual([]);
  });

  test('should filter out non-string values', async () => {
    mockLoadOptionsFunctions.helpers.request.mockResolvedValue({
      data: {
        '11': 'בנק דיסקונט',
        'metadata': { someField: 'value' },
        '12': 'בנק הפועלים',
        'status': 1,
      },
    });

    const icount = new ICount();
    const options = await icount.methods.loadOptions.getBanks.call(
      mockLoadOptionsFunctions
    );

    expect(options).toHaveLength(2);
    expect(options.every(opt => typeof opt.name === 'string')).toBe(true);
  });

  test('should handle empty response', async () => {
    mockLoadOptionsFunctions.helpers.request.mockResolvedValue({});

    const icount = new ICount();
    const options = await icount.methods.loadOptions.getBanks.call(
      mockLoadOptionsFunctions
    );

    expect(options).toEqual([]);
  });

  test('should use correct API endpoint and headers', async () => {
    mockLoadOptionsFunctions.helpers.request.mockResolvedValue({ data: {} });
    mockLoadOptionsFunctions.getCredentials.mockResolvedValue({
      token: 'test-token',
    });

    const icount = new ICount();
    await icount.methods.loadOptions.getBanks.call(mockLoadOptionsFunctions);

    expect(mockLoadOptionsFunctions.helpers.request).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.icount.co.il/api/v3.php/bank/get_list',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });
});
```

**Coverage Target**: 100%

_(דוגמאות דומות עבור: `users.test.ts`, `clientTypes.test.ts`, `contactTypes.test.ts`, `documentTypes.test.ts`)_

---

## 🔗 2. Integration Tests - בדיקות אינטגרציה

### 2.1 Document Operations

#### `tests/integration/document/create.test.ts`

**מטרה**: בדיקת יצירת מסמך חדש עם כל התרחישים האפשריים

```typescript
describe('Document - Create Operation', () => {
  let mockExecuteFunctions: MockExecuteFunctions;
  let mockApi: MockICountApi;

  beforeEach(() => {
    mockExecuteFunctions = createMockExecuteFunctions();
    mockApi = new MockICountApi();
    mockExecuteFunctions.helpers.request = mockApi.request.bind(mockApi);
  });

  afterEach(() => {
    mockApi.reset();
  });

  describe('Success - Minimal Data', () => {
    test('should create invoice with minimal required fields', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320', // חשבונית מס
        use_existing_client: false,
        client_name: 'Test Company Ltd',
        items: [
          {
            description: 'Consulting Services',
            quantity: 10,
            unit_price: 500,
          },
        ],
      });

      mockApi.mockResponse('/api/v3.php/doc/create', {
        status: true,
        data: {
          doc_id: 'uuid-12345',
          doc_number: 2001,
          doc_type: 320,
          client_name: 'Test Company Ltd',
          total: 5000,
          pdf_link: 'https://icount.co.il/pdf/12345',
        },
      });

      const result = await executeCreate.call(mockExecuteFunctions, 0);

      expect(result).toMatchObject({
        json: {
          doc_id: 'uuid-12345',
          doc_number: 2001,
          pdf_link: expect.stringContaining('pdf'),
        },
      });
    });
  });

  describe('Success - Full Data', () => {
    test('should create document with all optional fields', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        issue_date: '2025-01-15T00:00:00.000Z',
        due_date: '2025-02-15T00:00:00.000Z',
        currency_code: 'USD',
        lang: 'en',
        use_existing_client: false,
        client_name: 'Test Company',
        client_email: 'test@example.com',
        client_phone: '0501234567',
        client_address: '123 Main St',
        client_city: 'Tel Aviv',
        client_id_number: '123456789',
        items: [
          {
            description: 'Product A',
            quantity: 5,
            unit_price: 100,
            vat: 18,
            discount: 10,
            item_code: 'PROD-A',
          },
          {
            description: 'Product B',
            quantity: 3,
            unit_price: 200,
            vat: 18,
          },
        ],
        remarks: 'Special delivery instructions',
        send_email: true,
      });

      mockApi.mockResponse('/api/v3.php/doc/create', {
        status: true,
        data: mockDocumentFixture,
      });

      const result = await executeCreate.call(mockExecuteFunctions, 0);

      expect(result.json).toBeDefined();
      expect(mockApi.lastRequest.body).toMatchObject({
        doc_type: '320',
        currency: 'USD',
        lang: 'en',
      });
    });
  });

  describe('Success - Existing Client', () => {
    test('should create document using existing client ID', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: true,
        client_id: 456,
        items: [{ description: 'Service', quantity: 1, unit_price: 1000 }],
      });

      mockApi.mockResponse('/api/v3.php/doc/create', {
        status: true,
        data: mockDocumentFixture,
      });

      await executeCreate.call(mockExecuteFunctions, 0);

      expect(mockApi.lastRequest.body).toMatchObject({
        client_id: 456,
      });
      expect(mockApi.lastRequest.body).not.toHaveProperty('client_name');
    });
  });

  describe('Validation Errors', () => {
    test('should throw error when doc_type is missing', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '',
        items: [],
      });

      await expect(
        executeCreate.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('סוג מסמך הוא שדה חובה');
    });

    test('should throw error when items array is empty', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items: [],
      });

      await expect(
        executeCreate.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('נדרש לפחות פריט אחד במסמך');
    });

    test('should throw error when client info missing', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: false,
        client_name: '',
        items: [{ description: 'Test', quantity: 1, unit_price: 100 }],
      });

      await expect(
        executeCreate.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('יש לספק שם לקוח או מזהה לקוח קיים');
    });

    test('should validate email format', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        client_email: 'invalid-email',
        items: [{ description: 'Test', quantity: 1, unit_price: 100 }],
      });

      await expect(
        executeCreate.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('כתובת אימייל לא תקינה');
    });

    test('should validate item quantity is positive', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items: [{ description: 'Test', quantity: -1, unit_price: 100 }],
      });

      await expect(
        executeCreate.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('כמות חייבת להיות מספר חיובי');
    });

    test('should validate item price is positive', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items: [{ description: 'Test', quantity: 1, unit_price: -100 }],
      });

      await expect(
        executeCreate.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('מחיר יחידה חייב להיות מספר חיובי');
    });
  });

  describe('API Errors', () => {
    test('should handle API error response', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items: [{ description: 'Test', quantity: 1, unit_price: 100 }],
      });

      mockApi.mockResponse('/api/v3.php/doc/create', {
        status: false,
        message: 'סוג מסמך לא קיים',
      });

      await expect(
        executeCreate.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('סוג מסמך לא קיים');
    });

    test('should handle network error', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items: [{ description: 'Test', quantity: 1, unit_price: 100 }],
      });

      mockApi.mockError('/api/v3.php/doc/create', new Error('Network timeout'));

      await expect(
        executeCreate.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('Network timeout');
    });

    test('should handle authentication error', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items: [{ description: 'Test', quantity: 1, unit_price: 100 }],
      });

      mockApi.mockError('/api/v3.php/doc/create', {
        statusCode: 401,
      });

      await expect(
        executeCreate.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('Authentication failed');
    });
  });

  describe('Idempotency', () => {
    test('should include idempotency key in request', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items: [{ description: 'Test', quantity: 1, unit_price: 100 }],
      });

      mockApi.mockResponse('/api/v3.php/doc/create', {
        status: true,
        data: mockDocumentFixture,
      });

      await executeCreate.call(mockExecuteFunctions, 0);

      expect(mockApi.lastRequest.body).toHaveProperty('idempotency_key');
      expect(mockApi.lastRequest.body.idempotency_key).toContain('create');
    });

    test('should generate different keys for different items', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items: [{ description: 'Test', quantity: 1, unit_price: 100 }],
      });

      mockApi.mockResponse('/api/v3.php/doc/create', {
        status: true,
        data: mockDocumentFixture,
      });

      await executeCreate.call(mockExecuteFunctions, 0);
      const key1 = mockApi.lastRequest.body.idempotency_key;

      await executeCreate.call(mockExecuteFunctions, 1); // Different item index
      const key2 = mockApi.lastRequest.body.idempotency_key;

      expect(key1).not.toBe(key2);
    });
  });

  describe('Edge Cases', () => {
    test('should handle Hebrew characters in description', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: false,
        client_name: 'חברת בדיקה בע"מ',
        items: [{ description: 'שירותי ייעוץ בעברית', quantity: 1, unit_price: 1000 }],
      });

      mockApi.mockResponse('/api/v3.php/doc/create', {
        status: true,
        data: mockDocumentFixture,
      });

      const result = await executeCreate.call(mockExecuteFunctions, 0);

      expect(result).toBeDefined();
      expect(mockApi.lastRequest.body.client_name).toBe('חברת בדיקה בע"מ');
    });

    test('should handle very large quantities', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items: [{ description: 'Test', quantity: 1000000, unit_price: 0.01 }],
      });

      mockApi.mockResponse('/api/v3.php/doc/create', {
        status: true,
        data: mockDocumentFixture,
      });

      const result = await executeCreate.call(mockExecuteFunctions, 0);

      expect(result).toBeDefined();
    });

    test('should handle decimal prices', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items: [{ description: 'Test', quantity: 1, unit_price: 99.99 }],
      });

      mockApi.mockResponse('/api/v3.php/doc/create', {
        status: true,
        data: mockDocumentFixture,
      });

      const result = await executeCreate.call(mockExecuteFunctions, 0);

      expect(result).toBeDefined();
    });

    test('should handle multiple items (50+)', async () => {
      const items = Array.from({ length: 50 }, (_, i) => ({
        description: `Item ${i + 1}`,
        quantity: 1,
        unit_price: 100,
      }));

      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: false,
        client_name: 'Test',
        items,
      });

      mockApi.mockResponse('/api/v3.php/doc/create', {
        status: true,
        data: mockDocumentFixture,
      });

      const result = await executeCreate.call(mockExecuteFunctions, 0);

      expect(result).toBeDefined();
      expect(mockApi.lastRequest.body.items).toHaveLength(50);
    });
  });

  describe('Different Document Types', () => {
    const documentTypes = [
      { code: '320', name: 'חשבונית מס' },
      { code: '305', name: 'חשבונית מס קבלה' },
      { code: '405', name: 'קבלה' },
      { code: '300', name: 'הצעת מחיר' },
    ];

    documentTypes.forEach(({ code, name }) => {
      test(`should create ${name} (${code})`, async () => {
        mockExecuteFunctions.setParameters({
          resource: 'document',
          operation: 'create',
          doc_type: code,
          use_existing_client: false,
          client_name: 'Test',
          items: [{ description: 'Test', quantity: 1, unit_price: 100 }],
        });

        mockApi.mockResponse('/api/v3.php/doc/create', {
          status: true,
          data: { ...mockDocumentFixture, doc_type: parseInt(code) },
        });

        const result = await executeCreate.call(mockExecuteFunctions, 0);

        expect(result.json.doc_type).toBe(parseInt(code));
      });
    });
  });
});
```

**Coverage Target**: 95%+

---

#### `tests/integration/document/convert.test.ts`

**מטרה**: בדיקת המרת מסמך מסוג אחד לאחר

```typescript
describe('Document - Convert Operation', () => {
  let mockExecuteFunctions: MockExecuteFunctions;
  let mockApi: MockICountApi;

  beforeEach(() => {
    mockExecuteFunctions = createMockExecuteFunctions();
    mockApi = new MockICountApi();
    mockExecuteFunctions.helpers.request = mockApi.request.bind(mockApi);
  });

  describe('Success Cases', () => {
    test('should convert quote (300) to invoice (320)', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'convert',
        source_doc_id: 'uuid-quote-123',
        target_doc_type: '320',
      });

      mockApi.mockResponse('/api/v3.php/doc/convert', {
        status: true,
        data: {
          doc_id: 'uuid-invoice-456',
          doc_number: 2001,
          doc_type: 320,
          source_doc_id: 'uuid-quote-123',
        },
      });

      const result = await executeConvert.call(mockExecuteFunctions, 0);

      expect(result.json.doc_id).toBe('uuid-invoice-456');
      expect(result.json.doc_type).toBe(320);
    });

    test('should convert invoice to receipt', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'convert',
        source_doc_id: 'uuid-invoice-123',
        target_doc_type: '305', // חשבונית מס קבלה
      });

      mockApi.mockResponse('/api/v3.php/doc/convert', {
        status: true,
        data: mockDocumentFixture,
      });

      const result = await executeConvert.call(mockExecuteFunctions, 0);

      expect(result).toBeDefined();
    });

    test('should preserve client information after conversion', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'convert',
        source_doc_id: 'uuid-123',
        target_doc_type: '320',
      });

      mockApi.mockResponse('/api/v3.php/doc/convert', {
        status: true,
        data: {
          ...mockDocumentFixture,
          client_id: 789,
          client_name: 'Original Client',
        },
      });

      const result = await executeConvert.call(mockExecuteFunctions, 0);

      expect(result.json.client_id).toBe(789);
      expect(result.json.client_name).toBe('Original Client');
    });
  });

  describe('Validation Errors', () => {
    test('should throw error when source_doc_id is missing', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'convert',
        source_doc_id: '',
        target_doc_type: '320',
      });

      await expect(
        executeConvert.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('מזהה מסמך מקור הוא שדה חובה');
    });

    test('should throw error when target_doc_type is missing', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'convert',
        source_doc_id: 'uuid-123',
        target_doc_type: '',
      });

      await expect(
        executeConvert.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('סוג מסמך יעד הוא שדה חובה');
    });

    test('should handle invalid document type conversion', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'convert',
        source_doc_id: 'uuid-123',
        target_doc_type: '999',
      });

      mockApi.mockResponse('/api/v3.php/doc/convert', {
        status: false,
        message: 'סוג מסמך לא חוקי להמרה',
      });

      await expect(
        executeConvert.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('סוג מסמך לא חוקי להמרה');
    });
  });

  describe('API Errors', () => {
    test('should handle document not found error', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'convert',
        source_doc_id: 'uuid-nonexistent',
        target_doc_type: '320',
      });

      mockApi.mockResponse('/api/v3.php/doc/convert', {
        status: false,
        message: 'Document not found',
      });

      await expect(
        executeConvert.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('Document not found');
    });

    test('should handle already converted document', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'document',
        operation: 'convert',
        source_doc_id: 'uuid-already-converted',
        target_doc_type: '320',
      });

      mockApi.mockResponse('/api/v3.php/doc/convert', {
        status: false,
        message: 'Document already converted',
      });

      await expect(
        executeConvert.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('Document already converted');
    });
  });
});
```

**Coverage Target**: 90%+

---

### 2.2 Customer Operations

#### `tests/integration/customer/upsert.test.ts`

**מטרה**: בדיקת פעולת Upsert - יצירה או עדכון לקוח

```typescript
describe('Customer - Upsert Operation', () => {
  let mockExecuteFunctions: MockExecuteFunctions;
  let mockApi: MockICountApi;

  beforeEach(() => {
    mockExecuteFunctions = createMockExecuteFunctions();
    mockApi = new MockICountApi();
    mockExecuteFunctions.helpers.request = mockApi.request.bind(mockApi);
  });

  describe('Create Path (Customer Not Found)', () => {
    test('should create new customer when not found by email', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'New Company Ltd',
        email: 'new@example.com',
        phone: '0501234567',
      });

      // Mock search returns empty
      mockApi.mockResponse('/api/v3.php/client/search', {
        status: true,
        data: [],
      });

      // Mock create returns new customer
      mockApi.mockResponse('/api/v3.php/client/create', {
        status: true,
        data: {
          client_id: 999,
          name: 'New Company Ltd',
          email: 'new@example.com',
          phone: '0501234567',
        },
      });

      const result = await executeUpsert.call(mockExecuteFunctions, 0);

      expect(result.json.client_id).toBe(999);
      expect(result.json.name).toBe('New Company Ltd');
      expect(mockApi.callCount).toBe(2); // search + create
    });

    test('should create customer when not found by id_number', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Test Company',
        id_number: '123456789',
      });

      mockApi.mockResponse('/api/v3.php/client/search', {
        status: true,
        data: [],
      });

      mockApi.mockResponse('/api/v3.php/client/create', {
        status: true,
        data: {
          client_id: 1000,
          name: 'Test Company',
          id_number: '123456789',
        },
      });

      const result = await executeUpsert.call(mockExecuteFunctions, 0);

      expect(result.json.client_id).toBe(1000);
      expect(mockApi.callCount).toBe(2);
    });

    test('should search by email first if provided', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Test',
        email: 'test@example.com',
        id_number: '123456789',
      });

      mockApi.mockResponse('/api/v3.php/client/search', {
        status: true,
        data: [],
      });

      mockApi.mockResponse('/api/v3.php/client/create', {
        status: true,
        data: mockCustomerFixture,
      });

      await executeUpsert.call(mockExecuteFunctions, 0);

      // First request should search by email
      expect(mockApi.requests[0].body).toMatchObject({
        email: 'test@example.com',
      });
    });
  });

  describe('Update Path (Customer Found)', () => {
    test('should update existing customer found by email', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Updated Company Name',
        email: 'existing@example.com',
        phone: '0509999999',
      });

      // Mock search returns existing customer
      mockApi.mockResponse('/api/v3.php/client/search', {
        status: true,
        data: [
          {
            client_id: 555,
            name: 'Old Company Name',
            email: 'existing@example.com',
            phone: '0501111111',
          },
        ],
      });

      // Mock update
      mockApi.mockResponse('/api/v3.php/client/update', {
        status: true,
        data: {
          client_id: 555,
          name: 'Updated Company Name',
          email: 'existing@example.com',
          phone: '0509999999',
        },
      });

      const result = await executeUpsert.call(mockExecuteFunctions, 0);

      expect(result.json.client_id).toBe(555);
      expect(result.json.name).toBe('Updated Company Name');
      expect(result.json.phone).toBe('0509999999');
      expect(mockApi.callCount).toBe(2); // search + update
    });

    test('should update customer found by id_number', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Company',
        id_number: '987654321',
        email: 'new-email@example.com',
      });

      mockApi.mockResponse('/api/v3.php/client/search', {
        status: true,
        data: [
          {
            client_id: 777,
            name: 'Company',
            id_number: '987654321',
            email: 'old-email@example.com',
          },
        ],
      });

      mockApi.mockResponse('/api/v3.php/client/update', {
        status: true,
        data: {
          client_id: 777,
          email: 'new-email@example.com',
        },
      });

      const result = await executeUpsert.call(mockExecuteFunctions, 0);

      expect(result.json.client_id).toBe(777);
      expect(result.json.email).toBe('new-email@example.com');
    });

    test('should use first result if multiple customers found', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Test',
        email: 'duplicate@example.com',
      });

      mockApi.mockResponse('/api/v3.php/client/search', {
        status: true,
        data: [
          { client_id: 100, email: 'duplicate@example.com' },
          { client_id: 101, email: 'duplicate@example.com' },
        ],
      });

      mockApi.mockResponse('/api/v3.php/client/update', {
        status: true,
        data: { client_id: 100 },
      });

      const result = await executeUpsert.call(mockExecuteFunctions, 0);

      expect(result.json.client_id).toBe(100);
    });

    test('should only update provided fields', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Company',
        email: 'test@example.com',
        phone: '0509999999',
        // address not provided
      });

      mockApi.mockResponse('/api/v3.php/client/search', {
        status: true,
        data: [
          {
            client_id: 888,
            name: 'Company',
            email: 'test@example.com',
            phone: '0501111111',
            address: 'Old Address',
          },
        ],
      });

      mockApi.mockResponse('/api/v3.php/client/update', {
        status: true,
        data: mockCustomerFixture,
      });

      await executeUpsert.call(mockExecuteFunctions, 0);

      // Update should not include address
      expect(mockApi.requests[1].body).toMatchObject({
        client_id: 888,
        phone: '0509999999',
      });
      expect(mockApi.requests[1].body).not.toHaveProperty('address');
    });
  });

  describe('Validation Errors', () => {
    test('should throw error when name is missing', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: '',
        email: 'test@example.com',
      });

      await expect(
        executeUpsert.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('שם לקוח הוא שדה חובה');
    });

    test('should throw error when neither email nor id_number provided', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Test Company',
      });

      await expect(
        executeUpsert.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('יש לספק אימייל או ח.פ לחיפוש לקוח');
    });

    test('should validate email format', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Test',
        email: 'invalid-email-format',
      });

      await expect(
        executeUpsert.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('כתובת אימייל לא תקינה');
    });

    test('should validate VAT ID format (9 digits)', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Test',
        email: 'test@example.com',
        vat_id: '12345', // Too short
      });

      await expect(
        executeUpsert.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('מספר עוסק מורשה חייב להיות 9 ספרות');
    });

    test('should validate Israeli phone format', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Test',
        email: 'test@example.com',
        phone: '123', // Invalid
      });

      await expect(
        executeUpsert.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('מספר טלפון לא תקין');
    });
  });

  describe('API Errors', () => {
    test('should handle search API error', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Test',
        email: 'test@example.com',
      });

      mockApi.mockError('/api/v3.php/client/search', {
        statusCode: 500,
        message: 'Server Error',
      });

      await expect(
        executeUpsert.call(mockExecuteFunctions, 0)
      ).rejects.toThrow();
    });

    test('should handle create API error', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Test',
        email: 'test@example.com',
      });

      mockApi.mockResponse('/api/v3.php/client/search', {
        status: true,
        data: [],
      });

      mockApi.mockResponse('/api/v3.php/client/create', {
        status: false,
        message: 'Customer already exists',
      });

      await expect(
        executeUpsert.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('Customer already exists');
    });

    test('should handle update API error', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Test',
        email: 'test@example.com',
      });

      mockApi.mockResponse('/api/v3.php/client/search', {
        status: true,
        data: [{ client_id: 123 }],
      });

      mockApi.mockResponse('/api/v3.php/client/update', {
        status: false,
        message: 'Update failed',
      });

      await expect(
        executeUpsert.call(mockExecuteFunctions, 0)
      ).rejects.toThrow('Update failed');
    });
  });

  describe('Edge Cases', () => {
    test('should handle customer with Hebrew name', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'חברת בדיקה בע"מ',
        email: 'test@example.com',
      });

      mockApi.mockResponse('/api/v3.php/client/search', { status: true, data: [] });
      mockApi.mockResponse('/api/v3.php/client/create', {
        status: true,
        data: { client_id: 999, name: 'חברת בדיקה בע"מ' },
      });

      const result = await executeUpsert.call(mockExecuteFunctions, 0);

      expect(result.json.name).toBe('חברת בדיקה בע"מ');
    });

    test('should handle empty search results gracefully', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Test',
        email: 'test@example.com',
      });

      mockApi.mockResponse('/api/v3.php/client/search', {
        status: true,
        data: null, // null instead of []
      });

      mockApi.mockResponse('/api/v3.php/client/create', {
        status: true,
        data: mockCustomerFixture,
      });

      const result = await executeUpsert.call(mockExecuteFunctions, 0);

      expect(result).toBeDefined();
    });

    test('should trim whitespace from inputs', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: '  Test Company  ',
        email: '  test@example.com  ',
      });

      mockApi.mockResponse('/api/v3.php/client/search', { status: true, data: [] });
      mockApi.mockResponse('/api/v3.php/client/create', {
        status: true,
        data: mockCustomerFixture,
      });

      await executeUpsert.call(mockExecuteFunctions, 0);

      expect(mockApi.requests[1].body.name).toBe('Test Company');
      expect(mockApi.requests[1].body.email).toBe('test@example.com');
    });
  });

  describe('Full Customer Data', () => {
    test('should handle all customer fields', async () => {
      mockExecuteFunctions.setParameters({
        resource: 'customer',
        operation: 'upsert',
        name: 'Full Data Company Ltd',
        email: 'full@example.com',
        id_number: '123456789',
        vat_id: '987654321',
        phone: '0501234567',
        mobile: '0529876543',
        fax: '035551234',
        address: '123 Main Street',
        city: 'Tel Aviv',
        zip: '6789012',
        country: 'Israel',
        remarks: 'VIP Customer',
      });

      mockApi.mockResponse('/api/v3.php/client/search', { status: true, data: [] });
      mockApi.mockResponse('/api/v3.php/client/create', {
        status: true,
        data: mockCustomerFixture,
      });

      await executeUpsert.call(mockExecuteFunctions, 0);

      expect(mockApi.requests[1].body).toMatchObject({
        name: 'Full Data Company Ltd',
        email: 'full@example.com',
        id_number: '123456789',
        vat_id: '987654321',
        phone: '0501234567',
        mobile: '0529876543',
        address: '123 Main Street',
        city: 'Tel Aviv',
      });
    });
  });
});
```

**Coverage Target**: 95%+

---

## 🎬 3. E2E Tests - בדיקות מקצה לקצה

### 3.1 Workflow Tests

#### `tests/e2e/workflows/invoice-creation.test.ts`

**מטרה**: בדיקת תרחיש שלם של יצירת חשבונית מהתחלה ועד הסוף

```typescript
describe('E2E - Complete Invoice Creation Workflow', () => {
  let testWorkflow: TestWorkflowRunner;
  let mockApi: MockICountApi;

  beforeEach(() => {
    testWorkflow = new TestWorkflowRunner();
    mockApi = new MockICountApi();
  });

  test('should create customer and invoice in single workflow', async () => {
    // Scenario: New customer orders products, we need to:
    // 1. Create/upsert customer
    // 2. Create invoice for that customer
    // 3. Get invoice PDF URL

    const workflowInput = {
      customer_name: 'E2E Test Company Ltd',
      customer_email: 'e2e@test.com',
      customer_phone: '0501234567',
      products: [
        { description: 'Product A', quantity: 5, price: 100 },
        { description: 'Product B', quantity: 2, price: 250 },
      ],
    };

    // Mock customer upsert (create)
    mockApi.mockResponse('/api/v3.php/client/search', {
      status: true,
      data: [],
    });

    mockApi.mockResponse('/api/v3.php/client/create', {
      status: true,
      data: {
        client_id: 1001,
        name: 'E2E Test Company Ltd',
        email: 'e2e@test.com',
      },
    });

    // Mock document create
    mockApi.mockResponse('/api/v3.php/doc/create', {
      status: true,
      data: {
        doc_id: 'uuid-e2e-invoice',
        doc_number: 3001,
        doc_type: 320,
        total: 1000,
        pdf_link: 'https://icount.co.il/pdf/e2e-invoice',
      },
    });

    // Mock get doc URL
    mockApi.mockResponse('/api/v3.php/doc/getdocurl', {
      status: true,
      data: {
        url: 'https://icount.co.il/pdf/e2e-invoice.pdf',
      },
    });

    const result = await testWorkflow
      .addNode('icount-customer-upsert', {
        resource: 'customer',
        operation: 'upsert',
        name: '{{ $json.customer_name }}',
        email: '{{ $json.customer_email }}',
        phone: '{{ $json.customer_phone }}',
      })
      .addNode('icount-invoice-create', {
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: true,
        client_id: '{{ $node["icount-customer-upsert"].json.client_id }}',
        items: '{{ $json.products }}',
      })
      .addNode('icount-get-pdf', {
        resource: 'document',
        operation: 'getDocUrl',
        doc_id: '{{ $node["icount-invoice-create"].json.doc_id }}',
      })
      .execute(workflowInput);

    // Verify workflow completed successfully
    expect(result.status).toBe('success');

    // Verify customer was created
    expect(result.nodes['icount-customer-upsert'].data.client_id).toBe(1001);

    // Verify invoice was created with correct customer
    expect(result.nodes['icount-invoice-create'].data.doc_number).toBe(3001);

    // Verify PDF URL was retrieved
    expect(result.nodes['icount-get-pdf'].data.url).toContain('.pdf');

    // Verify API was called in correct order
    expect(mockApi.requests).toHaveLength(4);
    expect(mockApi.requests[0].endpoint).toContain('client/search');
    expect(mockApi.requests[1].endpoint).toContain('client/create');
    expect(mockApi.requests[2].endpoint).toContain('doc/create');
    expect(mockApi.requests[3].endpoint).toContain('doc/getdocurl');
  });

  test('should update existing customer and create invoice', async () => {
    const workflowInput = {
      customer_email: 'existing@example.com',
      customer_phone: '0509999999', // Updated phone
      products: [{ description: 'Service', quantity: 1, price: 5000 }],
    };

    // Mock customer upsert (update existing)
    mockApi.mockResponse('/api/v3.php/client/search', {
      status: true,
      data: [
        {
          client_id: 555,
          email: 'existing@example.com',
          phone: '0501111111', // Old phone
        },
      ],
    });

    mockApi.mockResponse('/api/v3.php/client/update', {
      status: true,
      data: {
        client_id: 555,
        phone: '0509999999', // Updated
      },
    });

    mockApi.mockResponse('/api/v3.php/doc/create', {
      status: true,
      data: mockDocumentFixture,
    });

    const result = await testWorkflow
      .addNode('icount-customer-upsert', {
        resource: 'customer',
        operation: 'upsert',
        name: 'Existing Customer',
        email: '{{ $json.customer_email }}',
        phone: '{{ $json.customer_phone }}',
      })
      .addNode('icount-invoice-create', {
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: true,
        client_id: '{{ $node["icount-customer-upsert"].json.client_id }}',
        items: '{{ $json.products }}',
      })
      .execute(workflowInput);

    expect(result.status).toBe('success');
    expect(result.nodes['icount-customer-upsert'].data.client_id).toBe(555);
    expect(result.nodes['icount-customer-upsert'].data.phone).toBe('0509999999');

    // Verify update was called, not create
    expect(mockApi.requests[1].endpoint).toContain('client/update');
  });

  test('should handle workflow with multiple items in batch', async () => {
    // Process 3 orders in one workflow run
    const workflowInput = [
      {
        customer: 'Company A',
        email: 'a@example.com',
        total: 1000,
      },
      {
        customer: 'Company B',
        email: 'b@example.com',
        total: 2000,
      },
      {
        customer: 'Company C',
        email: 'c@example.com',
        total: 3000,
      },
    ];

    // Mock responses for each customer + invoice
    mockApi.mockMultipleResponses([
      // Customer A
      { endpoint: '/api/v3.php/client/search', response: { status: true, data: [] } },
      {
        endpoint: '/api/v3.php/client/create',
        response: { status: true, data: { client_id: 1 } },
      },
      {
        endpoint: '/api/v3.php/doc/create',
        response: { status: true, data: { doc_id: 'invoice-1' } },
      },
      // Customer B
      { endpoint: '/api/v3.php/client/search', response: { status: true, data: [] } },
      {
        endpoint: '/api/v3.php/client/create',
        response: { status: true, data: { client_id: 2 } },
      },
      {
        endpoint: '/api/v3.php/doc/create',
        response: { status: true, data: { doc_id: 'invoice-2' } },
      },
      // Customer C
      { endpoint: '/api/v3.php/client/search', response: { status: true, data: [] } },
      {
        endpoint: '/api/v3.php/client/create',
        response: { status: true, data: { client_id: 3 } },
      },
      {
        endpoint: '/api/v3.php/doc/create',
        response: { status: true, data: { doc_id: 'invoice-3' } },
      },
    ]);

    const result = await testWorkflow
      .addNode('icount-customer-upsert', {
        resource: 'customer',
        operation: 'upsert',
        name: '{{ $json.customer }}',
        email: '{{ $json.email }}',
      })
      .addNode('icount-invoice-create', {
        resource: 'document',
        operation: 'create',
        doc_type: '320',
        use_existing_client: true,
        client_id: '{{ $node["icount-customer-upsert"].json.client_id }}',
        items: [{ description: 'Service', quantity: 1, unit_price: '{{ $json.total }}' }],
      })
      .executeBatch(workflowInput);

    expect(result.status).toBe('success');
    expect(result.itemsProcessed).toBe(3);
    expect(result.itemsFailed).toBe(0);

    // Verify 3 invoices created
    expect(result.outputData).toHaveLength(3);
  });
});
```

**Coverage Target**: 80%+

---

#### `tests/e2e/workflows/document-lifecycle.test.ts`

**מטרה**: בדיקת מחזור חיים מלא של מסמך

```typescript
describe('E2E - Document Lifecycle', () => {
  let testWorkflow: TestWorkflowRunner;
  let mockApi: MockICountApi;

  beforeEach(() => {
    testWorkflow = new TestWorkflowRunner();
    mockApi = new MockICountApi();
  });

  test('should handle complete document lifecycle: Quote → Invoice → Receipt', async () => {
    // Scenario:
    // 1. Create quote (הצעת מחיר)
    // 2. Convert to invoice (חשבונית מס)
    // 3. Convert to receipt (חשבונית מס קבלה)
    // 4. Close document

    const input = {
      customer_name: 'Lifecycle Test Company',
      customer_email: 'lifecycle@test.com',
      products: [{ description: 'Consulting', quantity: 10, price: 500 }],
    };

    // Mock quote creation
    mockApi.mockResponse('/api/v3.php/doc/create', {
      status: true,
      data: {
        doc_id: 'quote-123',
        doc_number: 1001,
        doc_type: 300, // Quote
      },
    });

    // Mock convert quote → invoice
    mockApi.mockResponse('/api/v3.php/doc/convert', {
      status: true,
      data: {
        doc_id: 'invoice-456',
        doc_number: 2001,
        doc_type: 320, // Invoice
        source_doc_id: 'quote-123',
      },
    });

    // Mock convert invoice → receipt
    mockApi.mockResponse('/api/v3.php/doc/convert', {
      status: true,
      data: {
        doc_id: 'receipt-789',
        doc_number: 3001,
        doc_type: 305, // Invoice-Receipt
        source_doc_id: 'invoice-456',
      },
    });

    // Mock close document
    mockApi.mockResponse('/api/v3.php/doc/close', {
      status: true,
      data: {
        doc_id: 'receipt-789',
        status: 'closed',
      },
    });

    const result = await testWorkflow
      .addNode('create-quote', {
        resource: 'document',
        operation: 'create',
        doc_type: '300', // Quote
        use_existing_client: false,
        client_name: '{{ $json.customer_name }}',
        client_email: '{{ $json.customer_email }}',
        items: '{{ $json.products }}',
      })
      .addNode('convert-to-invoice', {
        resource: 'document',
        operation: 'convert',
        source_doc_id: '{{ $node["create-quote"].json.doc_id }}',
        target_doc_type: '320', // Invoice
      })
      .addNode('convert-to-receipt', {
        resource: 'document',
        operation: 'convert',
        source_doc_id: '{{ $node["convert-to-invoice"].json.doc_id }}',
        target_doc_type: '305', // Receipt
      })
      .addNode('close-document', {
        resource: 'document',
        operation: 'close',
        doc_id: '{{ $node["convert-to-receipt"].json.doc_id }}',
      })
      .execute(input);

    expect(result.status).toBe('success');

    // Verify quote created
    expect(result.nodes['create-quote'].data.doc_type).toBe(300);

    // Verify converted to invoice
    expect(result.nodes['convert-to-invoice'].data.doc_type).toBe(320);

    // Verify converted to receipt
    expect(result.nodes['convert-to-receipt'].data.doc_type).toBe(305);

    // Verify document closed
    expect(result.nodes['close-document'].data.status).toBe('closed');

    // Verify all 4 operations executed
    expect(mockApi.requests).toHaveLength(4);
  });

  test('should handle document cancellation workflow', async () => {
    // Scenario:
    // 1. Get document details
    // 2. Cancel document
    // 3. Verify cancellation

    mockApi.mockResponse('/api/v3.php/doc/get', {
      status: true,
      data: {
        doc_id: 'invoice-999',
        doc_number: 5001,
        status: 'open',
      },
    });

    mockApi.mockResponse('/api/v3.php/doc/cancel', {
      status: true,
      data: {
        doc_id: 'invoice-999',
        status: 'cancelled',
        cancellation_date: '2025-01-15',
      },
    });

    mockApi.mockResponse('/api/v3.php/doc/get', {
      status: true,
      data: {
        doc_id: 'invoice-999',
        doc_number: 5001,
        status: 'cancelled',
      },
    });

    const result = await testWorkflow
      .addNode('get-document', {
        resource: 'document',
        operation: 'get',
        doc_id: 'invoice-999',
      })
      .addNode('cancel-document', {
        resource: 'document',
        operation: 'cancel',
        doc_id: '{{ $node["get-document"].json.doc_id }}',
      })
      .addNode('verify-cancellation', {
        resource: 'document',
        operation: 'get',
        doc_id: '{{ $node["get-document"].json.doc_id }}',
      })
      .execute({});

    expect(result.status).toBe('success');
    expect(result.nodes['get-document'].data.status).toBe('open');
    expect(result.nodes['cancel-document'].data.status).toBe('cancelled');
    expect(result.nodes['verify-cancellation'].data.status).toBe('cancelled');
  });
});
```

**Coverage Target**: 75%+

---

## 🛠️ 4. Test Helpers & Utilities

### 4.1 Mock API

#### `tests/helpers/mockICountApi.ts`

```typescript
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
```

---

### 4.2 Mock n8n Context

#### `tests/helpers/mockN8nContext.ts`

```typescript
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
```

---

### 4.3 Test Fixtures

#### `tests/helpers/testFixtures.ts`

```typescript
export const mockCustomerFixture = {
  client_id: 123,
  name: 'Test Company Ltd',
  email: 'test@example.com',
  phone: '0501234567',
  mobile: '0529876543',
  address: '123 Main St',
  city: 'Tel Aviv',
  zip: '6789012',
  country: 'Israel',
  id_number: '123456789',
  vat_id: '987654321',
};

export const mockDocumentFixture = {
  doc_id: 'uuid-12345',
  doc_number: 2001,
  doc_type: 320,
  client_id: 123,
  client_name: 'Test Company Ltd',
  issue_date: '2025-01-15',
  due_date: '2025-02-15',
  currency: 'ILS',
  lang: 'he',
  total: 5000,
  total_before_vat: 4237.29,
  vat_total: 762.71,
  pdf_link: 'https://icount.co.il/pdf/12345',
  status: 'open',
  items: [
    {
      description: 'Test Service',
      quantity: 10,
      unit_price: 500,
      vat: 18,
      total: 5000,
    },
  ],
};

export const mockContactFixture = {
  contact_id: 456,
  client_id: 123,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '0501112222',
  position: 'CEO',
  contact_type_id: 1,
};

export const mockBanksFixture = {
  '10': 'בנק לאומי',
  '11': 'בנק דיסקונט',
  '12': 'בנק הפועלים',
  '20': 'בנק מזרחי טפחות',
};

export const mockUsersFixture = [
  {
    user_id: 1,
    user_name: 'Admin User',
    email: 'admin@company.com',
  },
  {
    user_id: 2,
    user_name: 'Sales User',
    email: 'sales@company.com',
  },
];

export const mockDocumentTypesFixture = {
  '300': 'הצעת מחיר',
  '305': 'חשבונית מס קבלה',
  '320': 'חשבונית מס',
  '400': 'חשבונית זיכוי',
  '405': 'קבלה',
};

export const mockClientTypesFixture = {
  '1': {
    client_type_id: 1,
    client_type_name: 'לקוח פרטי',
  },
  '2': {
    client_type_id: 2,
    client_type_name: 'חברה',
  },
  '3': {
    client_type_id: 3,
    client_type_name: 'עוסק מורשה',
  },
};

export const mockContactTypesFixture = {
  '1': {
    contact_type_id: 1,
    contact_type_name: 'מנהל',
  },
  '2': {
    contact_type_id: 2,
    contact_type_name: 'כספים',
  },
};
```

---

## 📋 5. Coverage Requirements

### Coverage Targets by Component

| Component | Unit Tests | Integration Tests | E2E Tests | Overall Target |
|-----------|-----------|-------------------|-----------|----------------|
| **Utils** | 100% | - | - | **100%** |
| **Load Options** | 100% | - | - | **100%** |
| **Document Operations** | - | 95%+ | 80%+ | **90%+** |
| **Customer Operations** | - | 95%+ | 80%+ | **90%+** |
| **Credentials** | - | 100% | - | **100%** |
| **Error Handling** | - | 90%+ | 85%+ | **85%+** |
| **Validation** | 100% | - | - | **100%** |
| **Overall Project** | - | - | - | **85%+** |

---

## ⚙️ 6. Test Configuration

### `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'nodes/**/*.ts',
    'credentials/**/*.ts',
    '!nodes/**/*.node.ts', // Exclude main node files (tested via integration)
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/nodes/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],
  globalTeardown: '<rootDir>/tests/setup/globalTeardown.ts',
  verbose: true,
  testTimeout: 30000,
};
```

### `tests/setup/jest.setup.ts`

```typescript
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
```

---

## 🎯 7. Test Execution Strategy

### 7.1 Local Development

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- tests/unit/utils
npm test -- tests/integration/document

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- create.test.ts
```

### 7.2 CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm test -- tests/unit --coverage

      - name: Run integration tests
        run: npm test -- tests/integration --coverage

      - name: Run E2E tests
        run: npm test -- tests/e2e --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 85" | bc -l) )); then
            echo "Coverage $COVERAGE% is below threshold 85%"
            exit 1
          fi

      - name: Build project
        run: npm run build
```

---

## 📊 8. Testing Checklist

### ✅ Per Operation Checklist

לכל operation יש לוודא:

- [ ] **Success Cases**
  - [ ] Minimal required data
  - [ ] Full optional data
  - [ ] Edge cases (Hebrew, special characters, large numbers)

- [ ] **Validation**
  - [ ] Missing required fields
  - [ ] Invalid formats (email, phone, VAT, etc.)
  - [ ] Invalid types/values

- [ ] **API Integration**
  - [ ] Correct endpoint called
  - [ ] Correct HTTP method
  - [ ] Correct headers (Authorization, Content-Type)
  - [ ] Correct request body structure

- [ ] **Error Handling**
  - [ ] API errors (status: false)
  - [ ] Network errors
  - [ ] Authentication errors (401, 403)
  - [ ] Rate limiting (429)
  - [ ] Timeout errors

- [ ] **Idempotency**
  - [ ] Idempotency key included (if applicable)
  - [ ] Unique keys for different items

- [ ] **Data Transformation**
  - [ ] Input mapping correct
  - [ ] Output format correct
  - [ ] Field renaming correct

---

## 🚀 9. Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Install Jest and dependencies
- [ ] Create test helpers (MockAPI, MockContext)
- [ ] Create test fixtures
- [ ] Setup Jest configuration
- [ ] Write first 5 unit tests (utils)

### Phase 2: Unit Tests (Week 2)
- [ ] Test all utility functions (100%)
- [ ] Test all load options methods (100%)
- [ ] Test validation functions (100%)
- [ ] Reach 100% unit test coverage

### Phase 3: Integration Tests - Documents (Week 3)
- [ ] Document: Create
- [ ] Document: Convert
- [ ] Document: Update Income Type
- [ ] Document: Get
- [ ] Document: List
- [ ] Document: Search
- [ ] Document: Cancel
- [ ] Document: Close
- [ ] Document: Get Doc URL
- [ ] Reach 90%+ coverage for documents

### Phase 4: Integration Tests - Customers (Week 4)
- [ ] Customer: Create
- [ ] Customer: Update
- [ ] Customer: Upsert
- [ ] Customer: Get
- [ ] Customer: List
- [ ] Customer: Delete
- [ ] Customer: Get Open Docs
- [ ] Customer: Get Contacts
- [ ] Customer: Add Contact
- [ ] Customer: Update Contact
- [ ] Customer: Delete Contact
- [ ] Reach 90%+ coverage for customers

### Phase 5: E2E Tests (Week 5)
- [ ] Invoice creation workflow
- [ ] Customer management workflow
- [ ] Document lifecycle workflow
- [ ] Error handling scenarios
- [ ] Batch processing scenarios
- [ ] Reach 80%+ E2E coverage

### Phase 6: CI/CD & Polish (Week 6)
- [ ] Setup GitHub Actions
- [ ] Configure code coverage reports
- [ ] Add coverage badges
- [ ] Create TESTING.md documentation
- [ ] Create CONTRIBUTING.md with testing guidelines
- [ ] Final coverage review
- [ ] Ensure 85%+ overall coverage

---

## 📚 10. Documentation Requirements

לאחר השלמת הבדיקות, יש ליצור:

1. **TESTING.md** - מדריך מלא לבדיקות
2. **CONTRIBUTING.md** - הנחיות לתרומה כולל דרישות testing
3. **Test Coverage Badges** - בadge ב-README
4. **API Documentation** - עדכון עם דוגמאות מבדיקות

---

## 🎓 11. Best Practices

### Do's ✅
- כתוב בדיקות לפני תיקון באגים (TDD)
- בדוק edge cases ו-error scenarios
- השתמש ב-fixtures לנתונים חוזרים
- בדוק עם נתונים בעברית
- וודא שכל בדיקה עצמאית ולא תלויה באחרות
- נקה mocks לאחר כל בדיקה
- השתמש בשמות תיאוריים לבדיקות

### Don'ts ❌
- לא לבדוק עם API אמיתי (תמיד mock)
- לא להשאיר hard-coded credentials
- לא לדלג על validation tests
- לא להריץ בדיקות ארוכות ב-unit tests
- לא לתלות בדיקה אחת בתוצאה של אחרת
- לא להשתמש ב-console.log בבדיקות

---

## 📞 Support & Questions

לשאלות או בעיות בהטמעת הבדיקות:
1. בדוק את [testing.md](testing.md) למדריך מקיף
2. עיין בדוגמאות הקוד במסמך זה
3. פתח issue ב-GitHub
4. התייעץ עם הצוות

---

**סיכום**: מסמך זה מגדיר **אפיון מלא ומקיף** עבור כל בדיקות ה-Testing הנדרשות לפרויקט n8n-nodes-icount, כולל כל ה-operations, helpers, utilities ו-workflows. הטמעה מלאה תבטיח איכות קוד גבוהה, אמינות ובטחון בעת שינויים עתידיים.
