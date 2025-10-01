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
        detail_level: 10, // Full details
    };

    const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/client/get_list',
        body,
        json: true,
    });

    if (response.status === false) {
        const errorMsg = response.message || response.error || JSON.stringify(response);
        throw new Error(`iCount API Error: ${errorMsg}`);
    }

    // Try different response structures
    let customersData = response.data?.data || response.data || response.clients || response;

    let customers: any[] = [];

    // Check if it's already an array
    if (Array.isArray(customersData)) {
        customers = customersData;
    }
    // If it's an object (like { "123": {...}, "456": {...} }), convert to array
    else if (customersData && typeof customersData === 'object') {
        customers = Object.values(customersData).filter(item =>
            item && typeof item === 'object' && !Array.isArray(item)
        );
    }

    // If still empty, check if we need to return the response as-is for debugging
    if (customers.length === 0 && response) {
        // Return the full response for debugging
        return [{ json: { debug: 'No customers found', response: response } }];
    }

    // Limit results if needed
    if (!returnAll) {
        customers = customers.slice(0, limit);
    }

    return customers.map((customer: any) => ({ json: customer }));
}