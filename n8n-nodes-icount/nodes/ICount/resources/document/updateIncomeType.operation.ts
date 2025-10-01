import { INodeProperties } from 'n8n-workflow';

export const documentUpdateIncomeTypeDescription: INodeProperties[] = [
    {
        displayName: 'Document Type',
        name: 'doctype',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['updateIncomeType'],
            },
        },
        default: '',
        required: true,
        description: 'סוג המסמך (לדוגמה: 320 לחשבונית מס)',
    },
    {
        displayName: 'Document Number',
        name: 'docnum',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['updateIncomeType'],
            },
        },
        default: 0,
        required: true,
        description: 'מספר המסמך',
    },
    {
        displayName: 'Income Type',
        name: 'incomeType',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['updateIncomeType'],
            },
        },
        options: [
            {
                name: 'Income Type ID',
                value: 'id',
            },
            {
                name: 'Income Type Name',
                value: 'name',
            },
        ],
        default: 'id',
        description: 'האם להשתמש ב-ID או בשם של סוג ההכנסה',
    },
    {
        displayName: 'Income Type ID',
        name: 'income_type_id',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['updateIncomeType'],
                incomeType: ['id'],
            },
        },
        default: 0,
        description: 'מזהה סוג ההכנסה',
    },
    {
        displayName: 'Income Type Name',
        name: 'income_type_name',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['updateIncomeType'],
                incomeType: ['name'],
            },
        },
        default: '',
        description: 'שם סוג ההכנסה (אם לא קיים, המערכת תיצור אותו אוטומטית)',
    },
];

export async function executeUpdateIncomeType(this: any, index: number): Promise<any> {
    const credentials = await this.getCredentials('iCountApi');
    const doctype = this.getNodeParameter('doctype', index) as string;
    const docnum = this.getNodeParameter('docnum', index) as number;
    const incomeType = this.getNodeParameter('incomeType', index) as string;

    const body: any = {
        doctype,
        docnum,
    };

    if (incomeType === 'id') {
        body.income_type_id = this.getNodeParameter('income_type_id', index) as number;
    } else {
        body.income_type_name = this.getNodeParameter('income_type_name', index) as string;
    }

    const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/doc/update_doc_income_type',
        body,
        json: true,
    });

    if (response.status === false) {
        const errorMsg = response.message || response.error || JSON.stringify(response);
        throw new Error(`iCount API Error: ${errorMsg}`);
    }

    return { json: response };
}
