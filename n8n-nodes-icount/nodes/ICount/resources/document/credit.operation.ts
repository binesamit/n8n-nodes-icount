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

    const body: any = {
        doctype: 'refund', // Credit note
        origin_doc_id: originDocId,
        hwc: comments,
        send_email: sendEmail ? 1 : 0,
    };

    if (creditType === 'partial' && items.length > 0) {
        body.items = items;
    }

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
        throw new Error(`iCount API Error: ${errorMsg}` || 'Failed to create credit note');
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