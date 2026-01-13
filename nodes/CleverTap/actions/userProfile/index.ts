/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import {
	cleverTapApiRequest,
	cleverTapBatchUpload,
	getUnixTimestamp,
} from '../../transport';

export async function upload(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identity = this.getNodeParameter('identity', index) as string;
	const profileData = this.getNodeParameter('profileData', index, {}) as IDataObject;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const record: IDataObject = {
		identity,
		type: 'profile',
		profileData: { ...profileData },
	};

	if (additionalFields.objectId) {
		record.objectId = additionalFields.objectId;
	}

	if (additionalFields.timestamp) {
		record.ts = getUnixTimestamp(additionalFields.timestamp as string);
	}

	if (additionalFields.fbId) {
		(record.profileData as IDataObject).fbId = additionalFields.fbId;
	}

	if (additionalFields.gpId) {
		(record.profileData as IDataObject).gpId = additionalFields.gpId;
	}

	const results = await cleverTapBatchUpload.call(this, [record]);

	return [{ json: { results }, pairedItem: index }];
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const identity = this.getNodeParameter('identity', index) as string;

	const body: IDataObject = {
		identity: [identity],
	};

	const response = await cleverTapApiRequest.call(this, 'POST', '/profile.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getByEmail(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const email = this.getNodeParameter('email', index) as string;

	const body: IDataObject = {
		email,
	};

	const response = await cleverTapApiRequest.call(this, 'POST', '/profile.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getByPhone(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const phone = this.getNodeParameter('phone', index) as string;

	const body: IDataObject = {
		phone,
	};

	const response = await cleverTapApiRequest.call(this, 'POST', '/profile.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function deleteProfile(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identity = this.getNodeParameter('identity', index) as string;

	const body: IDataObject = {
		identity,
	};

	const response = await cleverTapApiRequest.call(this, 'POST', '/delete/profiles.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function demerge(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identity = this.getNodeParameter('identity', index) as string;
	const objectId = this.getNodeParameter('objectId', index) as string;

	const body: IDataObject = {
		identity,
		objectId,
	};

	const response = await cleverTapApiRequest.call(this, 'POST', '/demerge/profiles.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getCount(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const eventName = this.getNodeParameter('eventName', index) as string;
	const from = this.getNodeParameter('from', index) as string;
	const to = this.getNodeParameter('to', index) as string;

	const fromDate = new Date(from);
	const toDate = new Date(to);

	const body: IDataObject = {
		event_name: eventName,
		from:
			fromDate.getFullYear() * 10000 +
			(fromDate.getMonth() + 1) * 100 +
			fromDate.getDate(),
		to: toDate.getFullYear() * 10000 + (toDate.getMonth() + 1) * 100 + toDate.getDate(),
	};

	const response = await cleverTapApiRequest.call(this, 'POST', '/counts/profiles.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function disassociate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identity = this.getNodeParameter('identity', index) as string;
	const deviceToken = this.getNodeParameter('deviceToken', index) as string;

	const body: IDataObject = {
		identity,
		token: deviceToken,
	};

	const response = await cleverTapApiRequest.call(this, 'POST', '/disassociate.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function subscribe(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identity = this.getNodeParameter('identity', index) as string;
	const subscriptionData = this.getNodeParameter('subscriptionData', index, {}) as IDataObject;

	const profileData: IDataObject = {};

	if (subscriptionData.email !== undefined) {
		profileData['MSG-email'] = subscriptionData.email;
	}

	if (subscriptionData.push !== undefined) {
		profileData['MSG-push'] = subscriptionData.push;
	}

	if (subscriptionData.sms !== undefined) {
		profileData['MSG-sms'] = subscriptionData.sms;
	}

	if (subscriptionData.whatsapp !== undefined) {
		profileData['MSG-whatsapp'] = subscriptionData.whatsapp;
	}

	const record: IDataObject = {
		identity,
		type: 'profile',
		profileData,
	};

	const results = await cleverTapBatchUpload.call(this, [record]);

	return [{ json: { results }, pairedItem: index }];
}

export async function getSubscriptionStatus(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identity = this.getNodeParameter('identity', index) as string;

	const body: IDataObject = {
		identity: [identity],
	};

	const response = await cleverTapApiRequest.call(this, 'POST', '/profile.json', body);

	// Extract subscription status from profile
	const profile = response as unknown as IDataObject;
	const subscriptionStatus: IDataObject = {};

	if (profile.record) {
		const record = profile.record as IDataObject;
		subscriptionStatus.email = record['MSG-email'] ?? null;
		subscriptionStatus.push = record['MSG-push'] ?? null;
		subscriptionStatus.sms = record['MSG-sms'] ?? null;
		subscriptionStatus.whatsapp = record['MSG-whatsapp'] ?? null;
	}

	return [{ json: { status: 'success', subscriptionStatus }, pairedItem: index }];
}

export const userProfileOperations = {
	upload,
	get,
	getByEmail,
	getByPhone,
	delete: deleteProfile,
	demerge,
	getCount,
	disassociate,
	subscribe,
	getSubscriptionStatus,
};
