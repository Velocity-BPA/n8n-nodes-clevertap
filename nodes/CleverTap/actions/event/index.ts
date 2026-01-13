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
	cleverTapApiRequestAllItems,
	getUnixTimestamp,
	formatDateForCleverTap,
} from '../../transport';

export async function upload(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identity = this.getNodeParameter('identity', index) as string;
	const eventName = this.getNodeParameter('eventName', index) as string;
	const eventData = this.getNodeParameter('eventData', index, {}) as IDataObject;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const record: IDataObject = {
		identity,
		type: 'event',
		evtName: eventName,
		evtData: eventData,
	};

	if (additionalFields.objectId) {
		record.objectId = additionalFields.objectId;
	}

	if (additionalFields.timestamp) {
		record.ts = getUnixTimestamp(additionalFields.timestamp as string);
	} else {
		record.ts = getUnixTimestamp();
	}

	const results = await cleverTapBatchUpload.call(this, [record]);

	return [{ json: { results }, pairedItem: index }];
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const identity = this.getNodeParameter('identity', index) as string;
	const eventName = this.getNodeParameter('eventName', index) as string;
	const from = this.getNodeParameter('from', index) as string;
	const to = this.getNodeParameter('to', index) as string;

	const body: IDataObject = {
		identity,
		event_name: eventName,
		from: formatDateForCleverTap(from),
		to: formatDateForCleverTap(to),
	};

	const response = await cleverTapApiRequest.call(this, 'POST', '/events.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getMany(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const eventName = this.getNodeParameter('eventName', index) as string;
	const from = this.getNodeParameter('from', index) as string;
	const to = this.getNodeParameter('to', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		event_name: eventName,
		from: formatDateForCleverTap(from),
		to: formatDateForCleverTap(to),
	};

	if (additionalFields.groups) {
		body.groups = additionalFields.groups;
	}

	if (additionalFields.eventProperties) {
		body.event_properties = additionalFields.eventProperties;
	}

	if (returnAll) {
		const results = await cleverTapApiRequestAllItems.call(
			this,
			'POST',
			'/events.json',
			body,
		);
		return results.map((item) => ({ json: item, pairedItem: index }));
	} else {
		const limit = this.getNodeParameter('limit', index, 50) as number;
		const results = await cleverTapApiRequestAllItems.call(
			this,
			'POST',
			'/events.json',
			body,
			undefined,
			limit,
		);
		return results.map((item) => ({ json: item, pairedItem: index }));
	}
}

export async function getCount(
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

	if (additionalFields.unique) {
		body.unique = additionalFields.unique;
	}

	if (additionalFields.groups) {
		body.groups = additionalFields.groups;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/counts/events.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getPropertyValues(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const eventName = this.getNodeParameter('eventName', index) as string;
	const propertyName = this.getNodeParameter('propertyName', index) as string;
	const from = this.getNodeParameter('from', index) as string;
	const to = this.getNodeParameter('to', index) as string;

	const body: IDataObject = {
		event_name: eventName,
		property_name: propertyName,
		from: formatDateForCleverTap(from),
		to: formatDateForCleverTap(to),
	};

	const response = await cleverTapApiRequest.call(
		this,
		'POST',
		'/events/propertyValues.json',
		body,
	);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getTopEvents(
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

	if (additionalFields.limit) {
		body.limit = additionalFields.limit;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/counts/top.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getTimeline(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identity = this.getNodeParameter('identity', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		identity,
	};

	if (additionalFields.cursor) {
		body.cursor = additionalFields.cursor;
	}

	if (additionalFields.batchSize) {
		body.batch_size = additionalFields.batchSize;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/timeline.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export const eventOperations = {
	upload,
	get,
	getMany,
	getCount,
	getPropertyValues,
	getTopEvents,
	getTimeline,
};
