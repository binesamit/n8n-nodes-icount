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
            {
                displayName: 'Combine All Items',
                name: 'combineAllItems',
                type: 'boolean',
                default: false,
                description: 'Whether to return all documents in a single item (ON) or each document as a separate item (OFF)',
            },
        ],
    },
];

export async function executeList(this: any, index: number): Promise<any> {
    const credentials = await this.getCredentials('iCountApi');
    const returnAll = this.getNodeParameter('returnAll', index) as boolean;
    const filters = this.getNodeParameter('filters', index, {}) as any;
    const combineAllItems = filters.combineAllItems || false;

    // Remove combineAllItems from filters before sending to API
    const { combineAllItems: _, ...apiFilters } = filters;

    const body: any = {
        cid: credentials.cid,
        user: credentials.user,
        pass: credentials.pass,
        ...apiFilters,
    };

    if (!returnAll) {
        body.limit = this.getNodeParameter('limit', index, 50) as number;
    }

    const response = await this.helpers.request({
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/doc/list',
        body,
        json: true,
    });

    if (response.status === false) {
        const errorMsg = response.message || response.error || JSON.stringify(response);
        throw new Error(`iCount API Error: ${errorMsg}`);
    }

    // Try different response structures
    let documentsData = response.data?.documents || response.documents || response.data || response;

    let documents: any[] = [];

    // Check if it's already an array
    if (Array.isArray(documentsData)) {
        documents = documentsData;
    }
    // If it's an object (like { "123": {...}, "456": {...} }), convert to array
    else if (documentsData && typeof documentsData === 'object') {
        documents = Object.values(documentsData).filter(item =>
            item && typeof item === 'object' && !Array.isArray(item)
        );
    }

    // If combineAllItems is enabled, return all documents in a single item
    if (combineAllItems) {
        return [{ json: { documents: documents } }];
    }

    // Otherwise, return each document as a separate item
    return documents.map((doc: any) => ({ json: doc }));
}