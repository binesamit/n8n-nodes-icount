import { INodeProperties } from 'n8n-workflow';

export const customerGetDescription: INodeProperties[] = [
    {
        displayName: 'Client ID',
        name: 'client_id',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['get'],
            },
        },
        default: '',
        required: true,
        description: 'מזהה הלקוח ב-iCount',
    },
];

export async function executeGet(this: any, index: number): Promise<any> {
    const clientId = this.getNodeParameter('client_id', index) as string;

    const body = {
        client_id: parseInt(clientId, 10),
    };

    const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/client/info',
        body,
        json: true,
    });

    if (response.status === false) {
        const errorMsg = response.message || response.error || JSON.stringify(response);
        throw new Error(`iCount API Error: ${errorMsg}`);
    }

    return { json: response.data || response };
}