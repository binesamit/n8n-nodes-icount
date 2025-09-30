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
		displayName: 'First Name',
		name: 'first_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'שם פרטי',
	},
	{
		displayName: 'Last Name',
		name: 'last_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'שם משפחה',
	},
	{
		displayName: 'Company Name',
		name: 'company_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'שם חברה',
	},
	{
		displayName: 'ID Number',
		name: 'id_no',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'ת.ז/ע.מ/ח.פ/ה.פ',
	},
	{
		displayName: 'Contact Type',
		name: 'contact_type',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		options: [
			{ name: 'איש קשר ראשי (Primary)', value: 'PRIMARY' },
			{ name: 'כספים (Billing)', value: 'BILLING' },
			{ name: 'משלוח (Shipping)', value: 'SHIPPING' },
			{ name: 'מנהל (Administrative)', value: 'ADMINISTRATIVE' },
			{ name: 'טכני (Technical)', value: 'TECHNICAL' },
			{ name: 'עובד (Employee)', value: 'EMPLOYEE' },
			{ name: 'מנהל חשבונות (Accountant)', value: 'ACCOUNTANT' },
			{ name: 'עורך דין (Lawyer)', value: 'LAWYER' },
			{ name: 'נותן שירות (Service Provider)', value: 'SERVICE_PROVIDER' },
			{ name: 'ספק (Supplier)', value: 'SUPPLIER' },
		],
		default: 'PRIMARY',
		description: 'סוג איש קשר',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'אימייל',
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'טלפון',
	},
	{
		displayName: 'Mobile',
		name: 'mobile',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'נייד',
	},
	{
		displayName: 'Fax',
		name: 'fax',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'פקס',
	},
	{
		displayName: 'Position',
		name: 'position',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'תפקיד',
	},
	{
		displayName: 'Business Country',
		name: 'bus_country',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'מדינה - כתובת עסק',
	},
	{
		displayName: 'Business City',
		name: 'bus_city',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'עיר - כתובת עסק',
	},
	{
		displayName: 'Business ZIP',
		name: 'bus_zip',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'מיקוד - כתובת עסק',
	},
	{
		displayName: 'Business Street',
		name: 'bus_street',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'רחוב - כתובת עסק',
	},
	{
		displayName: 'Business Street Number',
		name: 'bus_no',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'מספר בית - כתובת עסק',
	},
	{
		displayName: 'Home Country',
		name: 'home_country',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'מדינה - כתובת מגורים',
	},
	{
		displayName: 'Home City',
		name: 'home_city',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'עיר - כתובת מגורים',
	},
	{
		displayName: 'Home ZIP',
		name: 'home_zip',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'מיקוד - כתובת מגורים',
	},
	{
		displayName: 'Home Street',
		name: 'home_street',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'רחוב - כתובת מגורים',
	},
	{
		displayName: 'Home Street Number',
		name: 'home_no',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'מספר בית - כתובת מגורים',
	},
	{
		displayName: 'Date of Birth',
		name: 'dob',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'תאריך לידה (YYYY-MM-DD)',
	},
	{
		displayName: 'Notes',
		name: 'notes',
		type: 'string',
		typeOptions: { rows: 3 },
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['addContact'],
			},
		},
		default: '',
		description: 'הערות',
	},
];

export async function executeAddContact(this: any, index: number): Promise<any> {
	const clientId = this.getNodeParameter('client_id', index) as number;
	const firstName = this.getNodeParameter('first_name', index, '') as string;
	const lastName = this.getNodeParameter('last_name', index, '') as string;
	const companyName = this.getNodeParameter('company_name', index, '') as string;
	const idNo = this.getNodeParameter('id_no', index, '') as string;
	const contactType = this.getNodeParameter('contact_type', index, 'PRIMARY') as string;
	const email = this.getNodeParameter('email', index, '') as string;
	const phone = this.getNodeParameter('phone', index, '') as string;
	const mobile = this.getNodeParameter('mobile', index, '') as string;
	const fax = this.getNodeParameter('fax', index, '') as string;
	const position = this.getNodeParameter('position', index, '') as string;
	const busCountry = this.getNodeParameter('bus_country', index, '') as string;
	const busCity = this.getNodeParameter('bus_city', index, '') as string;
	const busZip = this.getNodeParameter('bus_zip', index, '') as string;
	const busStreet = this.getNodeParameter('bus_street', index, '') as string;
	const busNo = this.getNodeParameter('bus_no', index, '') as string;
	const homeCountry = this.getNodeParameter('home_country', index, '') as string;
	const homeCity = this.getNodeParameter('home_city', index, '') as string;
	const homeZip = this.getNodeParameter('home_zip', index, '') as string;
	const homeStreet = this.getNodeParameter('home_street', index, '') as string;
	const homeNo = this.getNodeParameter('home_no', index, '') as string;
	const dob = this.getNodeParameter('dob', index, '') as string;
	const notes = this.getNodeParameter('notes', index, '') as string;

	const body: any = {
		client_id: clientId,
		contact_type: contactType,
	};

	// Add name fields - at least one is required for display
	if (firstName) body.first_name = firstName;
	if (lastName) body.last_name = lastName;
	if (companyName) body.company_name = companyName;
	if (idNo) body.id_no = idNo;

	// Add optional fields if provided
	if (email) body.email = email;
	if (phone) body.phone = phone;
	if (mobile) body.mobile = mobile;
	if (fax) body.fax = fax;
	if (position) body.position = position;
	if (busCountry) body.bus_country = busCountry;
	if (busCity) body.bus_city = busCity;
	if (busZip) body.bus_zip = busZip;
	if (busStreet) body.bus_street = busStreet;
	if (busNo) body.bus_no = busNo;
	if (homeCountry) body.home_country = homeCountry;
	if (homeCity) body.home_city = homeCity;
	if (homeZip) body.home_zip = homeZip;
	if (homeStreet) body.home_street = homeStreet;
	if (homeNo) body.home_no = homeNo;
	if (dob) body.dob = dob;
	if (notes) body.notes = notes;

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
