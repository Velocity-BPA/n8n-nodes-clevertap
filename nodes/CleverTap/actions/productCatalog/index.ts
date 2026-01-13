/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import { cleverTapApiRequest, cleverTapBatchUpload } from '../../transport';

export async function upload(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const catalogId = this.getNodeParameter('catalogId', index) as string;
	const items = this.getNodeParameter('items', index) as IDataObject;
	const itemsArray = (items.item as IDataObject[]) || [];

	const records = itemsArray.map((item) => ({
		catalog_id: catalogId,
		...item,
	}));

	const results = await cleverTapBatchUpload.call(this, records);

	return [{ json: { results }, pairedItem: index }];
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const catalogId = this.getNodeParameter('catalogId', index) as string;
	const itemId = this.getNodeParameter('itemId', index) as string;

	const response = await cleverTapApiRequest.call(this, 'GET', '/catalog/item.json', undefined, {
		catalog_id: catalogId,
		item_id: itemId,
	});

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getMany(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const catalogId = this.getNodeParameter('catalogId', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const qs: IDataObject = {
		catalog_id: catalogId,
	};

	if (additionalFields.category) {
		qs.category = additionalFields.category;
	}

	if (additionalFields.cursor) {
		qs.cursor = additionalFields.cursor;
	}

	const response = await cleverTapApiRequest.call(this, 'GET', '/catalog/items.json', undefined, qs);

	const items = (response as unknown as IDataObject).items || [];

	if (!returnAll) {
		const limit = this.getNodeParameter('limit', index, 50) as number;
		return (items as IDataObject[])
			.slice(0, limit)
			.map((item) => ({ json: item, pairedItem: index }));
	}

	return (items as IDataObject[]).map((item) => ({ json: item, pairedItem: index }));
}

export async function update(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const catalogId = this.getNodeParameter('catalogId', index) as string;
	const itemId = this.getNodeParameter('itemId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		catalog_id: catalogId,
		item_id: itemId,
		...updateFields,
	};

	const response = await cleverTapApiRequest.call(this, 'POST', '/catalog/item/update.json', payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function deleteItem(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const catalogId = this.getNodeParameter('catalogId', index) as string;
	const itemId = this.getNodeParameter('itemId', index) as string;

	const response = await cleverTapApiRequest.call(this, 'POST', '/catalog/item/delete.json', {
		catalog_id: catalogId,
		item_id: itemId,
	});

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function createCatalog(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const payload: IDataObject = {
		name,
	};

	if (additionalFields.description) {
		payload.description = additionalFields.description;
	}

	if (additionalFields.schema) {
		payload.schema = additionalFields.schema;
	}

	const response = await cleverTapApiRequest.call(this, 'POST', '/catalog/create.json', payload);

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export async function getCatalogs(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;

	const response = await cleverTapApiRequest.call(this, 'GET', '/catalogs.json');

	const catalogs = (response as unknown as IDataObject).catalogs || [];

	if (!returnAll) {
		const limit = this.getNodeParameter('limit', index, 50) as number;
		return (catalogs as IDataObject[])
			.slice(0, limit)
			.map((item) => ({ json: item, pairedItem: index }));
	}

	return (catalogs as IDataObject[]).map((item) => ({ json: item, pairedItem: index }));
}

export async function deleteCatalog(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const catalogId = this.getNodeParameter('catalogId', index) as string;

	const response = await cleverTapApiRequest.call(this, 'POST', '/catalog/delete.json', {
		catalog_id: catalogId,
	});

	return [{ json: response as unknown as IDataObject, pairedItem: index }];
}

export const productCatalogOperations = {
	upload,
	get,
	getMany,
	update,
	delete: deleteItem,
	createCatalog,
	getCatalogs,
	deleteCatalog,
};
