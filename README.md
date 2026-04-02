# n8n-nodes-clevertap

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for CleverTap's customer engagement and analytics platform. This node provides access to 5 core resources including profiles, events, campaigns, segments, and reports, enabling complete automation of user data management, behavioral tracking, targeted messaging campaigns, audience segmentation, and performance analytics within your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Customer Engagement](https://img.shields.io/badge/Customer%20Engagement-Platform-orange)
![Mobile Analytics](https://img.shields.io/badge/Mobile%20Analytics-API-green)
![Marketing Automation](https://img.shields.io/badge/Marketing%20Automation-Ready-purple)

## Features

- **Profile Management** - Create, update, retrieve, and delete user profiles with custom properties and behavioral data
- **Event Tracking** - Record and query user events, custom actions, and behavioral analytics data
- **Campaign Operations** - Create, manage, and monitor push notifications, email campaigns, and in-app messaging
- **Audience Segmentation** - Build, update, and manage user segments based on behavior, demographics, and custom criteria
- **Analytics & Reporting** - Generate performance reports, engagement metrics, and conversion analytics
- **Real-time Data Sync** - Synchronize user data and events in real-time with CleverTap's platform
- **Batch Operations** - Support for bulk profile updates and mass event uploads for efficient data processing
- **Advanced Filtering** - Query profiles and events with complex filters, date ranges, and custom parameters

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-clevertap`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-clevertap
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-clevertap.git
cd n8n-nodes-clevertap
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-clevertap
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your CleverTap API key from the dashboard settings | Yes |
| Account ID | CleverTap account identifier for API requests | Yes |
| Region | Data center region (US, EU, Asia Pacific) | Yes |
| Passcode | Additional security passcode for API authentication | Yes |

## Resources & Operations

### 1. Profile

| Operation | Description |
|-----------|-------------|
| Create | Create a new user profile with custom properties and initial data |
| Update | Update existing profile information, properties, and behavioral data |
| Get | Retrieve profile details by user ID or email address |
| Delete | Remove a user profile and all associated data |
| Upload | Bulk upload multiple profiles from CSV or JSON data |
| Get Events | Retrieve all events associated with a specific profile |
| Get Properties | Fetch custom properties and their values for a profile |

### 2. Event

| Operation | Description |
|-----------|-------------|
| Record | Track a single custom event with properties and user context |
| Upload | Bulk upload multiple events for processing and analytics |
| Query | Search and filter events by date range, user, or custom criteria |
| Get Details | Retrieve detailed information about a specific event |
| Get Analytics | Generate analytics and insights for event performance |
| Get Funnel | Analyze event funnels and conversion rates |

### 3. Campaign

| Operation | Description |
|-----------|-------------|
| Create | Create new push notification, email, or in-app message campaigns |
| Update | Modify campaign content, targeting, and scheduling parameters |
| Get | Retrieve campaign details, status, and configuration |
| Delete | Remove campaigns and stop active messaging |
| Send | Trigger immediate campaign delivery to targeted segments |
| Schedule | Set up automated campaign delivery with timing rules |
| Get Stats | Fetch campaign performance metrics and engagement data |
| Stop | Halt active campaigns and prevent further message delivery |

### 4. Segment

| Operation | Description |
|-----------|-------------|
| Create | Build new user segments with behavioral and demographic criteria |
| Update | Modify segment rules, conditions, and targeting parameters |
| Get | Retrieve segment details, size, and member criteria |
| Delete | Remove segments and associated targeting rules |
| Get Users | List all users belonging to a specific segment |
| Get Stats | Analyze segment performance and user engagement metrics |

### 5. Report

| Operation | Description |
|-----------|-------------|
| Generate | Create custom reports with specified metrics and date ranges |
| Get | Retrieve existing report data and analytics insights |
| Download | Export report data in various formats (CSV, JSON, PDF) |
| Schedule | Set up automated recurring reports with email delivery |
| Get Metrics | Fetch key performance indicators and engagement statistics |
| Get Retention | Analyze user retention rates and cohort performance |
| Get Conversion | Generate conversion funnel reports and optimization insights |

## Usage Examples

```javascript
// Create a new user profile with custom properties
{
  "identity": "user123@example.com",
  "profileData": {
    "Name": "John Doe",
    "Email": "user123@example.com",
    "Phone": "+1234567890",
    "Gender": "M",
    "Age": 28,
    "Custom_Property": "Premium User"
  }
}
```

```javascript
// Track a custom purchase event
{
  "identity": "user123@example.com",
  "eventName": "Product Purchased",
  "eventData": {
    "Product Name": "Premium Subscription",
    "Amount": 99.99,
    "Currency": "USD",
    "Category": "Subscription",
    "Timestamp": "2024-01-15T10:30:00Z"
  }
}
```

```javascript
// Create a targeted push notification campaign
{
  "campaignName": "Flash Sale Alert",
  "messageContent": {
    "title": "50% Off Everything!",
    "body": "Limited time offer - Don't miss out!",
    "action_url": "https://example.com/sale"
  },
  "targetSegment": "Premium Users",
  "scheduling": {
    "send_time": "2024-01-20T14:00:00Z",
    "timezone": "America/New_York"
  }
}
```

```javascript
// Generate a conversion funnel report
{
  "reportType": "conversion_funnel",
  "events": ["App Opened", "Product Viewed", "Add to Cart", "Purchase"],
  "dateRange": {
    "from": "2024-01-01",
    "to": "2024-01-31"
  },
  "segmentFilter": "Mobile Users",
  "granularity": "daily"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API credentials or expired authentication | Verify API key, account ID, and passcode in credentials |
| 403 Forbidden | Insufficient permissions for requested operation | Check account permissions and API access levels |
| 404 Not Found | Profile, campaign, or segment does not exist | Verify resource IDs and check if resource was deleted |
| 429 Rate Limited | API request limit exceeded for current time period | Implement request throttling and retry with exponential backoff |
| 400 Bad Request | Invalid data format or missing required fields | Validate input data structure and required parameters |
| 500 Server Error | CleverTap service temporarily unavailable | Retry request after delay or check CleverTap status page |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-clevertap/issues)
- **CleverTap API Documentation**: [CleverTap REST API Guide](https://developer.clevertap.com/docs/api)
- **CleverTap Community**: [CleverTap Support Portal](https://support.clevertap.com)