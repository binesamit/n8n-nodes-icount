export const mockCustomerFixture = {
  client_id: 123,
  name: 'Test Company Ltd',
  email: 'test@example.com',
  phone: '0501234567',
  mobile: '0529876543',
  address: '123 Main St',
  city: 'Tel Aviv',
  zip: '6789012',
  country: 'Israel',
  id_number: '123456789',
  vat_id: '987654321',
};

export const mockDocumentFixture = {
  doc_id: 'uuid-12345',
  doc_number: 2001,
  doc_type: 320,
  client_id: 123,
  client_name: 'Test Company Ltd',
  issue_date: '2025-01-15',
  due_date: '2025-02-15',
  currency: 'ILS',
  lang: 'he',
  total: 5000,
  total_before_vat: 4237.29,
  vat_total: 762.71,
  pdf_link: 'https://icount.co.il/pdf/12345',
  status: 'open',
  items: [
    {
      description: 'Test Service',
      quantity: 10,
      unit_price: 500,
      vat: 18,
      total: 5000,
    },
  ],
};

export const mockContactFixture = {
  contact_id: 456,
  client_id: 123,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '0501112222',
  position: 'CEO',
  contact_type_id: 1,
};

export const mockBanksFixture = {
  '10': 'בנק לאומי',
  '11': 'בנק דיסקונט',
  '12': 'בנק הפועלים',
  '20': 'בנק מזרחי טפחות',
};

export const mockUsersFixture = [
  {
    user_id: 1,
    user_name: 'Admin User',
    email: 'admin@company.com',
  },
  {
    user_id: 2,
    user_name: 'Sales User',
    email: 'sales@company.com',
  },
];

export const mockDocumentTypesFixture = {
  '300': 'הצעת מחיר',
  '305': 'חשבונית מס קבלה',
  '320': 'חשבונית מס',
  '400': 'חשבונית זיכוי',
  '405': 'קבלה',
};

export const mockClientTypesFixture = {
  '1': {
    client_type_id: 1,
    client_type_name: 'לקוח פרטי',
  },
  '2': {
    client_type_id: 2,
    client_type_name: 'חברה',
  },
  '3': {
    client_type_id: 3,
    client_type_name: 'עוסק מורשה',
  },
};

export const mockContactTypesFixture = {
  '1': {
    contact_type_id: 1,
    contact_type_name: 'מנהל',
  },
  '2': {
    contact_type_id: 2,
    contact_type_name: 'כספים',
  },
};
