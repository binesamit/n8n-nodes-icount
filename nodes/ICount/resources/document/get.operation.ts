import { INodeProperties } from 'n8n-workflow';

export const documentGetDescription: INodeProperties[] = [
    {
        displayName: 'Document Type',
        name: 'doctype',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['get'],
            },
        },
        options: [
            { name: 'חשבונית מס קבלה (Invoice Receipt)', value: 'invrec' },
            { name: 'חשבונית מס (Tax Invoice)', value: 'invoice' },
            { name: 'קבלה (Receipt)', value: 'receipt' },
            { name: 'חשבונית זיכוי (Refund)', value: 'refund' },
            { name: 'חשבון עסקה (Deal)', value: 'deal' },
            { name: 'הצעת מחיר (Price Quote)', value: 'offer' },
            { name: 'הזמנה (Order)', value: 'order' },
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
                operation: ['get'],
            },
        },
        default: 0,
        required: true,
        description: 'מספר המסמך',
    },
];

export async function executeGet(this: any, index: number): Promise<any> {
    const doctype = this.getNodeParameter('doctype', index) as string;
    const docnum = this.getNodeParameter('docnum', index) as number;

    const body = {
        doctype,
        docnum,
    };

    const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/doc/info',
        body,
        json: true,
    });

    if (response.status === false) {
        const errorMsg = response.message || response.error || JSON.stringify(response);
        throw new Error(`iCount API Error: ${errorMsg}`);
    }

    return { json: response.data || response };
}