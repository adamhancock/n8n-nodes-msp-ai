import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const scheduleProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a schedule entry',
				action: 'Create a schedule entry',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a schedule entry',
				action: 'Delete a schedule entry',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a schedule entry by ID',
				action: 'Get a schedule entry',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many schedule entries',
				action: 'Get many schedule entries',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search schedule entries',
				action: 'Search schedule entries',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a schedule entry',
				action: 'Update a schedule entry',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Schedule ID',
		name: 'scheduleId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the schedule entry',
	},
	{
		displayName: 'Object Type',
		name: 'objectType',
		type: 'options' as NodePropertyTypes,
		options: [
			{
				name: 'Activity',
				value: 'Activity',
			},
			{
				name: 'Service Ticket',
				value: 'ServiceTicket',
			},
			{
				name: 'Project',
				value: 'Project',
			},
			{
				name: 'Sales',
				value: 'Sales',
			},
		],
		default: 'Activity',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
		description: 'The type of object to schedule',
	},
	{
		displayName: 'Object ID',
		name: 'objectId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
		description: 'The ID of the object to schedule',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['search'],
			},
		},
		description: 'Search conditions to filter schedule entries (e.g., objectType="Activity" or member/identifier="jsmith")',
		placeholder: 'objectType="Ticket"',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['schedule'],
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
				resource: ['schedule'],
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
				resource: ['schedule'],
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
				resource: ['schedule'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'Schedule end date (YYYY-MM-DD)',
			},
			{
				displayName: 'Member ID',
				name: 'member',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The member assigned to this schedule entry',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'Schedule start date (YYYY-MM-DD)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options' as NodePropertyTypes,
				options: [
					{
						name: 'Scheduled',
						value: 'Scheduled',
					},
					{
						name: 'Confirmed',
						value: 'Confirmed',
					},
					{
						name: 'Completed',
						value: 'Completed',
					},
				],
				default: 'Scheduled',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options' as NodePropertyTypes,
				options: [
					{
						name: 'General',
						value: 'General',
					},
					{
						name: 'Project',
						value: 'Project',
					},
					{
						name: 'Sales',
						value: 'Sales',
					},
				],
				default: 'General',
			},
		],
	},
];
