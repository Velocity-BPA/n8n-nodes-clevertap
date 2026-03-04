import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CleverTapApi implements ICredentialType {
	name = 'cleverTapApi';
	displayName = 'CleverTap API';
	documentationUrl = 'https://developer.clevertap.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Account ID',
			name: 'accountId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your CleverTap Account ID from the dashboard under Settings > API Credentials',
		},
		{
			displayName: 'Passcode',
			name: 'passcode',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your CleverTap Account Passcode from the dashboard under Settings > API Credentials',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.clevertap.com/1',
			required: true,
			description: 'The base URL for the CleverTap API',
		},
	];
}