import { INodeProperties } from 'n8n-workflow';

export const documentCloseDescription: INodeProperties[] = [
	{
		displayName: 'Document Type',
		name: 'doctype',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['close'],
			},
		},
		options: [
			{ name: 'חשבונית מס (Tax Invoice)', value: 'taxinvoice' },
			{ name: 'חשבונית מס קבלה (Invoice Receipt)', value: 'invoicereceipt' },
			{ name: 'קבלה (Receipt)', value: 'receipt' },
			{ name: 'הצעת מחיר (Price Quote)', value: 'priceQuote' },
			{ name: 'תעודת משלוח (Delivery Note)', value: 'deliveryNote' },
		],
		default: 'taxinvoice',
		required: true,
		description: 'סוג המסמך',
	},
	{
		displayName: 'Document Number',
		name: 'docnum',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['close'],
			},
		},
		default: 0,
		required: true,
		description: 'מספר המסמך לסגירה',
	},
	{
		displayName: 'Based On Documents',
		name: 'based_on',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['close'],
			},
		},
		default: '',
		description: 'רשימת מסמכי בסיס (JSON array)',
		placeholder: '[{"doctype": "priceQuote", "docnum": 123}]',
	},
];

export async function executeClose(this: any, index: number): Promise<any> {
	const doctype = this.getNodeParameter('doctype', index) as string;
	const docnum = this.getNodeParameter('docnum', index) as number;
	const basedOnStr = this.getNodeParameter('based_on', index, '') as string;

	const body: any = {
		doctype,
		docnum,
	};

	if (basedOnStr) {
		try {
			body.based_on = JSON.parse(basedOnStr);
		} catch (error) {
			throw new Error('Invalid JSON format for based_on parameter');
		}
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
		method: 'POST',
		url: 'https://api.icount.co.il/api/v3.php/doc/close',
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
			doctype,
			docnum,
			...response,
		},
	};
}
