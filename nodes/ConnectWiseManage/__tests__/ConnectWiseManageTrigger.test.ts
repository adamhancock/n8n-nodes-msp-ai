import type { INodeTypeDescription, IWebhookResponseData } from 'n8n-workflow';
import { ConnectWiseManageTrigger } from '../ConnectWiseManageTrigger.node';

jest.mock('n8n-workflow', () => ({
	NodeApiError: jest.fn(),
	NodeOperationError: jest.fn(),
}));

describe('ConnectWiseManageTrigger Node', () => {
	let node: ConnectWiseManageTrigger;

	beforeEach(() => {
		node = new ConnectWiseManageTrigger();
		jest.clearAllMocks();
	});

	describe('Node Description', () => {
		it('should have correct properties', () => {
			const nodeDescription = node.description as INodeTypeDescription;
			expect(nodeDescription.name).toBe('connectWiseManageTrigger');
			expect(nodeDescription.displayName).toBe('ConnectWise Manage Trigger');
			expect(nodeDescription.group).toEqual(['trigger']);
			expect(nodeDescription.version).toBe(1);
			expect(nodeDescription.description).toBe('Handle ConnectWise Manage events via webhooks');
			expect(nodeDescription.webhooks).toHaveLength(1);
			expect(nodeDescription.webhooks![0]).toEqual({
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			});
		});

		it('should have required event type property', () => {
			const nodeDescription = node.description as INodeTypeDescription;
			const eventTypeProperty = nodeDescription.properties.find((p) => p.name === 'type');
			expect(eventTypeProperty).toBeDefined();
			expect(eventTypeProperty!.required).toBe(true);
			expect(eventTypeProperty!.type).toBe('options');
			expect(eventTypeProperty!.default).toBe('Ticket');
		});
	});

	describe('Load Options Method', () => {
		it('should return empty array if level is not Board', async () => {
			const getCurrentNodeParameter = jest.fn().mockReturnValue('Owner');
			const getCredentials = jest.fn();
			const requestWithAuthentication = jest.fn();

			const result = await node.methods.loadOptions.getLevelValues.call({
				getCurrentNodeParameter,
				getCredentials,
				helpers: { requestWithAuthentication },
			} as any);

			expect(result).toEqual([]);
			expect(getCurrentNodeParameter).toHaveBeenCalledWith('level');
		});

		it('should load board options when level is Board', async () => {
			const mockBoards = [
				{ id: 1, name: 'Service Board 1' },
				{ id: 2, name: 'Service Board 2' },
			];

			const getCurrentNodeParameter = jest.fn().mockReturnValue('Board');
			const getCredentials = jest.fn().mockResolvedValue({
				siteUrl: 'https://api.connectwise.com',
			});
			const requestWithAuthentication = jest.fn().mockResolvedValue(mockBoards);

			const result = await node.methods.loadOptions.getLevelValues.call({
				getCurrentNodeParameter,
				getCredentials,
				helpers: { requestWithAuthentication },
			} as any);

			expect(result).toEqual([
				{ name: 'Service Board 1', value: '1' },
				{ name: 'Service Board 2', value: '2' },
			]);
		});
	});

	describe('Webhook Methods', () => {
		let staticData: { webhookId?: string };
		let hookContext: any;

		beforeEach(() => {
			staticData = {};
			const requestWithAuthentication = jest.fn();
			const getNodeParameter = jest.fn();

			hookContext = {
				getCredentials: jest.fn().mockResolvedValue({
					siteUrl: 'https://api.connectwise.com',
				}),
				getNodeWebhookUrl: jest.fn().mockReturnValue('https://n8n.example.com/webhook/abc123'),
				getWorkflowStaticData: jest.fn().mockReturnValue(staticData),
				getNodeParameter,
				getNode: jest.fn().mockReturnValue({ name: 'ConnectWise Manage Trigger' }),
				helpers: {
					requestWithAuthentication,
				},
			};
		});

		describe('checkExists', () => {
			it('should return true if webhook exists', async () => {
				const mockWebhooks = [{ id: '123', url: 'https://n8n.example.com/webhook/abc123' }];
				hookContext.helpers.requestWithAuthentication.mockResolvedValue(mockWebhooks);

				const exists = await node.webhookMethods.default.checkExists.call(hookContext);

				expect(exists).toBe(true);
				expect(staticData.webhookId).toBe('123');
			});

			it('should return false if webhook does not exist', async () => {
				const mockWebhooks = [{ id: '123', url: 'https://different.url/webhook' }];
				hookContext.helpers.requestWithAuthentication.mockResolvedValue(mockWebhooks);

				const exists = await node.webhookMethods.default.checkExists.call(hookContext);

				expect(exists).toBe(false);
				expect(staticData.webhookId).toBeUndefined();
			});
		});

		describe('create', () => {
			beforeEach(() => {
				hookContext.getNodeParameter = jest.fn().mockImplementation((paramName: string) => {
					const params: { [key: string]: any } = {
						type: 'Ticket',
						level: 'Owner',
						active: true,
						isSelfSuppressed: true,
					};
					return params[paramName];
				});
			});

			it('should create webhook successfully', async () => {
				const mockResponse = { id: '123' };
				hookContext.helpers.requestWithAuthentication
					.mockResolvedValueOnce([])
					.mockResolvedValueOnce(mockResponse);

				const created = await node.webhookMethods.default.create.call(hookContext);

				expect(created).toBe(true);
				expect(staticData.webhookId).toBe('123');
			});

			it('should handle ObjectExists error and retry', async () => {
				let retryCount = 0;
				hookContext.helpers.requestWithAuthentication.mockImplementation(async () => {
					if (retryCount === 0) {
						retryCount++;
						const error = new Error('Object exists');
						(error as any).error = {
							code: 'InvalidObject',
							errors: [{ code: 'ObjectExists' }],
						};
						throw error;
					} else if (retryCount === 1) {
						retryCount++;
						return []; // cleanup response
					} else {
						return { id: '123' }; // successful creation
					}
				});

				const created = await node.webhookMethods.default.create.call(hookContext);

				expect(created).toBe(true);
				expect(staticData.webhookId).toBe('123');
				expect(hookContext.helpers.requestWithAuthentication).toHaveBeenCalledTimes(3);
			});
		});

		describe('delete', () => {
			it('should delete webhook successfully', async () => {
				staticData.webhookId = '123';
				hookContext.helpers.requestWithAuthentication.mockResolvedValueOnce(undefined);

				const deleted = await node.webhookMethods.default.delete.call(hookContext);

				expect(deleted).toBe(true);
				expect(staticData.webhookId).toBeUndefined();
			});

			it('should return true if no webhook ID exists', async () => {
				const deleted = await node.webhookMethods.default.delete.call(hookContext);

				expect(deleted).toBe(true);
				expect(hookContext.helpers.requestWithAuthentication).not.toHaveBeenCalled();
			});
		});
	});

	describe('Webhook Handler', () => {
		it('should process webhook data correctly', async () => {
			const mockRequestBody = { id: 123, type: 'Ticket', action: 'updated' };
			const webhookContext = {
				getRequestObject: jest.fn().mockReturnValue({ body: mockRequestBody }),
				helpers: {
					returnJsonArray: jest.fn((data) => [data]),
				},
			};

			const response = (await node.webhook.call(webhookContext as any)) as IWebhookResponseData;

			expect(response.workflowData![0]).toEqual([mockRequestBody]);
		});
	});
});
