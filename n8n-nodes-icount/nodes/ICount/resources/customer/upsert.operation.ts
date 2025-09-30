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
                displayName: 'First Name',
                name: 'first_name',
                type: 'string',
                default: '',
                description: 'שם פרטי',
            },
            {
                displayName: 'Last Name',
                name: 'last_name',
                type: 'string',
                default: '',
                description: 'שם משפחה',
            },
            {
                displayName: 'VAT ID',
                name: 'vat_id',
                type: 'string',
                default: '',
                description: 'מספר עוסק מורשה',
            },
            {
                displayName: 'Phone',
                name: 'phone',
                type: 'string',
                default: '',
                description: 'טלפון',
            },
            {
                displayName: 'Mobile',
                name: 'mobile',
                type: 'string',
                default: '',
                description: 'נייד',
            },
            {
                displayName: 'Fax',
                name: 'fax',
                type: 'string',
                default: '',
                description: 'פקס',
            },
            {
                displayName: 'Address',
                name: 'address',
                type: 'string',
                default: '',
                description: 'כתובת (שדה כללי)',
            },
            {
                displayName: 'City',
                name: 'city',
                type: 'string',
                default: '',
                description: 'עיר (שדה כללי)',
            },
            {
                displayName: 'Business Country',
                name: 'bus_country',
                type: 'string',
                default: '',
                description: 'מדינה - כתובת עסק',
            },
            {
                displayName: 'Business State',
                name: 'bus_state',
                type: 'string',
                default: '',
                description: 'מחוז/אזור - כתובת עסק',
            },
            {
                displayName: 'Business City',
                name: 'bus_city',
                type: 'string',
                default: '',
                description: 'עיר - כתובת עסק',
            },
            {
                displayName: 'Business ZIP',
                name: 'bus_zip',
                type: 'string',
                default: '',
                description: 'מיקוד - כתובת עסק',
            },
            {
                displayName: 'Business Street',
                name: 'bus_street',
                type: 'string',
                default: '',
                description: 'רחוב - כתובת עסק',
            },
            {
                displayName: 'Business Street Number',
                name: 'bus_no',
                type: 'string',
                default: '',
                description: 'מספר בית - כתובת עסק',
            },
            {
                displayName: 'Home Country',
                name: 'home_country',
                type: 'string',
                default: '',
                description: 'מדינה - כתובת מגורים',
            },
            {
                displayName: 'Home State',
                name: 'home_state',
                type: 'string',
                default: '',
                description: 'מחוז/אזור - כתובת מגורים',
            },
            {
                displayName: 'Home City',
                name: 'home_city',
                type: 'string',
                default: '',
                description: 'עיר - כתובת מגורים',
            },
            {
                displayName: 'Home ZIP',
                name: 'home_zip',
                type: 'string',
                default: '',
                description: 'מיקוד - כתובת מגורים',
            },
            {
                displayName: 'Home Street',
                name: 'home_street',
                type: 'string',
                default: '',
                description: 'רחוב - כתובת מגורים',
            },
            {
                displayName: 'Home Street Number',
                name: 'home_no',
                type: 'string',
                default: '',
                description: 'מספר בית - כתובת מגורים',
            },
            {
                displayName: 'Bank',
                name: 'bank',
                type: 'string',
                default: '',
                description: 'בנק',
            },
            {
                displayName: 'Branch',
                name: 'branch',
                type: 'string',
                default: '',
                description: 'סניף',
            },
            {
                displayName: 'Account',
                name: 'account',
                type: 'string',
                default: '',
                description: 'חשבון',
            },
            {
                displayName: 'Foreign Account',
                name: 'faccount',
                type: 'string',
                default: '',
                description: 'חשבון זר',
            },
            {
                displayName: 'Notes',
                name: 'notes',
                type: 'string',
                typeOptions: { rows: 3 },
                default: '',
                description: 'הערות',
            },
            {
                displayName: 'Digital Signature',
                name: 'digsig',
                type: 'string',
                default: '',
                description: 'חתימה דיגיטלית',
            },
            {
                displayName: 'Custom Client ID',
                name: 'custom_client_id',
                type: 'string',
                default: '',
                description: 'מזהה לקוח מותאם אישית',
            },
            {
                displayName: 'Custom Info',
                name: 'custom_info',
                type: 'string',
                default: '',
                description: 'מידע מותאם אישית',
            },
            {
                displayName: 'Employee Assigned',
                name: 'employee_assigned',
                type: 'number',
                default: 0,
                description: 'מספר עובד מוקצה',
            },
            {
                displayName: 'Client Type ID',
                name: 'client_type_id',
                type: 'number',
                default: 0,
                description: 'מזהה סוג לקוח',
            },
            {
                displayName: 'Client Type Name',
                name: 'client_type_name',
                type: 'string',
                default: '',
                description: 'שם סוג לקוח',
            },
            {
                displayName: 'Payment Terms',
                name: 'payment_terms',
                type: 'number',
                default: 0,
                description: 'תנאי תשלום (מספר ימים)',
            },
            {
                displayName: 'Client Type Discount',
                name: 'client_type_discount',
                type: 'number',
                default: 0,
                description: 'הנחת סוג לקוח (%)',
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

    const customerData: any = {
        client_name: name,
        client_hp: idNumber,
        client_email: email,
    };

    // Add all additional fields if provided
    if (additionalFields.first_name) customerData.first_name = additionalFields.first_name;
    if (additionalFields.last_name) customerData.last_name = additionalFields.last_name;
    if (additionalFields.vat_id) customerData.vat_id = additionalFields.vat_id;
    if (additionalFields.phone) customerData.client_phone = additionalFields.phone;
    if (additionalFields.mobile) customerData.mobile = additionalFields.mobile;
    if (additionalFields.fax) customerData.fax = additionalFields.fax;
    if (additionalFields.address) customerData.client_address = additionalFields.address;
    if (additionalFields.city) customerData.client_city = additionalFields.city;
    if (additionalFields.bus_country) customerData.bus_country = additionalFields.bus_country;
    if (additionalFields.bus_state) customerData.bus_state = additionalFields.bus_state;
    if (additionalFields.bus_city) customerData.bus_city = additionalFields.bus_city;
    if (additionalFields.bus_zip) customerData.bus_zip = additionalFields.bus_zip;
    if (additionalFields.bus_street) customerData.bus_street = additionalFields.bus_street;
    if (additionalFields.bus_no) customerData.bus_no = additionalFields.bus_no;
    if (additionalFields.home_country) customerData.home_country = additionalFields.home_country;
    if (additionalFields.home_state) customerData.home_state = additionalFields.home_state;
    if (additionalFields.home_city) customerData.home_city = additionalFields.home_city;
    if (additionalFields.home_zip) customerData.home_zip = additionalFields.home_zip;
    if (additionalFields.home_street) customerData.home_street = additionalFields.home_street;
    if (additionalFields.home_no) customerData.home_no = additionalFields.home_no;
    if (additionalFields.bank) customerData.bank = additionalFields.bank;
    if (additionalFields.branch) customerData.branch = additionalFields.branch;
    if (additionalFields.account) customerData.account = additionalFields.account;
    if (additionalFields.faccount) customerData.faccount = additionalFields.faccount;
    if (additionalFields.notes) customerData.notes = additionalFields.notes;
    if (additionalFields.digsig) customerData.digsig = additionalFields.digsig;
    if (additionalFields.custom_client_id) customerData.custom_client_id = additionalFields.custom_client_id;
    if (additionalFields.custom_info) customerData.custom_info = additionalFields.custom_info;
    if (additionalFields.employee_assigned) customerData.employee_assigned = additionalFields.employee_assigned;
    if (additionalFields.client_type_id) customerData.client_type_id = additionalFields.client_type_id;
    if (additionalFields.client_type_name) customerData.client_type_name = additionalFields.client_type_name;
    if (additionalFields.payment_terms) customerData.payment_terms = additionalFields.payment_terms;
    if (additionalFields.client_type_discount) customerData.client_type_discount = additionalFields.client_type_discount;

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