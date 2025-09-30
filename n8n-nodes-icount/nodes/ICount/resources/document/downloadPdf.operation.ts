import { INodeProperties } from 'n8n-workflow';

export const documentDownloadPdfDescription: INodeProperties[] = [
    {
        displayName: 'Document ID',
        name: 'doc_id',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['downloadPdf'],
            },
        },
        default: '',
        required: true,
        description: 'מזהה המסמך (UUID)',
    },
];

export async function executeDownloadPdf(this: any, index: number): Promise<any> {
    const credentials = await this.getCredentials('iCountApi');
    const docId = this.getNodeParameter('doc_id', index) as string;

    // First, get document info to get PDF link
    const getBody = {
        doc_id: docId,
    };

    const docResponse = await this.helpers.request({
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/doc/get',
        headers: {
            'Authorization': `Bearer ${credentials.token}`,
            'Content-Type': 'application/json',
        },
        body: getBody,
        json: true,
    });

    if (!docResponse.status || !docResponse.data.pdf_link) {
        throw new Error('PDF link not found');
    }

    // Download PDF
    const pdfResponse = await this.helpers.request({
        method: 'GET',
        url: docResponse.data.pdf_link,
        encoding: null,
    });

    return {
        json: {
            doc_id: docId,
            doc_number: docResponse.data.doc_number,
            pdf_url: docResponse.data.pdf_link,
        },
        binary: {
            data: {
                data: pdfResponse.toString('base64'),
                fileName: `document_${docResponse.data.doc_number}.pdf`,
                mimeType: 'application/pdf',
            },
        },
    };
}