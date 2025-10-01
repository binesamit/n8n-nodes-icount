import { INodeProperties } from 'n8n-workflow';

export const documentGetDocUrlDescription: INodeProperties[] = [
	{
		displayName: 'Document Type',
		name: 'doctype',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['getDocUrl'],
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
				operation: ['getDocUrl'],
			},
		},
		default: 0,
		required: true,
		description: 'מספר המסמך',
	},
	{
		displayName: 'Language',
		name: 'lang',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['getDocUrl'],
			},
		},
		options: [
			{ name: 'עברית', value: 'he' },
			{ name: 'English', value: 'en' },
		],
		default: 'he',
		required: true,
		description: 'שפת המסמך',
	},
	{
		displayName: 'Original Document',
		name: 'orig',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['getDocUrl'],
			},
		},
		default: true,
		description: 'מקור אם true, עותק אם false',
	},
	{
		displayName: 'Hide ILS Prices',
		name: 'hidenis',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['getDocUrl'],
			},
		},
		default: false,
		description: 'הסתרת מחירי שקלים (רק למסמכים במטבע זר)',
	},
	{
		displayName: 'Document Language',
		name: 'doc_lang',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['getDocUrl'],
			},
		},
		options: [
			{ name: 'עברית', value: 'he' },
			{ name: 'English', value: 'en' },
		],
		default: '',
		description: 'שפת גרסת המסמך (אם לא מועבר, ישתמש בשפת ה-API)',
	},
	{
		displayName: 'Email To',
		name: 'email_to',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['getDocUrl'],
			},
		},
		default: '',
		description: 'כתובת מייל של הנמען (למעקב)',
	},
];

export async function executeGetDocUrl(this: any, index: number): Promise<any> {
	const doctype = this.getNodeParameter('doctype', index) as string;
	const docnum = this.getNodeParameter('docnum', index) as number;
	const lang = this.getNodeParameter('lang', index) as string;
	const orig = this.getNodeParameter('orig', index, true) as boolean;
	const hidenis = this.getNodeParameter('hidenis', index, false) as boolean;
	const docLang = this.getNodeParameter('doc_lang', index, '') as string;
	const emailTo = this.getNodeParameter('email_to', index, '') as string;

	const body: any = {
		doctype,
		docnum,
		lang,
		orig,
		hidenis,
	};

	if (docLang) {
		body.doc_lang = docLang;
	}

	if (emailTo) {
		body.email_to = emailTo;
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
		method: 'POST',
		url: 'https://api.icount.co.il/api/v3.php/doc/get_doc_url',
		body,
		json: true,
	});

	if (response.status === false) {
		const errorMsg = response.message || response.error || JSON.stringify(response);
		throw new Error(`iCount API Error: ${errorMsg}`);
	}

	return {
		json: {
			doctype,
			docnum,
			url: response.url,
			...response,
		},
	};
}
