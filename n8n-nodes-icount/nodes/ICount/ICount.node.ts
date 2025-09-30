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
                        name: 'Get',
                        value: 'get',
                        description: 'שליפת מסמך לפי ID',
                        action: 'Get a document',
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'רשימת מסמכים',
                        action: 'List documents',
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
                        name: 'List',
                        value: 'list',
                        description: 'רשימת לקוחות',
                        action: 'List customers',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'שליפת לקוח לפי ID',
                        action: 'Get a customer',
                    },
                ],
                default: 'upsert',
            },

            // ========== Operation Fields ==========
            ...documentCreateDescription,
            ...documentUpdateDescription,
            ...documentCreditDescription,
            ...documentGetDescription,
            ...documentListDescription,
            ...documentDownloadPdfDescription,
            ...customerUpsertDescription,
            ...customerListDescription,
            ...customerGetDescription,
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
                        case 'get':
                            result = await executeGet.call(this, i);
                            break;
                        case 'list':
                            const listResults = await executeList.call(this, i);
                            returnData.push(...listResults);
                            continue;
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
                        case 'list':
                            const customerListResults = await executeCustomerList.call(this, i);
                            returnData.push(...customerListResults);
                            continue;
                        case 'get':
                            result = await executeCustomerGet.call(this, i);
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