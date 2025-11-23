import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const ticketProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
			},
		},
		options: [
			{
				name: 'Get by Contact',
				value: 'getByContact',
				description: 'Get tickets by contact ID',
				action: 'Get tickets by contact',
			},
			{
				name: 'Add Note',
				value: 'addNote',
				description: 'Add a note to a ticket',
				action: 'Add a note to a ticket',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a ticket',
				action: 'Create a ticket',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a ticket',
				action: 'Delete a ticket',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a ticket by ID',
				action: 'Get a ticket',
			},
			{
				name: 'Get Configurations',
				value: 'getConfigurations',
				description: 'Get configurations associated with a ticket',
				action: 'Get configurations for a ticket',
			},
			{
				name: 'Get Custom Field',
				value: 'getCustomField',
				description: 'Get a specific custom field value for a ticket',
				action: 'Get a custom field value for a ticket',
			},
			{
				name: 'Get Custom Fields',
				value: 'getCustomFields',
				description: 'Get all custom fields for service tickets',
				action: 'Get custom fields for service tickets',
			},
			{
				name: 'Update Custom Field',
				value: 'updateCustomField',
				description: 'Update a specific custom field value for a ticket',
				action: 'Update a custom field value for a ticket',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many tickets',
				action: 'Get many tickets',
			},
			{
				name: 'Get Notes',
				value: 'getNotes',
				description: 'Get notes for a ticket',
				action: 'Get notes for a ticket',
			},
			{
				name: 'List Subtypes', // Added
				value: 'listSubtypes',
				description: 'List ticket subtypes for a board and type',
				action: 'List ticket subtypes for a board and type',
			},
			{
				name: 'List Types', // Added
				value: 'listTypes',
				description: 'List ticket types for a board',
				action: 'List ticket types for a board',
			},
			{
				name: 'List Documents',
				value: 'listDocuments',
				description: 'List documents attached to a ticket',
				action: 'List documents for a ticket',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search tickets',
				action: 'Search tickets',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a ticket',
				action: 'Update a ticket',
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
				resource: ['ticket'],
				operation: ['getByContact'],
			},
		},
		description: 'The ID of the contact to get tickets for',
	},
	// Extend existing getAll fields to getByContact
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		default: false,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getByContact'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Fields',
		name: 'fields',
		type: 'string' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['get', 'getAll', 'search', 'getByContact'],
			},
		},
		default: '',
		description: 'Comma-separated list of fields to return (e.g., id,summary,status). Leave empty to return all fields.',
		placeholder: 'id,summary,status,board,company',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number' as NodePropertyTypes,
		default: 100,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getByContact'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		description: 'Max number of results to return',
	},
	// Fields for listTypes and listSubtypes
	{
		displayName: 'Board ID',
		name: 'boardId',
		type: 'string' as NodePropertyTypes, // Changed from 'options'
		// Removed typeOptions for dynamic loading
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['listTypes', 'listSubtypes'],
			},
		},
		description: 'The ID of the board to list types/subtypes for',
	},
	{
		displayName: 'Type ID',
		name: 'typeId',
		type: 'string' as NodePropertyTypes, // Changed from 'options'
		// Removed typeOptions and loadOptionsDependsOn
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['listSubtypes'],
			},
		},
		description: 'The ID of the type to list subtypes for',
	},
	// Standard Ticket Fields
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: [
					'get',
					'update',
					'delete',
					'getNotes',
					'addNote',
					'getCustomField',
					'updateCustomField',
					'listDocuments', // Added
					'getConfigurations',
				],
			},
		},
		description: 'The ID of the ticket',
	},
	{
		displayName: 'Summary',
		name: 'summary',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['create'],
			},
		},
		description: 'The summary of the ticket',
	},
	// Fields for addNote
	{
		displayName: 'Note Text',
		name: 'noteText',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['addNote'],
			},
		},
		description: 'The text of the note to add',
	},
	{
		displayName: 'Detail Description',
		name: 'detailDescription',
		type: 'boolean' as NodePropertyTypes,
		default: false,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['addNote'],
			},
		},
		description: 'Whether this note is a detail description',
	},
	{
		displayName: 'Internal Analysis',
		name: 'internalAnalysis',
		type: 'boolean' as NodePropertyTypes,
		default: false,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['addNote'],
			},
		},
		description: 'Whether this note is an internal analysis',
	},
	{
		displayName: 'Resolution',
		name: 'resolution',
		type: 'boolean' as NodePropertyTypes,
		default: false,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['addNote'],
			},
		},
		description: 'Whether this note is a resolution',
	},
	// Fields for get/update Custom Field
	{
		displayName: 'Custom Field',
		name: 'customFieldId',
		type: 'options' as NodePropertyTypes,
		typeOptions: {
			loadOptionsMethod: 'getCustomFields',
		},
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getCustomField', 'updateCustomField'], // Show for both get and update
			},
		},
		description: 'The custom field to get or update',
	},
	{
		displayName: 'Value',
		name: 'customFieldValue',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['updateCustomField'], // Only show for update
			},
		},
		description: 'The new value for the custom field',
	},
	// Fields for getAll / search
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		default: false,
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getAll', 'search', 'getNotes', 'listDocuments'], // Added getNotes, listDocuments
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number' as NodePropertyTypes,
		default: 100, // Default to 100 for getAll/getNotes
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getAll', 'search', 'getNotes', 'listDocuments'], // Added getNotes, listDocuments
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000, // ConnectWise API max page size
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'string' as NodePropertyTypes,
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['getAll', 'search', 'getNotes', 'listDocuments'], // Added getNotes, listDocuments
			},
		},
		placeholder: 'status/ID=1 and priority/ID=3',
		description: 'Query conditions to filter results (e.g., status/ID=1 and priority/ID=3)',
	},
	// Filters (Consider removing if 'Conditions' is preferred)
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection' as NodePropertyTypes,
		placeholder: 'Add Filter',
		displayOptions: {
			// Decide if this is needed alongside 'Conditions'
			// show: {
			// 	resource: ['ticket'],
			// 	operation: ['getAll', 'search'],
			// },
			show: {
				// Hide for now, prefer 'Conditions'
				resource: ['ticket'],
				operation: [],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options' as NodePropertyTypes,
				// Add options or load dynamically if possible
				default: '',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options' as NodePropertyTypes,
				// Add options or load dynamically if possible
				default: '',
			},
		],
	},
	// Additional Fields for Create/Update
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection' as NodePropertyTypes,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The summary of the ticket',
			},
			{
				displayName: 'Board',
				name: 'board',
				type: 'options' as NodePropertyTypes,
				typeOptions: {
					loadOptionsMethod: 'getServiceBoards',
				},
				default: '',
				description: 'The service board for the ticket',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'number' as NodePropertyTypes, // Changed from options
				default: '',
				description: 'The ID of the ticket type', // Updated description
				typeOptions: {
					numberPrecision: 0,
				},
			},
			{
				displayName: 'Subtype',
				name: 'subType',
				type: 'number' as NodePropertyTypes, // Changed from options
				default: '',
				description: 'The ID of the ticket subtype', // Updated description
				typeOptions: {
					numberPrecision: 0,
				},
			},
			{
				displayName: 'Agreement ID',
				name: 'agreement',
				type: 'number' as NodePropertyTypes, // Assuming ID is numeric
				default: '',
				description: 'The ID of the agreement to associate with this ticket',
				typeOptions: {
					numberPrecision: 0,
				},
			},
			{
				displayName: 'Company ID',
				name: 'company',
				type: 'number' as NodePropertyTypes, // Assuming ID is numeric
				default: '',
				description: 'The ID of the company associated with the ticket',
				typeOptions: {
					numberPrecision: 0,
				},
			},
			{
				displayName: 'Contact ID',
				name: 'contact',
				type: 'number' as NodePropertyTypes, // Assuming ID is numeric
				default: '',
				description: 'The ID of the contact associated with the ticket',
				typeOptions: {
					numberPrecision: 0,
				},
			},
			{
				displayName: 'Initial Description',
				name: 'initialDescription',
				type: 'string' as NodePropertyTypes,
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'The initial description of the ticket',
			},
			{
				displayName: 'Priority ID',
				name: 'priority',
				type: 'number' as NodePropertyTypes, // Assuming ID is numeric
				default: '',
				description: 'The ID of the priority level',
				typeOptions: {
					numberPrecision: 0,
				},
			},
			{
				displayName: 'Status ID',
				name: 'status',
				type: 'number' as NodePropertyTypes, // Assuming ID is numeric
				default: '',
				description: 'The ID of the ticket status',
				typeOptions: {
					numberPrecision: 0,
				},
			},
			// Add other relevant fields as needed
		],
	},
];
