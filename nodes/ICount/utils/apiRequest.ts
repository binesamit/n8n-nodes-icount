import {
    IExecuteFunctions,
    IHttpRequestMethods,
    IDataObject,
} from 'n8n-workflow';
import { ICountCredentials, ICountApiResponse } from '../types';

export async function iCountApiRequest(
    this: IExecuteFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
): Promise<ICountApiResponse> {
    const credentials = await this.getCredentials('iCountApi') as any;

    const options = {
        method,
        body: Object.keys(body).length > 0 ? body : undefined,
        qs,
        uri: `https://api.icount.co.il${endpoint}`,
        headers: {
            'Authorization': `Bearer ${credentials.token}`,
            'Content-Type': 'application/json',
        },
        json: true,
    };

    try {
        const response = await this.helpers.request(options);

        if (response.status === false) {
            throw new Error(response.message || response.error || JSON.stringify(response));
        }

        return response;
    } catch (error: any) {
        // טיפול ב-Rate Limiting
        if (error.statusCode === 429) {
            const retryAfter = error.response?.headers['retry-after'] || 60;
            throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
        }

        // שגיאות אימות
        if (error.statusCode === 401 || error.statusCode === 403) {
            throw new Error('Authentication failed. Check your credentials.');
        }

        throw error;
    }
}