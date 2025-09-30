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
        client_name: name,
        client_hp: idNumber,
        client_email: email,
        client_address: additionalFields.address || '',
        client_city: additionalFields.city || '',
        client_phone: additionalFields.phone || '',
    };

    // Try to find existing customer
    const searchValue = searchBy === 'id_number' ? idNumber : email;

    const searchBody = {
        [searchBy]: searchValue,
    };

    let customerId = null;

    try {
        const searchResponse = await this.helpers.request({
            method: 'POST',
            url: 'https://api.icount.co.il/api/v3.php/client/find',
            headers: {
                'Authorization': `Bearer ${credentials.token}`,
                'Content-Type': 'application/json',
            },
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

    try {
        if (customerId) {
            // Update existing
            const updateBody = {
                client_id: customerId,
                ...customerData,
            };

            response = await this.helpers.request({
                method: 'POST',
                url: 'https://api.icount.co.il/api/v3.php/client/update',
                headers: {
                    'Authorization': `Bearer ${credentials.token}`,
                    'Content-Type': 'application/json',
                },
                body: updateBody,
                json: true,
            });
        } else {
            // Create new
            const createBody = {
                ...customerData,
            };

            response = await this.helpers.request({
                method: 'POST',
                url: 'https://api.icount.co.il/api/v3.php/client/create',
                headers: {
                    'Authorization': `Bearer ${credentials.token}`,
                    'Content-Type': 'application/json',
                },
                body: createBody,
                json: true,
            });
        }
    } catch (error: any) {
        const errorMessage = error.message || 'Unknown error';
        const errorDetails = error.response?.body || error.response || {};
        throw new Error(`Failed to upsert customer: ${errorMessage}. Details: ${JSON.stringify(errorDetails)}`);
    }

    // iCount API may return response without status field or with different structure
    // Let's check if we got an error or success
    if (response && response.status === false) {
        const errorMsg = response.message || response.error || JSON.stringify(response);
        throw new Error(`iCount API Error: ${errorMsg}`);
    }

    // If we got here, assume success and return the data
    return {
        json: {
            action: customerId ? 'updated' : 'created',
            customer_id: response?.data?.client_id || response?.client_id || customerId,
            ...(response?.data || response || {}),
        },
    };
}