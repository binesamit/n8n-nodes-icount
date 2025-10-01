import { INodeProperties } from 'n8n-workflow';

export const customerUpsertDescription: INodeProperties[] = [
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
        displayName: 'First Name',
        name: 'first_name',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'שם פרטי',
    },
    {
        displayName: 'Last Name',
        name: 'last_name',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'שם משפחה',
    },
    {
        displayName: 'VAT ID',
        name: 'vat_id',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'מספר עוסק מורשה',
    },
    {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'טלפון',
    },
    {
        displayName: 'Mobile',
        name: 'mobile',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'נייד',
    },
    {
        displayName: 'Fax',
        name: 'fax',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'פקס',
    },
    {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'כתובת',
    },
    {
        displayName: 'City',
        name: 'city',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'עיר',
    },
    {
        displayName: 'Business Country',
        name: 'bus_country',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'מדינה - כתובת עסק',
    },
    {
        displayName: 'Business State',
        name: 'bus_state',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'מחוז/אזור - כתובת עסק',
    },
    {
        displayName: 'Business City',
        name: 'bus_city',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'עיר - כתובת עסק',
    },
    {
        displayName: 'Business ZIP',
        name: 'bus_zip',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'מיקוד - כתובת עסק',
    },
    {
        displayName: 'Business Street',
        name: 'bus_street',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'רחוב - כתובת עסק',
    },
    {
        displayName: 'Business Street Number',
        name: 'bus_no',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'מספר בית - כתובת עסק',
    },
    {
        displayName: 'Home Country',
        name: 'home_country',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'מדינה - כתובת מגורים',
    },
    {
        displayName: 'Home State',
        name: 'home_state',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'מחוז/אזור - כתובת מגורים',
    },
    {
        displayName: 'Home City',
        name: 'home_city',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'עיר - כתובת מגורים',
    },
    {
        displayName: 'Home ZIP',
        name: 'home_zip',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'מיקוד - כתובת מגורים',
    },
    {
        displayName: 'Home Street',
        name: 'home_street',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'רחוב - כתובת מגורים',
    },
    {
        displayName: 'Home Street Number',
        name: 'home_no',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'מספר בית - כתובת מגורים',
    },
    {
        displayName: 'Bank',
        name: 'bank',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getBanks',
        },
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'בנק',
    },
    {
        displayName: 'Branch',
        name: 'branch',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'סניף',
    },
    {
        displayName: 'Account',
        name: 'account',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'חשבון',
    },
    {
        displayName: 'Foreign Account',
        name: 'faccount',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'חשבון זר',
    },
    {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        typeOptions: { rows: 3 },
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'הערות',
    },
    {
        displayName: 'Digital Signature',
        name: 'digsig',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'חתימה דיגיטלית',
    },
    {
        displayName: 'Custom Client ID',
        name: 'custom_client_id',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'מזהה לקוח מותאם אישית',
    },
    {
        displayName: 'Custom Info',
        name: 'custom_info',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'מידע מותאם אישית',
    },
    {
        displayName: 'Employee Assigned',
        name: 'employee_assigned',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getUsers',
        },
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'משויך ל',
    },
    {
        displayName: 'Client Type',
        name: 'client_type_id',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getClientTypes',
        },
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'סוג לקוח',
    },
    {
        displayName: 'Client Type Name',
        name: 'client_type_name',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: '',
        description: 'שם סוג לקוח',
    },
    {
        displayName: 'Payment Terms',
        name: 'payment_terms',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: 0,
        description: 'תנאי תשלום (מספר ימים)',
    },
    {
        displayName: 'Client Type Discount',
        name: 'client_type_discount',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['upsert'],
            },
        },
        default: 0,
        description: 'הנחת סוג לקוח (%)',
    },
];

export async function executeUpsert(this: any, index: number): Promise<any> {
    const credentials = await this.getCredentials('iCountApi');
    const name = this.getNodeParameter('name', index) as string;
    const idNumber = this.getNodeParameter('id_number', index, '') as string;
    const email = this.getNodeParameter('email', index, '') as string;

    // Get all fields directly as parameters (no more additionalFields)
    const firstName = this.getNodeParameter('first_name', index, '') as string;
    const lastName = this.getNodeParameter('last_name', index, '') as string;
    const vatId = this.getNodeParameter('vat_id', index, '') as string;
    const phone = this.getNodeParameter('phone', index, '') as string;
    const mobile = this.getNodeParameter('mobile', index, '') as string;
    const fax = this.getNodeParameter('fax', index, '') as string;
    const address = this.getNodeParameter('address', index, '') as string;
    const city = this.getNodeParameter('city', index, '') as string;
    const busCountry = this.getNodeParameter('bus_country', index, '') as string;
    const busState = this.getNodeParameter('bus_state', index, '') as string;
    const busCity = this.getNodeParameter('bus_city', index, '') as string;
    const busZip = this.getNodeParameter('bus_zip', index, '') as string;
    const busStreet = this.getNodeParameter('bus_street', index, '') as string;
    const busNo = this.getNodeParameter('bus_no', index, '') as string;
    const homeCountry = this.getNodeParameter('home_country', index, '') as string;
    const homeState = this.getNodeParameter('home_state', index, '') as string;
    const homeCity = this.getNodeParameter('home_city', index, '') as string;
    const homeZip = this.getNodeParameter('home_zip', index, '') as string;
    const homeStreet = this.getNodeParameter('home_street', index, '') as string;
    const homeNo = this.getNodeParameter('home_no', index, '') as string;
    const bank = this.getNodeParameter('bank', index, '') as string;
    const branch = this.getNodeParameter('branch', index, '') as string;
    const account = this.getNodeParameter('account', index, '') as string;
    const faccount = this.getNodeParameter('faccount', index, '') as string;
    const notes = this.getNodeParameter('notes', index, '') as string;
    const digsig = this.getNodeParameter('digsig', index, '') as string;
    const customClientId = this.getNodeParameter('custom_client_id', index, '') as string;
    const customInfo = this.getNodeParameter('custom_info', index, '') as string;
    const employeeAssigned = this.getNodeParameter('employee_assigned', index, '') as string;
    const clientTypeId = this.getNodeParameter('client_type_id', index, '') as string;
    const clientTypeName = this.getNodeParameter('client_type_name', index, '') as string;
    const paymentTerms = this.getNodeParameter('payment_terms', index, 0) as number;
    const clientTypeDiscount = this.getNodeParameter('client_type_discount', index, 0) as number;

    const customerData: any = {
        client_name: name,
    };

    // Add required fields only if provided - try both with and without client_ prefix
    if (idNumber) {
        customerData.hp = idNumber;
        customerData.vat_id = idNumber;
    }
    if (email) {
        customerData.client_email = email;
        customerData.email = email;
    }

    // Add all other fields if provided
    if (firstName) customerData.first_name = firstName;
    if (lastName) customerData.last_name = lastName;
    if (vatId) customerData.vat_id = vatId;
    if (phone) {
        customerData.client_phone = phone;
        customerData.phone = phone;
    }
    if (mobile) customerData.mobile = mobile;
    if (fax) customerData.fax = fax;
    if (address) {
        customerData.client_address = address;
        customerData.address = address;
    }
    if (city) {
        customerData.client_city = city;
        customerData.city = city;
    }
    if (busCountry) customerData.bus_country = busCountry;
    if (busState) customerData.bus_state = busState;
    if (busCity) customerData.bus_city = busCity;
    if (busZip) customerData.bus_zip = busZip;
    if (busStreet) customerData.bus_street = busStreet;
    if (busNo) customerData.bus_no = busNo;
    if (homeCountry) customerData.home_country = homeCountry;
    if (homeState) customerData.home_state = homeState;
    if (homeCity) customerData.home_city = homeCity;
    if (homeZip) customerData.home_zip = homeZip;
    if (homeStreet) customerData.home_street = homeStreet;
    if (homeNo) customerData.home_no = homeNo;
    if (bank) customerData.bank = bank;
    if (branch) customerData.branch = branch;
    if (account) customerData.account = account;
    if (faccount) customerData.faccount = faccount;
    if (notes) customerData.notes = notes;
    if (digsig) customerData.digsig = digsig;
    if (customClientId) customerData.custom_client_id = customClientId;
    if (customInfo) customerData.custom_info = customInfo;
    if (employeeAssigned) customerData.employee_assigned = employeeAssigned;
    if (clientTypeId) customerData.client_type_id = clientTypeId;
    if (clientTypeName) customerData.client_type_name = clientTypeName;
    if (paymentTerms) customerData.payment_terms = paymentTerms;
    if (clientTypeDiscount) customerData.client_type_discount = clientTypeDiscount;

    // Try to find existing customer by HP or email to get client_id
    let existingClientId = null;

    // Search by HP first if provided
    if (idNumber) {
        try {
            const searchResponse = await this.helpers.request({
                method: 'POST',
                url: 'https://api.icount.co.il/api/v3.php/client/find',
                headers: {
                    'Authorization': `Bearer ${credentials.token}`,
                    'Content-Type': 'application/json',
                },
                body: { hp: idNumber },
                json: true,
            });

            if (searchResponse?.status && searchResponse?.data?.client_id) {
                existingClientId = searchResponse.data.client_id;
            }
        } catch (error) {
            // Not found by HP, continue
        }
    }

    // If not found by HP, try email
    if (!existingClientId && email) {
        try {
            const searchResponse = await this.helpers.request({
                method: 'POST',
                url: 'https://api.icount.co.il/api/v3.php/client/find',
                headers: {
                    'Authorization': `Bearer ${credentials.token}`,
                    'Content-Type': 'application/json',
                },
                body: { email: email },
                json: true,
            });

            if (searchResponse?.status && searchResponse?.data?.client_id) {
                existingClientId = searchResponse.data.client_id;
            }
        } catch (error) {
            // Not found by email either, will create new
        }
    }

    // Use create_or_update endpoint with client_id if found
    const body = {
        ...customerData,
        ...(existingClientId ? { client_id: existingClientId } : {}),
    };

    let response;

    try {
        response = await this.helpers.request({
            method: 'POST',
            url: 'https://api.icount.co.il/api/v3.php/client/create_or_update',
            headers: {
                'Authorization': `Bearer ${credentials.token}`,
                'Content-Type': 'application/json',
            },
            body,
            json: true,
        });
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
            action: 'upserted',
            customer_id: response?.data?.client_id || response?.client_id,
            ...(response?.data || response || {}),
        },
    };
}