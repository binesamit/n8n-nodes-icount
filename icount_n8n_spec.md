# אפיון מלא: iCount Node עבור N8N
## Technical Specification for Claude Code

---

## 1. מבוא ומטרה

פיתוח Custom Node עבור N8N לניהול מסמכים חשבונאיים במערכת iCount הישראלית.

**גרסת API**: iCount API v3  
**URL בסיס**: `https://apiv3.icount.co.il`  
**תיעוד API**: https://apiv3.icount.co.il/docs

---

## 2. מבנה הפרויקט

```
n8n-nodes-icount/
├── credentials/
│   └── ICountApi.credentials.ts
├── nodes/
│   └── ICount/
│       ├── ICount.node.ts
│       ├── ICount.node.json
│       ├── icount.svg
│       ├── resources/
│       │   ├── document/
│       │   │   ├── create.operation.ts
│       │   │   ├── update.operation.ts
│       │   │   ├── credit.operation.ts
│       │   │   ├── get.operation.ts
│       │   │   ├── list.operation.ts
│       │   │   └── downloadPdf.operation.ts
│       │   └── customer/
│       │       ├── find.operation.ts
│       │       ├── create.operation.ts
│       │       ├── update.operation.ts
│       │       └── upsert.operation.ts
│       ├── utils/
│       │   ├── apiRequest.ts
│       │   ├── idempotency.ts
│       │   └── validation.ts
│       └── types.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 3. Credentials (אימות)

### קובץ: `credentials/ICountApi.credentials.ts`

```typescript
import {
    ICredentialType,
    INodeProperties,
    IAuthenticateGeneric,
    ICredentialTestRequest,
} from 'n8n-workflow';

export class ICountApi implements ICredentialType {
    name = 'iCountApi';
    displayName = 'iCount API';
    documentationUrl = 'https://apiv3.icount.co.il/docs';
    properties: INodeProperties[] = [
        {
            displayName: 'Company ID (CID)',
            name: 'cid',
            type: 'string',
            default: '',
            required: true,
            description: 'מזהה החברה (ע.מ / ח.פ) כפי שמופיע ב-iCount',
        },
        {
            displayName: 'Username',
            name: 'user',
            type: 'string',
            default: '',
            required: true,
            description: 'שם משתמש API',
        },
        {
            displayName: 'Password',
            name: 'pass',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            description: 'סיסמת API',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            body: {
                cid: '={{$credentials.cid}}',
                user: '={{$credentials.user}}',
                pass: '={{$credentials.pass}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://apiv3.icount.co.il',
            url: '/api/v3/doc/list',
            method: 'POST',
            body: {
                cid: '={{$credentials.cid}}',
                user: '={{$credentials.user}}',
                pass: '={{$credentials.pass}}',
                limit: 1,
            },
        },
    };
}
```

---

## 4. Types (טיפוסים)

### קובץ: `nodes/ICount/types.ts`

```typescript
export type ICountResource = 'document' | 'customer';

export type DocumentOperation = 
    | 'create' 
    | 'update' 
    | 'credit' 
    | 'get' 
    | 'list' 
    | 'downloadPdf';

export type CustomerOperation = 
    | 'find' 
    | 'create' 
    | 'update' 
    | 'upsert';

export type DocumentType = 
    | '320' // חשבונית מס
    | '305' // חשבונית מס קבלה
    | '405' // קבלה
    | '410' // קבלה על תרומה
    | '300' // הצעת מחיר
    | '100' // תעודת משלוח
    | '400'; // חשבונית זיכוי

export type VatType = '0' | '1' | '-1'; // 0=לא כולל, 1=כולל, -1=פטור

export type PaymentType = '1' | '3' | '4' | '5'; // 1=מזומן, 3=אשראי, 4=שיק, 5=העברה

export type CreditType = 'full' | 'partial';

export interface ICountCredentials {
    cid: string;
    user: string;
    pass: string;
}

export interface DocumentItem {
    description: string;
    quantity: number;
    unit_price: number;
    vat_type?: VatType;
    discount_value?: number;
    item_code?: string;
    unit?: string;
}

export interface Payment {
    type: PaymentType;
    amount: number;
    date?: string;
    transaction_id?: string;
}

export interface Customer {
    name: string;
    id_number?: string;
    address?: string;
    city?: string;
    email?: string;
    phone?: string;
}

export interface DocumentCreateParams {
    doc_type: DocumentType;
    issue_date?: string;
    due_date?: string;
    currency_code?: string;
    lang?: 'he' | 'en';
    client: Customer;
    items: DocumentItem[];
    payments?: Payment[];
    comments?: string;
    send_email?: boolean;
}

export interface DocumentUpdateParams {
    doc_id: string;
    [key: string]: any;
}

export interface DocumentCreditParams {
    origin_doc_id: string;
    credit_type: CreditType;
    items?: DocumentItem[];
    comments?: string;
    send_email?: boolean;
}

export interface ICountApiResponse {
    status: boolean;
    data?: any;
    message?: string;
    error?: string;
}
```

---

## 5. Utils - API Request Handler

### קובץ: `nodes/ICount/utils/apiRequest.ts`

```typescript
import {
    IExecuteFunctions,
    IHttpRequestMethods,
    IDataObject,
} from 'n8n-workflow';
import { ICountCredentials, ICountApiResponse } from '../types';

export async function iCountApiRequest(
    this: IExecuteFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
): Promise<ICountApiResponse> {
    const credentials = await this.getCredentials('iCountApi') as ICountCredentials;

    // הוספת credentials לכל בקשה
    const requestBody = {
        cid: credentials.cid,
        user: credentials.user,
        pass: credentials.pass,
        ...body,
    };

    const options = {
        method,
        body: requestBody,
        qs,
        uri: `https://apiv3.icount.co.il${endpoint}`,
        json: true,
    };

    try {
        const response = await this.helpers.request(options);
        
        if (!response.status) {
            throw new Error(response.message || response.error || 'Unknown API error');
        }

        return response;
    } catch (error: any) {
        // טיפול ב-Rate Limiting
        if (error.statusCode === 429) {
            const retryAfter = error.response?.headers['retry-after'] || 60;
            throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
        }

        // שגיאות אימות
        if (error.statusCode === 401 || error.statusCode === 403) {
            throw new Error('Authentication failed. Check your credentials.');
        }

        throw error;
    }
}
```

---

## 6. Utils - Idempotency

### קובץ: `nodes/ICount/utils/idempotency.ts`

```typescript
import { IExecuteFunctions } from 'n8n-workflow';

export function generateIdempotencyKey(
    context: IExecuteFunctions,
    operation: string,
): string {
    const workflowId = context.getWorkflow().id;
    const executionId = context.getExecutionId();
    const nodeId = context.getNode().id;
    const itemIndex = context.getItemIndex();
    
    return `${workflowId}-${executionId}-${nodeId}-${operation}-${itemIndex}`;
}

export function addIdempotencyToBody(
    context: IExecuteFunctions,
    body: any,
    operation: string,
): any {
    const idempotencyKey = generateIdempotencyKey(context, operation);
    
    return {
        ...body,
        idempotency_key: idempotencyKey,
    };
}
```

---

## 7. Document Operations

### 7.1 קובץ: `nodes/ICount/resources/document/create.operation.ts`

```typescript
import { INodeProperties } from 'n8n-workflow';

export const documentCreateDescription: INodeProperties[] = [
    // ========== Document Type ==========
    {
        displayName: 'Document Type',
        name: 'doc_type',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        options: [
            { name: 'חשבונית מס (Tax Invoice)', value: '320' },
            { name: 'חשבונית מס קבלה (Invoice Receipt)', value: '305' },
            { name: 'קבלה (Receipt)', value: '405' },
            { name: 'קבלה על תרומה (Donation Receipt)', value: '410' },
            { name: 'הצעת מחיר (Price Quote)', value: '300' },
            { name: 'תעודת משלוח (Delivery Note)', value: '100' },
        ],
        default: '320',
        required: true,
        description: 'סוג המסמך להנפקה',
    },

    // ========== Document Details ==========
    {
        displayName: 'Document Date',
        name: 'issue_date',
        type: 'dateTime',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'תאריך הפקת המסמך (ברירת מחדל: היום)',
    },
    {
        displayName: 'Due Date',
        name: 'due_date',
        type: 'dateTime',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'תאריך יעד לתשלום',
    },
    {
        displayName: 'Currency',
        name: 'currency_code',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        options: [
            { name: 'שקל (ILS)', value: 'ILS' },
            { name: 'דולר (USD)', value: 'USD' },
            { name: 'יורו (EUR)', value: 'EUR' },
        ],
        default: 'ILS',
        description: 'מטבע המסמך',
    },
    {
        displayName: 'Language',
        name: 'lang',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        options: [
            { name: 'עברית', value: 'he' },
            { name: 'English', value: 'en' },
        ],
        default: 'he',
        description: 'שפת המסמך',
    },

    // ========== Client Details ==========
    {
        displayName: 'Client Name',
        name: 'client_name',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        default: '',
        required: true,
        description: 'שם הלקוח המלא',
    },
    {
        displayName: 'HP Number',
        name: 'client_id_number',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'ח.פ / ע.מ / ת.ז של הלקוח',
    },
    {
        displayName: 'Client Email',
        name: 'client_email',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'כתובת מייל לשליחת המסמך',
    },
    {
        displayName: 'Client Address',
        name: 'client_address',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'כתובת הלקוח',
    },
    {
        displayName: 'Client City',
        name: 'client_city',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'עיר הלקוח',
    },
    {
        displayName: 'Client Phone',
        name: 'client_phone',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'טלפון הלקוח',
    },

    // ========== Items ==========
    {
        displayName: 'Items',
        name: 'items',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        default: {},
        required: true,
        placeholder: 'Add Item',
        description: 'פריטים/שירותים במסמך',
        options: [
            {
                name: 'item',
                displayName: 'Item',
                values: [
                    {
                        displayName: 'Description',
                        name: 'description',
                        type: 'string',
                        default: '',
                        required: true,
                        description: 'תיאור הפריט/שירות',
                    },
                    {
                        displayName: 'Quantity',
                        name: 'quantity',
                        type: 'number',
                        default: 1,
                        required: true,
                        description: 'כמות',
                    },
                    {
                        displayName: 'Unit Price',
                        name: 'unit_price',
                        type: 'number',
                        default: 0,
                        required: true,
                        description: 'מחיר ליחידה (לפני מע"מ)',
                    },
                    {
                        displayName: 'VAT Type',
                        name: 'vat_type',
                        type: 'options',
                        options: [
                            { name: 'לא כולל מע"מ', value: '0' },
                            { name: 'כולל מע"מ', value: '1' },
                            { name: 'פטור ממע"מ', value: '-1' },
                        ],
                        default: '0',
                        description: 'סוג מע"מ',
                    },
                    {
                        displayName: 'Discount (%)',
                        name: 'discount_value',
                        type: 'number',
                        default: 0,
                        description: 'אחוז הנחה',
                    },
                    {
                        displayName: 'Item Code',
                        name: 'item_code',
                        type: 'string',
                        default: '',
                        description: 'קוד פריט/SKU',
                    },
                    {
                        displayName: 'Unit',
                        name: 'unit',
                        type: 'string',
                        default: 'יח׳',
                        description: 'יחידת מידה (יח׳, ק"ג, שעות וכו\')',
                    },
                ],
            },
        ],
    },

    // ========== Payments ==========
    {
        displayName: 'Add Payments',
        name: 'add_payments',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        default: false,
        description: 'האם להוסיף תשלומים למסמך',
    },
    {
        displayName: 'Payments',
        name: 'payments',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
                add_payments: [true],
            },
        },
        default: {},
        placeholder: 'Add Payment',
        description: 'תשלומים שהתקבלו',
        options: [
            {
                name: 'payment',
                displayName: 'Payment',
                values: [
                    {
                        displayName: 'Payment Type',
                        name: 'type',
                        type: 'options',
                        options: [
                            { name: 'מזומן', value: '1' },
                            { name: 'אשראי', value: '3' },
                            { name: 'שיק', value: '4' },
                            { name: 'העברה בנקאית', value: '5' },
                        ],
                        default: '1',
                        required: true,
                        description: 'אמצעי תשלום',
                    },
                    {
                        displayName: 'Amount',
                        name: 'amount',
                        type: 'number',
                        default: 0,
                        required: true,
                        description: 'סכום התשלום',
                    },
                    {
                        displayName: 'Payment Date',
                        name: 'date',
                        type: 'dateTime',
                        default: '',
                        description: 'תאריך קבלת התשלום',
                    },
                    {
                        displayName: 'Transaction ID',
                        name: 'transaction_id',
                        type: 'string',
                        default: '',
                        description: 'מזהה עסקה (לאשראי/העברה)',
                    },
                ],
            },
        ],
    },

    // ========== Additional Options ==========
    {
        displayName: 'Notes',
        name: 'comments',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'הערות שיופיעו במסמך',
    },
    {
        displayName: 'Send by Email',
        name: 'send_email',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        default: false,
        description: 'שליחה אוטומטית למייל הלקוח',
    },
    {
        displayName: 'Download PDF',
        name: 'download_pdf',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        default: false,
        description: 'הורדת קובץ PDF כפלט בינארי',
    },
];

export async function executeCreate(this: any, index: number): Promise<any> {
    const credentials = await this.getCredentials('iCountApi');
    
    // Build document object
    const docType = this.getNodeParameter('doc_type', index) as string;
    const issueDate = this.getNodeParameter('issue_date', index, '') as string;
    const dueDate = this.getNodeParameter('due_date', index, '') as string;
    const currency = this.getNodeParameter('currency_code', index, 'ILS') as string;
    const lang = this.getNodeParameter('lang', index, 'he') as string;
    
    // Client
    const client = {
        name: this.getNodeParameter('client_name', index) as string,
        id_number: this.getNodeParameter('client_id_number', index, '') as string,
        email: this.getNodeParameter('client_email', index, '') as string,
        address: this.getNodeParameter('client_address', index, '') as string,
        city: this.getNodeParameter('client_city', index, '') as string,
        phone: this.getNodeParameter('client_phone', index, '') as string,
    };
    
    // Items
    const itemsData = this.getNodeParameter('items', index, {}) as any;
    const items = itemsData.item || [];
    
    // Payments
    const addPayments = this.getNodeParameter('add_payments', index, false) as boolean;
    let payments = [];
    if (addPayments) {
        const paymentsData = this.getNodeParameter('payments', index, {}) as any;
        payments = paymentsData.payment || [];
    }
    
    const comments = this.getNodeParameter('comments', index, '') as string;
    const sendEmail = this.getNodeParameter('send_email', index, false) as boolean;
    const downloadPdf = this.getNodeParameter('download_pdf', index, false) as boolean;
    
    // Build API request body
    const body = {
        cid: credentials.cid,
        user: credentials.user,
        pass: credentials.pass,
        doc_type: docType,
        issue_date: issueDate,
        due_date: dueDate,
        currency_code: currency,
        lang,
        client,
        items,
        payments,
        comments,
        send_email: sendEmail,
    };
    
    // Add idempotency key
    const idempotencyKey = generateIdempotencyKey(this, 'create');
    body.idempotency_key = idempotencyKey;
    
    // Make API request
    const response = await this.helpers.request({
        method: 'POST',
        url: 'https://apiv3.icount.co.il/api/v3/doc/create',
        body,
        json: true,
    });
    
    if (!response.status) {
        throw new Error(response.message || 'Failed to create document');
    }
    
    const result = {
        json: {
            doc_id: response.data.doc_id,
            doc_number: response.data.doc_number,
            pdf_url: response.data.pdf_link,
            ...response.data,
        },
    };
    
    // Download PDF if requested
    if (downloadPdf && response.data.pdf_link) {
        const pdfResponse = await this.helpers.request({
            method: 'GET',
            url: response.data.pdf_link,
            encoding: null,
        });
        
        result.binary = {
            data: {
                data: pdfResponse.toString('base64'),
                fileName: `invoice_${response.data.doc_number}.pdf`,
                mimeType: 'application/pdf',
            },
        };
    }
    
    return result;
}
```

### 7.2 קובץ: `nodes/ICount/resources/document/update.operation.ts`

```typescript
import { INodeProperties } from 'n8n-workflow';

export const documentUpdateDescription: INodeProperties[] = [
    {
        displayName: 'Document ID',
        name: 'doc_id',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['update'],
            },
        },
        default: '',
        required: true,
        description: 'מזהה המסמך (UUID) לעדכון',
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['update'],
            },
        },
        default: {},
        options: [
            // כל השדות מ-create, אך כאופציונליים
            {
                displayName: 'Due Date',
                name: 'due_date',
                type: 'dateTime',
                default: '',
            },
            {
                displayName: 'Client Email',
                name: 'client_email',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Notes',
                name: 'comments',
                type: 'string',
                typeOptions: { rows: 4 },
                default: '',
            },
            // ... שדות נוספים
        ],
    },
];

export async function executeUpdate(this: any, index: number): Promise<any> {
    const credentials = await this.getCredentials('iCountApi');
    const docId = this.getNodeParameter('doc_id', index) as string;
    const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
    
    const body = {
        cid: credentials.cid,
        user: credentials.user,
        pass: credentials.pass,
        doc_id: docId,
        ...updateFields,
    };
    
    const response = await this.helpers.request({
        method: 'POST',
        url: 'https://apiv3.icount.co.il/api/v3/doc/update',
        body,
        json: true,
    });
    
    if (!response.status) {
        throw new Error(response.message || 'Failed to update document');
    }
    
    return { json: response.data };
}
```

### 7.3 קובץ: `nodes/ICount/resources/document/credit.operation.ts`

```typescript
import { INodeProperties } from 'n8n-workflow';

export const documentCreditDescription: INodeProperties[] = [
    {
        displayName: 'Original Document ID',
        name: 'origin_doc_id',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['credit'],
            },
        },
        default: '',
        required: true,
        description: 'מזהה המסמך המקורי (UUID) לזיכוי',
    },
    {
        displayName: 'Credit Type',
        name: 'credit_type',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['credit'],
            },
        },
        options: [
            { name: 'זיכוי מלא (Copy All Lines)', value: 'full' },
            { name: 'זיכוי חלקי (Select Items)', value: 'partial' },
        ],
        default: 'full',
        required: true,
        description: 'סוג הזיכוי',
    },
    {
        displayName: 'Items to Credit',
        name: 'items',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['credit'],
                credit_type: ['partial'],
            },
        },
        default: {},
        placeholder: 'Add Item',
        description: 'פריטים לזיכוי (בזיכוי חלקי)',
        options: [
            {
                name: 'item',
                displayName: 'Item',
                values: [
                    {
                        displayName: 'Description',
                        name: 'description',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'Quantity',
                        name: 'quantity',
                        type: 'number',
                        default: 1,
                        required: true,
                    },
                    {
                        displayName: 'Unit Price',
                        name: 'unit_price',
                        type: 'number',
                        default: 0,
                        required: true,
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Reason',
        name: 'comments',
        type: 'string',
        typeOptions: { rows: 3 },
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['credit'],
            },
        },
        default: '',
        description: 'סיבת הזיכוי',
    },
    {
        displayName: 'Send by Email',
        name: 'send_email',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['credit'],
            },
        },
        default: false,
        description: 'שליחת מסמך הזיכוי למייל',
    },
];

export async function executeCredit(this: any, index: number): Promise<any> {
    const credentials = await this.getCredentials('iCountApi');
    const originDocId = this.getNodeParameter('origin_doc_id', index) as string;
    const creditType = this.getNodeParameter('credit_type', index) as string;
    const comments = this.getNodeParameter('comments', index, '') as string;
    const sendEmail = this.getNodeParameter('send_email', index, false) as boolean;
    
    let items = [];
    if (creditType === 'partial') {
        const itemsData = this.getNodeParameter('items', index, {}) as any;
        items = itemsData.item || [];
    }
    
    const body = {
        cid: credentials.cid,
        user: credentials.user,
        pass: credentials.pass,
        doc_type: '400', // Credit note
        origin_doc_id: originDocId,
        comments,
        send_email: sendEmail,
    };
    
    if (creditType === 'partial' && items.length > 0) {
        body.items = items;
    }
    
    const response = await this.helpers.request({
        method: 'POST',
        url: 'https://apiv3.icount.co.il/api/v3/doc/create',
        body,
        json: true,
    });
    
    if (!response.status) {
        throw new Error(response.message || 'Failed to create credit note');
    }
    
    return {
        json: {
            credit_doc_id: response.data.doc_id,
            credit_doc_number: response.data.doc_number,
            origin_doc_id: originDocId,
            pdf_url: response.data.pdf_link,
            ...response.data,
        },
    };
}
```

### 7.4 קובץ: `nodes/ICount/resources/document/get.operation.ts`

```typescript
import { INodeProperties } from 'n8n-workflow';

export const documentGetDescription: INodeProperties[] = [
    {
        displayName: 'Document ID',
        name: 'doc_id',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['get'],
            },
        },
        default: '',
        required: true,
        description: 'מזהה המסמך (UUID)',
    },
];

export async function executeGet(this: any, index: number): Promise<any> {
    const credentials = await this.getCredentials('iCountApi');
    const docId = this.getNodeParameter('doc_id', index) as string;
    
    const body = {
        cid: credentials.cid,
        user: credentials.user,
        pass: credentials.pass,
        doc_id: docId,
    };
    
    const response = await this.helpers.request({
        method: 'POST',
        url: 'https://apiv3.icount.co.il/api/v3/doc/get',
        body,
        json: true,
    });
    
    if (!response.status) {
        throw new Error(response.message || 'Document not found');
    }
    
    return { json: response.data };
}
```

### 7.5 קובץ: `nodes/ICount/resources/document/list.operation.ts`

```typescript
import { INodeProperties } from 'n8n-workflow';

export const documentListDescription: INodeProperties[] = [
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['list'],
            },
        },
        default: false,
        description: 'האם להחזיר את כל התוצאות',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['list'],
                returnAll: [false],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 100,
        },
        default: 50,
        description: 'מספר התוצאות להחזיר',
    },
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['list'],
            },
        },
        default: {},
        options: [
            {
                displayName: 'From Date',
                name: 'from_date',
                type: 'dateTime',
                default: '',
                description: 'תאריך התחלה',
            },
            {
                displayName: 'To Date',
                name: 'to_date',
                type: 'dateTime',
                default: '',
                description: 'תאריך סיום',
            },
            {
                displayName: 'Document Type',
                name: 'doc_type',
                type: 'options',
                options: [
                    { name: 'חשבונית מס', value: '320' },
                    { name: 'חשבונית מס קבלה', value: '305' },
                    { name: 'קבלה', value: '405' },
                    { name: 'הצעת מחיר', value: '300' },
                ],
                default: '',
            },
            {
                displayName: 'Client Name',
                name: 'client_name',
                type: 'string',
                default: '',
            },
        ],
    },
];

export async function executeList(this: any, index: number): Promise<any> {
    const credentials = await this.getCredentials('iCountApi');
    const returnAll = this.getNodeParameter('returnAll', index) as boolean;
    const filters = this.getNodeParameter('filters', index, {}) as any;
    
    const body = {
        cid: credentials.cid,
        user: credentials.user,
        pass: credentials.pass,
        ...filters,
    };
    
    if (!returnAll) {
        body.limit = this.getNodeParameter('limit', index, 50) as number;
    }
    
    const response = await this.helpers.request({
        method: 'POST',
        url: 'https://apiv3.icount.co.il/api/v3/doc/list',
        body,
        json: true,
    });
    
    if (!response.status) {
        throw new Error(response.message || 'Failed to list documents');
    }
    
    const documents = response.data.documents || [];
    
    return documents.map((doc: any) => ({ json: doc }));
}
```

### 7.6 קובץ: `nodes/ICount/resources/document/downloadPdf.operation.ts`

```typescript
import { INodeProperties } from 'n8n-workflow';

export const documentDownloadPdfDescription: INodeProperties[] = [
    {
        displayName: 'Document ID',
        name: 'doc_id',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['downloadPdf'],
            },
        },
        default: '',
        required: true,
        description: 'מזהה המסמך (UUID)',
    },
];

export async function executeDownloadPdf(this: any, index: number): Promise<any> {
    const credentials = await this.getCredentials('iCountApi');
    const docId = this.getNodeParameter('doc_id', index) as string;
    
    // First, get document info to get PDF link
    const getBody = {
        cid: credentials.cid,
        user: credentials.user,
        pass: credentials.pass,
        doc_id: docId,
    };
    
    const docResponse = await this.helpers.request({
        method: 'POST',
        url: 'https://apiv3.icount.co.il/api/v3/doc/get',
        body: getBody,
        json: true,
    });
    
    if (!docResponse.status || !docResponse.data.pdf_link) {
        throw new Error('PDF link not found');
    }
    
    // Download PDF
    const pdfResponse = await this.helpers.request({
        method: 'GET',
        url: docResponse.data.pdf_link,
        encoding: null,
    });
    
    return {
        json: {
            doc_id: docId,
            doc_number: docResponse.data.doc_number,
            pdf_url: docResponse.data.pdf_link,
        },
        binary: {
            data: {
                data: pdfResponse.toString('base64'),
                fileName: `document_${docResponse.data.doc_number}.pdf`,
                mimeType: 'application/pdf',
            },
        },
    };
}
```

---

## 8. Customer Operations

### 8.1 קובץ: `nodes/ICount/resources/customer/upsert.operation.ts`

```typescript
import { INodeProperties } from 'n8n-workflow';

export const customerUpsertDescription: INodeProperties[] = [
    {
        displayName: 'Search By',
        name: 'search_by',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        options: [
            { name: 'HP Number', value: 'id_number' },
            { name: 'Email', value: 'email' },
        ],
        default: 'id_number',
        description: 'שדה לחיפוש לקוח קיים',
    },
    {
        displayName: 'Customer Name',
        name: 'name',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        required: true,
    },
    {
        displayName: 'HP Number',
        name: 'id_number',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
    },
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: {},
        options: [
            {
                displayName: 'Address',
                name: 'address',
                type: 'string',
                default: '',
            },
            {
                displayName: 'City',
                name: 'city',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Phone',
                name: 'phone',
                type: 'string',
                default: '',
            },
        ],
    },
];

export async function executeUpsert(this: any, index: number): Promise<any> {
    const credentials = await this.getCredentials('iCountApi');
    const searchBy = this.getNodeParameter('search_by', index) as string;
    const name = this.getNodeParameter('name', index) as string;
    const idNumber = this.getNodeParameter('id_number', index, '') as string;
    const email = this.getNodeParameter('email', index, '') as string;
    const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;
    
    const customerData = {
        name,
        id_number: idNumber,
        email,
        ...additionalFields,
    };
    
    // Try to find existing customer
    const searchValue = searchBy === 'id_number' ? idNumber : email;
    
    const searchBody = {
        cid: credentials.cid,
        user: credentials.user,
        pass: credentials.pass,
        [searchBy]: searchValue,
    };
    
    let customerId = null;
    
    try {
        const searchResponse = await this.helpers.request({
            method: 'POST',
            url: 'https://apiv3.icount.co.il/api/v3/client/find',
            body: searchBody,
            json: true,
        });
        
        if (searchResponse.status && searchResponse.data) {
            customerId = searchResponse.data.client_id;
        }
    } catch (error) {
        // Customer not found, will create new
    }
    
    let response;
    
    if (customerId) {
        // Update existing
        const updateBody = {
            cid: credentials.cid,
            user: credentials.user,
            pass: credentials.pass,
            client_id: customerId,
            ...customerData,
        };
        
        response = await this.helpers.request({
            method: 'POST',
            url: 'https://apiv3.icount.co.il/api/v3/client/update',
            body: updateBody,
            json: true,
        });
    } else {
        // Create new
        const createBody = {
            cid: credentials.cid,
            user: credentials.user,
            pass: credentials.pass,
            ...customerData,
        };
        
        response = await this.helpers.request({
            method: 'POST',
            url: 'https://apiv3.icount.co.il/api/v3/client/create',
            body: createBody,
            json: true,
        });
    }
    
    if (!response.status) {
        throw new Error(response.message || 'Failed to upsert customer');
    }
    
    return {
        json: {
            action: customerId ? 'updated' : 'created',
            customer_id: response.data.client_id || customerId,
            ...response.data,
        },
    };
}
```

---

## 9. Main Node File

### קובץ: `nodes/ICount/ICount.node.ts`

```typescript
import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

import { 
    documentCreateDescription,
    executeCreate,
} from './resources/document/create.operation';

import {
    documentUpdateDescription,
    executeUpdate,
} from './resources/document/update.operation';

import {
    documentCreditDescription,
    executeCredit,
} from './resources/document/credit.operation';

import {
    documentGetDescription,
    executeGet,
} from './resources/document/get.operation';

import {
    documentListDescription,
    executeList,
} from './resources/document/list.operation';

import {
    documentDownloadPdfDescription,
    executeDownloadPdf,
} from './resources/document/downloadPdf.operation';

import {
    customerUpsertDescription,
    executeUpsert,
} from './resources/customer/upsert.operation';

export class ICount implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'iCount',
        name: 'iCount',
        icon: 'file:icount.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["resource"]}} - {{$parameter["operation"]}}',
        description: 'ניהול מסמכים חשבונאיים ב-iCount',
        defaults: {
            name: 'iCount',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'iCountApi',
                required: true,
            },
        ],
        properties: [
            // ========== Resource ==========
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Document',
                        value: 'document',
                        description: 'ניהול מסמכים (חשבוניות, קבלות וכו\')',
                    },
                    {
                        name: 'Customer',
                        value: 'customer',
                        description: 'ניהול לקוחות',
                    },
                ],
                default: 'document',
            },

            // ========== Document Operations ==========
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['document'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'יצירת מסמך חדש',
                        action: 'Create a document',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'עדכון מסמך קיים',
                        action: 'Update a document',
                    },
                    {
                        name: 'Credit',
                        value: 'credit',
                        description: 'יצירת חשבונית זיכוי',
                        action: 'Create a credit note',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'שליפת מסמך לפי ID',
                        action: 'Get a document',
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'רשימת מסמכים',
                        action: 'List documents',
                    },
                    {
                        name: 'Download PDF',
                        value: 'downloadPdf',
                        description: 'הורדת PDF של מסמך',
                        action: 'Download document PDF',
                    },
                ],
                default: 'create',
            },

            // ========== Customer Operations ==========
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['customer'],
                    },
                },
                options: [
                    {
                        name: 'Upsert',
                        value: 'upsert',
                        description: 'יצירה או עדכון לקוח',
                        action: 'Upsert a customer',
                    },
                ],
                default: 'upsert',
            },

            // ========== Operation Fields ==========
            ...documentCreateDescription,
            ...documentUpdateDescription,
            ...documentCreditDescription,
            ...documentGetDescription,
            ...documentListDescription,
            ...documentDownloadPdfDescription,
            ...customerUpsertDescription,
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        for (let i = 0; i < items.length; i++) {
            try {
                let result: any;

                if (resource === 'document') {
                    switch (operation) {
                        case 'create':
                            result = await executeCreate.call(this, i);
                            break;
                        case 'update':
                            result = await executeUpdate.call(this, i);
                            break;
                        case 'credit':
                            result = await executeCredit.call(this, i);
                            break;
                        case 'get':
                            result = await executeGet.call(this, i);
                            break;
                        case 'list':
                            const listResults = await executeList.call(this, i);
                            returnData.push(...listResults);
                            continue;
                        case 'downloadPdf':
                            result = await executeDownloadPdf.call(this, i);
                            break;
                        default:
                            throw new Error(`Unknown operation: ${operation}`);
                    }
                } else if (resource === 'customer') {
                    switch (operation) {
                        case 'upsert':
                            result = await executeUpsert.call(this, i);
                            break;
                        default:
                            throw new Error(`Unknown operation: ${operation}`);
                    }
                }

                if (Array.isArray(result)) {
                    returnData.push(...result);
                } else {
                    returnData.push(result);
                }
            } catch (error: any) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                            item: i,
                        },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}
```

---

## 10. package.json

```json
{
  "name": "n8n-nodes-icount",
  "version": "1.0.0",
  "description": "n8n node for iCount Israeli accounting system",
  "keywords": [
    "n8n-community-node-package",
    "n8n",
    "icount",
    "accounting",
    "israel",
    "invoices"
  ],
  "license": "MIT",
  "homepage": "https://github.com/yourusername/n8n-nodes-icount",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yourusername/n8n-nodes-icount.git"
  },
  "main": "index.js",
  "scripts": {
    "build": "tsc && gulp build:icons",
    "dev": "tsc --watch",
    "format": "prettier nodes credentials --write",
    "lint": "eslint nodes credentials package.json",
    "lintfix": "eslint nodes credentials package.json --fix",
    "prepublishOnly": "npm run build && npm run lint -c .eslintrc.prepublish.js nodes credentials package.json"
  },
  "files": [
    "dist"
  ],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/ICountApi.credentials.js"
    ],
    "nodes": [
      "dist/nodes/ICount/ICount.node.js"
    ]
  },
  "devDependencies": {
    "@typescript-eslint/parser": "^5.0.0",
    "eslint-plugin-n8n-nodes-base": "^1.11.0",
    "gulp": "^4.0.2",
    "n8n-workflow": "^1.0.0",
    "prettier": "^2.7.1",
    "typescript": "^4.8.4"
  },
  "dependencies": {
    "n8n-workflow": "^1.0.0"
  }
}
```

---

## 11. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "commonjs",
    "lib": ["ES2019"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": [
    "credentials/**/*",
    "nodes/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

---

## 12. README.md

```markdown
# n8n-nodes-icount

This is an n8n community node for iCount - Israeli accounting system.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Document Resource

- **Create**: Create new invoices, receipts, quotes, etc.
- **Update**: Update existing documents
- **Credit**: Create credit notes
- **Get**: Retrieve document by ID
- **List**: Search and list documents
- **Download PDF**: Download document as PDF

### Customer Resource

- **Upsert**: Create or update customer (find by HP/email)

## Credentials

You need to create iCount API credentials with:

- **Company ID (CID)**: Your company number
- **Username**: API username
- **Password**: API password

## Example Workflows

### Create Invoice from Webhook

```
Webhook → iCount (Upsert Customer) → iCount (Create Invoice) → Send Email
```

### Batch Credit Notes

```
Get Data → Loop → iCount (Credit) → Save Results
```

## Resources

- [iCount API Documentation](https://apiv3.icount.co.il/docs)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT
```

---

## 13. הערות מיוחדות ל-Claude Code

### 13.1 סדר פיתוח מומלץ

1. **התחל מ-Credentials** - צור את `ICountApi.credentials.ts` ובדוק אותו
2. **Types** - הגדר את כל הטיפוסים ב-`types.ts`
3. **Utils** - צור את `apiRequest.ts` ו-`idempotency.ts`
4. **Document Operations** - התחל מ-`create`, המשך ל-`update`, `credit`, וכו'
5. **Customer Operations** - `upsert`
6. **Main Node** - חבר הכל יחד ב-`ICount.node.ts`
7. **Testing** - בדוק כל operation בנפרד

### 13.2 נקודות קריטיות

- ✅ **Idempotency Key** חייב להיות בכל Create/Update
- ✅ **Rate Limiting** - טפל ב-429 errors
- ✅ **Credentials** בכל API call
- ✅ **Binary Output** - PDF downloads
- ✅ **Error Handling** - שגיאות ברורות בעברית
- ✅ **Validation** - בדוק שדות חובה לפני שליחה

### 13.3 בדיקות

```bash
# התקנה מקומית
npm link

# בתוך n8n
cd ~/.n8n
npm link n8n-nodes-icount

# הרצת n8n
n8n start
```

### 13.4 API Endpoints Reference

```
POST /api/v3/doc/create    - Create document
POST /api/v3/doc/update    - Update document
POST /api/v3/doc/get       - Get document
POST /api/v3/doc/list      - List documents
POST /api/v3/client/find   - Find customer
POST /api/v3/client/create - Create customer
POST /api/v3/client/update - Update customer
```

---

## 14. Checklist לפני Release

- [ ] כל ה-operations עובדים
- [ ] Credentials נבדקו
- [ ] טיפול בשגיאות עובד
- [ ] PDF download עובד (binary output)
- [ ] Idempotency מיושם
- [ ] README מלא ומפורט
- [ ] דוגמאות workflows
- [ ] אייקון (icount.svg) קיים
- [ ] package.json נכון
- [ ] TypeScript compiles ללא שגיאות
- [ ] Linting עובר
- [ ] נבדק על חשבון iCount אמיתי

---

**סיום האפיון**

אפיון זה מכיל את כל הפרטים הטכניים הנדרשים לפיתוח iCount Node ל-N8N.
Claude Code יכול להשתמש באפיון זה ישירות לייצור הקוד.