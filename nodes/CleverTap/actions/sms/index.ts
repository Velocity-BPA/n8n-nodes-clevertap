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
	const content = this.getNodeParameter('content', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		to: {
			identity: identities.split(',').map((id) => id.trim()),
		},
		content: {
			body: content,
		},
	};

	if (additionalFields.senderId) {
		(payload.content as IDataObject).sender_id = additionalFields.senderId;
	}

	if (additionalFields.templateId) {
		(payload.content as IDataObject).template_id = additionalFields.templateId;
	}

	if (additionalFields.dltTemplateId) {
		(payload.content as IDataObject).dlt_template_id = additionalFields.dltTemplateId;
	}

	if (additionalFields.provider) {
		(payload.content as IDataObject).provider = additionalFields.provider;
	}

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/sms/schedule.json', payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function sendToSegment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const segmentName = this.getNodeParameter('segmentName', index) as string;
	const content = this.getNodeParameter('content', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		to: {
			segment: segmentName,
		},
		content: {
			body: content,
		},
	};

	if (additionalFields.senderId) {
		(payload.content as IDataObject).sender_id = additionalFields.senderId;
	}

	if (additionalFields.templateId) {
		(payload.content as IDataObject).template_id = additionalFields.templateId;
	}

	if (additionalFields.dltTemplateId) {
		(payload.content as IDataObject).dlt_template_id = additionalFields.dltTemplateId;
	}

	if (additionalFields.provider) {
		(payload.content as IDataObject).provider = additionalFields.provider;
	}

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/sms/schedule.json', payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getProviders(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const response = await cleverTapApiRequest.call(this, 'GET', '/sms/providers.json');

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function createTemplate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const content = this.getNodeParameter('content', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		name,
		body: content,
	};

	if (additionalFields.senderId) {
		payload.sender_id = additionalFields.senderId;
	}

	if (additionalFields.dltTemplateId) {
		payload.dlt_template_id = additionalFields.dltTemplateId;
	}

	const response = await cleverTapApiRequest.call(
		this,
		'POST',
		'/sms/templates/create.json',
		payload,
	);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getTemplates(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;

	const response = await cleverTapApiRequest.call(this, 'GET', '/sms/templates.json');

	const templates = (response as unknown as IDataObject).templates || [];

	if (!returnAll) {
		const limit = this.getNodeParameter('limit', index, 50) as number;
		return (templates as IDataObject[])
			.slice(0, limit)
			.map((item) => ({ json: item, pairedItem: index }));
	}

	return (templates as IDataObject[]).map((item) => ({ json: item, pairedItem: index }));
}

export const smsOperations = {
	send,
	sendToSegment,
	getProviders,
	createTemplate,
	getTemplates,
};
