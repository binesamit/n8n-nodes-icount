import { INodeProperties } from 'n8n-workflow';

export const customerDeleteDescription: INodeProperties[] = [
	{
		displayName: 'Client ID',
		name: 'client_id',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['delete'],
			},
		},
		default: 0,
		required: true,
		description: 'מזהה הלקוח למחיקה',
	},
];

export async function executeDelete(this: any, index: number): Promise<any> {
	const clientId = this.getNodeParameter('client_id', index) as number;

	const body = {
		client_id: clientId,
	};

	const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
		method: 'POST',
		url: 'https://api.icount.co.il/api/v3.php/client/delete',
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
			...response,
		},
	};
}
