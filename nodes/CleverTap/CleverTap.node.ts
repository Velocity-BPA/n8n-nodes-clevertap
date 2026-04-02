/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-clevertap/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class CleverTap implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'CleverTap',
    name: 'clevertap',
    icon: 'file:clevertap.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the CleverTap API',
    defaults: {
      name: 'CleverTap',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'clevertapApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'UserProfile',
            value: 'userProfile',
          },
          {
            name: 'Event',
            value: 'event',
          },
          {
            name: 'Campaign',
            value: 'campaign',
          },
          {
            name: 'Segment',
            value: 'segment',
          },
          {
            name: 'Analytics',
            value: 'analytics',
          },
          {
            name: 'Message',
            value: 'message',
          }
        ],
        default: 'userProfile',
      },
      // Operation dropdowns per resource
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
    {
      name: 'Upload Profiles',
      value: 'uploadProfiles',
      description: 'Create or update user profiles in bulk',
      action: 'Upload profiles',
    },
    {
      name: 'Get Profiles',
      value: 'getProfiles',
      description: 'Retrieve user profiles by identity or object ID',
      action: 'Get profiles',
    },
    {
      name: 'Get Profile Push',
      value: 'getProfilePush',
      description: 'Get push notification details for profiles',
      action: 'Get profile push',
    },
    {
      name: 'Get Profile Counts',
      value: 'getProfileCounts',
      description: 'Get profile counts and statistics',
      action: 'Get profile counts',
    },
  ],
  default: 'uploadProfiles',
},
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
    {
      name: 'Upload Events',
      value: 'uploadEvents',
      description: 'Upload custom events for users',
      action: 'Upload events',
    },
    {
      name: 'Get Events',
      value: 'getEvents',
      description: 'Retrieve events for specific users or time periods',
      action: 'Get events',
    },
    {
      name: 'Get Event Counts',
      value: 'getEventCounts',
      description: 'Get event counts and analytics',
      action: 'Get event counts',
    },
    {
      name: 'Get Event Trends',
      value: 'getEventTrends',
      description: 'Get event trends and patterns over time',
      action: 'Get event trends',
    },
  ],
  default: 'uploadEvents',
},
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
    {
      name: 'Send Push Campaign',
      value: 'sendPushCampaign',
      description: 'Send push notification campaigns',
      action: 'Send push campaign',
    },
    {
      name: 'Send Email Campaign',
      value: 'sendEmailCampaign',
      description: 'Send email campaigns',
      action: 'Send email campaign',
    },
    {
      name: 'Create Campaign Target',
      value: 'createCampaignTarget',
      description: 'Create target audience for campaigns',
      action: 'Create campaign target',
    },
    {
      name: 'Get Campaigns',
      value: 'getCampaigns',
      description: 'List all campaigns',
      action: 'Get campaigns',
    },
    {
      name: 'Get Campaign Results',
      value: 'getCampaignResults',
      description: 'Get campaign performance results',
      action: 'Get campaign results',
    },
  ],
  default: 'sendPushCampaign',
},
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
    {
      name: 'Create Segment',
      value: 'createSegment',
      description: 'Create user segments based on criteria',
      action: 'Create segment',
    },
    {
      name: 'Get Segments',
      value: 'getSegments',
      description: 'List all user segments',
      action: 'Get segments',
    },
    {
      name: 'Get Segment Users',
      value: 'getSegmentUsers',
      description: 'Get users in a specific segment',
      action: 'Get segment users',
    },
  ],
  default: 'createSegment',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['analytics'],
    },
  },
  options: [
    {
      name: 'Get Counts',
      value: 'getCounts',
      description: 'Get various count metrics',
      action: 'Get count metrics',
    },
    {
      name: 'Get Trends',
      value: 'getTrends',
      description: 'Get trending data and analytics',
      action: 'Get trending data',
    },
    {
      name: 'Get Cohorts',
      value: 'getCohorts',
      description: 'Get cohort analysis data',
      action: 'Get cohort analysis',
    },
    {
      name: 'Get Funnel Analytics',
      value: 'getFunnelAnalytics',
      description: 'Get funnel analysis data',
      action: 'Get funnel analytics',
    },
  ],
  default: 'getCounts',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['message'],
    },
  },
  options: [
    {
      name: 'Send Push Message',
      value: 'sendPushMessage',
      description: 'Send individual push messages',
      action: 'Send push message',
    },
    {
      name: 'Send Email Message',
      value: 'sendEmailMessage',
      description: 'Send individual email messages',
      action: 'Send email message',
    },
    {
      name: 'Send SMS Message',
      value: 'sendSmsMessage',
      description: 'Send SMS messages',
      action: 'Send SMS message',
    },
    {
      name: 'Create Message Target',
      value: 'createMessageTarget',
      description: 'Create message targeting criteria',
      action: 'Create message target',
    },
    {
      name: 'Get Messages',
      value: 'getMessages',
      description: 'List sent messages',
      action: 'Get messages',
    },
  ],
  default: 'sendPushMessage',
},
      // Parameter definitions
{
  displayName: 'Profiles',
  name: 'profiles',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['userProfile'],
      operation: ['uploadProfiles'],
    },
  },
  default: '[]',
  description: 'Array of profile objects to upload',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['userProfile'],
      operation: ['uploadProfiles'],
    },
  },
  options: [
    {
      name: 'Profile',
      value: 'profile',
    },
    {
      name: 'Event',
      value: 'event',
    },
  ],
  default: 'profile',
  description: 'Type of data being uploaded',
},
{
  displayName: 'Identity',
  name: 'identity',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['userProfile'],
      operation: ['getProfiles', 'getProfilePush'],
    },
  },
  default: '',
  description: 'User identity to retrieve profile for',
},
{
  displayName: 'Object ID',
  name: 'objectId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['userProfile'],
      operation: ['getProfiles', 'getProfilePush'],
    },
  },
  default: '',
  description: 'CleverTap object ID for the user',
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['userProfile'],
      operation: ['getProfiles'],
    },
  },
  default: '',
  description: 'Email address to retrieve profile for',
},
{
  displayName: 'From',
  name: 'from',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['userProfile'],
      operation: ['getProfiles', 'getProfileCounts'],
    },
  },
  default: '',
  description: 'Start date for profile data retrieval',
},
{
  displayName: 'To',
  name: 'to',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['userProfile'],
      operation: ['getProfiles', 'getProfileCounts'],
    },
  },
  default: '',
  description: 'End date for profile data retrieval',
},
{
  displayName: 'User Type',
  name: 'userType',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['userProfile'],
      operation: ['getProfileCounts'],
    },
  },
  options: [
    {
      name: 'All',
      value: 'all',
    },
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
  ],
  default: 'all',
  description: 'Type of users to count',
},
{
  displayName: 'Events',
  name: 'events',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['event'],
      operation: ['uploadEvents'],
    },
  },
  default: '[]',
  description: 'Array of event objects to upload',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['event'],
      operation: ['uploadEvents'],
    },
  },
  options: [
    {
      name: 'Event',
      value: 'event',
    },
    {
      name: 'Profile',
      value: 'profile',
    },
  ],
  default: 'event',
  description: 'Type of data being uploaded',
},
{
  displayName: 'Identity',
  name: 'identity',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['event'],
      operation: ['getEvents'],
    },
  },
  default: '',
  description: 'User identity to retrieve events for',
},
{
  displayName: 'Object ID',
  name: 'objectId',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['event'],
      operation: ['getEvents'],
    },
  },
  default: '',
  description: 'Specific object ID to filter events',
},
{
  displayName: 'From Date',
  name: 'from',
  type: 'dateTime',
  required: false,
  displayOptions: {
    show: {
      resource: ['event'],
      operation: ['getEvents', 'getEventCounts', 'getEventTrends'],
    },
  },
  default: '',
  description: 'Start date for event retrieval',
},
{
  displayName: 'To Date',
  name: 'to',
  type: 'dateTime',
  required: false,
  displayOptions: {
    show: {
      resource: ['event'],
      operation: ['getEvents', 'getEventCounts', 'getEventTrends'],
    },
  },
  default: '',
  description: 'End date for event retrieval',
},
{
  displayName: 'Events',
  name: 'eventsList',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['event'],
      operation: ['getEvents'],
    },
  },
  default: '',
  description: 'Comma-separated list of event names to retrieve',
},
{
  displayName: 'Event Name',
  name: 'eventName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['event'],
      operation: ['getEventCounts', 'getEventTrends'],
    },
  },
  default: '',
  description: 'Name of the event to analyze',
},
{
  displayName: 'Groups',
  name: 'groups',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['event'],
      operation: ['getEventCounts', 'getEventTrends'],
    },
  },
  default: '[]',
  description: 'Array of grouping criteria for analytics',
},
{
  displayName: 'To',
  name: 'to',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['sendPushCampaign'],
    },
  },
  default: '{}',
  description: 'Target audience for the push notification',
  placeholder: '{"segment_id": "123"}',
},
{
  displayName: 'Notification',
  name: 'notification',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['sendPushCampaign'],
    },
  },
  default: '{}',
  description: 'Push notification content',
  placeholder: '{"title": "Hello", "body": "World"}',
},
{
  displayName: 'Platform Specific',
  name: 'platformSpecific',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['sendPushCampaign'],
    },
  },
  default: '{}',
  description: 'Platform-specific payload formats',
  placeholder: '{"android": {...}, "ios": {...}}',
},
{
  displayName: 'To',
  name: 'to',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['sendEmailCampaign'],
    },
  },
  default: '{}',
  description: 'Target audience for the email campaign',
  placeholder: '{"segment_id": "123"}',
},
{
  displayName: 'Subject',
  name: 'subject',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['sendEmailCampaign'],
    },
  },
  default: '',
  description: 'Email subject line',
},
{
  displayName: 'Body',
  name: 'body',
  type: 'string',
  typeOptions: {
    rows: 5,
  },
  required: true,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['sendEmailCampaign'],
    },
  },
  default: '',
  description: 'Email body content',
},
{
  displayName: 'From',
  name: 'from',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['sendEmailCampaign'],
    },
  },
  default: '',
  description: 'Sender email address',
},
{
  displayName: 'Target Name',
  name: 'targetName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['createCampaignTarget'],
    },
  },
  default: '',
  description: 'Name for the target audience',
},
{
  displayName: 'Query',
  name: 'query',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['createCampaignTarget'],
    },
  },
  default: '{}',
  description: 'Query to define the target audience',
  placeholder: '{"event_name": "App Launched"}',
},
{
  displayName: 'From Date',
  name: 'from',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['getCampaigns'],
    },
  },
  default: '',
  description: 'Start date for campaign list (YYYY-MM-DD)',
},
{
  displayName: 'To Date',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['getCampaigns'],
    },
  },
  default: '',
  description: 'End date for campaign list (YYYY-MM-DD)',
},
{
  displayName: 'Campaign Type',
  name: 'campaignType',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['getCampaigns'],
    },
  },
  options: [
    {
      name: 'All',
      value: 'all',
    },
    {
      name: 'Push',
      value: 'push',
    },
    {
      name: 'Email',
      value: 'email',
    },
    {
      name: 'SMS',
      value: 'sms',
    },
  ],
  default: 'all',
  description: 'Type of campaigns to retrieve',
},
{
  displayName: 'Campaign ID',
  name: 'campaignId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['getCampaignResults'],
    },
  },
  default: '',
  description: 'ID of the campaign to get results for',
},
{
  displayName: 'From Date',
  name: 'from',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['getCampaignResults'],
    },
  },
  default: '',
  description: 'Start date for results (YYYY-MM-DD)',
},
{
  displayName: 'To Date',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['campaign'],
      operation: ['getCampaignResults'],
    },
  },
  default: '',
  description: 'End date for results (YYYY-MM-DD)',
},
{
  displayName: 'Segment Name',
  name: 'segment_name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['segment'],
      operation: ['createSegment'],
    },
  },
  default: '',
  description: 'Name of the segment to create',
},
{
  displayName: 'Query',
  name: 'query',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['segment'],
      operation: ['createSegment'],
    },
  },
  default: '{}',
  description: 'Query criteria for segment creation in JSON format',
},
{
  displayName: 'Estimate Only',
  name: 'estimate_only',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['segment'],
      operation: ['createSegment'],
    },
  },
  default: false,
  description: 'Whether to only estimate segment size without creating it',
},
{
  displayName: 'Cursor',
  name: 'cursor',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['segment'],
      operation: ['getSegments'],
    },
  },
  default: '',
  description: 'Cursor for pagination',
},
{
  displayName: 'Segment ID',
  name: 'segment_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['segment'],
      operation: ['getSegmentUsers'],
    },
  },
  default: '',
  description: 'ID of the segment to get users from',
},
{
  displayName: 'Cursor',
  name: 'cursor',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['segment'],
      operation: ['getSegmentUsers'],
    },
  },
  default: '',
  description: 'Cursor for pagination',
},
{
  displayName: 'Format',
  name: 'format',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['segment'],
      operation: ['getSegmentUsers'],
    },
  },
  options: [
    {
      name: 'JSON',
      value: 'json',
    },
    {
      name: 'CSV',
      value: 'csv',
    },
  ],
  default: 'json',
  description: 'Format of the response',
},
{
  displayName: 'User Type',
  name: 'userType',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getCounts'],
    },
  },
  options: [
    {
      name: 'All',
      value: 'all',
    },
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'New',
      value: 'new',
    },
  ],
  default: 'all',
  description: 'Type of users to count',
},
{
  displayName: 'Event Name',
  name: 'eventName',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getCounts', 'getTrends', 'getCohorts'],
    },
  },
  default: '',
  description: 'Name of the event to analyze',
},
{
  displayName: 'From Date',
  name: 'fromDate',
  type: 'dateTime',
  required: true,
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getCounts', 'getTrends', 'getCohorts', 'getFunnelAnalytics'],
    },
  },
  default: '',
  description: 'Start date for the analysis period',
},
{
  displayName: 'To Date',
  name: 'toDate',
  type: 'dateTime',
  required: true,
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getCounts', 'getTrends', 'getCohorts', 'getFunnelAnalytics'],
    },
  },
  default: '',
  description: 'End date for the analysis period',
},
{
  displayName: 'Groups',
  name: 'groups',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getTrends'],
    },
  },
  default: '',
  description: 'Groups to segment the trending data by',
},
{
  displayName: 'Period',
  name: 'period',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getCohorts'],
    },
  },
  options: [
    {
      name: 'Daily',
      value: 'daily',
    },
    {
      name: 'Weekly',
      value: 'weekly',
    },
    {
      name: 'Monthly',
      value: 'monthly',
    },
  ],
  default: 'weekly',
  description: 'Time period for cohort analysis',
},
{
  displayName: 'Funnel ID',
  name: 'funnelId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getFunnelAnalytics'],
    },
  },
  default: '',
  description: 'ID of the funnel to analyze',
},
{
  displayName: 'To',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['message'],
      operation: ['sendPushMessage'],
    },
  },
  default: '',
  description: 'The recipient identifier (user ID, email, or phone number)',
},
{
  displayName: 'Notification',
  name: 'notification',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['message'],
      operation: ['sendPushMessage'],
    },
  },
  default: '{}',
  description: 'The notification content including title and body',
},
{
  displayName: 'Platform Specific',
  name: 'platform_specific',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['message'],
      operation: ['sendPushMessage'],
    },
  },
  default: '{}',
  description: 'Platform-specific payload formats (iOS, Android)',
},
{
  displayName: 'To',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['message'],
      operation: ['sendEmailMessage'],
    },
  },
  default: '',
  description: 'The recipient email address',
},
{
  displayName: 'Subject',
  name: 'subject',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['message'],
      operation: ['sendEmailMessage'],
    },
  },
  default: '',
  description: 'The email subject',
},
{
  displayName: 'Body',
  name: 'body',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['message'],
      operation: ['sendEmailMessage'],
    },
  },
  default: '',
  description: 'The email body content',
},
{
  displayName: 'From',
  name: 'from',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['message'],
      operation: ['sendEmailMessage'],
    },
  },
  default: '',
  description: 'The sender email address',
},
{
  displayName: 'To',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['message'],
      operation: ['sendSmsMessage'],
    },
  },
  default: '',
  description: 'The recipient phone number',
},
{
  displayName: 'Body',
  name: 'body',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['message'],
      operation: ['sendSmsMessage'],
    },
  },
  default: '',
  description: 'The SMS message content',
},
{
  displayName: 'Target Name',
  name: 'target_name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['message'],
      operation: ['createMessageTarget'],
    },
  },
  default: '',
  description: 'The name for the targeting criteria',
},
{
  displayName: 'Query',
  name: 'query',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['message'],
      operation: ['createMessageTarget'],
    },
  },
  default: '{}',
  description: 'The targeting query criteria',
},
{
  displayName: 'From Date',
  name: 'from',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['message'],
      operation: ['getMessages'],
    },
  },
  default: '',
  description: 'Start date for message listing (YYYY-MM-DD)',
},
{
  displayName: 'To Date',
  name: 'to',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['message'],
      operation: ['getMessages'],
    },
  },
  default: '',
  description: 'End date for message listing (YYYY-MM-DD)',
},
{
  displayName: 'Message Type',
  name: 'message_type',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['message'],
      operation: ['getMessages'],
    },
  },
  options: [
    {
      name: 'Push',
      value: 'push',
    },
    {
      name: 'Email',
      value: 'email',
    },
    {
      name: 'SMS',
      value: 'sms',
    },
    {
      name: 'In-App',
      value: 'inapp',
    },
  ],
  default: 'push',
  description: 'The type of messages to retrieve',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'userProfile':
        return [await executeUserProfileOperations.call(this, items)];
      case 'event':
        return [await executeEventOperations.call(this, items)];
      case 'campaign':
        return [await executeCampaignOperations.call(this, items)];
      case 'segment':
        return [await executeSegmentOperations.call(this, items)];
      case 'analytics':
        return [await executeAnalyticsOperations.call(this, items)];
      case 'message':
        return [await executeMessageOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeUserProfileOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('clevertapApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'uploadProfiles': {
          const profiles = this.getNodeParameter('profiles', i) as any;
          const type = this.getNodeParameter('type', i) as string;
          
          const parsedProfiles = typeof profiles === 'string' ? JSON.parse(profiles) : profiles;
          
          const requestBody: any = {
            d: parsedProfiles,
          };

          const options: any = {
            method: 'POST',
            url: 'https://api.clevertap.com/1/upload',
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            json: requestBody,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getProfiles': {
          const identity = this.getNodeParameter('identity', i) as string;
          const objectId = this.getNodeParameter('objectId', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const to = this.getNodeParameter('to', i) as string;
          
          const requestBody: any = {};
          
          if (identity) {
            requestBody.identity = identity;
          }
          if (objectId) {
            requestBody.objectId = objectId;
          }
          if (email) {
            requestBody.email = email;
          }
          if (from) {
            requestBody.from = from;
          }
          if (to) {
            requestBody.to = to;
          }

          const options: any = {
            method: 'POST',
            url: 'https://api.clevertap.com/1/profiles.json',
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            json: requestBody,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getProfilePush': {
          const identity = this.getNodeParameter('identity', i) as string;
          const objectId = this.getNodeParameter('objectId', i) as string;
          
          const requestBody: any = {};
          
          if (identity) {
            requestBody.identity = identity;
          }
          if (objectId) {
            requestBody.objectId = objectId;
          }

          const options: any = {
            method: 'POST',
            url: 'https://api.clevertap.com/1/profiles/push',
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            json: requestBody,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getProfileCounts': {
          const userType = this.getNodeParameter('userType', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const to = this.getNodeParameter('to', i) as string;
          
          const requestBody: any = {};
          
          if (userType && userType !== 'all') {
            requestBody.user_type = userType;
          }
          if (from) {
            requestBody.from = from;
          }
          if (to) {
            requestBody.to = to;
          }

          const options: any = {
            method: 'POST',
            url: 'https://api.clevertap.com/1/counts.json',
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            json: requestBody,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }
  
  return returnData;
}

async function executeEventOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('clevertapApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'uploadEvents': {
          const events = this.getNodeParameter('events', i) as any;
          const type = this.getNodeParameter('type', i) as string;
          
          const eventsData = typeof events === 'string' ? JSON.parse(events) : events;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.clevertap.com/1'}/upload`,
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            body: {
              d: eventsData,
              type: type,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getEvents': {
          const identity = this.getNodeParameter('identity', i) as string;
          const objectId = this.getNodeParameter('objectId', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const to = this.getNodeParameter('to', i) as string;
          const eventsList = this.getNodeParameter('eventsList', i) as string;
          
          const requestBody: any = {
            identity: identity,
          };
          
          if (objectId) requestBody.objectId = objectId;
          if (from) requestBody.from = from;
          if (to) requestBody.to = to;
          if (eventsList) requestBody.events = eventsList.split(',').map((e: string) => e.trim());
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.clevertap.com/1'}/events.json`,
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getEventCounts': {
          const eventName = this.getNodeParameter('eventName', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const to = this.getNodeParameter('to', i) as string;
          const groups = this.getNodeParameter('groups', i) as any;
          
          const requestBody: any = {
            event_name: eventName,
          };
          
          if (from) requestBody.from = from;
          if (to) requestBody.to = to;
          if (groups) {
            const groupsData = typeof groups === 'string' ? JSON.parse(groups) : groups;
            if (Array.isArray(groupsData) && groupsData.length > 0) {
              requestBody.groups = groupsData;
            }
          }
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.clevertap.com/1'}/counts.json`,
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getEventTrends': {
          const eventName = this.getNodeParameter('eventName', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const to = this.getNodeParameter('to', i) as string;
          const groups = this.getNodeParameter('groups', i) as any;
          
          const requestBody: any = {
            event_name: eventName,
          };
          
          if (from) requestBody.from = from;
          if (to) requestBody.to = to;
          if (groups) {
            const groupsData = typeof groups === 'string' ? JSON.parse(groups) : groups;
            if (Array.isArray(groupsData) && groupsData.length > 0) {
              requestBody.groups = groupsData;
            }
          }
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.clevertap.com/1'}/trends.json`,
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }
  
  return returnData;
}

async function executeCampaignOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('clevertapApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'sendPushCampaign': {
          const to = this.getNodeParameter('to', i) as any;
          const notification = this.getNodeParameter('notification', i) as any;
          const platformSpecific = this.getNodeParameter('platformSpecific', i, {}) as any;

          const body: any = {
            to: typeof to === 'string' ? JSON.parse(to) : to,
            notification: typeof notification === 'string' ? JSON.parse(notification) : notification,
          };

          if (platformSpecific && Object.keys(platformSpecific).length > 0) {
            body.platform_specific = typeof platformSpecific === 'string' ? JSON.parse(platformSpecific) : platformSpecific;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/send/push.json`,
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'sendEmailCampaign': {
          const to = this.getNodeParameter('to', i) as any;
          const subject = this.getNodeParameter('subject', i) as string;
          const body = this.getNodeParameter('body', i) as string;
          const from = this.getNodeParameter('from', i) as string;

          const requestBody: any = {
            to: typeof to === 'string' ? JSON.parse(to) : to,
            subject,
            body,
            from,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/send/email.json`,
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createCampaignTarget': {
          const targetName = this.getNodeParameter('targetName', i) as string;
          const query = this.getNodeParameter('query', i) as any;

          const requestBody: any = {
            target_name: targetName,
            query: typeof query === 'string' ? JSON.parse(query) : query,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/targets/create.json`,
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCampaigns': {
          const from = this.getNodeParameter('from', i) as string;
          const to = this.getNodeParameter('to', i) as string;
          const campaignType = this.getNodeParameter('campaignType', i, 'all') as string;

          const requestBody: any = {
            from,
            to,
          };

          if (campaignType !== 'all') {
            requestBody.campaign_type = campaignType;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/campaigns/list.json`,
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCampaignResults': {
          const campaignId = this.getNodeParameter('campaignId', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const to = this.getNodeParameter('to', i) as string;

          const requestBody: any = {
            campaign_id: campaignId,
            from,
            to,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/campaigns/result.json`,
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
            itemIndex: i,
          });
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error, { itemIndex: i });
      }
    }
  }

  return returnData;
}

async function executeSegmentOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('clevertapApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'createSegment': {
          const segmentName = this.getNodeParameter('segment_name', i) as string;
          const query = this.getNodeParameter('query', i) as any;
          const estimateOnly = this.getNodeParameter('estimate_only', i) as boolean;

          const body: any = {
            segment_name: segmentName,
            query: typeof query === 'string' ? JSON.parse(query) : query,
            estimate_only: estimateOnly,
          };

          const options: any = {
            method: 'POST',
            url: 'https://api.clevertap.com/1/segments/create.json',
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            json: true,
            body: body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSegments': {
          const cursor = this.getNodeParameter('cursor', i) as string;

          const body: any = {};
          if (cursor) {
            body.cursor = cursor;
          }

          const options: any = {
            method: 'POST',
            url: 'https://api.clevertap.com/1/segments/list.json',
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            json: true,
            body: body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSegmentUsers': {
          const segmentId = this.getNodeParameter('segment_id', i) as string;
          const cursor = this.getNodeParameter('cursor', i) as string;
          const format = this.getNodeParameter('format', i) as string;

          const body: any = {
            segment_id: segmentId,
            format: format,
          };

          if (cursor) {
            body.cursor = cursor;
          }

          const options: any = {
            method: 'POST',
            url: 'https://api.clevertap.com/1/segments/result.json',
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            json: true,
            body: body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.response && error.response.body) {
          throw new NodeApiError(this.getNode(), error.response.body, { 
            message: error.response.body.message || error.message,
            httpCode: error.statusCode || error.response.status
          });
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeAnalyticsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('clevertapApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getCounts': {
          const userType = this.getNodeParameter('userType', i) as string;
          const eventName = this.getNodeParameter('eventName', i) as string;
          const fromDate = this.getNodeParameter('fromDate', i) as string;
          const toDate = this.getNodeParameter('toDate', i) as string;

          const body: any = {
            user_type: userType,
            from: new Date(fromDate).toISOString().split('T')[0],
            to: new Date(toDate).toISOString().split('T')[0],
          };

          if (eventName) {
            body.event_name = eventName;
          }

          const options: any = {
            method: 'POST',
            url: 'https://api.clevertap.com/1/counts.json',
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTrends': {
          const eventName = this.getNodeParameter('eventName', i) as string;
          const fromDate = this.getNodeParameter('fromDate', i) as string;
          const toDate = this.getNodeParameter('toDate', i) as string;
          const groups = this.getNodeParameter('groups', i) as string;

          const body: any = {
            from: new Date(fromDate).toISOString().split('T')[0],
            to: new Date(toDate).toISOString().split('T')[0],
          };

          if (eventName) {
            body.event_name = eventName;
          }

          if (groups) {
            body.groups = groups.split(',').map((g: string) => g.trim());
          }

          const options: any = {
            method: 'POST',
            url: 'https://api.clevertap.com/1/trends.json',
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCohorts': {
          const eventName = this.getNodeParameter('eventName', i) as string;
          const fromDate = this.getNodeParameter('fromDate', i) as string;
          const toDate = this.getNodeParameter('toDate', i) as string;
          const period = this.getNodeParameter('period', i) as string;

          const body: any = {
            from: new Date(fromDate).toISOString().split('T')[0],
            to: new Date(toDate).toISOString().split('T')[0],
            period,
          };

          if (eventName) {
            body.event_name = eventName;
          }

          const options: any = {
            method: 'POST',
            url: 'https://api.clevertap.com/1/cohorts.json',
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFunnelAnalytics': {
          const funnelId = this.getNodeParameter('funnelId', i) as string;
          const fromDate = this.getNodeParameter('fromDate', i) as string;
          const toDate = this.getNodeParameter('toDate', i) as string;

          const body: any = {
            funnel_id: funnelId,
            from: new Date(fromDate).toISOString().split('T')[0],
            to: new Date(toDate).toISOString().split('T')[0],
          };

          const options: any = {
            method: 'POST',
            url: 'https://api.clevertap.com/1/funnel.json',
            headers: {
              'X-CleverTap-Account-Id': credentials.accountId,
              'X-CleverTap-Passcode': credentials.passcode,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeMessageOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('clevertapApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'sendPushMessage': {
          const to = this.getNodeParameter('to', i) as string;
          const notification = this.getNodeParameter('notification', i) as any;
          const platformSpecific = this.getNodeParameter('platform_specific', i) as any;

          let parsedNotification: any;
          let parsedPlatformSpecific: any;

          try {
            parsedNotification = typeof notification === 'string' ? JSON.parse(notification) : notification;
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid notification JSON: ${error.message}`);
          }

          try {
            parsedPlatformSpec