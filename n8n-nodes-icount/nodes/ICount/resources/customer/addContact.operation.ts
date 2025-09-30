import { INodeProperties } from 'n8n-workflow';

export const customerAddContactDescription: INodeProperties[] = [
	{
		displayName: 'Client ID',
		name: 'client_id',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: 0,
		required: true,
		description: 'מזהה הלקוח',
	},
	{
		displayName: 'First Name',
		name: 'first_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
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
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'שם משפחה',
	},
	{
		displayName: 'Company Name',
		name: 'company_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'שם חברה',
	},
	{
		displayName: 'Contact Type',
		name: 'contact_type',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		options: [
			{ name: 'איש קשר ראשי (Primary)', value: 'PRIMARY' },
			{ name: 'כספים (Billing)', value: 'BILLING' },
			{ name: 'משלוח (Shipping)', value: 'SHIPPING' },
			{ name: 'מנהל (Administrative)', value: 'ADMINISTRATIVE' },
			{ name: 'טכני (Technical)', value: 'TECHNICAL' },
			{ name: 'עובד (Employee)', value: 'EMPLOYEE' },
			{ name: 'מנהל חשבונות (Accountant)', value: 'ACCOUNTANT' },
			{ name: 'עורך דין (Lawyer)', value: 'LAWYER' },
			{ name: 'נותן שירות (Service Provider)', value: 'SERVICE_PROVIDER' },
			{ name: 'ספק (Supplier)', value: 'SUPPLIER' },
		],
		default: 'PRIMARY',
		description: 'סוג איש קשר',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'אימייל',
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
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
				operation: ['addContact'],
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
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'פקס',
	},
	{
		displayName: 'Position',
		name: 'position',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'תפקיד',
	},
	{
		displayName: 'Notes',
		name: 'notes',
		type: 'string',
		typeOptions: { rows: 3 },
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'הערות',
	},
];

export async function executeAddContact(this: any, index: number): Promise<any> {
	const clientId = this.getNodeParameter('client_id', index) as number;
	const firstName = this.getNodeParameter('first_name', index, '') as string;
	const lastName = this.getNodeParameter('last_name', index, '') as string;
	const companyName = this.getNodeParameter('company_name', index, '') as string;
	const contactType = this.getNodeParameter('contact_type', index, 'PRIMARY') as string;
	const email = this.getNodeParameter('email', index, '') as string;
	const phone = this.getNodeParameter('phone', index, '') as string;
	const mobile = this.getNodeParameter('mobile', index, '') as string;
	const fax = this.getNodeParameter('fax', index, '') as string;
	const position = this.getNodeParameter('position', index, '') as string;
	const notes = this.getNodeParameter('notes', index, '') as string;

	const body: any = {
		client_id: clientId,
		contact_type: contactType,
	};

	// Add name fields - at least one is required for display
	if (firstName) body.first_name = firstName;
	if (lastName) body.last_name = lastName;
	if (companyName) body.company_name = companyName;

	// Add optional fields if provided
	if (email) body.email = email;
	if (phone) body.phone = phone;
	if (mobile) body.mobile = mobile;
	if (fax) body.fax = fax;
	if (position) body.position = position;
	if (notes) body.notes = notes;

	const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
		method: 'POST',
		url: 'https://api.icount.co.il/api/v3.php/client/add_contact',
		body,
		json: true,
	});

	if (response.status === false) {
		const errorMsg = response.message || response.error || JSON.stringify(response);
		throw new Error(`iCount API Error: ${errorMsg}`);
	}

	return {
		json: {
			success: true,
			client_id: clientId,
			contact_id: response.data?.contact_id || response.contact_id,
			...response.data || response,
		},
	};
}
