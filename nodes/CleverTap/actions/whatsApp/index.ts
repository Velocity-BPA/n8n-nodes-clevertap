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
	const messageType = this.getNodeParameter('messageType', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		to: {
			identity: identities.split(',').map((id) => id.trim()),
		},
		content: {
			type: messageType,
		},
	};

	if (messageType === 'text') {
		const text = this.getNodeParameter('text', index) as string;
		(payload.content as IDataObject).text = text;
	}

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	const response = await cleverTapApiRequest.call(
		this,
		'POST',
		'/whatsapp/schedule.json',
		payload,
	);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function sendTemplate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identities = this.getNodeParameter('identities', index) as string;
	const templateName = this.getNodeParameter('templateName', index) as string;
	const languageCode = this.getNodeParameter('languageCode', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		to: {
			identity: identities.split(',').map((id) => id.trim()),
		},
		content: {
			type: 'template',
			template_name: templateName,
			language_code: languageCode,
		},
	};

	if (additionalFields.templateParams) {
		const params = additionalFields.templateParams as string;
		(payload.content as IDataObject).template_params = params.split(',').map((p) => p.trim());
	}

	if (additionalFields.hsmId) {
		(payload.content as IDataObject).hsm_id = additionalFields.hsmId;
	}

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	const response = await cleverTapApiRequest.call(
		this,
		'POST',
		'/whatsapp/schedule.json',
		payload,
	);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function sendMedia(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identities = this.getNodeParameter('identities', index) as string;
	const mediaType = this.getNodeParameter('mediaType', index) as string;
	const mediaUrl = this.getNodeParameter('mediaUrl', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		to: {
			identity: identities.split(',').map((id) => id.trim()),
		},
		content: {
			type: mediaType,
			media_url: mediaUrl,
		},
	};

	if (additionalFields.caption) {
		(payload.content as IDataObject).caption = additionalFields.caption;
	}

	if (additionalFields.filename) {
		(payload.content as IDataObject).filename = additionalFields.filename;
	}

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	const response = await cleverTapApiRequest.call(
		this,
		'POST',
		'/whatsapp/schedule.json',
		payload,
	);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getTemplates(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;

	const response = await cleverTapApiRequest.call(this, 'GET', '/whatsapp/templates.json');

	const templates = (response as unknown as IDataObject).templates || [];

	if (!returnAll) {
		const limit = this.getNodeParameter('limit', index, 50) as number;
		return (templates as IDataObject[])
			.slice(0, limit)
			.map((item) => ({ json: item, pairedItem: index }));
	}

	return (templates as IDataObject[]).map((item) => ({ json: item, pairedItem: index }));
}

export async function createTemplate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const languageCode = this.getNodeParameter('languageCode', index) as string;
	const category = this.getNodeParameter('category', index) as string;
	const content = this.getNodeParameter('content', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		name,
		language_code: languageCode,
		category,
		body: content,
	};

	if (additionalFields.headerType) {
		payload.header = {
			type: additionalFields.headerType,
			text: additionalFields.headerText,
		};
	}

	if (additionalFields.footer) {
		payload.footer = additionalFields.footer;
	}

	if (additionalFields.buttons) {
		payload.buttons = additionalFields.buttons;
	}

	const response = await cleverTapApiRequest.call(
		this,
		'POST',
		'/whatsapp/templates/create.json',
		payload,
	);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getConversations(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identity = this.getNodeParameter('identity', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const qs: IDataObject = {
		identity,
	};

	if (additionalFields.cursor) {
		qs.cursor = additionalFields.cursor;
	}

	if (additionalFields.limit) {
		qs.limit = additionalFields.limit;
	}

	const response = await cleverTapApiRequest.call(
		this,
		'GET',
		'/whatsapp/conversations.json',
		undefined,
		qs,
	);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export const whatsAppOperations = {
	send,
	sendTemplate,
	sendMedia,
	getTemplates,
	createTemplate,
	getConversations,
};
