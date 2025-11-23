import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const timeProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['time'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a time entry',
				action: 'Create a time entry',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a time entry',
				action: 'Delete a time entry',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a time entry by ID',
				action: 'Get a time entry',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many time entries',
				action: 'Get many time entries',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search time entries',
				action: 'Search time entries',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a time entry',
				action: 'Update a time entry',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Time Entry ID',
		name: 'timeEntryId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['time'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the time entry',
	},
	{
		displayName: 'Time Start',
		name: 'timeStart',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['time'],
				operation: ['create'],
			},
		},
		description: 'Start time (YYYY-MM-DD HH:mm:ss)',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['time'],
				operation: ['search'],
			},
		},
		description: 'Search conditions to filter time entries (e.g., chargeCode/id=123 or member/identifier="jsmith")',
		placeholder: 'company/id=250',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['time'],
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
				resource: ['time'],
				operation: ['get', 'getAll', 'search'],
			},
		},
		default: '',
		description: 'Comma-separated list of fields to return (e.g., id,timeStart,timeEnd). Leave empty to return all fields.',
		placeholder: 'id,timeStart,timeEnd,member,company',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['time'],
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
				resource: ['time'],
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
				description: 'Whether the time entry is billable',
			},
			{
				displayName: 'Charge Code',
				name: 'chargeCode',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The charge code for the time entry',
			},
			{
				displayName: 'Company ID',
				name: 'company',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The company associated with this time entry',
			},
			{
				displayName: 'Member ID',
				name: 'member',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The member associated with this time entry',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'Notes about the time entry',
			},
			{
				displayName: 'Time End',
				name: 'timeEnd',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'End time (YYYY-MM-DD HH:mm:ss)',
			},
			{
				displayName: 'Work Type',
				name: 'workType',
				type: 'options' as NodePropertyTypes,
				options: [
					{
						name: 'Administrative',
						value: 'Administrative',
					},
					{
						name: 'Project',
						value: 'Project',
					},
					{
						name: 'Support',
						value: 'Support',
					},
				],
				default: 'Support',
			},
		],
	},
];
