/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import { cleverTapApiRequest, formatDateForCleverTap } from '../../transport';

export async function getRealTime(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const qs: IDataObject = {};

	if (additionalFields.eventName) {
		qs.event_name = additionalFields.eventName;
	}

	const response = await cleverTapApiRequest.call(this, 'GET', '/now.json', undefined, qs);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getTrends(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const eventName = this.getNodeParameter('eventName', index) as string;
	const from = this.getNodeParameter('from', index) as string;
	const to = this.getNodeParameter('to', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		event_name: eventName,
		from: formatDateForCleverTap(from),
		to: formatDateForCleverTap(to),
	};

	if (additionalFields.daily !== undefined) {
		body.daily = additionalFields.daily;
	}

	if (additionalFields.unique !== undefined) {
		body.unique = additionalFields.unique;
	}

	if (additionalFields.groups) {
		body.groups = additionalFields.groups;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/trends.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getMessageReport(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const from = this.getNodeParameter('from', index) as string;
	const to = this.getNodeParameter('to', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const qs: IDataObject = {
		from: formatDateForCleverTap(from),
		to: formatDateForCleverTap(to),
	};

	if (additionalFields.channel) {
		qs.channel = additionalFields.channel;
	}

	if (additionalFields.daily !== undefined) {
		qs.daily = additionalFields.daily;
	}

	const response = await cleverTapApiRequest.call(
		this,
		'GET',
		'/reports/messages.json',
		undefined,
		qs,
	);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getRevenueReport(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const from = this.getNodeParameter('from', index) as string;
	const to = this.getNodeParameter('to', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		from: formatDateForCleverTap(from),
		to: formatDateForCleverTap(to),
	};

	if (additionalFields.eventName) {
		body.event_name = additionalFields.eventName;
	}

	if (additionalFields.daily !== undefined) {
		body.daily = additionalFields.daily;
	}

	if (additionalFields.groups) {
		body.groups = additionalFields.groups;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/reports/revenue.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getUninstallReport(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const from = this.getNodeParameter('from', index) as string;
	const to = this.getNodeParameter('to', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const qs: IDataObject = {
		from: formatDateForCleverTap(from),
		to: formatDateForCleverTap(to),
	};

	if (additionalFields.daily !== undefined) {
		qs.daily = additionalFields.daily;
	}

	const response = await cleverTapApiRequest.call(
		this,
		'GET',
		'/reports/uninstalls.json',
		undefined,
		qs,
	);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getFunnelReport(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const funnelName = this.getNodeParameter('funnelName', index) as string;
	const from = this.getNodeParameter('from', index) as string;
	const to = this.getNodeParameter('to', index) as string;

	const body: IDataObject = {
		funnel_name: funnelName,
		from: formatDateForCleverTap(from),
		to: formatDateForCleverTap(to),
	};

	const response = await cleverTapApiRequest.call(this, 'POST', '/funnels.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getCohortReport(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const eventName = this.getNodeParameter('eventName', index) as string;
	const from = this.getNodeParameter('from', index) as string;
	const to = this.getNodeParameter('to', index) as string;
	const cohortType = this.getNodeParameter('cohortType', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		event_name: eventName,
		from: formatDateForCleverTap(from),
		to: formatDateForCleverTap(to),
		cohort_type: cohortType,
	};

	if (additionalFields.returnEventName) {
		body.return_event_name = additionalFields.returnEventName;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/cohorts.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getRetentionReport(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const eventName = this.getNodeParameter('eventName', index) as string;
	const from = this.getNodeParameter('from', index) as string;
	const to = this.getNodeParameter('to', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		event_name: eventName,
		from: formatDateForCleverTap(from),
		to: formatDateForCleverTap(to),
	};

	if (additionalFields.cohortType) {
		body.cohort_type = additionalFields.cohortType;
	}

	if (additionalFields.unique !== undefined) {
		body.unique = additionalFields.unique;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/retention.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export const reportOperations = {
	getRealTime,
	getTrends,
	getMessageReport,
	getRevenueReport,
	getUninstallReport,
	getFunnelReport,
	getCohortReport,
	getRetentionReport,
};
