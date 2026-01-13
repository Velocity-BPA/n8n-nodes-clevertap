/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import {
	cleverTapApiRequest,
	formatDateForCleverTap,
} from '../../transport';

export async function create(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const campaignType = this.getNodeParameter('campaignType', index) as string;
	const title = this.getNodeParameter('title', index) as string;
	const body = this.getNodeParameter('body', index) as string;
	const identities = this.getNodeParameter('identities', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		name,
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

	if (additionalFields.estimateOnly) {
		payload.estimate_only = additionalFields.estimateOnly;
	}

	if (additionalFields.wzrkCid) {
		payload.wzrk_cid = additionalFields.wzrkCid;
	}

	// Build platform-specific content
	if (additionalFields.platformSpecific) {
		const content = payload.content as IDataObject;
		content.platform_specific = additionalFields.platformSpecific;
	}

	let endpoint = '/push/schedule.json';
	if (campaignType === 'email') {
		endpoint = '/email/schedule.json';
	} else if (campaignType === 'sms') {
		endpoint = '/sms/schedule.json';
	} else if (campaignType === 'whatsapp') {
		endpoint = '/whatsapp/schedule.json';
	}

	const response = await cleverTapApiRequest.call(this, 'POST', endpoint, payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const campaignId = this.getNodeParameter('campaignId', index) as string;

	const response = await cleverTapApiRequest.call(this, 'GET', '/campaigns.json', undefined, {
		id: campaignId,
	});

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getMany(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const qs: IDataObject = {};

	if (additionalFields.from) {
		qs.from = formatDateForCleverTap(additionalFields.from as string);
	}

	if (additionalFields.to) {
		qs.to = formatDateForCleverTap(additionalFields.to as string);
	}

	const response = await cleverTapApiRequest.call(this, 'GET', '/campaigns.json', undefined, qs);

	const campaigns = (response as unknown as IDataObject).campaigns || [];

	if (!returnAll) {
		const limit = this.getNodeParameter('limit', index, 50) as number;
		return (campaigns as IDataObject[])
			.slice(0, limit)
			.map((item) => ({ json: item, pairedItem: index }));
	}

	return (campaigns as IDataObject[]).map((item) => ({ json: item, pairedItem: index }));
}

export async function getStats(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const campaignId = this.getNodeParameter('campaignId', index) as string;

	const response = await cleverTapApiRequest.call(
		this,
		'GET',
		'/campaigns/stats.json',
		undefined,
		{
			id: campaignId,
		},
	);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function stop(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const campaignId = this.getNodeParameter('campaignId', index) as string;

	const response = await cleverTapApiRequest.call(this, 'POST', '/campaigns/stop.json', {
		id: campaignId,
	});

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function createTargeted(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const campaignType = this.getNodeParameter('campaignType', index) as string;
	const title = this.getNodeParameter('title', index) as string;
	const body = this.getNodeParameter('body', index) as string;
	const segmentQuery = this.getNodeParameter('segmentQuery', index, {}) as IDataObject;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		name,
		where: segmentQuery,
		content: {
			title,
			body,
		},
	};

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	if (additionalFields.estimateOnly) {
		payload.estimate_only = additionalFields.estimateOnly;
	}

	let endpoint = '/push/schedule.json';
	if (campaignType === 'email') {
		endpoint = '/email/schedule.json';
	} else if (campaignType === 'sms') {
		endpoint = '/sms/schedule.json';
	} else if (campaignType === 'whatsapp') {
		endpoint = '/whatsapp/schedule.json';
	}

	const response = await cleverTapApiRequest.call(this, 'POST', endpoint, payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function createControlGroup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const campaignType = this.getNodeParameter('campaignType', index) as string;
	const title = this.getNodeParameter('title', index) as string;
	const body = this.getNodeParameter('body', index) as string;
	const segmentQuery = this.getNodeParameter('segmentQuery', index, {}) as IDataObject;
	const controlGroupPercentage = this.getNodeParameter('controlGroupPercentage', index) as number;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		name,
		where: segmentQuery,
		content: {
			title,
			body,
		},
		control_group: {
			percentage: controlGroupPercentage,
		},
	};

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	let endpoint = '/push/schedule.json';
	if (campaignType === 'email') {
		endpoint = '/email/schedule.json';
	} else if (campaignType === 'sms') {
		endpoint = '/sms/schedule.json';
	} else if (campaignType === 'whatsapp') {
		endpoint = '/whatsapp/schedule.json';
	}

	const response = await cleverTapApiRequest.call(this, 'POST', endpoint, payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getReport(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const campaignId = this.getNodeParameter('campaignId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const qs: IDataObject = {
		id: campaignId,
	};

	if (additionalFields.from) {
		qs.from = formatDateForCleverTap(additionalFields.from as string);
	}

	if (additionalFields.to) {
		qs.to = formatDateForCleverTap(additionalFields.to as string);
	}

	const response = await cleverTapApiRequest.call(
		this,
		'GET',
		'/campaigns/report.json',
		undefined,
		qs,
	);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export const campaignOperations = {
	create,
	get,
	getMany,
	getStats,
	stop,
	createTargeted,
	createControlGroup,
	getReport,
};
