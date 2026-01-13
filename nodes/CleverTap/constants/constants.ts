/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const CLEVERTAP_REGIONS: Record<string, string> = {
	India: 'https://api.clevertap.com/1',
	Singapore: 'https://sg1.api.clevertap.com/1',
	US: 'https://us1.api.clevertap.com/1',
	EU: 'https://eu1.api.clevertap.com/1',
	Indonesia: 'https://aps3.api.clevertap.com/1',
	'Middle East': 'https://mec1.api.clevertap.com/1',
};

export const BATCH_SIZE = 1000;

export const RATE_LIMITS = {
	upload: 500, // requests per second
	campaign: 3, // requests per second
	query: 10, // requests per second
	export: 1, // requests per second
};

export const CAMPAIGN_TYPES = [
	{ name: 'Mobile Push', value: 'mobile_push' },
	{ name: 'Web Push', value: 'web_push' },
	{ name: 'Email', value: 'email' },
	{ name: 'SMS', value: 'sms' },
	{ name: 'WhatsApp', value: 'whatsapp' },
];

export const SEGMENT_TYPES = [
	{ name: 'Static', value: 'static' },
	{ name: 'Live', value: 'live' },
];

export const WHATSAPP_MESSAGE_TYPES = [
	{ name: 'Text', value: 'text' },
	{ name: 'Image', value: 'image' },
	{ name: 'Document', value: 'document' },
	{ name: 'Template', value: 'template' },
];

export const COHORT_TYPES = [
	{ name: 'Days', value: 'days' },
	{ name: 'Weeks', value: 'weeks' },
	{ name: 'Months', value: 'months' },
];

export const GENDER_OPTIONS = [
	{ name: 'Male', value: 'M' },
	{ name: 'Female', value: 'F' },
];

export const SUBSCRIPTION_CHANNELS = [
	{ name: 'Email', value: 'MSG-email' },
	{ name: 'Push', value: 'MSG-push' },
	{ name: 'SMS', value: 'MSG-sms' },
	{ name: 'WhatsApp', value: 'MSG-whatsapp' },
];
