import {
    IExecuteFunctions,
    ILoadOptionsFunctions,
    INodeExecutionData,
    INodePropertyOptions,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

import {
    documentCreateDescription,
    executeCreate,
} from './resources/document/create.operation';

import {
    documentUpdateDescription,
    executeUpdate,
} from './resources/document/update.operation';


import {
    documentGetDescription,
    executeGet,
} from './resources/document/get.operation';

import {
    documentListDescription,
    executeList,
} from './resources/document/list.operation';


import {
    documentCancelDescription,
    executeCancel,
} from './resources/document/cancel.operation';

import {
    documentCloseDescription,
    executeClose,
} from './resources/document/close.operation';

import {
    documentGetDocUrlDescription,
    executeGetDocUrl,
} from './resources/document/getDocUrl.operation';

import {
    documentSearchDescription,
    executeSearch,
} from './resources/document/search.operation';


import {
    customerUpsertDescription,
    executeUpsert,
} from './resources/customer/upsert.operation';

import {
    customerCreateDescription,
    executeCreateCustomer,
} from './resources/customer/create.operation';

import {
    customerUpdateDescription,
    executeUpdateCustomer,
} from './resources/customer/update.operation';

import {
    customerListDescription,
    executeList as executeCustomerList,
} from './resources/customer/list.operation';

import {
    customerGetDescription,
    executeGet as executeCustomerGet,
} from './resources/customer/get.operation';

import {
    customerGetOpenDocsDescription,
    executeGetOpenDocs,
} from './resources/customer/getOpenDocs.operation';

import {
    customerDeleteDescription,
    executeDelete,
} from './resources/customer/delete.operation';

import {
    customerGetContactsDescription,
    executeGetContacts,
} from './resources/customer/getContacts.operation';

import {
    customerAddContactDescription,
    executeAddContact,
} from './resources/customer/addContact.operation';

import {
    customerUpdateContactDescription,
    executeUpdateContact,
} from './resources/customer/updateContact.operation';

import {
    customerDeleteContactDescription,
    executeDeleteContact,
} from './resources/customer/deleteContact.operation';

export class ICount implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'iCount',
        name: 'iCount',
        icon: 'file:icount.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["resource"]}} - {{$parameter["operation"]}}',
        description: 'ניהול מסמכים חשבונאיים ב-iCount',
        defaults: {
            name: 'iCount',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'iCountApi',
                required: true,
            },
        ],
        properties: [
            // ========== Resource ==========
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Document',
                        value: 'document',
                        description: 'ניהול מסמכים (חשבוניות, קבלות וכו\')',
                    },
                    {
                        name: 'Customer',
                        value: 'customer',
                        description: 'ניהול לקוחות',
                    },
                ],
                default: 'document',
            },

            // ========== Document Operations ==========
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['document'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'יצירת מסמך חדש',
                        action: 'Create a document',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'עדכון מסמך קיים',
                        action: 'Update a document',
                    },
                    {
                        name: 'Cancel',
                        value: 'cancel',
                        description: 'ביטול מסמך',
                        action: 'Cancel a document',
                    },
                    {
                        name: 'Close',
                        value: 'close',
                        description: 'סגירת מסמך',
                        action: 'Close a document',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'שליפת מסמך לפי ID',
                        action: 'Get a document',
                    },
                    {
                        name: 'Search',
                        value: 'search',
                        description: 'חיפוש מסמכים',
                        action: 'Search documents',
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'רשימת מסמכים',
                        action: 'List documents',
                    },
                    {
                        name: 'Get Document URL',
                        value: 'getDocUrl',
                        description: 'קבלת URL של מסמך',
                        action: 'Get document URL',
                    },
                ],
                default: 'create',
            },

            // ========== Customer Operations ==========
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['customer'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'יצירת לקוח חדש',
                        action: 'Create a customer',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'עדכון לקוח קיים',
                        action: 'Update a customer',
                    },
                    {
                        name: 'Upsert',
                        value: 'upsert',
                        description: 'יצירה או עדכון לקוח',
                        action: 'Upsert a customer',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'שליפת לקוח לפי ID',
                        action: 'Get a customer',
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'רשימת לקוחות',
                        action: 'List customers',
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'מחיקת לקוח',
                        action: 'Delete a customer',
                    },
                    {
                        name: 'Get Open Docs',
                        value: 'getOpenDocs',
                        description: 'רשימת מסמכים פתוחים ללקוחות',
                        action: 'Get open documents',
                    },
                    {
                        name: 'Get Contacts',
                        value: 'getContacts',
                        description: 'שליפת אנשי קשר של לקוח',
                        action: 'Get customer contacts',
                    },
                    {
                        name: 'Add Contact',
                        value: 'addContact',
                        description: 'הוספת איש קשר ללקוח',
                        action: 'Add customer contact',
                    },
                    {
                        name: 'Update Contact',
                        value: 'updateContact',
                        description: 'עדכון איש קשר',
                        action: 'Update customer contact',
                    },
                    {
                        name: 'Delete Contact',
                        value: 'deleteContact',
                        description: 'מחיקת איש קשר',
                        action: 'Delete customer contact',
                    },
                ],
                default: 'upsert',
            },

            // ========== Operation Fields ==========
            ...documentCreateDescription,
            ...documentUpdateDescription,
            ...documentCancelDescription,
            ...documentCloseDescription,
            ...documentGetDescription,
            ...documentSearchDescription,
            ...documentListDescription,
            ...documentGetDocUrlDescription,
            ...customerCreateDescription,
            ...customerUpdateDescription,
            ...customerUpsertDescription,
            ...customerGetDescription,
            ...customerListDescription,
            ...customerDeleteDescription,
            ...customerGetOpenDocsDescription,
            ...customerGetContactsDescription,
            ...customerAddContactDescription,
            ...customerUpdateContactDescription,
            ...customerDeleteContactDescription,
        ],
    };

    methods = {
        loadOptions: {
            // Get list of banks
            async getBanks(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const credentials = await this.getCredentials('iCountApi');

                try {
                    const response = await this.helpers.request({
                        method: 'POST',
                        url: 'https://api.icount.co.il/api/v3.php/bank/get_list',
                        headers: {
                            'Authorization': `Bearer ${credentials.token}`,
                            'Content-Type': 'application/json',
                        },
                        json: true,
                    });

                    // The API returns banks as an object where keys are bank IDs
                    // For example: { "11": "בנק דיסקונט", "12": "בנק הפועלים", ... }
                    let banksData = response?.data || response?.banks || response;

                    if (!banksData || typeof banksData !== 'object') {
                        return [];
                    }

                    // Convert object to array of options
                    const options: INodePropertyOptions[] = [];
                    for (const [bankId, bankName] of Object.entries(banksData)) {
                        if (typeof bankName === 'string') {
                            options.push({
                                name: `${bankId} - ${bankName}`,
                                value: bankId,
                            });
                        }
                    }

                    return options;
                } catch (error) {
                    return [];
                }
            },

            // Get list of users (employees)
            async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const credentials = await this.getCredentials('iCountApi');

                try {
                    const response = await this.helpers.request({
                        method: 'POST',
                        url: 'https://api.icount.co.il/api/v3.php/user/get_list',
                        headers: {
                            'Authorization': `Bearer ${credentials.token}`,
                            'Content-Type': 'application/json',
                        },
                        json: true,
                    });

                    let usersData = response?.data || response?.users || response;

                    if (!usersData) {
                        return [];
                    }

                    const options: INodePropertyOptions[] = [];

                    // If it's an object, convert to options
                    if (typeof usersData === 'object' && !Array.isArray(usersData)) {
                        for (const [userId, userData] of Object.entries(usersData)) {
                            if (typeof userData === 'string') {
                                options.push({
                                    name: userData,
                                    value: userId,
                                });
                            } else if (typeof userData === 'object' && userData !== null) {
                                const userObj = userData as any;
                                options.push({
                                    name: userObj.user_name || userObj.name || userObj.email || userId,
                                    value: String(userObj.user_id || userId),
                                });
                            }
                        }
                    }
                    // If it's an array
                    else if (Array.isArray(usersData)) {
                        for (const user of usersData) {
                            if (typeof user === 'object' && user !== null) {
                                options.push({
                                    name: user.user_name || user.name || user.email,
                                    value: String(user.user_id || user.id),
                                });
                            }
                        }
                    }

                    return options;
                } catch (error) {
                    return [];
                }
            },

            // Get list of client types
            async getClientTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const credentials = await this.getCredentials('iCountApi');

                try {
                    const response = await this.helpers.request({
                        method: 'POST',
                        url: 'https://api.icount.co.il/api/v3.php/client/types',
                        headers: {
                            'Authorization': `Bearer ${credentials.token}`,
                            'Content-Type': 'application/json',
                        },
                        json: true,
                    });

                    // The API might return an object with type IDs as keys and names as values
                    // Or it might return an array of objects
                    let typesData = response?.data || response?.types || response;

                    if (!typesData) {
                        return [];
                    }

                    const options: INodePropertyOptions[] = [];

                    // If it's an object (like banks), convert to options
                    if (typeof typesData === 'object' && !Array.isArray(typesData)) {
                        for (const [typeId, typeName] of Object.entries(typesData)) {
                            if (typeof typeName === 'string') {
                                options.push({
                                    name: typeName,
                                    value: typeId,
                                });
                            } else if (typeof typeName === 'object' && typeName !== null) {
                                // If it's an object with properties
                                const typeObj = typeName as any;
                                options.push({
                                    name: typeObj.client_type_name || typeObj.name || typeId,
                                    value: String(typeObj.client_type_id || typeObj.id || typeId),
                                });
                            }
                        }
                    }
                    // If it's an array of objects
                    else if (Array.isArray(typesData)) {
                        for (const type of typesData) {
                            if (typeof type === 'object' && type !== null) {
                                options.push({
                                    name: type.client_type_name || type.name,
                                    value: String(type.client_type_id || type.id),
                                });
                            }
                        }
                    }

                    return options;
                } catch (error) {
                    return [];
                }
            },

            // Get list of contact types
            async getContactTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const credentials = await this.getCredentials('iCountApi');

                try {
                    const response = await this.helpers.request({
                        method: 'POST',
                        url: 'https://api.icount.co.il/api/v3.php/client/contact_types',
                        headers: {
                            'Authorization': `Bearer ${credentials.token}`,
                            'Content-Type': 'application/json',
                        },
                        json: true,
                    });

                    let typesData = response?.data || response?.contact_types || response;

                    if (!typesData) {
                        return [];
                    }

                    const options: INodePropertyOptions[] = [];

                    // If it's an object, convert to options
                    if (typeof typesData === 'object' && !Array.isArray(typesData)) {
                        for (const [typeId, typeData] of Object.entries(typesData)) {
                            if (typeof typeData === 'string') {
                                options.push({
                                    name: typeData,
                                    value: typeId,
                                });
                            } else if (typeof typeData === 'object' && typeData !== null) {
                                const typeObj = typeData as any;
                                options.push({
                                    name: typeObj.contact_type_name || typeObj.name || typeId,
                                    value: String(typeObj.contact_type_id || typeId),
                                });
                            }
                        }
                    }
                    // If it's an array
                    else if (Array.isArray(typesData)) {
                        for (const type of typesData) {
                            if (typeof type === 'object' && type !== null) {
                                options.push({
                                    name: type.contact_type_name || type.name,
                                    value: String(type.contact_type_id || type.id),
                                });
                            }
                        }
                    }

                    return options;
                } catch (error) {
                    return [];
                }
            },
        },
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        for (let i = 0; i < items.length; i++) {
            try {
                let result: any;

                if (resource === 'document') {
                    switch (operation) {
                        case 'create':
                            result = await executeCreate.call(this, i);
                            break;
                        case 'update':
                            result = await executeUpdate.call(this, i);
                            break;
                        case 'cancel':
                            result = await executeCancel.call(this, i);
                            break;
                        case 'close':
                            result = await executeClose.call(this, i);
                            break;
                        case 'get':
                            result = await executeGet.call(this, i);
                            break;
                        case 'search':
                            const searchResults = await executeSearch.call(this, i);
                            returnData.push(...searchResults);
                            continue;
                        case 'list':
                            const listResults = await executeList.call(this, i);
                            returnData.push(...listResults);
                            continue;
                        case 'getDocUrl':
                            result = await executeGetDocUrl.call(this, i);
                            break;
                        default:
                            throw new Error(`Unknown operation: ${operation}`);
                    }
                } else if (resource === 'customer') {
                    switch (operation) {
                        case 'create':
                            result = await executeCreateCustomer.call(this, i);
                            break;
                        case 'update':
                            result = await executeUpdateCustomer.call(this, i);
                            break;
                        case 'upsert':
                            result = await executeUpsert.call(this, i);
                            break;
                        case 'get':
                            result = await executeCustomerGet.call(this, i);
                            break;
                        case 'list':
                            const customerListResults = await executeCustomerList.call(this, i);
                            returnData.push(...customerListResults);
                            continue;
                        case 'delete':
                            result = await executeDelete.call(this, i);
                            break;
                        case 'getOpenDocs':
                            const openDocsResults = await executeGetOpenDocs.call(this, i);
                            returnData.push(...openDocsResults);
                            continue;
                        case 'getContacts':
                            const contactsResults = await executeGetContacts.call(this, i);
                            returnData.push(...contactsResults);
                            continue;
                        case 'addContact':
                            result = await executeAddContact.call(this, i);
                            break;
                        case 'updateContact':
                            result = await executeUpdateContact.call(this, i);
                            break;
                        case 'deleteContact':
                            result = await executeDeleteContact.call(this, i);
                            break;
                        default:
                            throw new Error(`Unknown operation: ${operation}`);
                    }
                }

                if (Array.isArray(result)) {
                    returnData.push(...result);
                } else {
                    returnData.push(result);
                }
            } catch (error: any) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                            item: i,
                        },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}