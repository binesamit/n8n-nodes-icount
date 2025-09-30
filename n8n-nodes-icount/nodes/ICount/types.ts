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