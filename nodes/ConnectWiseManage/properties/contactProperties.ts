import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const contactProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a contact',
				action: 'Create a contact',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
				action: 'Delete a contact',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a contact by ID',
				action: 'Get a contact',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many contacts',
				action: 'Get many contacts',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search contacts using a generic query',
				action: 'Search contacts',
			},
			{
				name: 'Search by Phone',
				value: 'searchByPhone',
				description: 'Search contacts by phone number',
				action: 'Search contacts by phone',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a contact',
				action: 'Update a contact',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the contact',
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		description: 'The first name of the contact',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		description: 'The last name of the contact',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['search'],
			},
		},
		description:
			'Search conditions to filter contacts. Use conditions like `firstName="John"` or `lastName like "Smith%"`.',
		placeholder: 'company/id=250',
	},
	{
		displayName: 'Phone Number',
		name: 'phoneNumber',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['searchByPhone'],
			},
		},
		description: 'The phone number to search for (exact match)',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll', 'search', 'searchByPhone'], // Added searchByPhone
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
				resource: ['contact'],
				operation: ['getAll', 'search', 'searchByPhone'], // Added searchByPhone
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
				resource: ['contact'],
				operation: ['getAll', 'search', 'searchByPhone'], // Added searchByPhone
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
				resource: ['contact'],
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
				description: 'The company associated with this contact',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The job title of the contact',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string' as NodePropertyTypes,
				default: '',
				placeholder: 'name@email.com',
				description: 'The email address of the contact',
			},
			{
				displayName: 'Phone Number', // This is for create/update, distinct from the search field
				name: 'phoneNumber',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The phone number of the contact',
			},
		],
	},
];
