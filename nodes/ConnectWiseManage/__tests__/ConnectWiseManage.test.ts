import type { IExecuteFunctions, INodeTypeDescription, INode } from 'n8n-workflow';
import { ConnectWiseManage } from '../ConnectWiseManage.node';

const MockNodeOperationError = class extends Error {
	constructor(nodeObject: INode, message: string) {
		super(message);
		this.name = 'NodeOperationError';
	}
};

jest.mock('n8n-workflow', () => ({
	NodeApiError: jest.fn(),
	NodeOperationError: MockNodeOperationError,
}));

describe('ConnectWiseManage Node', () => {
	let node: ConnectWiseManage;
	let getNodeParameter: jest.Mock;
	let getInputData: jest.Mock;
	let getCredentials: jest.Mock;
	let getNode: jest.Mock;
	let continueOnFail: jest.Mock;
	let requestWithAuthentication: jest.Mock;

	const mockNode: INode = {
		id: 'test-node',
		name: 'ConnectWise Manage',
		type: 'n8n-nodes-base.connectWiseManage',
		typeVersion: 1,
		position: [0, 0],
		parameters: {},
	};

	beforeEach(() => {
		node = new ConnectWiseManage();

		// Create individual mocks
		getNodeParameter = jest.fn();
		getInputData = jest.fn().mockReturnValue([{}]);
		getCredentials = jest.fn().mockResolvedValue({
			siteUrl: 'https://api.connectwise.com',
		});
		getNode = jest.fn().mockReturnValue(mockNode);
		continueOnFail = jest.fn().mockReturnValue(false);
		requestWithAuthentication = jest.fn();
	});

	const mockExecuteFunctions = () =>
		({
			getNodeParameter,
			getInputData,
			getCredentials,
			getNode,
			continueOnFail,
			helpers: {
				requestWithAuthentication,
			},
		}) as unknown as IExecuteFunctions;

	describe('Node Description', () => {
		it('should have correct properties', () => {
			const nodeDescription = node.description as INodeTypeDescription;
			expect(nodeDescription.name).toBe('connectWiseManage');
			expect(nodeDescription.displayName).toBe('ConnectWise Manage');
			expect(nodeDescription.version).toBe(1);
			expect(nodeDescription.group).toEqual(['transform']);
			expect(nodeDescription.credentials).toBeDefined();
			expect(nodeDescription.credentials![0].name).toBe('connectWiseManageApi');
		});
	});

	describe('CRUD Operations', () => {
		describe('Create Operation', () => {
			beforeEach(() => {
				getNodeParameter
					.mockReturnValueOnce('ticket') // resource
					.mockReturnValueOnce('create') // operation
					.mockReturnValueOnce('Test Ticket') // summary (required field)
					.mockReturnValueOnce({}); // additionalFields
			});

			it('should create a ticket successfully', async () => {
				const mockResponse = { id: 1, summary: 'Test Ticket' };
				requestWithAuthentication.mockResolvedValueOnce(mockResponse);

				const result = await node.execute.call(mockExecuteFunctions());

				expect(result).toHaveLength(1);
				expect(result[0]).toHaveLength(1);
				expect(result[0][0].json).toEqual(mockResponse);
			});

			it('should throw error when required fields are missing', async () => {
				getNodeParameter
					.mockReturnValueOnce('ticket')
					.mockReturnValueOnce('create')
					.mockReturnValueOnce(undefined); // missing required field

				requestWithAuthentication.mockRejectedValueOnce(
					new MockNodeOperationError(mockNode, 'Required field "summary" is missing'),
				);

				await expect(node.execute.call(mockExecuteFunctions())).rejects.toThrow(
					'Required field "summary" is missing',
				);
			});
		});

		describe('Get Operation', () => {
			beforeEach(() => {
				getNodeParameter
					.mockReturnValueOnce('ticket')
					.mockReturnValueOnce('get')
					.mockReturnValueOnce('123');
			});

			it('should get a ticket successfully', async () => {
				const mockResponse = { id: 123, summary: 'Test Ticket' };
				requestWithAuthentication.mockResolvedValueOnce(mockResponse);

				const result = await node.execute.call(mockExecuteFunctions());

				expect(result).toHaveLength(1);
				expect(result[0]).toHaveLength(1);
				expect(result[0][0].json).toEqual(mockResponse);
			});
		});
	});

	describe('Error Handling', () => {
		it('should handle API errors gracefully when continueOnFail is true', async () => {
			getNodeParameter
				.mockReturnValueOnce('ticket')
				.mockReturnValueOnce('get')
				.mockReturnValueOnce('123');

			continueOnFail.mockReturnValue(true);
			requestWithAuthentication.mockRejectedValue(new Error('API Error'));

			const result = await node.execute.call(mockExecuteFunctions());

			expect(result).toHaveLength(1);
			expect(result[0]).toHaveLength(1);
			expect(result[0][0].json).toHaveProperty('error');
		});

		it('should throw error when continueOnFail is false', async () => {
			getNodeParameter
				.mockReturnValueOnce('ticket')
				.mockReturnValueOnce('get')
				.mockReturnValueOnce('123');

			continueOnFail.mockReturnValue(false);
			requestWithAuthentication.mockRejectedValue(new Error('API Error'));

			await expect(node.execute.call(mockExecuteFunctions())).rejects.toThrow('API Error');
		});
	});

	describe('Pagination', () => {
		beforeEach(() => {
			getNodeParameter
				.mockReturnValueOnce('ticket')
				.mockReturnValueOnce('getAll')
				.mockReturnValueOnce(true)
				.mockReturnValueOnce(100)
				.mockReturnValueOnce('id desc')
				.mockReturnValueOnce(1)
				.mockReturnValueOnce(50);
		});

		it('should handle pagination correctly', async () => {
			const page1 = Array(50).fill({ id: 1 });
			const page2 = Array(50).fill({ id: 2 });
			const page3 = Array(25).fill({ id: 3 });

			requestWithAuthentication
				.mockResolvedValueOnce(page1)
				.mockResolvedValueOnce(page2)
				.mockResolvedValueOnce(page3);

			const result = await node.execute.call(mockExecuteFunctions());

			expect(result).toHaveLength(1);
			expect(result[0]).toHaveLength(125);
			expect(requestWithAuthentication).toHaveBeenCalledTimes(3);
		});

		it('should respect the limit when returnAll is false', async () => {
			getNodeParameter
				.mockReturnValueOnce('ticket')
				.mockReturnValueOnce('getAll')
				.mockReturnValueOnce(false)
				.mockReturnValueOnce(10)
				.mockReturnValueOnce('id desc')
				.mockReturnValueOnce(1)
				.mockReturnValueOnce(50);

			const page = Array(50).fill({ id: 1 });
			requestWithAuthentication.mockResolvedValueOnce(page);

			const result = await node.execute.call(mockExecuteFunctions());

			// Map the page data to match the expected format
			const expectedData = page.slice(0, 10).map((item) => ({ json: item }));

			expect(result).toHaveLength(1);
			expect(result[0]).toHaveLength(10);
			expect(result[0]).toEqual(expectedData);
		});
	});
});
