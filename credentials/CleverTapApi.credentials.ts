import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class CleverTapApi implements ICredentialType {
	name = 'cleverTapApi';
	displayName = 'CleverTap API';
	documentationUrl = 'https://developer.clevertap.com/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'Account ID',
			name: 'accountId',
			type: 'string',
			required: true,
			default: '',
			description: 'Your CleverTap Account ID found in Settings > API Keys',
		},
		{
			displayName: 'API Passcode',
			name: 'passcode',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Your CleverTap API Passcode found in Settings > API Keys',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			required: true,
			default: 'https://api.clevertap.com/1',
			description: 'The base URL for CleverTap API requests',
		},
	];
}