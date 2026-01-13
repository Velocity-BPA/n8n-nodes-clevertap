/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CleverTapApi implements ICredentialType {
	name = 'cleverTapApi';
	displayName = 'CleverTap API';
	documentationUrl = 'https://developer.clevertap.com/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'Account ID',
			name: 'accountId',
			type: 'string',
			default: '',
			required: true,
			description: 'CleverTap Account/Project ID found in Settings > Project',
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
			description: 'CleverTap Passcode found in Settings > Passcode',
		},
		{
			displayName: 'Region',
			name: 'region',
			type: 'options',
			options: [
				{
					name: 'India',
					value: 'India',
				},
				{
					name: 'Singapore',
					value: 'Singapore',
				},
				{
					name: 'US',
					value: 'US',
				},
				{
					name: 'EU',
					value: 'EU',
				},
				{
					name: 'Indonesia',
					value: 'Indonesia',
				},
				{
					name: 'Middle East',
					value: 'Middle East',
				},
			],
			default: 'US',
			required: true,
			description: 'CleverTap data center region',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-CleverTap-Account-Id': '={{$credentials.accountId}}',
				'X-CleverTap-Passcode': '={{$credentials.passcode}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.region === "India" ? "https://api.clevertap.com/1" : $credentials.region === "Singapore" ? "https://sg1.api.clevertap.com/1" : $credentials.region === "EU" ? "https://eu1.api.clevertap.com/1" : $credentials.region === "Indonesia" ? "https://aps3.api.clevertap.com/1" : $credentials.region === "Middle East" ? "https://mec1.api.clevertap.com/1" : "https://us1.api.clevertap.com/1"}}',
			url: '/counts/profiles.json',
			method: 'POST',
			body: {
				event_name: 'App Launched',
				from: 20240101,
				to: 20240102,
			},
		},
	};
}
