/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import { cleverTapApiRequest } from '../../transport';

export async function send(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identities = this.getNodeParameter('identities', index) as string;
	const title = this.getNodeParameter('title', index) as string;
	const body = this.getNodeParameter('body', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		to: {
			identity: identities.split(',').map((id) => id.trim()),
		},
		content: {
			title,
			body,
		},
	};

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	if (additionalFields.wzrkTtl) {
		payload.wzrk_ttl = additionalFields.wzrkTtl;
	}

	if (additionalFields.deepLink) {
		(payload.content as IDataObject).deep_link = additionalFields.deepLink;
	}

	if (additionalFields.imageUrl) {
		(payload.content as IDataObject).image_url = additionalFields.imageUrl;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/targets/create.json', payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function sendToSegment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const segmentName = this.getNodeParameter('segmentName', index) as string;
	const title = this.getNodeParameter('title', index) as string;
	const body = this.getNodeParameter('body', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		to: {
			segment: segmentName,
		},
		content: {
			title,
			body,
		},
	};

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	if (additionalFields.wzrkTtl) {
		payload.wzrk_ttl = additionalFields.wzrkTtl;
	}

	if (additionalFields.deepLink) {
		(payload.content as IDataObject).deep_link = additionalFields.deepLink;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/targets/create.json', payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function sendToIdentity(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identity = this.getNodeParameter('identity', index) as string;
	const title = this.getNodeParameter('title', index) as string;
	const body = this.getNodeParameter('body', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		to: {
			identity: [identity],
		},
		content: {
			title,
			body,
		},
	};

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	if (additionalFields.wzrkTtl) {
		payload.wzrk_ttl = additionalFields.wzrkTtl;
	}

	if (additionalFields.deepLink) {
		(payload.content as IDataObject).deep_link = additionalFields.deepLink;
	}

	if (additionalFields.customKeyValue) {
		(payload.content as IDataObject).custom_key_value = additionalFields.customKeyValue;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/targets/create.json', payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function createWebPush(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identities = this.getNodeParameter('identities', index) as string;
	const title = this.getNodeParameter('title', index) as string;
	const body = this.getNodeParameter('body', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const webContent: IDataObject = {
		title,
		body,
	};

	if (additionalFields.iconUrl) {
		webContent.icon_url = additionalFields.iconUrl;
	}

	if (additionalFields.imageUrl) {
		webContent.image_url = additionalFields.imageUrl;
	}

	if (additionalFields.deepLink) {
		webContent.deep_link = additionalFields.deepLink;
	}

	if (additionalFields.requireInteraction !== undefined) {
		webContent.require_interaction = additionalFields.requireInteraction;
	}

	const payload: IDataObject = {
		to: {
			identity: identities.split(',').map((id) => id.trim()),
		},
		content: {
			platform_specific: {
				web: webContent,
			},
		},
	};

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	const response = await cleverTapApiRequest.call(
		this,
		'POST',
		'/webpush/schedule.json',
		payload,
	);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function createMobilePush(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identities = this.getNodeParameter('identities', index) as string;
	const title = this.getNodeParameter('title', index) as string;
	const body = this.getNodeParameter('body', index) as string;
	const platform = this.getNodeParameter('platform', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const platformContent: IDataObject = {
		title,
		body,
	};

	if (additionalFields.imageUrl) {
		platformContent.image_url = additionalFields.imageUrl;
	}

	if (additionalFields.deepLink) {
		platformContent.deep_link = additionalFields.deepLink;
	}

	if (additionalFields.soundFile) {
		platformContent.sound_file = additionalFields.soundFile;
	}

	// Platform-specific options
	if (platform === 'android') {
		if (additionalFields.icon) {
			platformContent.icon = additionalFields.icon;
		}
	} else if (platform === 'ios') {
		if (additionalFields.badgeCount !== undefined) {
			platformContent.badge_count = additionalFields.badgeCount;
		}
		if (additionalFields.category) {
			platformContent.category = additionalFields.category;
		}
	}

	const platformSpecific: IDataObject = {};
	platformSpecific[platform] = platformContent;

	const payload: IDataObject = {
		to: {
			identity: identities.split(',').map((id) => id.trim()),
		},
		content: {
			platform_specific: platformSpecific,
		},
	};

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	if (additionalFields.wzrkTtl) {
		payload.wzrk_ttl = additionalFields.wzrkTtl;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/push/schedule.json', payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function schedule(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identities = this.getNodeParameter('identities', index) as string;
	const title = this.getNodeParameter('title', index) as string;
	const body = this.getNodeParameter('body', index) as string;
	const scheduleTime = this.getNodeParameter('scheduleTime', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		to: {
			identity: identities.split(',').map((id) => id.trim()),
		},
		content: {
			title,
			body,
		},
		when: {
			send_at: scheduleTime,
		},
	};

	if (additionalFields.timezone) {
		(payload.when as IDataObject).timezone = additionalFields.timezone;
	}

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/push/schedule.json', payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function cancel(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const campaignId = this.getNodeParameter('campaignId', index) as string;

	const response = await cleverTapApiRequest.call(this, 'POST', '/targets/stop.json', {
		id: campaignId,
	});

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export const pushNotificationOperations = {
	send,
	sendToSegment,
	sendToIdentity,
	createWebPush,
	createMobilePush,
	schedule,
	cancel,
};
