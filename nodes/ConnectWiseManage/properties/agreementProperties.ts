import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const agreementProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['agreement'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an agreement',
				action: 'Create an agreement',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an agreement',
				action: 'Delete an agreement',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an agreement by ID',
				action: 'Get an agreement',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many agreements',
				action: 'Get many agreements',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search agreements',
				action: 'Search agreements',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an agreement',
				action: 'Update an agreement',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Agreement ID',
		name: 'agreementId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['agreement'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the agreement',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['agreement'],
				operation: ['create'],
			},
		},
		description: 'The name of the agreement',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['agreement'],
				operation: ['search'],
			},
		},
		description:
			'Query conditions to filter agreements (e.g., "name like \'Test%\'" or "type=\'Standard\'")',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['agreement'],
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
				resource: ['agreement'],
				operation: ['get', 'getAll', 'search'],
			},
		},
		default: '',
		description: 'Comma-separated list of fields to return (e.g., id,name,type). Leave empty to return all fields.',
		placeholder: 'id,name,type,startDate,endDate',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['agreement'],
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
				resource: ['agreement'],
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
						name: 'Standard',
						value: 'Standard',
					},
					{
						name: 'Support',
						value: 'Support',
					},
				],
				default: 'Standard',
			},
			{
				displayName: 'Company ID',
				name: 'company',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The company associated with this agreement',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'Agreement start date (YYYY-MM-DD)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'Agreement end date (YYYY-MM-DD)',
			},
		],
	},
];
