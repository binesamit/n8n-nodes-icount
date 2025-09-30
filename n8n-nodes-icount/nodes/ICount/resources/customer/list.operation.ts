import { INodeProperties } from 'n8n-workflow';

export const customerListDescription: INodeProperties[] = [
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['customer'],
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
                resource: ['customer'],
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
];

export async function executeList(this: any, index: number): Promise<any> {
    const returnAll = this.getNodeParameter('returnAll', index) as boolean;
    let limit = returnAll ? 1000 : this.getNodeParameter('limit', index, 50) as number;

    const body = {
        max_results: limit,
    };

    const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/client/search',
        body,
        json: true,
    });

    if (response.status === false) {
        const errorMsg = response.message || response.error || JSON.stringify(response);
        throw new Error(`iCount API Error: ${errorMsg}`);
    }

    const customers = response.data || [];

    return customers.map((customer: any) => ({ json: customer }));
}