import { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

import { activityProperties } from './activityProperties';
import { agreementProperties } from './agreementProperties';
import { companyProperties } from './companyProperties';
import { configurationProperties } from './configurationProperties';
import { contactProperties } from './contactProperties';
import { expenseProperties } from './expenseProperties';
import { invoiceProperties } from './invoiceProperties';
import { memberProperties } from './memberProperties';
import { opportunityProperties } from './opportunityProperties';
import { productCatalogProperties } from './productCatalogProperties';
import { projectProperties } from './projectProperties';
import { purchaseOrderProperties } from './purchaseOrderProperties';
import { scheduleProperties } from './scheduleProperties';
import { ticketProperties } from './ticketProperties';
import { timeProperties } from './timeProperties';
import { documentProperties } from './documentProperties'; // Added

const resourceProperty: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options' as NodePropertyTypes,
	noDataExpression: true,
	options: [
		{
			name: 'Activity',
			value: 'activity',
		},
		{
			name: 'Agreement',
			value: 'agreement',
		},
		{
			name: 'Company',
			value: 'company',
		},
		{
			name: 'Configuration',
			value: 'configuration',
		},
		{
			name: 'Contact',
			value: 'contact',
		},
		{
			name: 'Document',
			value: 'document',
		},
		{
			name: 'Expense',
			value: 'expense',
		},
		{
			name: 'Invoice',
			value: 'invoice',
		},
		{
			name: 'Member',
			value: 'member',
		},
		{
			name: 'Opportunity',
			value: 'opportunity',
		},
		{
			name: 'Product Catalog',
			value: 'productCatalog',
		},
		{
			name: 'Project',
			value: 'project',
		},
		{
			name: 'Purchase Order',
			value: 'purchaseOrder',
		},
		{
			name: 'Schedule',
			value: 'schedule',
		},
		{
			name: 'Service Ticket',
			value: 'ticket',
		},
		{
			name: 'Time',
			value: 'time',
		},
	],
	default: 'ticket',
};

const orderByProperty: INodeProperties = {
	displayName: 'Order By',
	name: 'orderBy',
	type: 'string' as NodePropertyTypes,
	displayOptions: {
		show: {
			operation: ['getAll', 'search', 'searchByPhone', 'getNotes', 'listDocuments'],
		},
	},
	default: '',
	description: 'Field to order results by (e.g. "ID desc")',
};

const pageProperty: INodeProperties = {
	displayName: 'Page Number',
	name: 'page',
	type: 'number' as NodePropertyTypes,
	displayOptions: {
		show: {
			operation: ['getAll'],
		},
	},
	typeOptions: {
		minValue: 1,
	},
	default: 1,
	description: 'Page number to retrieve (starts at 1)',
};

const pageSizeProperty: INodeProperties = {
	displayName: 'Page Size',
	name: 'pageSize',
	type: 'number' as NodePropertyTypes,
	displayOptions: {
		show: {
			operation: ['getAll'],
		},
	},
	typeOptions: {
		minValue: 1,
		maxValue: 1000,
	},
	default: 100,
	description: 'Number of results to return per page',
};

export const properties: INodeProperties[] = [
	resourceProperty,
	orderByProperty,
	pageProperty,
	pageSizeProperty,
	...activityProperties,
	...agreementProperties,
	...companyProperties,
	...configurationProperties,
	...contactProperties,
	...expenseProperties,
	...invoiceProperties,
	...memberProperties,
	...opportunityProperties,
	...productCatalogProperties,
	...projectProperties,
	...purchaseOrderProperties,
	...scheduleProperties,
	...ticketProperties,
	...timeProperties,
	...documentProperties, // Added
];
