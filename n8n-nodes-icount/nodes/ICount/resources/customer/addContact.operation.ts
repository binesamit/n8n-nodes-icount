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
		displayName: 'Contact Name',
		name: 'contact_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		required: true,
		description: 'שם איש הקשר',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'אימייל',
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
				displayName: 'Position',
				name: 'position',
				type: 'string',
				default: '',
				description: 'תפקיד',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'הערות',
			},
		],
	},
];

export async function executeAddContact(this: any, index: number): Promise<any> {
	const clientId = this.getNodeParameter('client_id', index) as number;
	const contactName = this.getNodeParameter('contact_name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;

	const body: any = {
		client_id: clientId,
		contact_name: contactName,
	};

	// Add optional fields if provided
	if (additionalFields.email) body.email = additionalFields.email;
	if (additionalFields.phone) body.phone = additionalFields.phone;
	if (additionalFields.mobile) body.mobile = additionalFields.mobile;
	if (additionalFields.fax) body.fax = additionalFields.fax;
	if (additionalFields.position) body.position = additionalFields.position;
	if (additionalFields.notes) body.notes = additionalFields.notes;

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
