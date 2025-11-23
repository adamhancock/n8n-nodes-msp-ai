import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const expenseProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['expense'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an expense',
				action: 'Create an expense',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an expense',
				action: 'Delete an expense',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an expense by ID',
				action: 'Get an expense',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many expenses',
				action: 'Get many expenses',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search expenses',
				action: 'Search expenses',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an expense',
				action: 'Update an expense',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Expense ID',
		name: 'expenseId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the expense',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['create'],
			},
		},
		description: 'The description of the expense',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['search'],
			},
		},
		description: 'Search conditions to filter expenses (e.g., company/id=250 or amount > 100)',
		placeholder: 'member/identifier="jsmith"',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['getAll', 'search'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['getAll', 'search'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 100,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection' as NodePropertyTypes,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number' as NodePropertyTypes,
				default: 0,
				description: 'The amount of the expense',
			},
			{
				displayName: 'Company ID',
				name: 'company',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The company associated with this expense',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The date of the expense (YYYY-MM-DD)',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options' as NodePropertyTypes,
				options: [
					{
						name: 'Billable',
						value: 'Billable',
					},
					{
						name: 'Non-Billable',
						value: 'NonBillable',
					},
				],
				default: 'Billable',
			},
		],
	},
];
