import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const memberProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['member'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a member',
				action: 'Create a member',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a member',
				action: 'Delete a member',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a member by ID',
				action: 'Get a member',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many members',
				action: 'Get many members',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search members',
				action: 'Search members',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a member',
				action: 'Update a member',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Member ID',
		name: 'memberId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['member'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the member',
	},
	{
		displayName: 'Identifier',
		name: 'identifier',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['member'],
				operation: ['create'],
			},
		},
		description: 'The unique identifier/username of the member',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['member'],
				operation: ['search'],
			},
		},
		description: 'Search conditions to filter members (e.g., identifier="jsmith" or firstName contains "John")',
		placeholder: 'inactiveFlag=false',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['member'],
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
				resource: ['member'],
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
				resource: ['member'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string' as NodePropertyTypes,
				default: '',
				placeholder: 'name@email.com',
				description: 'The email address of the member',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The first name of the member',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The last name of the member',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The phone number of the member',
			},
			{
				displayName: 'Time Zone',
				name: 'timeZone',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The time zone of the member',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The job title of the member',
			},
			{
				displayName: 'Work Role',
				name: 'workRole',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The work role of the member',
			},
		],
	},
];
