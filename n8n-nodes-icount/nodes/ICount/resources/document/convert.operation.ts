import { INodeProperties } from 'n8n-workflow';

export const documentConvertDescription: INodeProperties[] = [
    {
        displayName: 'Document Type',
        name: 'doctype',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['convert'],
            },
        },
        default: '',
        required: true,
        description: 'סוג המסמך הנוכחי (לדוגמה: 320 לחשבונית מס)',
    },
    {
        displayName: 'Document Number',
        name: 'docnum',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['convert'],
            },
        },
        default: 0,
        required: true,
        description: 'מספר המסמך להמרה',
    },
    {
        displayName: 'Get Conversion Options',
        name: 'getOptions',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['convert'],
            },
        },
        default: true,
        description: 'האם לשלוף את אפשרויות ההמרה האפשריות (אם כבוי, יש לספק את conversion_type)',
    },
    {
        displayName: 'Conversion Type',
        name: 'conversion_type',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['convert'],
                getOptions: [false],
            },
        },
        default: '',
        description: 'סוג ההמרה (יש לקבל מתוך Get Conversion Options)',
    },
];

export async function executeConvert(this: any, index: number): Promise<any> {
    const credentials = await this.getCredentials('iCountApi');
    const doctype = this.getNodeParameter('doctype', index) as string;
    const docnum = this.getNodeParameter('docnum', index) as number;
    const getOptions = this.getNodeParameter('getOptions', index, true) as boolean;

    if (getOptions) {
        // Get conversion options
        const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
            method: 'POST',
            url: 'https://api.icount.co.il/api/v3.php/doc/get_doc_conversion_options',
            body: {
                doctype,
                docnum,
            },
            json: true,
        });

        if (response.status === false) {
            const errorMsg = response.message || response.error || JSON.stringify(response);
            throw new Error(`iCount API Error: ${errorMsg}`);
        }

        return { json: response };
    } else {
        // Perform conversion
        const conversionType = this.getNodeParameter('conversion_type', index) as string;

        const response = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
            method: 'POST',
            url: 'https://api.icount.co.il/api/v3.php/doc/convert',
            body: {
                doctype,
                docnum,
                conversion_type: conversionType,
            },
            json: true,
        });

        if (response.status === false) {
            const errorMsg = response.message || response.error || JSON.stringify(response);
            throw new Error(`iCount API Error: ${errorMsg}`);
        }

        return { json: response };
    }
}
