import { INodeProperties } from 'n8n-workflow';

export const customerGetOpenDocsDescription: INodeProperties[] = [
	{
		displayName: 'Client ID (Optional)',
		name: 'client_id',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['getOpenDocs'],
			},
		},
		default: '',
		description: 'מזהה לקוח ספציפי (אם ריק - יחזיר לכל הלקוחות)',
	},
	{
		displayName: 'Additional Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['getOpenDocs'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Document Type',
				name: 'doctype',
				type: 'options',
				options: [
					{ name: 'חשבונית מס קבלה (Invoice Receipt)', value: 'invrec' },
					{ name: 'חשבונית מס (Tax Invoice)', value: 'invoice' },
					{ name: 'קבלה (Receipt)', value: 'receipt' },
					{ name: 'חשבונית זיכוי (Refund)', value: 'refund' },
					{ name: 'חשבון עסקה (Deal)', value: 'deal' },
				],
				default: '',
				description: 'סוג מסמך לסינון',
			},
			{
				displayName: 'Get Items',
				name: 'get_items',
				type: 'boolean',
				default: false,
				description: 'האם להחזיר גם פריטים של כל מסמך',
			},
			{
				displayName: 'Client Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'סינון לפי מייל לקוח',
			},
			{
				displayName: 'Client Name',
				name: 'client_name',
				type: 'string',
				default: '',
				description: 'סינון לפי שם לקוח',
			},
		],
	},
];

export async function executeGetOpenDocs(this: any, index: number): Promise<any> {
	const clientId = this.getNodeParameter('client_id', index, '') as string;
	const options = this.getNodeParameter('options', index, {}) as any;

	const body: any = {
		...options,
	};

	if (clientId) {
		body.client_id = parseInt(clientId, 10);
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
		method: 'POST',
		url: 'https://api.icount.co.il/api/v3.php/client/get_open_docs',
		body,
		json: true,
	});

	if (response.status === false) {
		const errorMsg = response.message || response.error || JSON.stringify(response);
		throw new Error(`iCount API Error: ${errorMsg}`);
	}

	const docs = response.data || response || [];

	return Array.isArray(docs) ? docs.map((doc: any) => ({ json: doc })) : [{ json: docs }];
}
