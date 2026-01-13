/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IHttpRequestMethods,
	IRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import { CLEVERTAP_REGIONS, BATCH_SIZE } from '../constants/constants';
import type { ICleverTapCredentials, ICleverTapResponse } from '../types/CleverTapTypes';

/**
 * Get the base URL for the CleverTap region
 */
export function getRegionUrl(region: string): string {
	return CLEVERTAP_REGIONS[region] || CLEVERTAP_REGIONS.US;
}

/**
 * Make an authenticated request to CleverTap API
 */
export async function cleverTapApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
): Promise<ICleverTapResponse> {
	const credentials = (await this.getCredentials('cleverTapApi')) as ICleverTapCredentials;
	const baseUrl = getRegionUrl(credentials.region);

	const options: IRequestOptions = {
		method,
		uri: `${baseUrl}${endpoint}`,
		headers: {
			'X-CleverTap-Account-Id': credentials.accountId,
			'X-CleverTap-Passcode': credentials.passcode,
			'Content-Type': 'application/json',
		},
		qs,
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	try {
		const response = await this.helpers.request(options);

		if (response.status === 'fail') {
			throw new NodeApiError(this.getNode(), response, {
				message: response.error || 'CleverTap API request failed',
			});
		}

		return response as ICleverTapResponse;
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		const errorMessage = error instanceof Error ? error.message : 'CleverTap API request failed';
		throw new NodeApiError(this.getNode(), { error: errorMessage }, {
			message: errorMessage,
		});
	}
}

/**
 * Upload records in batches
 */
export async function cleverTapBatchUpload(
	this: IExecuteFunctions,
	records: IDataObject[],
	batchSize: number = BATCH_SIZE,
): Promise<ICleverTapResponse[]> {
	const results: ICleverTapResponse[] = [];

	for (let i = 0; i < records.length; i += batchSize) {
		const batch = records.slice(i, i + batchSize);
		const response = await cleverTapApiRequest.call(this, 'POST', '/upload', {
			d: batch,
		});
		results.push(response);
	}

	return results;
}

/**
 * Paginate through all results using cursor
 */
export async function cleverTapApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
	limit?: number,
): Promise<IDataObject[]> {
	const results: IDataObject[] = [];
	let cursor: string | null = null;

	do {
		const requestBody: IDataObject = { ...body };
		if (cursor) {
			requestBody.cursor = cursor;
		}

		const response = await cleverTapApiRequest.call(this, method, endpoint, requestBody, query);

		if (response.records) {
			results.push(...(response.records as unknown as IDataObject[]));
		} else if (response.data) {
			results.push(...(response.data as IDataObject[]));
		}

		cursor = response.cursor || response.next_cursor || null;

		if (limit && results.length >= limit) {
			return results.slice(0, limit);
		}
	} while (cursor);

	return results;
}

/**
 * Wait for async export to complete and retrieve results
 */
export async function cleverTapWaitForExport(
	this: IExecuteFunctions,
	reqId: number,
	maxAttempts: number = 30,
	delayMs: number = 2000,
): Promise<ICleverTapResponse> {
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		const response = await cleverTapApiRequest.call(this, 'GET', '/get/req_id', undefined, {
			req_id: reqId,
		});

		if (response.status === 'success' && response.records) {
			return response;
		}

		// Wait before next attempt
		await new Promise((resolve) => setTimeout(resolve, delayMs));
	}

	throw new Error(`Export request ${reqId} did not complete within the expected time`);
}

/**
 * Format date to YYYYMMDD format
 */
export function formatDateForCleverTap(date: Date | string): number {
	const d = typeof date === 'string' ? new Date(date) : date;
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return parseInt(`${year}${month}${day}`, 10);
}

/**
 * Convert Unix timestamp to date string
 */
export function unixToDateString(timestamp: number): string {
	return new Date(timestamp * 1000).toISOString();
}

/**
 * Get Unix timestamp
 */
export function getUnixTimestamp(date?: Date | string): number {
	const d = date ? (typeof date === 'string' ? new Date(date) : date) : new Date();
	return Math.floor(d.getTime() / 1000);
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string): boolean {
	if (!phone || phone.trim() === '') {
		return false;
	}
	// CleverTap expects phone with country code
	// Allow spaces and dashes in the number
	const cleanPhone = phone.replace(/[\s\-()]/g, '');
	const phoneRegex = /^\+[1-9]\d{1,14}$/;
	return phoneRegex.test(cleanPhone);
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
	if (!email || email.trim() === '') {
		return false;
	}
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Build segment query from parameters
 */
export function buildSegmentQuery(params: IDataObject): IDataObject {
	const query: IDataObject = {};

	// Handle simple property-based query
	if (params.property && params.operator && params.value !== undefined) {
		const operatorMap: Record<string, string> = {
			equals: 'eq',
			not_equals: 'neq',
			contains: 'contains',
			greater_than: 'gt',
			less_than: 'lt',
			exists: 'exists',
		};
		const op = operatorMap[params.operator as string] || params.operator;
		query.common_profile_prop = {
			[params.property as string]: { [op as string]: params.value },
		};
	}

	// Handle event-based query
	if (params.eventName) {
		query.event_name = params.eventName;
		if (params.eventOperator || params.eventValue !== undefined) {
			query.event_queries = [{
				name: params.eventName,
				...(params.eventOperator && { operator: params.eventOperator }),
				...(params.eventValue !== undefined && { value: params.eventValue }),
			}];
		}
	}

	if (params.from) {
		query.from = formatDateForCleverTap(params.from as string);
	}

	if (params.to) {
		query.to = formatDateForCleverTap(params.to as string);
	}

	if (params.profileProperties) {
		query.common_profile_properties = params.profileProperties;
	}

	if (params.eventProperties) {
		query.event_properties = params.eventProperties;
	}

	return query;
}

/**
 * Build campaign content from parameters
 */
export function buildCampaignContent(params: IDataObject): IDataObject {
	const content: IDataObject = {};

	if (params.title) {
		content.title = params.title;
	}

	if (params.body) {
		content.body = params.body;
	}

	const platformSpecific: IDataObject = {};

	if (params.androidOptions) {
		platformSpecific.android = params.androidOptions;
	}

	if (params.iosOptions) {
		platformSpecific.ios = params.iosOptions;
	}

	if (params.webOptions) {
		platformSpecific.web = params.webOptions;
	}

	if (Object.keys(platformSpecific).length > 0) {
		content.platform_specific = platformSpecific;
	}

	return content;
}
