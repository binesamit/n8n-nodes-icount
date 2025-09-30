import {
    IExecuteFunctions,
    INodeExecutionData,
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
    documentCreditDescription,
    executeCredit,
} from './resources/document/credit.operation';

import {
    documentGetDescription,
    executeGet,
} from './resources/document/get.operation';

import {
    documentListDescription,
    executeList,
} from './resources/document/list.operation';

import {
    documentDownloadPdfDescription,
    executeDownloadPdf,
} from './resources/document/downloadPdf.operation';

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
    documentInfoDescription,
    executeInfo,
} from './resources/document/info.operation';

import {
    customerUpsertDescription,
    executeUpsert,
} from './resources/customer/upsert.operation';

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
                        name: 'Credit',
                        value: 'credit',
                        description: 'יצירת חשבונית זיכוי',
                        action: 'Create a credit note',
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
                        name: 'Info',
                        value: 'info',
                        description: 'מידע מפורט על מסמך',
                        action: 'Get document info',
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
                    {
                        name: 'Download PDF',
                        value: 'downloadPdf',
                        description: 'הורדת PDF של מסמך',
                        action: 'Download document PDF',
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
                        name: 'Get Open Docs',
                        value: 'getOpenDocs',
                        description: 'רשימת מסמכים פתוחים ללקוחות',
                        action: 'Get open documents',
                    },
                ],
                default: 'upsert',
            },

            // ========== Operation Fields ==========
            ...documentCreateDescription,
            ...documentUpdateDescription,
            ...documentCreditDescription,
            ...documentCancelDescription,
            ...documentCloseDescription,
            ...documentGetDescription,
            ...documentInfoDescription,
            ...documentSearchDescription,
            ...documentListDescription,
            ...documentGetDocUrlDescription,
            ...documentDownloadPdfDescription,
            ...customerUpsertDescription,
            ...customerGetDescription,
            ...customerListDescription,
            ...customerGetOpenDocsDescription,
        ],
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
                        case 'credit':
                            result = await executeCredit.call(this, i);
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
                        case 'info':
                            result = await executeInfo.call(this, i);
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
                        case 'downloadPdf':
                            result = await executeDownloadPdf.call(this, i);
                            break;
                        default:
                            throw new Error(`Unknown operation: ${operation}`);
                    }
                } else if (resource === 'customer') {
                    switch (operation) {
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
                        case 'getOpenDocs':
                            const openDocsResults = await executeGetOpenDocs.call(this, i);
                            returnData.push(...openDocsResults);
                            continue;
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