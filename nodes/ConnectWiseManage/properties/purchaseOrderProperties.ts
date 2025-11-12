import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const purchaseOrderProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a purchase order',
				action: 'Create a purchase order',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a purchase order',
				action: 'Delete a purchase order',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a purchase order by ID',
				action: 'Get a purchase order',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many purchase orders',
				action: 'Get many purchase orders',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search purchase orders',
				action: 'Search purchase orders',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a purchase order',
				action: 'Update a purchase order',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Purchase Order ID',
		name: 'purchaseOrderId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the purchase order',
	},
	{
		displayName: 'Vendor ID',
		name: 'vendorId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['create'],
			},
		},
		description: 'The ID of the vendor for the purchase order',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['search'],
			},
		},
		description: 'Search conditions to filter purchase orders (e.g., vendor/id=123 or status="Open")',
		placeholder: 'status="Open"',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
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
				resource: ['purchaseOrder'],
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
				resource: ['purchaseOrder'],
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
				resource: ['purchaseOrder'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Date',
				name: 'date',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'Purchase order date (YYYY-MM-DD)',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'Additional notes for the purchase order',
			},
			{
				displayName: 'Shipping Cost',
				name: 'shippingCost',
				type: 'number' as NodePropertyTypes,
				default: 0,
				description: 'Shipping cost amount',
			},
			{
				displayName: 'Shipping Date',
				name: 'shippingDate',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'Expected shipping date (YYYY-MM-DD)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options' as NodePropertyTypes,
				options: [
					{
						name: 'Draft',
						value: 'Draft',
					},
					{
						name: 'Open',
						value: 'Open',
					},
					{
						name: 'Closed',
						value: 'Closed',
					},
					{
						name: 'Cancelled',
						value: 'Cancelled',
					},
				],
				default: 'Draft',
			},
			{
				displayName: 'Tax Rate',
				name: 'taxRate',
				type: 'number' as NodePropertyTypes,
				default: 0,
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
				description: 'Tax rate percentage (0-100)',
			},
		],
	},
];
