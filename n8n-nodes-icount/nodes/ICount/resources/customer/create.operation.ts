import { INodeProperties } from 'n8n-workflow';

export const customerCreateDescription: INodeProperties[] = [
	{
		displayName: 'Customer Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'שם הלקוח',
	},
	{
		displayName: 'HP Number',
		name: 'id_number',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'מספר ח.פ',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'כתובת אימייל',
	},
	{
		displayName: 'First Name',
		name: 'first_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
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
				operation: ['create'],
			},
		},
		default: '',
		description: 'שם משפחה',
	},
	{
		displayName: 'VAT ID',
		name: 'vat_id',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'מספר עוסק מורשה',
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
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
				operation: ['create'],
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
				operation: ['create'],
			},
		},
		default: '',
		description: 'פקס',
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'כתובת',
	},
	{
		displayName: 'City',
		name: 'city',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'עיר',
	},
	{
		displayName: 'Business Country',
		name: 'bus_country',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'מדינה - כתובת עסק',
	},
	{
		displayName: 'Business State',
		name: 'bus_state',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'מחוז/אזור - כתובת עסק',
	},
	{
		displayName: 'Business City',
		name: 'bus_city',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
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
				operation: ['create'],
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
				operation: ['create'],
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
				operation: ['create'],
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
				operation: ['create'],
			},
		},
		default: '',
		description: 'מדינה - כתובת מגורים',
	},
	{
		displayName: 'Home State',
		name: 'home_state',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'מחוז/אזור - כתובת מגורים',
	},
	{
		displayName: 'Home City',
		name: 'home_city',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
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
				operation: ['create'],
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
				operation: ['create'],
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
				operation: ['create'],
			},
		},
		default: '',
		description: 'מספר בית - כתובת מגורים',
	},
	{
		displayName: 'Bank',
		name: 'bank',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getBanks',
		},
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'בנק',
	},
	{
		displayName: 'Branch',
		name: 'branch',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'סניף',
	},
	{
		displayName: 'Account',
		name: 'account',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'חשבון',
	},
	{
		displayName: 'Foreign Account',
		name: 'faccount',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'חשבון זר',
	},
	{
		displayName: 'Notes',
		name: 'notes',
		type: 'string',
		typeOptions: { rows: 3 },
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'הערות',
	},
	{
		displayName: 'Digital Signature',
		name: 'digsig',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'חתימה דיגיטלית',
	},
	{
		displayName: 'Custom Client ID',
		name: 'custom_client_id',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'מזהה לקוח מותאם אישית',
	},
	{
		displayName: 'Custom Info',
		name: 'custom_info',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'מידע מותאם אישית',
	},
	{
		displayName: 'Employee Assigned',
		name: 'employee_assigned',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUsers',
		},
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'משויך ל',
	},
	{
		displayName: 'Client Type',
		name: 'client_type_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getClientTypes',
		},
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'סוג לקוח',
	},
	{
		displayName: 'Payment Terms',
		name: 'payment_terms',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'תנאי תשלום (מספר ימים)',
	},
	{
		displayName: 'Client Type Discount',
		name: 'client_type_discount',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'הנחת סוג לקוח (%)',
	},
];

export async function executeCreateCustomer(this: any, index: number): Promise<any> {
	const name = this.getNodeParameter('name', index) as string;
	const idNumber = this.getNodeParameter('id_number', index, '') as string;
	const email = this.getNodeParameter('email', index, '') as string;
	const firstName = this.getNodeParameter('first_name', index, '') as string;
	const lastName = this.getNodeParameter('last_name', index, '') as string;
	const vatId = this.getNodeParameter('vat_id', index, '') as string;
	const phone = this.getNodeParameter('phone', index, '') as string;
	const mobile = this.getNodeParameter('mobile', index, '') as string;
	const fax = this.getNodeParameter('fax', index, '') as string;
	const address = this.getNodeParameter('address', index, '') as string;
	const city = this.getNodeParameter('city', index, '') as string;
	const busCountry = this.getNodeParameter('bus_country', index, '') as string;
	const busState = this.getNodeParameter('bus_state', index, '') as string;
	const busCity = this.getNodeParameter('bus_city', index, '') as string;
	const busZip = this.getNodeParameter('bus_zip', index, '') as string;
	const busStreet = this.getNodeParameter('bus_street', index, '') as string;
	const busNo = this.getNodeParameter('bus_no', index, '') as string;
	const homeCountry = this.getNodeParameter('home_country', index, '') as string;
	const homeState = this.getNodeParameter('home_state', index, '') as string;
	const homeCity = this.getNodeParameter('home_city', index, '') as string;
	const homeZip = this.getNodeParameter('home_zip', index, '') as string;
	const homeStreet = this.getNodeParameter('home_street', index, '') as string;
	const homeNo = this.getNodeParameter('home_no', index, '') as string;
	const bank = this.getNodeParameter('bank', index, '') as string;
	const branch = this.getNodeParameter('branch', index, '') as string;
	const account = this.getNodeParameter('account', index, '') as string;
	const faccount = this.getNodeParameter('faccount', index, '') as string;
	const notes = this.getNodeParameter('notes', index, '') as string;
	const digsig = this.getNodeParameter('digsig', index, '') as string;
	const customClientId = this.getNodeParameter('custom_client_id', index, '') as string;
	const customInfo = this.getNodeParameter('custom_info', index, '') as string;
	const employeeAssigned = this.getNodeParameter('employee_assigned', index, '') as string;
	const clientTypeId = this.getNodeParameter('client_type_id', index, '') as string;
	const paymentTerms = this.getNodeParameter('payment_terms', index, 0) as number;
	const clientTypeDiscount = this.getNodeParameter('client_type_discount', index, 0) as number;

	const body: any = {
		client_name: name,
	};

	// Add all fields if provided
	if (idNumber) {
		body.client_hp = idNumber;
		body.hp = idNumber;
	}
	if (email) {
		body.client_email = email;
		body.email = email;
	}
	if (firstName) body.first_name = firstName;
	if (lastName) body.last_name = lastName;
	if (vatId) body.vat_id = vatId;
	if (phone) {
		body.client_phone = phone;
		body.phone = phone;
	}
	if (mobile) body.mobile = mobile;
	if (fax) body.fax = fax;
	if (address) {
		body.client_address = address;
		body.address = address;
	}
	if (city) {
		body.client_city = city;
		body.city = city;
	}
	if (busCountry) body.bus_country = busCountry;
	if (busState) body.bus_state = busState;
	if (busCity) body.bus_city = busCity;
	if (busZip) body.bus_zip = busZip;
	if (busStreet) body.bus_street = busStreet;
	if (busNo) body.bus_no = busNo;
	if (homeCountry) body.home_country = homeCountry;
	if (homeState) body.home_state = homeState;
	if (homeCity) body.home_city = homeCity;
	if (homeZip) body.home_zip = homeZip;
	if (homeStreet) body.home_street = homeStreet;
	if (homeNo) body.home_no = homeNo;
	if (bank) body.bank = bank;
	if (branch) body.branch = branch;
	if (account) body.account = account;
	if (faccount) body.faccount = faccount;
	if (notes) body.notes = notes;
	if (digsig) body.digsig = digsig;
	if (customClientId) body.custom_client_id = customClientId;
	if (customInfo) body.custom_info = customInfo;
	if (employeeAssigned) body.employee_assigned = parseInt(employeeAssigned, 10);
	if (clientTypeId) body.client_type_id = parseInt(clientTypeId, 10);
	if (paymentTerms) body.payment_terms = paymentTerms;
	if (clientTypeDiscount) body.client_type_discount = clientTypeDiscount;

	const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
		method: 'POST',
		url: 'https://api.icount.co.il/api/v3.php/client/create',
		body,
		json: true,
	});

	if (response.status === false) {
		const errorMsg = response.message || response.error || JSON.stringify(response);
		throw new Error(`iCount API Error: ${errorMsg}`);
	}

	return {
		json: {
			action: 'created',
			customer_id: response?.data?.client_id || response?.client_id,
			...(response?.data || response || {}),
		},
	};
}
