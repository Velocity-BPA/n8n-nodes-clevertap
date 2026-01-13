/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import {
	cleverTapApiRequest,
	cleverTapApiRequestAllItems,
	cleverTapWaitForExport,
	formatDateForCleverTap,
} from '../../transport';

export async function create(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const segmentType = this.getNodeParameter('segmentType', index) as string;
	const segmentQuery = this.getNodeParameter('segmentQuery', index, {}) as IDataObject;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		name,
		type: segmentType,
	};

	// Build query
	if (segmentQuery.eventName) {
		payload.event_name = segmentQuery.eventName;
	}

	if (segmentQuery.from) {
		payload.from = formatDateForCleverTap(segmentQuery.from as string);
	}

	if (segmentQuery.to) {
		payload.to = formatDateForCleverTap(segmentQuery.to as string);
	}

	if (segmentQuery.eventQueries) {
		payload.event_queries = segmentQuery.eventQueries;
	}

	if (segmentQuery.profileProperties) {
		payload.common_profile_prop = segmentQuery.profileProperties;
	}

	if (additionalFields.behavior) {
		payload.behavior = additionalFields.behavior;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/segment.json', payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const segmentId = this.getNodeParameter('segmentId', index) as string;

	const response = await cleverTapApiRequest.call(this, 'GET', '/segment.json', undefined, {
		id: segmentId,
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

	if (additionalFields.type) {
		qs.type = additionalFields.type;
	}

	const response = await cleverTapApiRequest.call(this, 'GET', '/segments.json', undefined, qs);

	const segments = (response as unknown as IDataObject).segments || [];

	if (!returnAll) {
		const limit = this.getNodeParameter('limit', index, 50) as number;
		return (segments as IDataObject[])
			.slice(0, limit)
			.map((item) => ({ json: item, pairedItem: index }));
	}

	return (segments as IDataObject[]).map((item) => ({ json: item, pairedItem: index }));
}

export async function getUsers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const segmentId = this.getNodeParameter('segmentId', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		segment_id: segmentId,
	};

	if (additionalFields.batchSize) {
		body.batch_size = additionalFields.batchSize;
	}

	if (returnAll) {
		const results = await cleverTapApiRequestAllItems.call(
			this,
			'POST',
			'/segment/users.json',
			body,
		);
		return results.map((item) => ({ json: item, pairedItem: index }));
	} else {
		const limit = this.getNodeParameter('limit', index, 50) as number;
		const results = await cleverTapApiRequestAllItems.call(
			this,
			'POST',
			'/segment/users.json',
			body,
			undefined,
			limit,
		);
		return results.map((item) => ({ json: item, pairedItem: index }));
	}
}

export async function estimate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const segmentQuery = this.getNodeParameter('segmentQuery', index, {}) as IDataObject;

	const body: IDataObject = {};

	if (segmentQuery.eventName) {
		body.event_name = segmentQuery.eventName;
	}

	if (segmentQuery.from) {
		body.from = formatDateForCleverTap(segmentQuery.from as string);
	}

	if (segmentQuery.to) {
		body.to = formatDateForCleverTap(segmentQuery.to as string);
	}

	if (segmentQuery.profileProperties) {
		body.common_profile_prop = segmentQuery.profileProperties;
	}

	if (segmentQuery.eventQueries) {
		body.event_queries = segmentQuery.eventQueries;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/segment/estimate.json', body);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function deleteSegment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const segmentId = this.getNodeParameter('segmentId', index) as string;

	const response = await cleverTapApiRequest.call(this, 'POST', '/segment/delete.json', {
		id: segmentId,
	});

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function downloadUsers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const segmentId = this.getNodeParameter('segmentId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		segment_id: segmentId,
	};

	if (additionalFields.properties) {
		body.properties = additionalFields.properties;
	}

	// Initiate async download
	const initResponse = await cleverTapApiRequest.call(
		this,
		'POST',
		'/segment/download.json',
		body,
	);

	// Wait for download to complete
	if (initResponse.req_id) {
		const result = await cleverTapWaitForExport.call(this, initResponse.req_id);
		return [{ json: result as unknown as IDataObject, pairedItem: index }];
	}

	return [{ json: initResponse as unknown as IDataObject, pairedItem: index }];
}

export const segmentOperations = {
	create,
	get,
	getMany,
	getUsers,
	estimate,
	delete: deleteSegment,
	downloadUsers,
};
