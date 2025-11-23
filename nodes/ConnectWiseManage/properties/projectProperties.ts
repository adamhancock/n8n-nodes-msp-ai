import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const projectProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a project',
				action: 'Create a project',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a project',
				action: 'Delete a project',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a project by ID',
				action: 'Get a project',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many projects',
				action: 'Get many projects',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search projects',
				action: 'Search projects',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a project',
				action: 'Update a project',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the project',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		description: 'The name of the project',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['search'],
			},
		},
		description: 'Search conditions to filter projects (e.g., name="Project Name" or status/id=1)',
		placeholder: 'name contains "Example"',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['project'],
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
				resource: ['project'],
				operation: ['get', 'getAll', 'search'],
			},
		},
		default: '',
		description: 'Comma-separated list of fields to return (e.g., id,name,status). Leave empty to return all fields.',
		placeholder: 'id,name,status,company,manager',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['project'],
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
				resource: ['project'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Billable',
				name: 'billable',
				type: 'boolean' as NodePropertyTypes,
				default: true,
				description: 'Whether the project is billable',
			},
			{
				displayName: 'Company ID',
				name: 'company',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The company associated with this project',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The description of the project',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'Project end date (YYYY-MM-DD)',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'Project start date (YYYY-MM-DD)',
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
						name: 'Closed',
						value: 'Closed',
					},
					{
						name: 'On Hold',
						value: 'OnHold',
					},
				],
				default: 'Open',
			},
		],
	},
];
