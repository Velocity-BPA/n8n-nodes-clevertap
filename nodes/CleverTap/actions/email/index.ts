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
	const from = this.getNodeParameter('from', index) as string;
	const subject = this.getNodeParameter('subject', index) as string;
	const body = this.getNodeParameter('body', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		to: {
			identity: identities.split(',').map((id) => id.trim()),
		},
		content: {
			from,
			subject,
			body,
		},
	};

	if (additionalFields.replyTo) {
		(payload.content as IDataObject).reply_to = additionalFields.replyTo;
	}

	if (additionalFields.senderName) {
		(payload.content as IDataObject).sender_name = additionalFields.senderName;
	}

	if (additionalFields.tags) {
		(payload.content as IDataObject).tags = (additionalFields.tags as string)
			.split(',')
			.map((t) => t.trim());
	}

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/email/schedule.json', payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function sendToSegment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const segmentName = this.getNodeParameter('segmentName', index) as string;
	const from = this.getNodeParameter('from', index) as string;
	const subject = this.getNodeParameter('subject', index) as string;
	const body = this.getNodeParameter('body', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		to: {
			segment: segmentName,
		},
		content: {
			from,
			subject,
			body,
		},
	};

	if (additionalFields.replyTo) {
		(payload.content as IDataObject).reply_to = additionalFields.replyTo;
	}

	if (additionalFields.senderName) {
		(payload.content as IDataObject).sender_name = additionalFields.senderName;
	}

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/email/schedule.json', payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function sendTemplate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identities = this.getNodeParameter('identities', index) as string;
	const templateId = this.getNodeParameter('templateId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		to: {
			identity: identities.split(',').map((id) => id.trim()),
		},
		content: {
			template_id: templateId,
		},
	};

	if (additionalFields.templateParams) {
		(payload.content as IDataObject).template_params = additionalFields.templateParams;
	}

	if (additionalFields.respectFrequencyCaps !== undefined) {
		payload.respect_frequency_caps = additionalFields.respectFrequencyCaps;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/email/schedule.json', payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getTemplates(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;

	const response = await cleverTapApiRequest.call(this, 'GET', '/email/templates.json');

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
	const subject = this.getNodeParameter('subject', index) as string;
	const body = this.getNodeParameter('body', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		name,
		subject,
		body,
	};

	if (additionalFields.from) {
		payload.from = additionalFields.from;
	}

	if (additionalFields.replyTo) {
		payload.reply_to = additionalFields.replyTo;
	}

	if (additionalFields.senderName) {
		payload.sender_name = additionalFields.senderName;
	}

	const response = await cleverTapApiRequest.call(
		this,
		'POST',
		'/email/templates/create.json',
		payload,
	);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function updateTemplate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const templateId = this.getNodeParameter('templateId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		id: templateId,
		...updateFields,
	};

	const response = await cleverTapApiRequest.call(
		this,
		'POST',
		'/email/templates/update.json',
		payload,
	);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function deleteTemplate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const templateId = this.getNodeParameter('templateId', index) as string;

	const response = await cleverTapApiRequest.call(this, 'POST', '/email/templates/delete.json', {
		id: templateId,
	});

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export const emailOperations = {
	send,
	sendToSegment,
	sendTemplate,
	getTemplates,
	createTemplate,
	updateTemplate,
	deleteTemplate,
};
