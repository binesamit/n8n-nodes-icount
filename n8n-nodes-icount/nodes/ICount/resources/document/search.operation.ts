import { INodeProperties } from 'n8n-workflow';

export const documentSearchDescription: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['search'],
			},
		},
		default: false,
		description: 'האם להחזיר את כל התוצאות',
	},
	{
		displayName: 'Max Results',
		name: 'max_results',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['search'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 0,
			maxValue: 1000,
		},
		default: 100,
		description: 'מספר מקסימלי של תוצאות (0-1000)',
	},
	{
		displayName: 'Detail Level',
		name: 'detail_level',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['search'],
			},
		},
		options: [
			{ name: 'Basic (doctype+docnum)', value: 0 },
			{ name: 'Standard (+ date, client, total)', value: 1 },
			{ name: 'Detailed (+ client details, totals)', value: 2 },
			{ name: 'Extended (+ employee, income type)', value: 3 },
			{ name: 'Full (+ foreign currency)', value: 4 },
			{ name: 'Complete (Everything)', value: 10 },
		],
		default: 1,
		description: 'רמת פירוט המידע',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['search'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Client ID',
				name: 'client_id',
				type: 'number',
				default: 0,
				description: 'מזהה לקוח',
			},
			{
				displayName: 'Client Name',
				name: 'client_name',
				type: 'string',
				default: '',
				description: 'שם לקוח',
			},
			{
				displayName: 'Client Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'כתובת מייל של לקוח',
			},
			{
				displayName: 'VAT ID',
				name: 'vat_id',
				type: 'string',
				default: '',
				description: 'ח.פ / ע.מ',
			},
			{
				displayName: 'Document Type',
				name: 'doctype',
				type: 'options',
				options: [
					{ name: 'חשבונית מס (Invoice)', value: 'invoice' },
					{ name: 'חשבונית מס קבלה (Invoice Receipt)', value: 'invrec' },
					{ name: 'קבלה (Receipt)', value: 'receipt' },
					{ name: 'חשבונית זיכוי (Refund)', value: 'refund' },
					{ name: 'הזמנה (Order)', value: 'order' },
					{ name: 'הצעת מחיר (Offer)', value: 'offer' },
					{ name: 'תעודת משלוח (Delivery)', value: 'delivery' },
					{ name: 'עסקה (Deal)', value: 'deal' },
				],
				default: '',
				description: 'סוג מסמך',
			},
			{
				displayName: 'Document Number',
				name: 'docnum',
				type: 'number',
				default: 0,
				description: 'מספר מסמך',
			},
			{
				displayName: 'Document Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'פתוח (Open)', value: 0 },
					{ name: 'סגור (Closed)', value: 1 },
					{ name: 'סגור חלקית (Partially Closed)', value: 2 },
				],
				default: 0,
				description: 'סטטוס מסמך',
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
				description: 'תאריך התחלה',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
				description: 'תאריך סיום',
			},
			{
				displayName: 'Due Date (Start)',
				name: 'start_duedate',
				type: 'dateTime',
				default: '',
				description: 'תאריך יעד - התחלה',
			},
			{
				displayName: 'Due Date (End)',
				name: 'end_duedate',
				type: 'dateTime',
				default: '',
				description: 'תאריך יעד - סיום',
			},
			{
				displayName: 'Sort Field',
				name: 'sort_field',
				type: 'options',
				options: [
					{ name: 'תאריך הנפקה', value: 'dateissued' },
					{ name: 'זמן הנפקה', value: 'timeissued' },
					{ name: 'מספר מסמך', value: 'docnum' },
					{ name: 'תאריך תשלום', value: 'paydate' },
					{ name: 'שם לקוח', value: 'client_name' },
				],
				default: 'dateissued',
				description: 'שדה למיון',
			},
			{
				displayName: 'Sort Order',
				name: 'sort_order',
				type: 'options',
				options: [
					{ name: 'עולה (ASC)', value: 'ASC' },
					{ name: 'יורד (DESC)', value: 'DESC' },
				],
				default: 'ASC',
				description: 'כיוון מיון',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				description: 'דילוג על תוצאות (pagination)',
			},
			{
				displayName: 'Get Base Documents',
				name: 'get_base_docs',
				type: 'boolean',
				default: false,
				description: 'האם להחזיר גם מסמכי בסיס',
			},
		],
	},
];

export async function executeSearch(this: any, index: number): Promise<any> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const detailLevel = this.getNodeParameter('detail_level', index, 1) as number;
	const filters = this.getNodeParameter('filters', index, {}) as any;

	const body: any = {
		detail_level: detailLevel,
		...filters,
	};

	if (!returnAll) {
		body.max_results = this.getNodeParameter('max_results', index, 100) as number;
	} else {
		body.max_results = 1000;
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
		method: 'POST',
		url: 'https://api.icount.co.il/api/v3.php/doc/search',
		body,
		json: true,
	});

	if (response.status === false) {
		const errorMsg = response.message || response.error || JSON.stringify(response);
		throw new Error(`iCount API Error: ${errorMsg}`);
	}

	const documents = response.data || [];

	return documents.map((doc: any) => ({ json: doc }));
}
