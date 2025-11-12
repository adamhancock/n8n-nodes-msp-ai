import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const opportunityProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an opportunity',
				action: 'Create an opportunity',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an opportunity',
				action: 'Delete an opportunity',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an opportunity by ID',
				action: 'Get an opportunity',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many opportunities',
				action: 'Get many opportunities',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search opportunities',
				action: 'Search opportunities',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an opportunity',
				action: 'Update an opportunity',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Opportunity ID',
		name: 'opportunityId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the opportunity',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['create'],
			},
		},
		description: 'The name of the opportunity',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['search'],
			},
		},
		description: 'Search conditions to filter opportunities (e.g., name contains "Project" or expectedCloseDate > [2024-01-01])',
		placeholder: 'status/id=1',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['opportunity'],
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
				resource: ['opportunity'],
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
		displayName: 'Order By',
		name: 'orderBy',
		type: 'string' as NodePropertyTypes,
		default: 'id',
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['getAll', 'search'],
			},
		},
		description: 'Order results by specified field',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection' as NodePropertyTypes,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['opportunity'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Company ID',
				name: 'company',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The company associated with this opportunity',
			},
			{
				displayName: 'Expected Close Date',
				name: 'expectedCloseDate',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'Expected close date (YYYY-MM-DD)',
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The location of the opportunity',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'Notes about the opportunity',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options' as NodePropertyTypes,
				options: [
					{
						name: 'Low',
						value: 'Low',
					},
					{
						name: 'Medium',
						value: 'Medium',
					},
					{
						name: 'High',
						value: 'High',
					},
				],
				default: 'Medium',
			},
			{
				displayName: 'Probability',
				name: 'probability',
				type: 'number' as NodePropertyTypes,
				default: 50,
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
				description: 'Probability of winning (0-100)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options' as NodePropertyTypes,
				options: [
					{
						name: 'Open',
						value: 'Open',
					},
					{
						name: 'Won',
						value: 'Won',
					},
					{
						name: 'Lost',
						value: 'Lost',
					},
					{
						name: 'No Decision',
						value: 'NoDecision',
					},
				],
				default: 'Open',
			},
		],
	},
];
