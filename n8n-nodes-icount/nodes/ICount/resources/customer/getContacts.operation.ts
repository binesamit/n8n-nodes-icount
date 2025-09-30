import { INodeProperties } from 'n8n-workflow';

export const customerGetContactsDescription: INodeProperties[] = [
	{
		displayName: 'Client ID',
		name: 'client_id',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['getContacts'],
			},
		},
		default: 0,
		required: true,
		description: 'מזהה הלקוח',
	},
];

export async function executeGetContacts(this: any, index: number): Promise<any> {
	const clientId = this.getNodeParameter('client_id', index) as number;

	const body = {
		client_id: clientId,
	};

	const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
		method: 'POST',
		url: 'https://api.icount.co.il/api/v3.php/client/get_contacts',
		body,
		json: true,
	});

	if (response.status === false) {
		const errorMsg = response.message || response.error || JSON.stringify(response);
		throw new Error(`iCount API Error: ${errorMsg}`);
	}

	let contacts = response.data || response.contacts || [];

	// Ensure it's an array
	if (!Array.isArray(contacts)) {
		contacts = [];
	}

	// If still empty, return debug info
	if (contacts.length === 0 && response) {
		return [{ json: { debug: 'No contacts found', response: response } }];
	}

	return contacts.map((contact: any) => ({ json: contact }));
}
