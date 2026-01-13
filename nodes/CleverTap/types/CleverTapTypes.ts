/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export interface ICleverTapCredentials {
	accountId: string;
	passcode: string;
	region: string;
}

export interface ICleverTapResponse {
	status: 'success' | 'fail' | 'partial';
	error?: string;
	code?: number;
	processed?: number;
	unprocessed?: IUnprocessedRecord[];
	records?: IUserProfile[];
	cursor?: string;
	next_cursor?: string;
	req_id?: number;
	data?: unknown[];
}

export interface IUnprocessedRecord {
	record: unknown;
	status: string;
	code: number;
	error: string;
}

export interface IUserProfile {
	identity?: string;
	objectId?: string;
	type?: 'profile' | 'event';
	ts?: number;
	profileData?: IProfileData;
	evtName?: string;
	evtData?: Record<string, unknown>;
}

export interface IProfileData {
	Name?: string;
	Email?: string;
	Phone?: string;
	Gender?: 'M' | 'F';
	DOB?: string;
	Photo?: string;
	fbId?: string;
	gpId?: string;
	'MSG-email'?: boolean;
	'MSG-push'?: boolean;
	'MSG-sms'?: boolean;
	'MSG-whatsapp'?: boolean;
	[key: string]: unknown;
}

export interface IEventRecord {
	identity?: string;
	objectId?: string;
	type: 'event';
	evtName: string;
	evtData?: Record<string, unknown>;
	ts?: number;
}

export interface ICampaign {
	campaign_id?: string;
	name: string;
	campaign_type: 'mobile_push' | 'web_push' | 'email' | 'sms' | 'whatsapp';
	where?: ISegmentQuery;
	content?: ICampaignContent;
	when?: ICampaignSchedule;
	respect_frequency_caps?: boolean;
	estimate_only?: boolean;
	wzrk_cid?: string;
}

export interface ISegmentQuery {
	event_name?: string;
	from?: number;
	to?: number;
	common_profile_properties?: IProfilePropertyFilter;
	event_properties?: IEventPropertyFilter[];
}

export interface IProfilePropertyFilter {
	property_name: string;
	operator: string;
	property_value: unknown;
}

export interface IEventPropertyFilter {
	property_name: string;
	operator: string;
	property_value: unknown;
}

export interface ICampaignContent {
	title?: string;
	body?: string;
	platform_specific?: IPlatformContent;
}

export interface IPlatformContent {
	android?: IAndroidContent;
	ios?: IIOSContent;
	web?: IWebContent;
}

export interface IAndroidContent {
	title?: string;
	body?: string;
	image_url?: string;
	deep_link?: string;
	icon?: string;
	sound_file?: string;
	custom_key_value?: Record<string, string>;
}

export interface IIOSContent {
	title?: string;
	body?: string;
	image_url?: string;
	deep_link?: string;
	badge_count?: number;
	sound_file?: string;
	category?: string;
}

export interface IWebContent {
	title?: string;
	body?: string;
	image_url?: string;
	deep_link?: string;
	icon_url?: string;
	require_interaction?: boolean;
}

export interface ICampaignSchedule {
	start_time?: string;
	end_time?: string;
	timezone?: string;
}

export interface IPushNotification {
	to?: string[];
	tag_group?: string;
	respect_frequency_caps?: boolean;
	title: string;
	body: string;
	platform_specific?: IPlatformContent;
	wzrk_acct_id?: string;
	wzrk_ttl?: number;
}

export interface ISegment {
	segment_id?: string;
	name: string;
	segment_type: 'static' | 'live';
	query?: ISegmentQuery;
}

export interface IEmailMessage {
	to?: string[];
	from: string;
	subject: string;
	body: string;
	reply_to?: string;
	sender_name?: string;
	template_id?: string;
	tags?: string[];
}

export interface ISmsMessage {
	to?: string[];
	content: string;
	sender_id?: string;
	template_id?: string;
	dlt_template_id?: string;
	provider?: string;
}

export interface IWhatsAppMessage {
	to?: string[];
	type: 'text' | 'image' | 'document' | 'template';
	template_name?: string;
	template_params?: string[];
	media_url?: string;
	caption?: string;
	hsm_id?: string;
	language_code?: string;
	text?: string;
}

export interface IProductCatalogItem {
	catalog_id?: string;
	item_id: string;
	name: string;
	description?: string;
	price?: number;
	image_url?: string;
	category?: string;
	available?: boolean;
	custom_fields?: Record<string, unknown>;
}

export interface IReportQuery {
	from: number;
	to: number;
	event_name?: string;
	daily?: boolean;
	groups?: IGroupConfig;
	unique?: boolean;
}

export interface IGroupConfig {
	group_by?: string;
	limit?: number;
}

export type CleverTapResource =
	| 'userProfile'
	| 'event'
	| 'campaign'
	| 'pushNotification'
	| 'segment'
	| 'email'
	| 'sms'
	| 'whatsApp'
	| 'productCatalog'
	| 'report';

export type UserProfileOperation =
	| 'upload'
	| 'get'
	| 'getByEmail'
	| 'getByPhone'
	| 'delete'
	| 'demerge'
	| 'getCount'
	| 'disassociate'
	| 'subscribe'
	| 'getSubscriptionStatus';

export type EventOperation =
	| 'upload'
	| 'get'
	| 'getMany'
	| 'getCount'
	| 'getPropertyValues'
	| 'getTopEvents'
	| 'getTimeline';

export type CampaignOperation =
	| 'create'
	| 'get'
	| 'getMany'
	| 'getStats'
	| 'stop'
	| 'createTargeted'
	| 'createControlGroup'
	| 'getReport';

export type PushNotificationOperation =
	| 'send'
	| 'sendToSegment'
	| 'sendToIdentity'
	| 'createWebPush'
	| 'createMobilePush'
	| 'schedule'
	| 'cancel';

export type SegmentOperation =
	| 'create'
	| 'get'
	| 'getMany'
	| 'getUsers'
	| 'estimate'
	| 'delete'
	| 'downloadUsers';

export type EmailOperation =
	| 'send'
	| 'sendToSegment'
	| 'sendTemplate'
	| 'getTemplates'
	| 'createTemplate'
	| 'updateTemplate'
	| 'deleteTemplate';

export type SmsOperation =
	| 'send'
	| 'sendToSegment'
	| 'getProviders'
	| 'createTemplate'
	| 'getTemplates';

export type WhatsAppOperation =
	| 'send'
	| 'sendTemplate'
	| 'sendMedia'
	| 'getTemplates'
	| 'createTemplate'
	| 'getConversations';

export type ProductCatalogOperation =
	| 'upload'
	| 'get'
	| 'getMany'
	| 'update'
	| 'delete'
	| 'createCatalog'
	| 'getCatalogs'
	| 'deleteCatalog';

export type ReportOperation =
	| 'getRealTime'
	| 'getTrends'
	| 'getMessageReport'
	| 'getRevenueReport'
	| 'getUninstallReport'
	| 'getFunnelReport'
	| 'getCohortReport'
	| 'getRetentionReport';
