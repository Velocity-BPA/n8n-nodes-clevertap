/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

/**
 * Convert profile data from n8n format to CleverTap format
 */
export function convertProfileData(data: IDataObject): IDataObject {
	const profileData: IDataObject = {};

	if (data.name) {
		profileData.Name = data.name;
	}

	if (data.email) {
		profileData.Email = data.email;
	}

	if (data.phone) {
		profileData.Phone = data.phone;
	}

	if (data.gender) {
		profileData.Gender = data.gender;
	}

	if (data.dateOfBirth) {
		profileData.DOB = formatDateOfBirth(data.dateOfBirth as string);
	}

	if (data.photo) {
		profileData.Photo = data.photo;
	}

	// Subscription preferences
	if (data.emailSubscription !== undefined) {
		profileData['MSG-email'] = data.emailSubscription;
	}

	if (data.pushSubscription !== undefined) {
		profileData['MSG-push'] = data.pushSubscription;
	}

	if (data.smsSubscription !== undefined) {
		profileData['MSG-sms'] = data.smsSubscription;
	}

	if (data.whatsappSubscription !== undefined) {
		profileData['MSG-whatsapp'] = data.whatsappSubscription;
	}

	// Copy custom properties
	if (data.customProperties) {
		const custom = data.customProperties as IDataObject;
		Object.assign(profileData, custom);
	}

	return profileData;
}

/**
 * Format date of birth to DD-MM-YYYY format
 */
export function formatDateOfBirth(date: string): string {
	if (!date || date.trim() === '') {
		return '';
	}
	const d = new Date(date);
	if (isNaN(d.getTime())) {
		return '';
	}
	const day = String(d.getDate()).padStart(2, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const year = d.getFullYear();
	return `${day}-${month}-${year}`;
}

/**
 * Parse comma-separated string to array
 */
export function parseCommaSeparated(value: string): string[] {
	return value
		.split(',')
		.map((item) => item.trim())
		.filter((item) => item.length > 0);
}

/**
 * Build webhook URL for CleverTap trigger
 */
export function buildWebhookUrl(baseUrl: string, webhookId: string): string {
	return `${baseUrl}/webhook/${webhookId}/clevertap`;
}

/**
 * Validate identity format (max 1024 chars)
 */
export function validateIdentity(identity: string): boolean {
	return identity.length > 0 && identity.length <= 1024;
}

/**
 * Delay helper for rate limiting
 */
export async function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Exponential backoff delay calculator
 */
export function calculateBackoffDelay(attempt: number, baseDelay: number = 500): number {
	return Math.min(baseDelay * Math.pow(2, attempt), 30000);
}

/**
 * Parse CleverTap error response
 */
export function parseCleverTapError(error: unknown): string {
	if (typeof error === 'string') {
		return error;
	}
	if (typeof error === 'object' && error !== null) {
		const errorObj = error as IDataObject;
		if (errorObj.error) {
			// Handle nested error object
			if (typeof errorObj.error === 'object' && errorObj.error !== null) {
				const nestedError = errorObj.error as IDataObject;
				if (nestedError.message) {
					return nestedError.message as string;
				}
			}
			return errorObj.error as string;
		}
		if (errorObj.message) {
			return errorObj.message as string;
		}
	}
	return 'Unknown CleverTap API error';
}

/**
 * Clean empty values from object
 */
export function cleanEmptyValues(obj: IDataObject): IDataObject {
	const cleaned: IDataObject = {};
	
	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== null && value !== '') {
			if (typeof value === 'object' && !Array.isArray(value)) {
				const cleanedNested = cleanEmptyValues(value as IDataObject);
				if (Object.keys(cleanedNested).length > 0) {
					cleaned[key] = cleanedNested;
				}
			} else {
				cleaned[key] = value;
			}
		}
	}
	
	return cleaned;
}

/**
 * Merge custom key-value pairs into object
 */
export function mergeCustomKeyValues(
	base: IDataObject,
	customPairs: Array<{ key: string; value: string }>,
): IDataObject {
	const result = { ...base };
	
	for (const pair of customPairs) {
		if (pair.key && pair.key.trim()) {
			result[pair.key.trim()] = pair.value;
		}
	}
	
	return result;
}
