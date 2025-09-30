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
        url: 'https://api.icount.co.il/api/v3.php/doc/get',
        body,
        json: true,
    });

    if (response.status === false) {
        const errorMsg = response.message || response.error || JSON.stringify(response);
        throw new Error(`iCount API Error: ${errorMsg}`);
    }

    return { json: response.data };
}