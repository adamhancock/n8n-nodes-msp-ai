import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const productCatalogProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as NodePropertyTypes,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['productCatalog'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a product catalog item',
				action: 'Create a product catalog item',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a product catalog item',
				action: 'Delete a product catalog item',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a product catalog item by ID',
				action: 'Get a product catalog item',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many product catalog items',
				action: 'Get many product catalog items',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search product catalog items',
				action: 'Search product catalog items',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a product catalog item',
				action: 'Update a product catalog item',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['productCatalog'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the product catalog item',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['productCatalog'],
				operation: ['create'],
			},
		},
		description: 'The name of the product catalog item',
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'string' as NodePropertyTypes,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['productCatalog'],
				operation: ['search'],
			},
		},
		description: 'Search conditions to filter product catalog items (e.g., name contains "Software" or category/ID=10)',
		placeholder: 'inactiveFlag=false',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['productCatalog'],
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
				resource: ['productCatalog'],
				operation: ['get', 'getAll', 'search'],
			},
		},
		default: '',
		description: 'Comma-separated list of fields to return (e.g., ID,identifier,description). Leave empty to return all fields.',
		placeholder: 'ID,identifier,description,price,category',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['productCatalog'],
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
				resource: ['productCatalog'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Active',
				name: 'active',
				type: 'boolean' as NodePropertyTypes,
				default: true,
				description: 'Whether the product catalog item is active',
			},
			{
				displayName: 'Category',
				name: 'category',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The category of the product catalog item',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The description of the product catalog item',
			},
			{
				displayName: 'Manufacturer',
				name: 'manufacturer',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The manufacturer of the product catalog item',
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'number' as NodePropertyTypes,
				default: 0,
				description: 'The price of the product catalog item',
			},
			{
				displayName: 'SKU',
				name: 'sku',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The SKU of the product catalog item',
			},
			{
				displayName: 'Vendor',
				name: 'vendor',
				type: 'string' as NodePropertyTypes,
				default: '',
				description: 'The vendor of the product catalog item',
			},
		],
	},
];
