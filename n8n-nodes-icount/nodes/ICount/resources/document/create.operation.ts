import { INodeProperties } from 'n8n-workflow';
import { generateIdempotencyKey } from '../../utils/idempotency';

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
            { name: 'חשבונית מס קבלה (Invoice Receipt)', value: 'invrec' },
            { name: 'חשבונית מס (Tax Invoice)', value: 'invoice' },
            { name: 'קבלה (Receipt)', value: 'receipt' },
            { name: 'חשבון עסקה (Transaction Account)', value: 'deal' },
            { name: 'הצעת מחיר (Price Quote)', value: 'offer' },
            { name: 'הזמנה (Order)', value: 'order' },
            { name: 'תעודת משלוח (Delivery Note)', value: 'delivery' },
        ],
        default: 'invrec',
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
        displayName: 'Use Existing Client',
        name: 'use_existing_client',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        default: false,
        description: 'השתמש בלקוח קיים מה-iCount על פי מזהה',
    },
    {
        displayName: 'Client ID',
        name: 'client_id',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
                use_existing_client: [true],
            },
        },
        default: '',
        required: true,
        description: 'מזהה הלקוח ב-iCount',
    },
    {
        displayName: 'Client Name',
        name: 'client_name',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
                use_existing_client: [false],
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
                use_existing_client: [false],
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
                use_existing_client: [false],
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
                use_existing_client: [false],
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
                use_existing_client: [false],
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
                use_existing_client: [false],
            },
        },
        default: '',
        description: 'טלפון הלקוח',
    },

    // ========== Items ==========
    {
        displayName: 'Items Input Type',
        name: 'items_input_type',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
            },
        },
        options: [
            { name: 'Build Manually', value: 'manual' },
            { name: 'JSON Array', value: 'json' },
        ],
        default: 'manual',
        description: 'בחר איך להזין את הפריטים',
    },
    {
        displayName: 'Items JSON',
        name: 'items_json',
        type: 'json',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
                items_input_type: ['json'],
            },
        },
        default: '[{"description":"פריט 1","quantity":1,"unitprice":100},{"description":"פריט 2","quantity":2,"unitprice":50}]',
        required: true,
        description: 'מערך JSON של פריטים (unitprice או unit_price)',
        placeholder: '[{"description":"פריט 1","quantity":1,"unitprice":100}]',
    },
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
                items_input_type: ['manual'],
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
        displayName: 'Payments Input Type',
        name: 'payments_input_type',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
                add_payments: [true],
            },
        },
        options: [
            { name: 'Build Manually', value: 'manual' },
            { name: 'JSON Array', value: 'json' },
        ],
        default: 'manual',
        description: 'בחר איך להזין את התשלומים',
    },
    {
        displayName: 'Payments JSON',
        name: 'payments_json',
        type: 'json',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['create'],
                add_payments: [true],
                payments_input_type: ['json'],
            },
        },
        default: '[{"type":"1","amount":182.36},{"type":"4","amount":200,"bank":12,"branch":1,"account":"123","cheque_number":"456"},{"type":"4","amount":300,"bank":12,"branch":1,"account":"123","cheque_number":"789"},{"type":"3","amount":500,"card_type":"VISA","card_number":"1234","num_of_payments":1,"holder_id":"123456789","holder_name":"John Doe","exp_year":2026,"exp_month":12,"transaction_id":"12345"}]',
        required: true,
        description: 'מערך JSON של תשלומים - type: 1=מזומן, 3=אשראי, 4=שיק, 5=העברה בנקאית',
        placeholder: '[{"type":"1","amount":100}]',
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
                payments_input_type: ['manual'],
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
                        displayName: 'Transaction ID / Confirmation Code',
                        name: 'transaction_id',
                        type: 'string',
                        displayOptions: {
                            show: {
                                type: ['3'],
                            },
                        },
                        default: '',
                        description: 'קוד אישור לעסקת אשראי',
                    },
                    {
                        displayName: 'Card Type',
                        name: 'card_type',
                        type: 'options',
                        displayOptions: {
                            show: {
                                type: ['3'],
                            },
                        },
                        options: [
                            { name: 'VISA', value: 'VISA' },
                            { name: 'MasterCard', value: 'MasterCard' },
                            { name: 'American Express', value: 'Amex' },
                            { name: 'Diners', value: 'Diners' },
                        ],
                        default: 'VISA',
                        description: 'סוג כרטיס אשראי',
                    },
                    {
                        displayName: 'Last 4 Digits',
                        name: 'card_number',
                        type: 'string',
                        displayOptions: {
                            show: {
                                type: ['3'],
                            },
                        },
                        default: '0000',
                        description: '4 ספרות אחרונות של הכרטיס',
                    },
                    {
                        displayName: 'Number of Payments',
                        name: 'num_of_payments',
                        type: 'number',
                        displayOptions: {
                            show: {
                                type: ['3'],
                            },
                        },
                        default: 1,
                        description: 'מספר תשלומים',
                    },
                    {
                        displayName: 'Holder ID',
                        name: 'holder_id',
                        type: 'string',
                        displayOptions: {
                            show: {
                                type: ['3'],
                            },
                        },
                        default: '000000000',
                        description: 'ת.ז. של בעל הכרטיס',
                    },
                    {
                        displayName: 'Holder Name',
                        name: 'holder_name',
                        type: 'string',
                        displayOptions: {
                            show: {
                                type: ['3'],
                            },
                        },
                        default: '',
                        description: 'שם בעל הכרטיס',
                    },
                    {
                        displayName: 'Expiration Year',
                        name: 'exp_year',
                        type: 'number',
                        displayOptions: {
                            show: {
                                type: ['3'],
                            },
                        },
                        default: new Date().getFullYear() + 1,
                        description: 'שנת תפוגה',
                    },
                    {
                        displayName: 'Expiration Month',
                        name: 'exp_month',
                        type: 'number',
                        displayOptions: {
                            show: {
                                type: ['3'],
                            },
                        },
                        default: 12,
                        description: 'חודש תפוגה',
                    },
                    // Cheque fields
                    {
                        displayName: 'Bank Number',
                        name: 'bank',
                        type: 'number',
                        displayOptions: {
                            show: {
                                type: ['4'],
                            },
                        },
                        default: 12,
                        required: true,
                        description: 'מספר בנק',
                    },
                    {
                        displayName: 'Branch Number',
                        name: 'branch',
                        type: 'number',
                        displayOptions: {
                            show: {
                                type: ['4'],
                            },
                        },
                        default: 1,
                        required: true,
                        description: 'מספר סניף',
                    },
                    {
                        displayName: 'Account Number',
                        name: 'account',
                        type: 'string',
                        displayOptions: {
                            show: {
                                type: ['4'],
                            },
                        },
                        default: '',
                        required: true,
                        description: 'מספר חשבון',
                    },
                    {
                        displayName: 'Cheque Number',
                        name: 'cheque_number',
                        type: 'string',
                        displayOptions: {
                            show: {
                                type: ['4'],
                            },
                        },
                        default: '',
                        required: true,
                        description: 'מספר שיק',
                    },
                    // Bank Transfer fields
                    {
                        displayName: 'Bank Account',
                        name: 'bank_account',
                        type: 'string',
                        displayOptions: {
                            show: {
                                type: ['5'],
                            },
                        },
                        default: '',
                        required: true,
                        description: 'מספר חשבון בנק',
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
    const credentials = await this.getCredentials('iCountApi') as any;

    // Build document object
    const docType = this.getNodeParameter('doc_type', index, '320') as string;
    const issueDate = this.getNodeParameter('issue_date', index, '') as string;
    const dueDate = this.getNodeParameter('due_date', index, '') as string;
    const currency = this.getNodeParameter('currency_code', index, 'ILS') as string;
    const lang = this.getNodeParameter('lang', index, 'he') as string;

    // Client
    const useExistingClient = this.getNodeParameter('use_existing_client', index, false) as boolean;
    let clientId = null;
    let client = null;

    if (useExistingClient) {
        clientId = this.getNodeParameter('client_id', index) as string;
    } else {
        client = {
            name: this.getNodeParameter('client_name', index) as string,
            id_number: this.getNodeParameter('client_id_number', index, '') as string,
            email: this.getNodeParameter('client_email', index, '') as string,
            address: this.getNodeParameter('client_address', index, '') as string,
            city: this.getNodeParameter('client_city', index, '') as string,
            phone: this.getNodeParameter('client_phone', index, '') as string,
        };
    }

    // Items
    const itemsInputType = this.getNodeParameter('items_input_type', index, 'manual') as string;
    let items = [];

    if (itemsInputType === 'json') {
        const itemsJson = this.getNodeParameter('items_json', index, '[]') as string;
        const rawItems = typeof itemsJson === 'string' ? JSON.parse(itemsJson) : itemsJson;

        // Convert field names from snake_case to iCount API format
        items = rawItems.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitprice: item.unit_price || item.unitprice, // Support both formats
        }));
    } else {
        const itemsData = this.getNodeParameter('items', index, {}) as any;
        const rawItems = itemsData.item || [];

        // Convert field names for manual input
        items = rawItems.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitprice: item.unit_price, // Convert from unit_price to unitprice
        }));
    }

    // Payments
    const addPayments = this.getNodeParameter('add_payments', index, false) as boolean;
    let payments = [];
    if (addPayments) {
        const paymentsInputType = this.getNodeParameter('payments_input_type', index, 'manual') as string;

        if (paymentsInputType === 'json') {
            const paymentsJson = this.getNodeParameter('payments_json', index, '[]') as string;
            payments = typeof paymentsJson === 'string' ? JSON.parse(paymentsJson) : paymentsJson;
        } else {
            const paymentsData = this.getNodeParameter('payments', index, {}) as any;
            payments = paymentsData.payment || [];
        }
    }

    const comments = this.getNodeParameter('comments', index, '') as string;
    const sendEmail = this.getNodeParameter('send_email', index, false) as boolean;
    const downloadPdf = this.getNodeParameter('download_pdf', index, false) as boolean;

    // Build API request body
    const body: any = {
        doctype: docType,
        lang,
        currency_code: currency,
        items,
    };

    // Add description if provided
    if (comments) {
        body.hwc = comments;
    }

    // Add client information
    if (useExistingClient && clientId) {
        body.client_id = clientId;
    } else if (client && client.name) {
        body.client_name = client.name;
        if (client.id_number) body.vat_id = client.id_number;
        if (client.email) body.email = client.email;
        if (client.address) body.client_address = client.address;
        if (client.city) body.client_city = client.city;
        if (client.phone) body.client_phone = client.phone;
    }

    // Add optional date fields if provided
    if (issueDate) {
        body.doc_date = issueDate;
    }
    if (dueDate) {
        body.duedate = dueDate;
    }

    // Add payments if provided and not empty
    if (payments && payments.length > 0) {
        payments.forEach((payment: any) => {
            if (payment.type === '1') { // Cash
                body.cash = { sum: payment.amount.toString() };
            } else if (payment.type === '3') { // Credit Card
                const numPayments = payment.num_of_payments || 1;
                const firstPayment = numPayments > 1 ? payment.amount.toString() : payment.amount.toString();

                body.cc = {
                    sum: payment.amount.toString(),
                    date: payment.date || new Date().toISOString().split('T')[0],
                    num_of_payments: numPayments,
                    first_payment: firstPayment,
                    card_type: payment.card_type || 'VISA',
                    card_number: payment.card_number || '0000',
                    exp_year: payment.exp_year || (new Date().getFullYear() + 1),
                    exp_month: payment.exp_month || 12,
                    holder_id: payment.holder_id || '000000000',
                    holder_name: payment.holder_name || 'Card Holder',
                    confirmation_code: payment.transaction_id || '000000',
                };
            } else if (payment.type === '4') { // Cheque
                if (!body.cheques) body.cheques = [];
                body.cheques.push({
                    sum: payment.amount.toString(),
                    date: payment.date || new Date().toISOString().split('T')[0],
                    bank: payment.bank || 12,
                    branch: payment.branch || 1,
                    account: payment.account || '1',
                    number: payment.cheque_number || '1',
                });
            } else if (payment.type === '5') { // Bank Transfer
                body.banktransfer = {
                    sum: payment.amount.toString(),
                    date: payment.date || new Date().toISOString().split('T')[0],
                    account: payment.bank_account || '1',
                };
            }
        });
    }

    // Add send email flag
    if (sendEmail) {
        body.send_email = 1;
    }

    // Make API request
    const response = await this.helpers.request({
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/doc/create',
        headers: {
            'Authorization': `Bearer ${credentials.token}`,
            'Content-Type': 'application/json',
        },
        body,
        json: true,
    });

    if (response.status === false) {
        const errorMsg = response.message || response.error || JSON.stringify(response);
        throw new Error(`iCount API Error: ${errorMsg}`);
    }

    const result: any = {
        json: {
            doc_id: response?.data?.doc_id || response?.doc_id,
            doc_number: response?.data?.doc_number || response?.doc_number,
            pdf_url: response?.data?.pdf_link || response?.pdf_link,
            ...(response?.data || response || {}),
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