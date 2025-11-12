import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const activityProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['activity'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an activity',
				action: 'Create an activity',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an activity',
				action: 'Delete an activity',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an activity by ID',
				action: 'Get an activity',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many activities',
				action: 'Get many activities',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search activities',
				action: 'Search activities',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an activity',
				action: 'Update an activity',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Activity ID',
		name: 'activityId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['activity'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the activity',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['activity'],
				operation: ['create'],
			},
		},
		description: 'The name of the activity',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['activity'],
				operation: ['search'],
			},
		},
		description: 'Search conditions to filter activities (e.g., name contains "Meeting" or type/id=1)',
		placeholder: 'company/id=250',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['activity'],
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
				resource: ['activity'],
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
				resource: ['activity'],
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
						name: 'Call',
						value: 'Call',
					},
					{
						name: 'Meeting',
						value: 'Meeting',
					},
					{
						name: 'Task',
						value: 'Task',
					},
				],
				default: 'Task',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
			{
				displayName: 'Company ID',
				name: 'company',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The company associated with this activity',
			},
		],
	},
];
