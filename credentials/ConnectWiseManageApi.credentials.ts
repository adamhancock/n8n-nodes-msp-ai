import type {
	ICredentialDataDecryptedObject,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class ConnectWiseManageApi implements ICredentialType {
	name = 'connectWiseManageApi';

	displayName = 'ConnectWise Manage API';

	documentationUrl = 'https://developer.connectwise.com/Products/Manage/REST';

	properties: INodeProperties[] = [
		{
			displayName: 'Site URL',
			name: 'siteUrl',
			type: 'string',
			default: 'https://api-na.myconnectwise.net',
			description: 'The URL of your ConnectWise Manage instance',
			required: true,
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'The Client ID (GUID) assigned to your integration',
			required: true,
		},
		{
			displayName: 'Company ID',
			name: 'companyId',
			type: 'string',
			default: '',
			description: 'The Company ID used to access the API',
			required: true,
		},
		{
			displayName: 'Public Key',
			name: 'publicKey',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			description: 'The Public Key for API authentication',
			required: true,
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			description: 'The Private Key for API authentication',
			required: true,
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		const base64Auth = Buffer.from(
			`${credentials.companyId}+${credentials.publicKey}:${credentials.privateKey}`,
		).toString('base64');

		requestOptions.headers = {
			...requestOptions.headers,
			clientId: credentials.clientId as string,
			Authorization: `Basic ${base64Auth}`,
		};

		return requestOptions;
	}

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.siteUrl}}',
			url: '/v4_6_release/apis/3.0/company/companies',
			method: 'GET',
		},
	};
}
