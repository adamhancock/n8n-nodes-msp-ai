import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const companyProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['company'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a company',
				action: 'Create a company',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a company',
				action: 'Delete a company',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a company by ID',
				action: 'Get a company',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many companies',
				action: 'Get many companies',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search companies',
				action: 'Search companies',
			},
			{
				name: 'Get by Phone Number',
				value: 'getByPhoneNumber',
				description: 'Find a company by its phone number',
				action: 'Get a company by phone number',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a company',
				action: 'Update a company',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the company',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['create'],
			},
		},
		description: 'The name of the company',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['search'],
			},
		},
		description: 'Search conditions to filter companies (e.g., name contains "Tech" or status/id=1)',
		placeholder: 'name contains "Tech"',
	},
	{
		displayName: 'Phone Number',
		name: 'phoneNumber',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['getByPhoneNumber'],
			},
		},
		description: 'The phone number to search for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['company'],
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
				resource: ['company'],
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
				resource: ['company'],
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
				resource: ['company'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
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
				description: 'The status of the company',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The phone number of the company',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The website of the company',
			},
			{
				displayName: 'Address Line 1',
				name: 'addressLine1',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The first line of the company address',
			},
			{
				displayName: 'Address Line 2',
				name: 'addressLine2',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The second line of the company address',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The city of the company address',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The state of the company address',
			},
			{
				displayName: 'Zip',
				name: 'zip',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The zip code of the company address',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The country of the company address',
			},
		],
	},
];
