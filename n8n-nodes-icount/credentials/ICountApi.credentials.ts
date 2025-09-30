import {
    ICredentialType,
    INodeProperties,
    IAuthenticateGeneric,
    ICredentialTestRequest,
} from 'n8n-workflow';

export class ICountApi implements ICredentialType {
    name = 'iCountApi';
    displayName = 'iCount API';
    documentationUrl = 'https://api.icount.co.il';
    properties: INodeProperties[] = [
        {
            displayName: 'API Token',
            name: 'token',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            description: 'API Token מ-iCount (למשל: API3E8-C0A82A0C-68DBC83B-7DCF7B4B22A5D22F)',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.token}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://api.icount.co.il',
            url: '/api/v3.php/app/info',
            method: 'GET',
        },
    };
}