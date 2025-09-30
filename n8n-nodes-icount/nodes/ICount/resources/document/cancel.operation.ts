import { INodeProperties } from 'n8n-workflow';

export const documentCancelDescription: INodeProperties[] = [
	{
		displayName: 'Document Type',
		name: 'doctype',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['cancel'],
			},
		},
		options: [
			{ name: 'חשבונית מס (Invoice)', value: 'invoice' },
			{ name: 'חשבונית מס קבלה (Invoice Receipt)', value: 'invrec' },
			{ name: 'קבלה (Receipt)', value: 'receipt' },
			{ name: 'חשבונית זיכוי (Refund)', value: 'refund' },
			{ name: 'הזמנה (Order)', value: 'order' },
			{ name: 'הצעת מחיר (Offer)', value: 'offer' },
			{ name: 'תעודת משלוח (Delivery)', value: 'delivery' },
		],
		default: 'invoice',
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
				operation: ['cancel'],
			},
		},
		default: 0,
		required: true,
		description: 'מספר המסמך לביטול',
	},
	{
		displayName: 'Refund Credit Card',
		name: 'refund_cc',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['cancel'],
			},
		},
		default: false,
		description: 'ביטול עסקת כרטיס אשראי (יחזיר שגיאה אם אין עסקת אשראי במסמך)',
	},
	{
		displayName: 'Cancellation Reason',
		name: 'reason',
		type: 'string',
		typeOptions: { rows: 3 },
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['cancel'],
			},
		},
		default: '',
		description: 'סיבת הביטול',
	},
];

export async function executeCancel(this: any, index: number): Promise<any> {
	const doctype = this.getNodeParameter('doctype', index) as string;
	const docnum = this.getNodeParameter('docnum', index) as number;
	const refundCc = this.getNodeParameter('refund_cc', index, false) as boolean;
	const reason = this.getNodeParameter('reason', index, '') as string;

	const body: any = {
		doctype,
		docnum,
		refund_cc: refundCc ? 1 : 0,
	};

	if (reason) {
		body.reason = reason;
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
		method: 'POST',
		url: 'https://api.icount.co.il/api/v3.php/doc/cancel',
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
