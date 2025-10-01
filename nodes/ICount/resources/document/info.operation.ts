import { INodeProperties } from 'n8n-workflow';

export const documentInfoDescription: INodeProperties[] = [
	{
		displayName: 'Document Type',
		name: 'doctype',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['info'],
			},
		},
		options: [
			{ name: 'חשבונית מס (Tax Invoice)', value: 'taxinvoice' },
			{ name: 'חשבונית מס קבלה (Invoice Receipt)', value: 'invoicereceipt' },
			{ name: 'קבלה (Receipt)', value: 'receipt' },
			{ name: 'הצעת מחיר (Price Quote)', value: 'priceQuote' },
			{ name: 'תעודת משלוח (Delivery Note)', value: 'deliveryNote' },
			{ name: 'חשבונית זיכוי (Refund)', value: 'refund' },
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
				operation: ['info'],
			},
		},
		default: 0,
		required: true,
		description: 'מספר המסמך',
	},
	{
		displayName: 'Additional Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['info'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Get Items',
				name: 'get_items',
				type: 'boolean',
				default: true,
				description: 'האם להחזיר פריטים',
			},
			{
				displayName: 'Get Payments',
				name: 'get_payments',
				type: 'boolean',
				default: true,
				description: 'האם להחזיר מידע תשלומים',
			},
			{
				displayName: 'Get Custom Info',
				name: 'get_custom_info',
				type: 'boolean',
				default: true,
				description: 'האם להחזיר שדות מותאמים אישית',
			},
			{
				displayName: 'Get PDF Link',
				name: 'get_pdf_link',
				type: 'boolean',
				default: false,
				description: 'האם להחזיר קישור ישיר ל-PDF',
			},
			{
				displayName: 'Get PayNow Link',
				name: 'get_paynow_link',
				type: 'boolean',
				default: false,
				description: 'האם להחזיר קישור לדף תשלום עצמי',
			},
			{
				displayName: 'Get Conversion Options',
				name: 'get_conversion_options',
				type: 'boolean',
				default: false,
				description: 'האם להחזיר אפשרויות המרה למסמכים אחרים',
			},
			{
				displayName: 'Get Base Doc URL',
				name: 'get_base_doc_url',
				type: 'boolean',
				default: false,
				description: 'האם להחזיר URL של מסמך בסיס',
			},
			{
				displayName: 'Get Doctype Info',
				name: 'get_doctype_info',
				type: 'boolean',
				default: false,
				description: 'האם להחזיר מידע על סוג המסמך',
			},
			{
				displayName: 'Get Autoinvoices',
				name: 'get_autoinvoices',
				type: 'boolean',
				default: false,
				description: 'האם להחזיר חשבוניות אוטומטיות (רק לקבלות)',
			},
			{
				displayName: 'Shortlink',
				name: 'shortlink',
				type: 'boolean',
				default: false,
				description: 'האם להחזיר קישור מקוצר',
			},
			{
				displayName: 'Max Clicks',
				name: 'max_clicks',
				type: 'number',
				default: 30,
				description: 'מספר קליקים מקסימלי לקישור מקוצר',
			},
			{
				displayName: 'Expire Days',
				name: 'expire_days',
				type: 'number',
				default: 30,
				description: 'ימי תפוגה לקישור מקוצר',
			},
			{
				displayName: 'Language',
				name: 'lang',
				type: 'options',
				options: [
					{ name: 'עברית', value: 'he' },
					{ name: 'English', value: 'en' },
				],
				default: 'he',
				description: 'שפה לקישור PDF',
			},
		],
	},
];

export async function executeInfo(this: any, index: number): Promise<any> {
	const credentials = await this.getCredentials('iCountApi');
	const doctype = this.getNodeParameter('doctype', index) as string;
	const docnum = this.getNodeParameter('docnum', index) as number;
	const options = this.getNodeParameter('options', index, {}) as any;

	const body: any = {
		cid: credentials.cid,
		user: credentials.user,
		pass: credentials.pass,
		doctype,
		docnum,
		...options,
	};

	const response = await this.helpers.request({
		method: 'POST',
		url: 'https://api.icount.co.il/api/v3.php/doc/info',
		body,
		json: true,
	});

	if (response.status === false) {
		const errorMsg = response.message || response.error || JSON.stringify(response);
		throw new Error(`iCount API Error: ${errorMsg}`);
	}

	return { json: response.data };
}
