/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { userProfileOperations } from './actions/userProfile';
import { eventOperations } from './actions/event';
import { campaignOperations } from './actions/campaign';
import { pushNotificationOperations } from './actions/pushNotification';
import { segmentOperations } from './actions/segment';
import { emailOperations } from './actions/email';
import { smsOperations } from './actions/sms';
import { whatsAppOperations } from './actions/whatsApp';
import { productCatalogOperations } from './actions/productCatalog';
import { reportOperations } from './actions/report';

// Emit licensing notice once on module load
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

let licenseNoticeEmitted = false;

function emitLicenseNotice(): void {
	if (!licenseNoticeEmitted) {
		console.warn(LICENSING_NOTICE);
		licenseNoticeEmitted = true;
	}
}

export class CleverTap implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CleverTap',
		name: 'cleverTap',
		icon: 'file:clevertap.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with CleverTap API for customer engagement and analytics',
		defaults: {
			name: 'CleverTap',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'cleverTapApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Campaign',
						value: 'campaign',
					},
					{
						name: 'Email',
						value: 'email',
					},
					{
						name: 'Event',
						value: 'event',
					},
					{
						name: 'Product Catalog',
						value: 'productCatalog',
					},
					{
						name: 'Push Notification',
						value: 'pushNotification',
					},
					{
						name: 'Report',
						value: 'report',
					},
					{
						name: 'Segment',
						value: 'segment',
					},
					{
						name: 'SMS',
						value: 'sms',
					},
					{
						name: 'User Profile',
						value: 'userProfile',
					},
					{
						name: 'WhatsApp',
						value: 'whatsApp',
					},
				],
				default: 'userProfile',
			},
			// User Profile Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['userProfile'],
					},
				},
				options: [
					{ name: 'Delete', value: 'delete', description: 'Delete a user profile', action: 'Delete a user profile' },
					{ name: 'Demerge', value: 'demerge', description: 'Demerge merged profiles', action: 'Demerge merged profiles' },
					{ name: 'Disassociate', value: 'disassociate', description: 'Remove device from profile', action: 'Remove device from profile' },
					{ name: 'Get', value: 'get', description: 'Get a user profile by identity', action: 'Get a user profile' },
					{ name: 'Get by Email', value: 'getByEmail', description: 'Get profile by email', action: 'Get profile by email' },
					{ name: 'Get by Phone', value: 'getByPhone', description: 'Get profile by phone', action: 'Get profile by phone' },
					{ name: 'Get Count', value: 'getCount', description: 'Get profile count for query', action: 'Get profile count' },
					{ name: 'Get Subscription Status', value: 'getSubscriptionStatus', description: 'Get push subscription status', action: 'Get subscription status' },
					{ name: 'Subscribe', value: 'subscribe', description: 'Update push subscription', action: 'Update subscription' },
					{ name: 'Upload', value: 'upload', description: 'Upload user profile data', action: 'Upload user profile' },
				],
				default: 'upload',
			},
			// Event Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['event'],
					},
				},
				options: [
					{ name: 'Get', value: 'get', description: 'Get events for user', action: 'Get events for user' },
					{ name: 'Get Count', value: 'getCount', description: 'Get event counts', action: 'Get event counts' },
					{ name: 'Get Many', value: 'getMany', description: 'Query events', action: 'Query events' },
					{ name: 'Get Property Values', value: 'getPropertyValues', description: 'Get event property values', action: 'Get property values' },
					{ name: 'Get Timeline', value: 'getTimeline', description: 'Get user event timeline', action: 'Get event timeline' },
					{ name: 'Get Top Events', value: 'getTopEvents', description: 'Get top events by count', action: 'Get top events' },
					{ name: 'Upload', value: 'upload', description: 'Upload event data', action: 'Upload event' },
				],
				default: 'upload',
			},
			// Campaign Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
					},
				},
				options: [
					{ name: 'Create', value: 'create', description: 'Create new campaign', action: 'Create a campaign' },
					{ name: 'Create Control Group', value: 'createControlGroup', description: 'Create with control group', action: 'Create with control group' },
					{ name: 'Create Targeted', value: 'createTargeted', description: 'Create targeted campaign', action: 'Create targeted campaign' },
					{ name: 'Get', value: 'get', description: 'Get campaign details', action: 'Get a campaign' },
					{ name: 'Get Many', value: 'getMany', description: 'List campaigns', action: 'List campaigns' },
					{ name: 'Get Report', value: 'getReport', description: 'Get campaign report', action: 'Get campaign report' },
					{ name: 'Get Stats', value: 'getStats', description: 'Get campaign statistics', action: 'Get campaign stats' },
					{ name: 'Stop', value: 'stop', description: 'Stop running campaign', action: 'Stop a campaign' },
				],
				default: 'create',
			},
			// Push Notification Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['pushNotification'],
					},
				},
				options: [
					{ name: 'Cancel', value: 'cancel', description: 'Cancel scheduled push', action: 'Cancel push notification' },
					{ name: 'Create Mobile Push', value: 'createMobilePush', description: 'Create mobile push', action: 'Create mobile push' },
					{ name: 'Create Web Push', value: 'createWebPush', description: 'Create web push', action: 'Create web push' },
					{ name: 'Schedule', value: 'schedule', description: 'Schedule push notification', action: 'Schedule push' },
					{ name: 'Send', value: 'send', description: 'Send push notification', action: 'Send push notification' },
					{ name: 'Send to Identity', value: 'sendToIdentity', description: 'Push to specific user', action: 'Send to identity' },
					{ name: 'Send to Segment', value: 'sendToSegment', description: 'Push to segment', action: 'Send to segment' },
				],
				default: 'send',
			},
			// Segment Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['segment'],
					},
				},
				options: [
					{ name: 'Create', value: 'create', description: 'Create segment', action: 'Create a segment' },
					{ name: 'Delete', value: 'delete', description: 'Delete segment', action: 'Delete a segment' },
					{ name: 'Download Users', value: 'downloadUsers', description: 'Download segment users', action: 'Download segment users' },
					{ name: 'Estimate', value: 'estimate', description: 'Estimate segment size', action: 'Estimate segment size' },
					{ name: 'Get', value: 'get', description: 'Get segment by ID', action: 'Get a segment' },
					{ name: 'Get Many', value: 'getMany', description: 'List segments', action: 'List segments' },
					{ name: 'Get Users', value: 'getUsers', description: 'Get users in segment', action: 'Get segment users' },
				],
				default: 'create',
			},
			// Email Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['email'],
					},
				},
				options: [
					{ name: 'Create Template', value: 'createTemplate', description: 'Create email template', action: 'Create email template' },
					{ name: 'Delete Template', value: 'deleteTemplate', description: 'Delete template', action: 'Delete email template' },
					{ name: 'Get Templates', value: 'getTemplates', description: 'List email templates', action: 'List email templates' },
					{ name: 'Send', value: 'send', description: 'Send email', action: 'Send email' },
					{ name: 'Send Template', value: 'sendTemplate', description: 'Send using template', action: 'Send email template' },
					{ name: 'Send to Segment', value: 'sendToSegment', description: 'Email to segment', action: 'Send to segment' },
					{ name: 'Update Template', value: 'updateTemplate', description: 'Update template', action: 'Update email template' },
				],
				default: 'send',
			},
			// SMS Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['sms'],
					},
				},
				options: [
					{ name: 'Create Template', value: 'createTemplate', description: 'Create SMS template', action: 'Create SMS template' },
					{ name: 'Get Providers', value: 'getProviders', description: 'List SMS providers', action: 'List SMS providers' },
					{ name: 'Get Templates', value: 'getTemplates', description: 'List SMS templates', action: 'List SMS templates' },
					{ name: 'Send', value: 'send', description: 'Send SMS', action: 'Send SMS' },
					{ name: 'Send to Segment', value: 'sendToSegment', description: 'SMS to segment', action: 'Send SMS to segment' },
				],
				default: 'send',
			},
			// WhatsApp Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['whatsApp'],
					},
				},
				options: [
					{ name: 'Create Template', value: 'createTemplate', description: 'Create template', action: 'Create WhatsApp template' },
					{ name: 'Get Conversations', value: 'getConversations', description: 'Get conversation threads', action: 'Get conversations' },
					{ name: 'Get Templates', value: 'getTemplates', description: 'List WhatsApp templates', action: 'List WhatsApp templates' },
					{ name: 'Send', value: 'send', description: 'Send WhatsApp message', action: 'Send WhatsApp message' },
					{ name: 'Send Media', value: 'sendMedia', description: 'Send media message', action: 'Send media message' },
					{ name: 'Send Template', value: 'sendTemplate', description: 'Send template message', action: 'Send template message' },
				],
				default: 'send',
			},
			// Product Catalog Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['productCatalog'],
					},
				},
				options: [
					{ name: 'Create Catalog', value: 'createCatalog', description: 'Create new catalog', action: 'Create catalog' },
					{ name: 'Delete', value: 'delete', description: 'Delete catalog item', action: 'Delete catalog item' },
					{ name: 'Delete Catalog', value: 'deleteCatalog', description: 'Delete catalog', action: 'Delete catalog' },
					{ name: 'Get', value: 'get', description: 'Get catalog item', action: 'Get catalog item' },
					{ name: 'Get Catalogs', value: 'getCatalogs', description: 'List catalogs', action: 'List catalogs' },
					{ name: 'Get Many', value: 'getMany', description: 'List catalog items', action: 'List catalog items' },
					{ name: 'Update', value: 'update', description: 'Update catalog item', action: 'Update catalog item' },
					{ name: 'Upload', value: 'upload', description: 'Upload catalog items', action: 'Upload catalog items' },
				],
				default: 'upload',
			},
			// Report Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['report'],
					},
				},
				options: [
					{ name: 'Get Cohort Report', value: 'getCohortReport', description: 'Get cohort analysis', action: 'Get cohort report' },
					{ name: 'Get Funnel Report', value: 'getFunnelReport', description: 'Get funnel analytics', action: 'Get funnel report' },
					{ name: 'Get Message Report', value: 'getMessageReport', description: 'Get messaging stats', action: 'Get message report' },
					{ name: 'Get Real Time', value: 'getRealTime', description: 'Get real-time metrics', action: 'Get real-time metrics' },
					{ name: 'Get Retention Report', value: 'getRetentionReport', description: 'Get retention metrics', action: 'Get retention report' },
					{ name: 'Get Revenue Report', value: 'getRevenueReport', description: 'Get revenue metrics', action: 'Get revenue report' },
					{ name: 'Get Trends', value: 'getTrends', description: 'Get trend data', action: 'Get trends' },
					{ name: 'Get Uninstall Report', value: 'getUninstallReport', description: 'Get uninstall data', action: 'Get uninstall report' },
				],
				default: 'getRealTime',
			},
			// =====================================================
			// USER PROFILE FIELDS
			// =====================================================
			{
				displayName: 'Identity',
				name: 'identity',
				type: 'string',
				required: true,
				default: '',
				description: 'User identity (max 1024 chars)',
				displayOptions: {
					show: {
						resource: ['userProfile'],
						operation: ['upload', 'get', 'delete', 'demerge', 'disassociate', 'subscribe', 'getSubscriptionStatus'],
					},
				},
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'user@example.com',
				displayOptions: {
					show: {
						resource: ['userProfile'],
						operation: ['getByEmail'],
					},
				},
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				required: true,
				default: '',
				placeholder: '+1234567890',
				description: 'Phone number with country code',
				displayOptions: {
					show: {
						resource: ['userProfile'],
						operation: ['getByPhone'],
					},
				},
			},
			{
				displayName: 'Object ID',
				name: 'objectId',
				type: 'string',
				required: true,
				default: '',
				description: 'CleverTap object ID',
				displayOptions: {
					show: {
						resource: ['userProfile'],
						operation: ['demerge'],
					},
				},
			},
			{
				displayName: 'Device Token',
				name: 'deviceToken',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['userProfile'],
						operation: ['disassociate'],
					},
				},
			},
			{
				displayName: 'Profile Data',
				name: 'profileData',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: false,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['userProfile'],
						operation: ['upload'],
					},
				},
				options: [
					{
						displayName: 'Profile Fields',
						name: 'profileFields',
						values: [
							{
								displayName: 'Name',
								name: 'Name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Email',
								name: 'Email',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Phone',
								name: 'Phone',
								type: 'string',
								default: '',
								description: 'Phone with country code (+1...)',
							},
							{
								displayName: 'Gender',
								name: 'Gender',
								type: 'options',
								options: [
									{ name: 'Male', value: 'M' },
									{ name: 'Female', value: 'F' },
								],
								default: 'M',
							},
							{
								displayName: 'Date of Birth',
								name: 'DOB',
								type: 'string',
								default: '',
								placeholder: 'DD-MM-YYYY',
							},
							{
								displayName: 'Photo URL',
								name: 'Photo',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Subscription Data',
				name: 'subscriptionData',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: false,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['userProfile'],
						operation: ['subscribe'],
					},
				},
				options: [
					{
						displayName: 'Subscriptions',
						name: 'subscriptions',
						values: [
							{
								displayName: 'Email Subscription',
								name: 'email',
								type: 'boolean',
								default: true,
							},
							{
								displayName: 'Push Subscription',
								name: 'push',
								type: 'boolean',
								default: true,
							},
							{
								displayName: 'SMS Subscription',
								name: 'sms',
								type: 'boolean',
								default: true,
							},
							{
								displayName: 'WhatsApp Subscription',
								name: 'whatsapp',
								type: 'boolean',
								default: true,
							},
						],
					},
				],
			},
			// =====================================================
			// EVENT FIELDS
			// =====================================================
			{
				displayName: 'Identity',
				name: 'identity',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['upload', 'get', 'getTimeline'],
					},
				},
			},
			{
				displayName: 'Event Name',
				name: 'eventName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['upload', 'get', 'getMany', 'getCount', 'getPropertyValues'],
					},
				},
			},
			{
				displayName: 'Event Name',
				name: 'eventName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['userProfile'],
						operation: ['getCount'],
					},
				},
			},
			{
				displayName: 'Event Data',
				name: 'eventData',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['upload'],
					},
				},
			},
			{
				displayName: 'Property Name',
				name: 'propertyName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['getPropertyValues'],
					},
				},
			},
			{
				displayName: 'From Date',
				name: 'from',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['get', 'getMany', 'getCount', 'getPropertyValues', 'getTopEvents'],
					},
				},
			},
			{
				displayName: 'From Date',
				name: 'from',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['userProfile'],
						operation: ['getCount'],
					},
				},
			},
			{
				displayName: 'To Date',
				name: 'to',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['get', 'getMany', 'getCount', 'getPropertyValues', 'getTopEvents'],
					},
				},
			},
			{
				displayName: 'To Date',
				name: 'to',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['userProfile'],
						operation: ['getCount'],
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['getMany'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 5000,
				},
				default: 50,
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['getMany'],
						returnAll: [false],
					},
				},
			},
			// =====================================================
			// CAMPAIGN FIELDS
			// =====================================================
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['get', 'getStats', 'stop', 'getReport'],
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create', 'createTargeted', 'createControlGroup'],
					},
				},
			},
			{
				displayName: 'Campaign Type',
				name: 'campaignType',
				type: 'options',
				options: [
					{ name: 'Mobile Push', value: 'mobile_push' },
					{ name: 'Web Push', value: 'web_push' },
					{ name: 'Email', value: 'email' },
					{ name: 'SMS', value: 'sms' },
					{ name: 'WhatsApp', value: 'whatsapp' },
				],
				default: 'mobile_push',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create', 'createTargeted', 'createControlGroup'],
					},
				},
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create', 'createTargeted', 'createControlGroup'],
					},
				},
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create', 'createTargeted', 'createControlGroup'],
					},
				},
			},
			{
				displayName: 'Identities',
				name: 'identities',
				type: 'string',
				required: true,
				default: '',
				description: 'Comma-separated list of user identities',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Segment Query',
				name: 'segmentQuery',
				type: 'json',
				default: '{}',
				description: 'Segment query JSON',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['createTargeted', 'createControlGroup'],
					},
				},
			},
			{
				displayName: 'Control Group Percentage',
				name: 'controlGroupPercentage',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 50,
				},
				default: 10,
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['createControlGroup'],
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['getMany'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['getMany'],
						returnAll: [false],
					},
				},
			},
			// =====================================================
			// PUSH NOTIFICATION FIELDS
			// =====================================================
			{
				displayName: 'Identities',
				name: 'identities',
				type: 'string',
				required: true,
				default: '',
				description: 'Comma-separated list of user identities',
				displayOptions: {
					show: {
						resource: ['pushNotification'],
						operation: ['send', 'createWebPush', 'createMobilePush', 'schedule'],
					},
				},
			},
			{
				displayName: 'Identity',
				name: 'identity',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['pushNotification'],
						operation: ['sendToIdentity'],
					},
				},
			},
			{
				displayName: 'Segment Name',
				name: 'segmentName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['pushNotification'],
						operation: ['sendToSegment'],
					},
				},
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['pushNotification'],
						operation: ['send', 'sendToSegment', 'sendToIdentity', 'createWebPush', 'createMobilePush', 'schedule'],
					},
				},
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['pushNotification'],
						operation: ['send', 'sendToSegment', 'sendToIdentity', 'createWebPush', 'createMobilePush', 'schedule'],
					},
				},
			},
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				options: [
					{ name: 'Android', value: 'android' },
					{ name: 'iOS', value: 'ios' },
				],
				default: 'android',
				displayOptions: {
					show: {
						resource: ['pushNotification'],
						operation: ['createMobilePush'],
					},
				},
			},
			{
				displayName: 'Schedule Time',
				name: 'scheduleTime',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['pushNotification'],
						operation: ['schedule'],
					},
				},
			},
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['pushNotification'],
						operation: ['cancel'],
					},
				},
			},
			// =====================================================
			// SEGMENT FIELDS
			// =====================================================
			{
				displayName: 'Segment ID',
				name: 'segmentId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['segment'],
						operation: ['get', 'getUsers', 'delete', 'downloadUsers'],
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['segment'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Segment Type',
				name: 'segmentType',
				type: 'options',
				options: [
					{ name: 'Static', value: 'static' },
					{ name: 'Live', value: 'live' },
				],
				default: 'static',
				displayOptions: {
					show: {
						resource: ['segment'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Segment Query',
				name: 'segmentQuery',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						resource: ['segment'],
						operation: ['create', 'estimate'],
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['segment'],
						operation: ['getMany', 'getUsers'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 5000,
				},
				default: 50,
				displayOptions: {
					show: {
						resource: ['segment'],
						operation: ['getMany', 'getUsers'],
						returnAll: [false],
					},
				},
			},
			// =====================================================
			// EMAIL FIELDS
			// =====================================================
			{
				displayName: 'Identities',
				name: 'identities',
				type: 'string',
				required: true,
				default: '',
				description: 'Comma-separated list of user identities',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send', 'sendTemplate'],
					},
				},
			},
			{
				displayName: 'Segment Name',
				name: 'segmentName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['sendToSegment'],
					},
				},
			},
			{
				displayName: 'From',
				name: 'from',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'sender@example.com',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send', 'sendToSegment'],
					},
				},
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send', 'sendToSegment', 'createTemplate'],
					},
				},
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 8,
				},
				required: true,
				default: '',
				description: 'HTML body content',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send', 'sendToSegment', 'createTemplate'],
					},
				},
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['sendTemplate', 'updateTemplate', 'deleteTemplate'],
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['createTemplate'],
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['getTemplates'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['getTemplates'],
						returnAll: [false],
					},
				},
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['updateTemplate'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Subject',
						name: 'subject',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Body',
						name: 'body',
						type: 'string',
						typeOptions: {
							rows: 8,
						},
						default: '',
					},
				],
			},
			// =====================================================
			// SMS FIELDS
			// =====================================================
			{
				displayName: 'Identities',
				name: 'identities',
				type: 'string',
				required: true,
				default: '',
				description: 'Comma-separated list of user identities',
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['send'],
					},
				},
			},
			{
				displayName: 'Segment Name',
				name: 'segmentName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['sendToSegment'],
					},
				},
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['send', 'sendToSegment', 'createTemplate'],
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['createTemplate'],
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['getTemplates'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['getTemplates'],
						returnAll: [false],
					},
				},
			},
			// =====================================================
			// WHATSAPP FIELDS
			// =====================================================
			{
				displayName: 'Identities',
				name: 'identities',
				type: 'string',
				required: true,
				default: '',
				description: 'Comma-separated list of user identities',
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['send', 'sendTemplate', 'sendMedia'],
					},
				},
			},
			{
				displayName: 'Message Type',
				name: 'messageType',
				type: 'options',
				options: [
					{ name: 'Text', value: 'text' },
					{ name: 'Image', value: 'image' },
					{ name: 'Document', value: 'document' },
					{ name: 'Template', value: 'template' },
				],
				default: 'text',
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['send'],
					},
				},
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['send'],
						messageType: ['text'],
					},
				},
			},
			{
				displayName: 'Template Name',
				name: 'templateName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['sendTemplate'],
					},
				},
			},
			{
				displayName: 'Language Code',
				name: 'languageCode',
				type: 'string',
				required: true,
				default: 'en',
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['sendTemplate', 'createTemplate'],
					},
				},
			},
			{
				displayName: 'Media Type',
				name: 'mediaType',
				type: 'options',
				options: [
					{ name: 'Image', value: 'image' },
					{ name: 'Document', value: 'document' },
					{ name: 'Video', value: 'video' },
				],
				default: 'image',
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['sendMedia'],
					},
				},
			},
			{
				displayName: 'Media URL',
				name: 'mediaUrl',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['sendMedia'],
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['createTemplate'],
					},
				},
			},
			{
				displayName: 'Category',
				name: 'category',
				type: 'options',
				options: [
					{ name: 'Marketing', value: 'MARKETING' },
					{ name: 'Utility', value: 'UTILITY' },
					{ name: 'Authentication', value: 'AUTHENTICATION' },
				],
				default: 'MARKETING',
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['createTemplate'],
					},
				},
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['createTemplate'],
					},
				},
			},
			{
				displayName: 'Identity',
				name: 'identity',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['getConversations'],
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['getTemplates'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['getTemplates'],
						returnAll: [false],
					},
				},
			},
			// =====================================================
			// PRODUCT CATALOG FIELDS
			// =====================================================
			{
				displayName: 'Catalog ID',
				name: 'catalogId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['productCatalog'],
						operation: ['upload', 'get', 'getMany', 'update', 'delete', 'deleteCatalog'],
					},
				},
			},
			{
				displayName: 'Item ID',
				name: 'itemId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['productCatalog'],
						operation: ['get', 'update', 'delete'],
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['productCatalog'],
						operation: ['createCatalog'],
					},
				},
			},
			{
				displayName: 'Items',
				name: 'items',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['productCatalog'],
						operation: ['upload'],
					},
				},
				options: [
					{
						displayName: 'Item',
						name: 'item',
						values: [
							{
								displayName: 'Item ID',
								name: 'item_id',
								type: 'string',
								required: true,
								default: '',
							},
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								required: true,
								default: '',
							},
							{
								displayName: 'Description',
								name: 'description',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Price',
								name: 'price',
								type: 'number',
								default: 0,
							},
							{
								displayName: 'Image URL',
								name: 'image_url',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Category',
								name: 'category',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Available',
								name: 'available',
								type: 'boolean',
								default: true,
							},
						],
					},
				],
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['productCatalog'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Price',
						name: 'price',
						type: 'number',
						default: 0,
					},
					{
						displayName: 'Image URL',
						name: 'image_url',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Category',
						name: 'category',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Available',
						name: 'available',
						type: 'boolean',
						default: true,
					},
				],
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['productCatalog'],
						operation: ['getMany', 'getCatalogs'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				displayOptions: {
					show: {
						resource: ['productCatalog'],
						operation: ['getMany', 'getCatalogs'],
						returnAll: [false],
					},
				},
			},
			// =====================================================
			// REPORT FIELDS
			// =====================================================
			{
				displayName: 'Event Name',
				name: 'eventName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getTrends', 'getCohortReport', 'getRetentionReport'],
					},
				},
			},
			{
				displayName: 'From Date',
				name: 'from',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getTrends', 'getMessageReport', 'getRevenueReport', 'getUninstallReport', 'getFunnelReport', 'getCohortReport', 'getRetentionReport'],
					},
				},
			},
			{
				displayName: 'To Date',
				name: 'to',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getTrends', 'getMessageReport', 'getRevenueReport', 'getUninstallReport', 'getFunnelReport', 'getCohortReport', 'getRetentionReport'],
					},
				},
			},
			{
				displayName: 'Funnel Name',
				name: 'funnelName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getFunnelReport'],
					},
				},
			},
			{
				displayName: 'Cohort Type',
				name: 'cohortType',
				type: 'options',
				options: [
					{ name: 'Days', value: 'days' },
					{ name: 'Weeks', value: 'weeks' },
					{ name: 'Months', value: 'months' },
				],
				default: 'days',
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getCohortReport'],
					},
				},
			},
			// =====================================================
			// ADDITIONAL FIELDS FOR ALL RESOURCES
			// =====================================================
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['userProfile'],
						operation: ['upload'],
					},
				},
				options: [
					{
						displayName: 'Object ID',
						name: 'objectId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Timestamp',
						name: 'timestamp',
						type: 'dateTime',
						default: '',
					},
					{
						displayName: 'Facebook ID',
						name: 'fbId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Google Plus ID',
						name: 'gpId',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['upload'],
					},
				},
				options: [
					{
						displayName: 'Object ID',
						name: 'objectId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Timestamp',
						name: 'timestamp',
						type: 'dateTime',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['getMany'],
					},
				},
				options: [
					{
						displayName: 'Groups',
						name: 'groups',
						type: 'json',
						default: '{}',
					},
					{
						displayName: 'Event Properties',
						name: 'eventProperties',
						type: 'json',
						default: '[]',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['getCount'],
					},
				},
				options: [
					{
						displayName: 'Unique',
						name: 'unique',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Groups',
						name: 'groups',
						type: 'json',
						default: '{}',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['getTopEvents'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 10,
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['getTimeline'],
					},
				},
				options: [
					{
						displayName: 'Cursor',
						name: 'cursor',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Batch Size',
						name: 'batchSize',
						type: 'number',
						default: 50,
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create', 'createTargeted', 'createControlGroup'],
					},
				},
				options: [
					{
						displayName: 'Respect Frequency Caps',
						name: 'respectFrequencyCaps',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Estimate Only',
						name: 'estimateOnly',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Campaign Reference ID',
						name: 'wzrkCid',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['getMany'],
					},
				},
				options: [
					{
						displayName: 'From Date',
						name: 'from',
						type: 'dateTime',
						default: '',
					},
					{
						displayName: 'To Date',
						name: 'to',
						type: 'dateTime',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['getReport'],
					},
				},
				options: [
					{
						displayName: 'From Date',
						name: 'from',
						type: 'dateTime',
						default: '',
					},
					{
						displayName: 'To Date',
						name: 'to',
						type: 'dateTime',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['pushNotification'],
						operation: ['send', 'sendToSegment', 'sendToIdentity'],
					},
				},
				options: [
					{
						displayName: 'Respect Frequency Caps',
						name: 'respectFrequencyCaps',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Time To Live (Seconds)',
						name: 'wzrkTtl',
						type: 'number',
						default: 86400,
					},
					{
						displayName: 'Deep Link',
						name: 'deepLink',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Image URL',
						name: 'imageUrl',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['pushNotification'],
						operation: ['createWebPush'],
					},
				},
				options: [
					{
						displayName: 'Respect Frequency Caps',
						name: 'respectFrequencyCaps',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Icon URL',
						name: 'iconUrl',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Image URL',
						name: 'imageUrl',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Deep Link',
						name: 'deepLink',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Require Interaction',
						name: 'requireInteraction',
						type: 'boolean',
						default: false,
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['pushNotification'],
						operation: ['createMobilePush'],
					},
				},
				options: [
					{
						displayName: 'Respect Frequency Caps',
						name: 'respectFrequencyCaps',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Time To Live (Seconds)',
						name: 'wzrkTtl',
						type: 'number',
						default: 86400,
					},
					{
						displayName: 'Image URL',
						name: 'imageUrl',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Deep Link',
						name: 'deepLink',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Sound File',
						name: 'soundFile',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Icon (Android)',
						name: 'icon',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Badge Count (iOS)',
						name: 'badgeCount',
						type: 'number',
						default: 1,
					},
					{
						displayName: 'Category (iOS)',
						name: 'category',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['pushNotification'],
						operation: ['schedule'],
					},
				},
				options: [
					{
						displayName: 'Timezone',
						name: 'timezone',
						type: 'string',
						default: 'UTC',
					},
					{
						displayName: 'Respect Frequency Caps',
						name: 'respectFrequencyCaps',
						type: 'boolean',
						default: true,
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['segment'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Behavior',
						name: 'behavior',
						type: 'json',
						default: '{}',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['segment'],
						operation: ['getMany'],
					},
				},
				options: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Static', value: 'static' },
							{ name: 'Live', value: 'live' },
						],
						default: 'static',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['segment'],
						operation: ['getUsers'],
					},
				},
				options: [
					{
						displayName: 'Batch Size',
						name: 'batchSize',
						type: 'number',
						default: 100,
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['segment'],
						operation: ['downloadUsers'],
					},
				},
				options: [
					{
						displayName: 'Properties',
						name: 'properties',
						type: 'string',
						default: '',
						description: 'Comma-separated list of properties to export',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send', 'sendToSegment'],
					},
				},
				options: [
					{
						displayName: 'Reply To',
						name: 'replyTo',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Sender Name',
						name: 'senderName',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Tags',
						name: 'tags',
						type: 'string',
						default: '',
						description: 'Comma-separated list of tags',
					},
					{
						displayName: 'Respect Frequency Caps',
						name: 'respectFrequencyCaps',
						type: 'boolean',
						default: true,
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['sendTemplate'],
					},
				},
				options: [
					{
						displayName: 'Template Params',
						name: 'templateParams',
						type: 'json',
						default: '{}',
					},
					{
						displayName: 'Respect Frequency Caps',
						name: 'respectFrequencyCaps',
						type: 'boolean',
						default: true,
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['createTemplate'],
					},
				},
				options: [
					{
						displayName: 'From',
						name: 'from',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Reply To',
						name: 'replyTo',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Sender Name',
						name: 'senderName',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['send', 'sendToSegment'],
					},
				},
				options: [
					{
						displayName: 'Sender ID',
						name: 'senderId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Template ID',
						name: 'templateId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'DLT Template ID (India)',
						name: 'dltTemplateId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Provider',
						name: 'provider',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Respect Frequency Caps',
						name: 'respectFrequencyCaps',
						type: 'boolean',
						default: true,
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['createTemplate'],
					},
				},
				options: [
					{
						displayName: 'Sender ID',
						name: 'senderId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'DLT Template ID (India)',
						name: 'dltTemplateId',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['send'],
					},
				},
				options: [
					{
						displayName: 'Respect Frequency Caps',
						name: 'respectFrequencyCaps',
						type: 'boolean',
						default: true,
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['sendTemplate'],
					},
				},
				options: [
					{
						displayName: 'Template Params',
						name: 'templateParams',
						type: 'string',
						default: '',
						description: 'Comma-separated template parameters',
					},
					{
						displayName: 'HSM ID',
						name: 'hsmId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Respect Frequency Caps',
						name: 'respectFrequencyCaps',
						type: 'boolean',
						default: true,
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['sendMedia'],
					},
				},
				options: [
					{
						displayName: 'Caption',
						name: 'caption',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Filename',
						name: 'filename',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Respect Frequency Caps',
						name: 'respectFrequencyCaps',
						type: 'boolean',
						default: true,
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['createTemplate'],
					},
				},
				options: [
					{
						displayName: 'Header Type',
						name: 'headerType',
						type: 'options',
						options: [
							{ name: 'Text', value: 'TEXT' },
							{ name: 'Image', value: 'IMAGE' },
							{ name: 'Document', value: 'DOCUMENT' },
							{ name: 'Video', value: 'VIDEO' },
						],
						default: 'TEXT',
					},
					{
						displayName: 'Header Text',
						name: 'headerText',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Footer',
						name: 'footer',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Buttons',
						name: 'buttons',
						type: 'json',
						default: '[]',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['whatsApp'],
						operation: ['getConversations'],
					},
				},
				options: [
					{
						displayName: 'Cursor',
						name: 'cursor',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 50,
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['productCatalog'],
						operation: ['getMany'],
					},
				},
				options: [
					{
						displayName: 'Category',
						name: 'category',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Cursor',
						name: 'cursor',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['productCatalog'],
						operation: ['createCatalog'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Schema',
						name: 'schema',
						type: 'json',
						default: '{}',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getRealTime'],
					},
				},
				options: [
					{
						displayName: 'Event Name',
						name: 'eventName',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getTrends'],
					},
				},
				options: [
					{
						displayName: 'Daily',
						name: 'daily',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Unique',
						name: 'unique',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Groups',
						name: 'groups',
						type: 'json',
						default: '{}',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getMessageReport'],
					},
				},
				options: [
					{
						displayName: 'Channel',
						name: 'channel',
						type: 'options',
						options: [
							{ name: 'Push', value: 'push' },
							{ name: 'Email', value: 'email' },
							{ name: 'SMS', value: 'sms' },
							{ name: 'WhatsApp', value: 'whatsapp' },
						],
						default: 'push',
					},
					{
						displayName: 'Daily',
						name: 'daily',
						type: 'boolean',
						default: false,
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getRevenueReport'],
					},
				},
				options: [
					{
						displayName: 'Event Name',
						name: 'eventName',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Daily',
						name: 'daily',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Groups',
						name: 'groups',
						type: 'json',
						default: '{}',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getUninstallReport'],
					},
				},
				options: [
					{
						displayName: 'Daily',
						name: 'daily',
						type: 'boolean',
						default: false,
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getCohortReport'],
					},
				},
				options: [
					{
						displayName: 'Return Event Name',
						name: 'returnEventName',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getRetentionReport'],
					},
				},
				options: [
					{
						displayName: 'Cohort Type',
						name: 'cohortType',
						type: 'options',
						options: [
							{ name: 'Days', value: 'days' },
							{ name: 'Weeks', value: 'weeks' },
							{ name: 'Months', value: 'months' },
						],
						default: 'days',
					},
					{
						displayName: 'Unique',
						name: 'unique',
						type: 'boolean',
						default: false,
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		emitLicenseNotice();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[] = [];

				switch (resource) {
					case 'userProfile':
						switch (operation) {
							case 'upload':
								result = await userProfileOperations.upload.call(this, i);
								break;
							case 'get':
								result = await userProfileOperations.get.call(this, i);
								break;
							case 'getByEmail':
								result = await userProfileOperations.getByEmail.call(this, i);
								break;
							case 'getByPhone':
								result = await userProfileOperations.getByPhone.call(this, i);
								break;
							case 'delete':
								result = await userProfileOperations.delete.call(this, i);
								break;
							case 'demerge':
								result = await userProfileOperations.demerge.call(this, i);
								break;
							case 'getCount':
								result = await userProfileOperations.getCount.call(this, i);
								break;
							case 'disassociate':
								result = await userProfileOperations.disassociate.call(this, i);
								break;
							case 'subscribe':
								result = await userProfileOperations.subscribe.call(this, i);
								break;
							case 'getSubscriptionStatus':
								result = await userProfileOperations.getSubscriptionStatus.call(this, i);
								break;
						}
						break;

					case 'event':
						switch (operation) {
							case 'upload':
								result = await eventOperations.upload.call(this, i);
								break;
							case 'get':
								result = await eventOperations.get.call(this, i);
								break;
							case 'getMany':
								result = await eventOperations.getMany.call(this, i);
								break;
							case 'getCount':
								result = await eventOperations.getCount.call(this, i);
								break;
							case 'getPropertyValues':
								result = await eventOperations.getPropertyValues.call(this, i);
								break;
							case 'getTopEvents':
								result = await eventOperations.getTopEvents.call(this, i);
								break;
							case 'getTimeline':
								result = await eventOperations.getTimeline.call(this, i);
								break;
						}
						break;

					case 'campaign':
						switch (operation) {
							case 'create':
								result = await campaignOperations.create.call(this, i);
								break;
							case 'get':
								result = await campaignOperations.get.call(this, i);
								break;
							case 'getMany':
								result = await campaignOperations.getMany.call(this, i);
								break;
							case 'getStats':
								result = await campaignOperations.getStats.call(this, i);
								break;
							case 'stop':
								result = await campaignOperations.stop.call(this, i);
								break;
							case 'createTargeted':
								result = await campaignOperations.createTargeted.call(this, i);
								break;
							case 'createControlGroup':
								result = await campaignOperations.createControlGroup.call(this, i);
								break;
							case 'getReport':
								result = await campaignOperations.getReport.call(this, i);
								break;
						}
						break;

					case 'pushNotification':
						switch (operation) {
							case 'send':
								result = await pushNotificationOperations.send.call(this, i);
								break;
							case 'sendToSegment':
								result = await pushNotificationOperations.sendToSegment.call(this, i);
								break;
							case 'sendToIdentity':
								result = await pushNotificationOperations.sendToIdentity.call(this, i);
								break;
							case 'createWebPush':
								result = await pushNotificationOperations.createWebPush.call(this, i);
								break;
							case 'createMobilePush':
								result = await pushNotificationOperations.createMobilePush.call(this, i);
								break;
							case 'schedule':
								result = await pushNotificationOperations.schedule.call(this, i);
								break;
							case 'cancel':
								result = await pushNotificationOperations.cancel.call(this, i);
								break;
						}
						break;

					case 'segment':
						switch (operation) {
							case 'create':
								result = await segmentOperations.create.call(this, i);
								break;
							case 'get':
								result = await segmentOperations.get.call(this, i);
								break;
							case 'getMany':
								result = await segmentOperations.getMany.call(this, i);
								break;
							case 'getUsers':
								result = await segmentOperations.getUsers.call(this, i);
								break;
							case 'estimate':
								result = await segmentOperations.estimate.call(this, i);
								break;
							case 'delete':
								result = await segmentOperations.delete.call(this, i);
								break;
							case 'downloadUsers':
								result = await segmentOperations.downloadUsers.call(this, i);
								break;
						}
						break;

					case 'email':
						switch (operation) {
							case 'send':
								result = await emailOperations.send.call(this, i);
								break;
							case 'sendToSegment':
								result = await emailOperations.sendToSegment.call(this, i);
								break;
							case 'sendTemplate':
								result = await emailOperations.sendTemplate.call(this, i);
								break;
							case 'getTemplates':
								result = await emailOperations.getTemplates.call(this, i);
								break;
							case 'createTemplate':
								result = await emailOperations.createTemplate.call(this, i);
								break;
							case 'updateTemplate':
								result = await emailOperations.updateTemplate.call(this, i);
								break;
							case 'deleteTemplate':
								result = await emailOperations.deleteTemplate.call(this, i);
								break;
						}
						break;

					case 'sms':
						switch (operation) {
							case 'send':
								result = await smsOperations.send.call(this, i);
								break;
							case 'sendToSegment':
								result = await smsOperations.sendToSegment.call(this, i);
								break;
							case 'getProviders':
								result = await smsOperations.getProviders.call(this, i);
								break;
							case 'createTemplate':
								result = await smsOperations.createTemplate.call(this, i);
								break;
							case 'getTemplates':
								result = await smsOperations.getTemplates.call(this, i);
								break;
						}
						break;

					case 'whatsApp':
						switch (operation) {
							case 'send':
								result = await whatsAppOperations.send.call(this, i);
								break;
							case 'sendTemplate':
								result = await whatsAppOperations.sendTemplate.call(this, i);
								break;
							case 'sendMedia':
								result = await whatsAppOperations.sendMedia.call(this, i);
								break;
							case 'getTemplates':
								result = await whatsAppOperations.getTemplates.call(this, i);
								break;
							case 'createTemplate':
								result = await whatsAppOperations.createTemplate.call(this, i);
								break;
							case 'getConversations':
								result = await whatsAppOperations.getConversations.call(this, i);
								break;
						}
						break;

					case 'productCatalog':
						switch (operation) {
							case 'upload':
								result = await productCatalogOperations.upload.call(this, i);
								break;
							case 'get':
								result = await productCatalogOperations.get.call(this, i);
								break;
							case 'getMany':
								result = await productCatalogOperations.getMany.call(this, i);
								break;
							case 'update':
								result = await productCatalogOperations.update.call(this, i);
								break;
							case 'delete':
								result = await productCatalogOperations.delete.call(this, i);
								break;
							case 'createCatalog':
								result = await productCatalogOperations.createCatalog.call(this, i);
								break;
							case 'getCatalogs':
								result = await productCatalogOperations.getCatalogs.call(this, i);
								break;
							case 'deleteCatalog':
								result = await productCatalogOperations.deleteCatalog.call(this, i);
								break;
						}
						break;

					case 'report':
						switch (operation) {
							case 'getRealTime':
								result = await reportOperations.getRealTime.call(this, i);
								break;
							case 'getTrends':
								result = await reportOperations.getTrends.call(this, i);
								break;
							case 'getMessageReport':
								result = await reportOperations.getMessageReport.call(this, i);
								break;
							case 'getRevenueReport':
								result = await reportOperations.getRevenueReport.call(this, i);
								break;
							case 'getUninstallReport':
								result = await reportOperations.getUninstallReport.call(this, i);
								break;
							case 'getFunnelReport':
								result = await reportOperations.getFunnelReport.call(this, i);
								break;
							case 'getCohortReport':
								result = await reportOperations.getCohortReport.call(this, i);
								break;
							case 'getRetentionReport':
								result = await reportOperations.getRetentionReport.call(this, i);
								break;
						}
						break;
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: i,
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
