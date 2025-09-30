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
                operation: ['get'],
            },
        },
        default: 0,
        required: true,
        description: 'מספר המסמך',
    },
];

export async function executeGet(this: any, index: number): Promise<any> {
    const credentials = await this.getCredentials('iCountApi');
    const doctype = this.getNodeParameter('doctype', index) as string;
    const docnum = this.getNodeParameter('docnum', index) as number;

    const body = {
        cid: credentials.cid,
        user: credentials.user,
        pass: credentials.pass,
        doctype,
        docnum,
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