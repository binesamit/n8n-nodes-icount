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
    const docId = this.getNodeParameter('doc_id', index) as string;

    // First, get document info to get PDF link - use doc/info instead of doc/get
    const getBody = {
        doc_id: docId,
    };

    const docResponse = await this.helpers.requestWithAuthentication.call(this, 'iCountApi', {
        method: 'POST',
        url: 'https://api.icount.co.il/api/v3.php/doc/info',
        body: getBody,
        json: true,
    });

    const docData = docResponse.data || docResponse;

    if (!docData || !docData.pdf_link) {
        throw new Error(`PDF link not found. Response: ${JSON.stringify(docResponse)}`);
    }

    // Download PDF
    const pdfResponse = await this.helpers.request({
        method: 'GET',
        url: docData.pdf_link,
        encoding: null,
    });

    return {
        json: {
            doc_id: docId,
            doc_number: docData.doc_number,
            pdf_url: docData.pdf_link,
        },
        binary: {
            data: {
                data: pdfResponse.toString('base64'),
                fileName: `document_${docData.doc_number}.pdf`,
                mimeType: 'application/pdf',
            },
        },
    };
}