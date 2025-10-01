import { INodeProperties } from 'n8n-workflow';

export const customerDeleteContactDescription: INodeProperties[] = [
	{
		displayName: 'Client ID',
		name: 'client_id',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['deleteContact'],
			},
		},
		default: 0,
		required: true,
		description: 'מזהה הלקוח',
	},
	{
		displayName: 'Contact ID',
		name: 'contact_id',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['deleteContact'],
			},
		},
		default: 0,
		required: true,
		description: 'מזהה איש הקשר למחיקה',
	},
];

export async function executeDeleteContact(this: any, index: number): Promise<any> {
	const clientId = this.getNodeParameter('client_id', index) as number;
	const contactId = this.getNodeParameter('contact_id', index) as number;

	const body = {
		client_id: clientId,
		contact_id: contactId,
	};

	const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
		method: 'POST',
		url: 'https://api.icount.co.il/api/v3.php/client/delete_contact',
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
			contact_id: contactId,
			...response,
		},
	};
}
