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
        ],
    },
];

export async function executeUpdate(this: any, index: number): Promise<any> {
    const credentials = await this.getCredentials('iCountApi');
    const docId = this.getNodeParameter('doc_id', index) as string;
    const updateFields = this.getNodeParameter('updateFields', index, {}) as any;

    const body = {
        cid: credentials.cid,
        user: credentials.token,
        pass: '',
        doc_id: docId,
        ...updateFields,
    };

    const response = await this.helpers.request({
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/doc/update',
        headers: {
            'Authorization': `Bearer ${credentials.token}`,
            'Content-Type': 'application/json',
        },
        body,
        json: true,
    });

    if (response.status === false) {
        const errorMsg = response.message || response.error || JSON.stringify(response);
        throw new Error(`iCount API Error: ${errorMsg}` || 'Failed to update document');
    }

    return { json: response.data };
}