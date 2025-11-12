import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

// Define interfaces and types
// Type definitions
export type StandardOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'update'
	| 'delete'
	| 'search'
	| 'getByPhoneNumber' // Renamed from searchByPhone for consistency
	| 'getByContact';
export type SpecialOperation =
	| 'getNotes'
	| 'addNote'
	| 'getCustomField'
	| 'updateCustomField'
	| 'getCustomFields'
	| 'getConfigurations'
	| 'listTypes' // Added
	| 'listSubtypes' // Added
	| 'listDocuments' // Added
	| 'downloadDocument'; // Added

interface ICustomField {
	id: string | number;
	caption?: string;
	value?: string | boolean;
}

interface ITicketData extends IDataObject {
	customFields?: ICustomField[];
}

interface IDataObject {
	[key: string]: any;
}

interface IRequestOptions {
	headers?: { [key: string]: string };
	method: Methods;
	body?: IDataObject;
	qs?: IDataObject;
	uri: string;
	json?: boolean;
}

enum Methods {
	GET = 'GET',
	POST = 'POST',
	PATCH = 'PATCH',
	DELETE = 'DELETE',
}

interface IResourceConfig {
	[key: string]: {
		endpoint: string;
		primaryKey: string;
		requiredCreateFields: string[];
		specialOperations?: {
			[key in SpecialOperation]?: {
				method: Methods;
				endpoint: (id?: string) => string;
				getBody?: (params: IDataObject) => IDataObject;
			};
		};
	};
}

// Resource configuration
const resourceConfig: IResourceConfig = {
	ticket: {
		endpoint: 'service/tickets',
		primaryKey: 'ticketId',
		requiredCreateFields: ['summary'],
		specialOperations: {
			getNotes: {
				method: Methods.GET,
				endpoint: (id) => `service/tickets/${id}/allNotes`,
				getBody: (params) => {
					const qs: IDataObject = {};
					if (params.conditions) {
						qs.conditions = params.conditions;
					}
					if (params.orderBy) {
						qs.orderBy = params.orderBy;
					}
					return qs;
				},
			},
			addNote: {
				method: Methods.POST,
				endpoint: (id) => `service/tickets/${id}/notes`,
				getBody: (params) => ({
					ticketId: params.ticketId,
					text: params.noteText,
					detailDescriptionFlag: params.detailDescription,
					internalAnalysisFlag: params.internalAnalysis,
					resolutionFlag: params.resolution,
				}),
			},
			getCustomField: {
				method: Methods.GET,
				endpoint: (id) => `service/tickets/${id}`,
			},
			updateCustomField: {
				method: Methods.PATCH,
				endpoint: (id) => `service/tickets/${id}`,
			},
			getCustomFields: {
				method: Methods.GET,
				endpoint: () =>
					`system/userDefinedFields?conditions=screenId='sr100'&orderBy=id desc&fields=id,connectwiseid,caption,fieldTypeIdentifier`,
			},
			getConfigurations: {
				method: Methods.GET,
				endpoint: (id) => `service/tickets/${id}/configurations`,
			},
			listTypes: {
				// Added
				method: Methods.GET,
				endpoint: (boardId) => `service/boards/${boardId}/types`,
				getBody: (params) => ({
					// Use getBody to pass typeId as query param
					fields: 'id,name',
					conditions: 'inactiveFlag=false',
					pageSize: 1000, // Optional: Add pagination if needed
				}),
			},
			listSubtypes: {
				// Added
				method: Methods.GET,
				endpoint: (boardId) => `service/boards/${boardId}/subtypes`,
				getBody: (params) => ({
					// Use getBody to pass typeId as query param
					fields: 'id,name,typeAssociationIds',
					pageSize: 1000, // Optional: Add pagination if needed
				}),
			},
			listDocuments: {
				// Added
				method: Methods.GET,
				endpoint: (id) => `service/tickets/${id}/documents`,
				getBody: (params) => {
					const qs: IDataObject = {};
					if (params.conditions) qs.conditions = params.conditions;
					if (params.orderBy) qs.orderBy = params.orderBy;
					// Handle pagination if returnAll is false
					if (!params.returnAll) {
						qs.page = params.page || 1;
						qs.pageSize = params.limit || 100;
					}
					return qs;
				},
			},
		},
	},
	company: {
		endpoint: 'company/companies',
		primaryKey: 'companyId',
		requiredCreateFields: ['name'],
	},
	time: {
		endpoint: 'time/entries',
		primaryKey: 'timeEntryId',
		requiredCreateFields: ['timeStart'],
	},
	purchaseOrder: {
		endpoint: 'procurement/purchaseorders',
		primaryKey: 'purchaseOrderId',
		requiredCreateFields: ['vendorId'],
	},
	schedule: {
		endpoint: 'schedule/entries',
		primaryKey: 'scheduleId',
		requiredCreateFields: ['objectType', 'objectId'],
	},
	productCatalog: {
		endpoint: 'procurement/catalog',
		primaryKey: 'productId',
		requiredCreateFields: ['name'],
	},
	opportunity: {
		endpoint: 'sales/opportunities',
		primaryKey: 'opportunityId',
		requiredCreateFields: ['name'],
	},
	member: {
		endpoint: 'system/members',
		primaryKey: 'memberId',
		requiredCreateFields: ['identifier'],
	},
	project: {
		endpoint: 'project/projects',
		primaryKey: 'projectId',
		requiredCreateFields: ['name'],
	},
	invoice: {
		endpoint: 'finance/invoices',
		primaryKey: 'invoiceId',
		requiredCreateFields: ['company'],
	},
	expense: {
		endpoint: 'expense/expenses',
		primaryKey: 'expenseId',
		requiredCreateFields: ['description'],
	},
	contact: {
		endpoint: 'company/contacts',
		primaryKey: 'contactId',
		requiredCreateFields: ['firstName', 'lastName'],
	},
	configuration: {
		endpoint: 'company/configurations',
		primaryKey: 'configurationId',
		requiredCreateFields: ['name'],
	},
	agreement: {
		endpoint: 'finance/agreements',
		primaryKey: 'agreementId',
		requiredCreateFields: ['name'],
	},
	activity: {
		endpoint: 'company/activities',
		primaryKey: 'activityId',
		requiredCreateFields: ['name'],
	},
	document: {
		// Added
		endpoint: 'system/documents', // Base endpoint for documents
		primaryKey: 'documentId',
		requiredCreateFields: [], // No create operation defined here
		specialOperations: {
			downloadDocument: {
				method: Methods.GET,
				endpoint: (id) => `system/documents/${id}/download`,
				// No getBody needed for download
			},
		},
	},
};

import { properties } from './properties';

export class ConnectWiseManage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ConnectWise Manage',
		name: 'connectWiseManage',
		icon: 'file:connectwise.svg',
		group: ['transform'],
		usableAsTool: true,
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume ConnectWise Manage API',
		defaults: {
			name: 'ConnectWise Manage',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'connectWiseManageApi',
				required: true,
			},
		],
		properties,
	};

	methods = {
		loadOptions: {
			async getCustomFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const options: INodePropertyOptions[] = [];
				const credentials = await this.getCredentials('connectWiseManageApi');

				try {
					const response = await this.helpers.requestWithAuthentication.call(
						this,
						'connectWiseManageApi',
						{
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/userDefinedFields?conditions=screenId='sr100'&fields=id,connectwiseid,caption,fieldTypeIdentifier`,
							json: true,
						},
					);

					if (Array.isArray(response)) {
						for (const field of response) {
							if (field.id && field.caption) {
								const valueToUse = field.connectwiseid || field.id;
								options.push({
									name: `${field.caption} (${valueToUse})`,
									value: valueToUse.toString(),
								});
							}
						}
					}

					return options;
				} catch (error) {
					console.error('Error loading custom fields:', error);
					return [{ name: 'Error Loading Fields', value: '' }];
				}
			},

			async getServiceBoards(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const options: INodePropertyOptions[] = [];
				const credentials = await this.getCredentials('connectWiseManageApi');

				try {
					const response = await this.helpers.requestWithAuthentication.call(
						this,
						'connectWiseManageApi',
						{
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/service/boards`,
							json: true,
							qs: {
								pageSize: 1000,
								conditions: 'inactiveFlag=false',
								fields: 'id,name',
								orderBy: 'name',
							},
						},
					);

					if (Array.isArray(response)) {
						for (const board of response) {
							if (board.id && board.name) {
								options.push({
									name: board.name,
									value: board.id.toString(),
								});
							}
						}
					}

					return options;
				} catch (error) {
					console.error('Error loading service boards:', error);
					return [{ name: 'Error Loading Boards', value: '' }];
				}
			},

			async getBoardSubtypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const options: INodePropertyOptions[] = [];
				const credentials = await this.getCredentials('connectWiseManageApi');

				try {
					const boardId = this.getNodeParameter('additionalFields.board') as string;
					const typeIdString = this.getNodeParameter('additionalFields.type') as string; // Get selected type ID
					const typeId = typeIdString ? parseInt(typeIdString, 10) : null; // Convert to number or null

					if (!boardId) {
						return [{ name: 'Please Select a Board First', value: '' }];
					}

					// Fetch all active subtypes for the board, including typeAssociationIds
					const response = await this.helpers.requestWithAuthentication.call(
						this,
						'connectWiseManageApi',
						{
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/service/boards/${boardId}/subtypes`,
							json: true,
							qs: {
								conditions: 'inactiveFlag=false',
								pageSize: 1000,
								orderBy: 'name',
								// Include typeAssociationIds in the fields requested
								fields: 'id,name,typeAssociationIds',
							},
						},
					);

					if (Array.isArray(response)) {
						for (const subtype of response) {
							// Check if subtype is valid
							if (subtype.id && subtype.name) {
								// If a typeId is selected, filter by typeAssociationIds
								if (typeId !== null) {
									if (
										subtype.typeAssociationIds &&
										Array.isArray(subtype.typeAssociationIds) &&
										subtype.typeAssociationIds.includes(typeId)
									) {
										options.push({
											name: subtype.name,
											value: subtype.id.toString(),
										});
									}
								} else {
									// If no typeId is selected, add all active subtypes
									options.push({
										name: subtype.name,
										value: subtype.id.toString(),
									});
								}
							}
						}
					}

					// Add a message if no subtypes match the selected type
					if (typeId !== null && options.length === 0) {
						return [{ name: 'No Subtypes Found for Selected Type', value: '' }];
					}

					return options;
				} catch (error) {
					console.error('Error loading board subtypes:', error);
					return [{ name: 'Error Loading Subtypes', value: '' }];
				}
			},

			async getBoardTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const options: INodePropertyOptions[] = [];
				const credentials = await this.getCredentials('connectWiseManageApi');

				try {
					const boardId = this.getNodeParameter('additionalFields.board') as string;

					if (!boardId) {
						return [{ name: 'Please Select a Board First', value: '' }];
					}

					const response = await this.helpers.requestWithAuthentication.call(
						this,
						'connectWiseManageApi',
						{
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/service/boards/${boardId}/types`,
							json: true,
							qs: {
								conditions: 'inactiveFlag=false',
								pageSize: 1000,
								orderBy: 'name',
								fields: 'id,name',
							},
						},
					);

					if (Array.isArray(response)) {
						for (const type of response) {
							if (type.id && type.name) {
								options.push({
									name: type.name,
									value: type.id.toString(),
								});
							}
						}
					}

					return options;
				} catch (error) {
					console.error('Error loading board types:', error);
					return [{ name: 'Error Loading Types', value: '' }];
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const node = this.getNode();

		// Type guards for operations
		const isSpecialOperation = (op: string): op is SpecialOperation =>
			[
				'getNotes',
				'addNote',
				'getCustomField',
				'updateCustomField',
				'getCustomFields',
				'getConfigurations',
				'listTypes', // Added
				'listSubtypes', // Added
				'listDocuments', // Added
				'downloadDocument', // Added
			].includes(op);

		const isStandardOperation = (op: string): op is StandardOperation =>
			[
				'create',
				'get',
				'getAll',
				'update',
				'delete',
				'search',
				'getByPhoneNumber',
				'getByContact',
			].includes(op);

		try {
			// Get parameters
			const resource = this.getNodeParameter('resource', 0) as string;

			const operation = this.getNodeParameter('operation', 0) as string;
			const credentials = await this.getCredentials('connectWiseManageApi');

			if (!isSpecialOperation(operation) && !isStandardOperation(operation)) {
				throw new NodeOperationError(node, `Operation '${operation}' is not supported`);
			}

			// Define API version and base URL
			const apiVersion = 'v4_6_release/apis/3.0';
			const baseUrl = `${credentials.siteUrl}/${apiVersion}`;

			// Helper function to make API requests
			const makeApiRequest = async (
				method: Methods,
				uri: string,
				body: IDataObject = {},
				qs: IDataObject = {},
			): Promise<IDataObject | IDataObject[]> => {
				const options: IRequestOptions = {
					headers: {
						'Content-Type': 'application/json',
					},
					method,
					uri,
					json: true,
					body: Object.keys(body).length > 0 ? body : undefined,
					qs: Object.keys(qs).length > 0 ? qs : undefined,
				};

				console.debug('DEBUG: Making API request:', { options }); // Added debug log

				try {
					return await this.helpers.requestWithAuthentication.call(
						this,
						'connectWiseManageApi',
						options,
					);
				} catch (error: any) {
					// Use 'any' to access potential response properties
					// Log the response body if available in the error object
					if (error.response && error.response.body) {
						console.error(
							'ConnectWise Error Response Body:',
							JSON.stringify(error.response.body, null, 2),
						);
					}
					// Re-throw a NodeOperationError, preserving original message if possible
					throw new NodeOperationError(
						node,
						error instanceof Error ? error.message : 'API request failed',
						// Removed the options object as 'cause' is not supported
					);
				}
			};

			for (let i = 0; i < items.length; i++) {
				try {
					let responseData: IDataObject | IDataObject[] | null = null;

					const currentResource = resourceConfig[resource] as {
						endpoint: string;
						primaryKey: string;
						requiredCreateFields: string[];
						specialOperations?: {
							[key in SpecialOperation]?: {
								method: Methods;
								endpoint: (id?: string) => string;
								getBody?: (params: IDataObject) => IDataObject;
							};
						};
					};

					if (!currentResource) {
						throw new NodeOperationError(this.getNode(), `Resource '${resource}' is not supported`);
					}

					// Check if this is a special operation
					const validSpecialOp = isSpecialOperation(operation);

					if (validSpecialOp) {
						const specialOp = currentResource.specialOperations?.[operation as SpecialOperation];
						if (!specialOp) {
							console.error(
								`DEBUG: Entering !specialOp block. Resource='${resource}', Operation='${operation}'`,
							); // Added error log
							throw new NodeOperationError(
								node,
								`Operation '${operation}' is not supported for resource '${resource}'`,
							);
						}

						const id = !['getCustomFields', 'listTypes', 'listSubtypes'].includes(operation)
							? (this.getNodeParameter(currentResource.primaryKey, i) as string)
							: undefined;
						// Removed unused boardId declaration here

						const uri = `${baseUrl}/${specialOp.endpoint(id)}`;

						switch (operation) {
							case 'getConfigurations': {
								const params: IDataObject = {
									ticketId: this.getNodeParameter(currentResource.primaryKey, i) as string,
								};
								const queryParams = specialOp?.getBody ? specialOp.getBody(params) : params;
								responseData = await makeApiRequest(specialOp.method, uri, {}, queryParams);
								break;
							}
							case 'listTypes': {
								const boardIdParam = this.getNodeParameter('boardId', i) as string;
								if (!boardIdParam)
									throw new NodeOperationError(
										node,
										'Board ID is required for listTypes operation',
									);
								const uriForTypes = `${baseUrl}/${specialOp.endpoint(boardIdParam)}`;
								// Pass standard filters for inactive items
								responseData = await makeApiRequest(
									specialOp.method,
									uriForTypes,
									{},
									{ conditions: 'inactiveFlag=false', pageSize: 1000, orderBy: 'name' },
								);
								break;
							}
							case 'listSubtypes': {
								const boardIdParam = this.getNodeParameter('boardId', i) as string;
								const typeIdParam = this.getNodeParameter('typeId', i) as string;
								if (!boardIdParam)
									throw new NodeOperationError(
										node,
										'Board ID is required for listSubtypes operation',
									);
								if (!typeIdParam)
									throw new NodeOperationError(
										node,
										'Type ID is required for listSubtypes operation',
									);
								const uriForSubtypes = `${baseUrl}/${specialOp.endpoint(boardIdParam)}`;
								const qs = specialOp.getBody ? specialOp.getBody({ typeId: typeIdParam }) : {};
								// Combine qs from getBody with default inactiveFlag filter and pagination/ordering
								const finalQs = {
									...qs,
									conditions: `${qs.conditions ? qs.conditions + ' and ' : ''}inactiveFlag=false`,
									pageSize: 1000,
									orderBy: 'name',
								};
								const response = await makeApiRequest(
									specialOp.method,
									uriForSubtypes,
									{},
									finalQs,
								);
								// Filter subtypes by typeAssociationIds
								responseData = response.filter(
									(subtype: IDataObject) =>
										subtype.typeAssociationIds &&
										subtype.typeAssociationIds.includes(parseInt(typeIdParam, 10)),
								);

								// remove typeAssociationIds from responseData
								responseData = responseData?.map((subtype: IDataObject) => {
									const { typeAssociationIds, ...rest } = subtype;
									return rest;
								});

								break;
							}

							case 'listDocuments': {
								// Added
								const params: IDataObject = {
									ticketId: this.getNodeParameter(currentResource.primaryKey, i) as string,
									conditions: this.getNodeParameter('conditions', i, '') as string,
									orderBy: this.getNodeParameter('orderBy', i, '') as string,
									returnAll: this.getNodeParameter('returnAll', i, false) as boolean,
									limit: this.getNodeParameter('limit', i, 100) as number,
									page: this.getNodeParameter('page', i, 1) as number, // Assuming page might be needed if not returnAll
								};
								const queryParams = specialOp?.getBody ? specialOp.getBody(params) : {};
								responseData = await makeApiRequest(specialOp.method, uri, {}, queryParams);
								break;
							}

							case 'downloadDocument': {
								// Initialize responseData to an empty array to prevent null check
								responseData = [];
								// Get document ID from parameters
								const documentId = this.getNodeParameter(currentResource.primaryKey, i) as string;
								if (!documentId) {
									throw new NodeOperationError(
										node,
										'Document ID parameter is missing or invalid for download operation.',
									);
								}

								const downloadUri = `${baseUrl}/${specialOp.endpoint(documentId)}`;

								// Need to call request helper directly for binary data
								const response = await this.helpers.requestWithAuthentication.call(
									this,
									'connectWiseManageApi',
									{
										method: specialOp.method,
										uri: downloadUri,
										encoding: null, // Get raw buffer
										resolveWithFullResponse: true, // Need headers for filename/type
									},
								);

								// Extract filename and mime type from headers if possible
								const contentDisposition = response.headers['content-disposition'];
								let fileName = `document_${id}`; // Default filename using 'id'
								if (contentDisposition) {
									const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
									if (filenameMatch && filenameMatch[1]) {
										fileName = filenameMatch[1];
									}
								}
								const mimeType = response.headers['content-type'] || 'application/octet-stream';

								// Prepare binary data for n8n output
								const binaryData = await this.helpers.prepareBinaryData(
									response.body as Buffer,
									fileName,
									mimeType,
								);
								// Structure the output item
								returnData.push({
									json: { documentId: documentId, fileName: fileName, mimeType: mimeType },
									binary: { data: binaryData },
								});
								break;
							}

							case 'getNotes': {
								const params: IDataObject = {};
								const conditions = this.getNodeParameter('conditions', i, '') as string;
								const orderBy = this.getNodeParameter('orderBy', i, '') as string;

								if (conditions) params.conditions = conditions;
								if (orderBy) params.orderBy = orderBy;

								const queryParams = specialOp?.getBody ? specialOp.getBody(params) : params;
								responseData = await makeApiRequest(
									specialOp.method,
									uri,
									{},
									Object.keys(queryParams).length > 0 ? queryParams : undefined,
								);
								break;
							}

							case 'getCustomField':
							case 'updateCustomField': {
								const customFieldId = this.getNodeParameter('customFieldId', i) as string;
								const customFieldValue =
									operation === 'updateCustomField'
										? (this.getNodeParameter('customFieldValue', i) as string)
										: '';

								if (operation === 'updateCustomField') {
									const ticketData = (await makeApiRequest(
										Methods.GET,
										uri,
										{},
										{},
									)) as ITicketData;

									if (!('customFields' in ticketData) || !Array.isArray(ticketData.customFields)) {
										throw new NodeOperationError(node, 'No custom fields found on ticket');
									}

									const customField = ticketData.customFields.find(
										(field: ICustomField) =>
											field.id.toString() === customFieldId ||
											(field.caption && field.caption.toString() === customFieldId),
									);

									if (!customField) {
										throw new NodeOperationError(
											node,
											`Custom field with ID ${customFieldId} not found on ticket`,
										);
									}

									responseData = await makeApiRequest(Methods.PATCH, uri, [
										{
											op: 'replace',
											path: '/customFields',
											value: {
												field: [
													{
														id: customFieldId,
														value: customFieldValue,
													},
												],
											},
										},
									]);
								} else {
									responseData = await makeApiRequest(Methods.GET, uri);
								}
								break;
							}

							case 'getCustomFields': {
								responseData = await makeApiRequest(specialOp.method, uri);
								break;
							}

							case 'addNote': {
								const params: IDataObject = {
									ticketId: this.getNodeParameter(currentResource.primaryKey, i) as string,
									noteText: this.getNodeParameter('noteText', i) as string,
									detailDescription: this.getNodeParameter('detailDescription', i) as boolean,
									internalAnalysis: this.getNodeParameter('internalAnalysis', i) as boolean,
									resolution: this.getNodeParameter('resolution', i) as boolean,
								};

								responseData = await makeApiRequest(
									specialOp.method,
									uri,
									specialOp.getBody ? specialOp.getBody(params) : params,
								);
								break;
							}

							// Removed default case as specific cases should cover all defined special ops
						}
					}
					// Removed extra closing brace that was here

					// Handle standard CRUD operations
					if (responseData === null && operation !== 'downloadDocument') {
						// Skip standard operation handling for document downloads
						switch (operation) {
							case 'create': {
								// Get required fields for this resource
								const body: IDataObject = {};
								for (const field of currentResource.requiredCreateFields) {
									body[field] = this.getNodeParameter(field, i);
								}

								// Add any additional fields
								const additionalFields = this.getNodeParameter(
									'additionalFields',
									i,
								) as IDataObject;
								Object.assign(body, additionalFields);

								responseData = await makeApiRequest(
									Methods.POST,
									`${baseUrl}/${currentResource.endpoint}`,
									body,
								);
								break;
							}

							case 'get': {
								const id = this.getNodeParameter(currentResource.primaryKey, i) as string;
								const fields = this.getNodeParameter('fields', i, '') as string;
								
								const qs: IDataObject = {};
								if (fields) {
									qs.fields = fields;
								}
								
								responseData = await makeApiRequest(
									Methods.GET,
									`${baseUrl}/${currentResource.endpoint}/${id}`,
									{},
									Object.keys(qs).length > 0 ? qs : undefined,
								);
								break;
							}

							case 'getByContact': {
								const contactId = this.getNodeParameter('contactId', i) as string;
								const returnAll = this.getNodeParameter('returnAll', i) as boolean;
								const limit = this.getNodeParameter('limit', i, 100) as number;
								const fields = this.getNodeParameter('fields', i, '') as string;

								// Initialize variables for pagination
								let page = 1;
								const pageSize = returnAll ? 1000 : limit;
								let allData: IDataObject[] = [];

								// Set initial query parameters
								const qs: IDataObject = {
									conditions: `contact/id=${contactId}`,
									pageSize,
									page,
								};
								
								if (fields) {
									qs.fields = fields;
								}

								// Make initial request
								let response = await makeApiRequest(
									Methods.GET,
									`${baseUrl}/${currentResource.endpoint}`,
									{},
									qs,
								);

								// If response is an array, add it to our results
								if (Array.isArray(response)) {
									allData = [...response];

									// Continue fetching pages until we have all data
									while (returnAll && response.length === pageSize) {
										page++;
										qs.page = page;

										response = await makeApiRequest(
											Methods.GET,
											`${baseUrl}/${currentResource.endpoint}`,
											{},
											qs,
										);

										if (Array.isArray(response)) {
											allData.push(...response);
										}
									}
								}

								responseData = allData;

								// If not returning all, limit the results
								if (!returnAll && Array.isArray(responseData)) {
									responseData = responseData.slice(0, limit);
								}
								break;
							}

							case 'getAll': {
								const returnAll = this.getNodeParameter('returnAll', i) as boolean;
								const limit = this.getNodeParameter('limit', i, 100) as number;
								const orderBy = this.getNodeParameter('orderBy', i) as string;
								const fields = this.getNodeParameter('fields', i, '') as string;

								// Initialize variables for pagination
								let page = 1;
								const pageSize = returnAll ? 1000 : limit;
								let allData: any[] = [];

								// Set initial query parameters
								const qs: IDataObject = {
									pageSize,
									page,
									orderBy,
								};

								// Add search conditions if provided
								const searchConditions = this.getNodeParameter('conditions', i, '') as string;
								if (searchConditions) {
									qs.conditions = searchConditions;
								}

								// Add fields parameter if provided
								if (fields) {
									qs.fields = fields;
								}

								// Add any additional filters for ticket searches
								if (resource === 'ticket') {
									const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
									Object.assign(qs, filters);
								}

								// Make initial request
								let response = await makeApiRequest(
									Methods.GET,
									`${baseUrl}/${currentResource.endpoint}`,
									{},
									qs,
								);

								// If response is an array, add it to our results
								if (Array.isArray(response)) {
									allData = [...response];
								}

								// Continue fetching pages until we have all data
								while (
									returnAll &&
									response &&
									Array.isArray(response) &&
									response.length === pageSize
								) {
									page++;
									qs.page = page;

									response = await makeApiRequest(
										Methods.GET,
										`${baseUrl}/${currentResource.endpoint}`,
										{},
										qs,
									);

									if (Array.isArray(response)) {
										allData.push(...response);
									}
								}

								responseData = allData;

								// If not returning all, limit the results
								if (!returnAll && Array.isArray(responseData)) {
									responseData = responseData.slice(0, limit);
								}
								break;
							}

							case 'update': {
								const id = this.getNodeParameter(currentResource.primaryKey, i) as string;
								const additionalFields = this.getNodeParameter(
									'additionalFields',
									i,
								) as IDataObject;

								// Convert additionalFields to JSON Patch format (array of operations)
								const patchOperations: { op: string; path: string; value: any }[] = [];
								const referenceFields = new Set([
									'board',
									'type',
									'subType',
									'priority',
									'status',
									'company',
									'contact',
									'agreement',
								]); // Add other reference fields if needed

								for (const key in additionalFields) {
									if (
										!additionalFields.hasOwnProperty(key) ||
										additionalFields[key] === undefined ||
										additionalFields[key] === null ||
										additionalFields[key] === ''
									) {
										continue; // Skip empty or null fields
									}

									let path = `/${key}`;
									let value = additionalFields[key];

									// Handle custom fields specifically
									if (key === 'customFields' && value?.field && Array.isArray(value.field)) {
										// ConnectWise PATCH for custom fields often requires replacing the whole array element
										// based on its ID. Construct patch operations for each custom field provided.
										for (const fieldEntry of value.field) {
											if (fieldEntry.id && 'value' in fieldEntry) {
												let cfValue = fieldEntry.value;
												// Basic boolean conversion
												if (cfValue === 'true') cfValue = true;
												if (cfValue === 'false') cfValue = false;
												// Note: More robust type checking based on fieldTypeIdentifier might be needed

												// This assumes the API wants the entire custom field object replaced.
												// A more granular patch might be /customFields/id={fieldEntry.id}/value
												// but that depends on the specific API implementation.
												// Sticking closer to the previous logic's apparent intent for now.
												patchOperations.push({
													op: 'replace', // Or 'add' if the field might not exist? 'replace' is safer.
													path: `/customFields`, // Path to the array
													value: [{ id: fieldEntry.id, value: cfValue }], // Value is an array containing the object to update/add
												});
											}
										}
										continue; // Skip the generic handling below for customFields key
									}

									// Handle reference fields (use direct numeric ID as value)
									if (referenceFields.has(key)) {
										// Ensure the value is treated as a numeric ID
										value = Number(value); // Use the direct number
										// Adjust path for reference fields that require /id suffix
										if (
											[
												'priority',
												'status',
												'type',
												'subType',
												'board',
												'company',
												'contact',
												'agreement',
											].includes(key)
										) {
											if (key === 'subType') {
												path = '/subType/id'; // Use camelCase for subtype
											} else {
												path = `/${key}/id`; // Default for other reference fields needing /id
											}
										} else {
											// If other reference fields don't need /id, handle them here
											// path = `/${key}`; // Default path if /id is not needed
										}
									}
									// Handle simple fields (use direct value) - value is already set correctly above
									// Handle simple fields (use direct value) - no special handling needed here

									patchOperations.push({
										op: 'replace',
										path: path,
										value: value,
									});
								}

								responseData = await makeApiRequest(
									Methods.PATCH,
									`${baseUrl}/${currentResource.endpoint}/${id}`,
									patchOperations,
								);
								break;
							}

							case 'delete': {
								const id = this.getNodeParameter(currentResource.primaryKey, i) as string;
								responseData = await makeApiRequest(
									Methods.DELETE,
									`${baseUrl}/${currentResource.endpoint}/${id}`,
								);
								break;
							}

							case 'search': {
								const conditions = this.getNodeParameter('conditions', i) as string;
								const orderBy = this.getNodeParameter('orderBy', i) as string;
								const returnAll = this.getNodeParameter('returnAll', i) as boolean;
								const limit = returnAll ? undefined : (this.getNodeParameter('limit', i) as number);
								const fields = this.getNodeParameter('fields', i, '') as string;

								// Initialize variables for pagination
								let page = 1;
								const pageSize = 1000; // Use maximum page size for efficient pagination
								let allData: any[] = [];

								// Set initial query parameters
								const qs: IDataObject = {
									conditions,
									orderBy,
									page,
									pageSize,
								};

								// Add fields parameter if provided
								if (fields) {
									qs.fields = fields;
								}

								// Add any additional filters for ticket searches
								if (resource === 'ticket') {
									const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
									Object.assign(qs, filters);
								}

								// Make initial request
								let response = await makeApiRequest(
									Methods.GET,
									`${baseUrl}/${currentResource.endpoint}`,
									{},
									qs,
								);

								// If response is an array, add it to our results
								if (Array.isArray(response)) {
									allData = [...response];
								}

								// Continue fetching pages until we have all data
								while (
									returnAll &&
									response &&
									Array.isArray(response) &&
									response.length === pageSize
								) {
									page++;
									qs.page = page;

									response = await makeApiRequest(
										Methods.GET,
										`${baseUrl}/${currentResource.endpoint}`,
										{},
										qs,
									);

									if (Array.isArray(response)) {
										allData.push(...response);
									}
								}

								responseData = allData;

								// If not returning all, limit the results
								if (!returnAll && Array.isArray(responseData)) {
									responseData = responseData.slice(0, limit);
								}
								break;
							}

							case 'getByPhoneNumber': {
								// This operation searches contacts by phone and returns the associated company.
								const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
								if (!phoneNumber) {
									throw new NodeOperationError(
										this.getNode(),
										'Phone Number is required for getByPhoneNumber operation.',
										{ itemIndex: i },
									);
								}

								// Target the contacts endpoint
								const contactsEndpoint = resourceConfig['contact'].endpoint; // Use contact config
								const uri = `${credentials.siteUrl}/v4_6_release/apis/3.0/${contactsEndpoint}`;
								const qs: IDataObject = {
									// Use childConditions to search contact communication items
									childConditions: `communicationItems/value like "%${phoneNumber}%" AND communicationItems/communicationType = 'Phone'`,
									// Include company details in the response
									fields: 'id,firstName,lastName,company',
									// We only need the first result
									pageSize: 1,
								};

								// Call makeApiRequest for contacts
								const contactsResponse = await makeApiRequest(Methods.GET, uri, {}, qs);

								// Process the response
								if (Array.isArray(contactsResponse) && contactsResponse.length > 0) {
									const firstContact = contactsResponse[0];
									// Extract the company object from the first contact
									if (firstContact.company) {
										// Return only the company object as a single-item array
										responseData = [firstContact.company];
									} else {
										// Contact found but no associated company
										responseData = [];
									}
								} else {
									// No contacts found for that phone number
									responseData = [];
								}
								break;
							}
							default:
								throw new NodeOperationError(
									node,
									`The Operation '${operation}' is not supported for resource '${resource}'`,
								);
						} // End of switch statement
					} // End of if (responseData === null ...)

					// Format the response data (This should be outside the 'if', but inside the 'try')
					if (responseData !== null) {
						if (operation === 'get' || !Array.isArray(responseData)) {
							// Handle single item response or non-array response
							returnData.push({
								json: responseData as IDataObject,
								pairedItem: { item: i },
							});
						} else {
							// Handle array response
							returnData.push(
								...responseData.map((item) => ({
									json: item,
									pairedItem: { item: i },
								})),
							);
						}
					}
					// Catch block for the inner try
				} catch (error: Error | unknown) {
					if (this.continueOnFail()) {
						returnData.push({
							json: {
								error: error instanceof Error ? error.message : JSON.stringify(error), // Stringify unknown errors
							},
							pairedItem: { item: i }, // Include pairedItem for context
						});
						continue; // Continue to the next item in the loop
					}
					// If not continuing on fail, wrap and re-throw the error
					if (error instanceof NodeOperationError) {
						// If it's already a NodeOperationError, add itemIndex if missing
						error.context = { ...error.context, itemIndex: i };
						throw error;
					}
					// Wrap other errors in NodeOperationError
					throw new NodeOperationError(
						node,
						error instanceof Error ? error.message : 'Unknown error occurred during item execution',
						{ itemIndex: i }, // Add itemIndex for context
					);
				}
			} // End of for loop

			return [returnData]; // Return successful results
			// Catch block for the outer try (errors outside the loop)
		} catch (error: Error | unknown) {
			// If the node fails, throw the error
			if (error instanceof NodeOperationError) {
				// Re-throw NodeOperationErrors directly
				throw error;
			}
			// Wrap other errors
			throw new NodeOperationError(
				node,
				error instanceof Error ? error.message : 'Unknown error occurred during node execution',
			);
		}
	} // End of execute method
} // End of class ConnectWiseManage with semi-colon
