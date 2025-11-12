import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const configurationProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['configuration'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a configuration',
				action: 'Create a configuration',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a configuration',
				action: 'Delete a configuration',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a configuration by ID',
				action: 'Get a configuration',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many configurations',
				action: 'Get many configurations',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search configurations',
				action: 'Search configurations',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a configuration',
				action: 'Update a configuration',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Configuration ID',
		name: 'configurationId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the configuration',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['create'],
			},
		},
		description: 'The name of the configuration',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['search'],
			},
		},
		description: 'Search conditions to filter configurations (e.g., name contains "Server" or company/id=250)',
		placeholder: 'company/id=250',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['getAll', 'search'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Fields',
		name: 'fields',
		type: 'string' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['get', 'getAll', 'search'],
			},
		},
		default: '',
		description: 'Comma-separated list of fields to return (e.g., id,name,company). Leave empty to return all fields.',
		placeholder: 'id,name,company,type,status',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['configuration'],
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
				resource: ['configuration'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'options' as NodePropertyTypes,
				options: [
					{
						name: 'Access',
						value: 'Access',
					},
					{
						name: 'Backup',
						value: 'Backup',
					},
					{
						name: 'Software',
						value: 'Software',
					},
				],
				default: 'Software',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options' as NodePropertyTypes,
				options: [
					{
						name: 'Active',
						value: 'Active',
					},
					{
						name: 'Inactive',
						value: 'Inactive',
					},
				],
				default: 'Active',
			},
			{
				displayName: 'Company ID',
				name: 'company',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The company associated with this configuration',
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The location of the configuration',
			},
		],
	},
];
