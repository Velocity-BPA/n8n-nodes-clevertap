# n8n-nodes-clevertap

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with CleverTap's customer engagement platform, enabling automation across 6 core resources. Manage user profiles, track events, execute campaigns, analyze segments, retrieve analytics data, and send personalized messages directly from your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![CleverTap](https://img.shields.io/badge/CleverTap-Supported-orange)
![Customer Engagement](https://img.shields.io/badge/Customer%20Engagement-Automation-green)
![Marketing](https://img.shields.io/badge/Marketing-Analytics-purple)

## Features

- **User Profile Management** - Create, update, retrieve, and delete user profiles with custom properties and segmentation data
- **Event Tracking** - Record custom events, conversions, and user interactions with detailed attribution and metadata
- **Campaign Orchestration** - Create, launch, monitor, and optimize multi-channel marketing campaigns programmatically
- **Segment Analytics** - Build dynamic user segments, analyze cohorts, and track segment performance metrics
- **Real-time Analytics** - Access engagement metrics, conversion funnels, retention reports, and custom analytics dashboards
- **Message Delivery** - Send personalized push notifications, emails, SMS, and in-app messages with advanced targeting
- **Automated Workflows** - Trigger customer journeys based on behavioral events, profile changes, and campaign interactions
- **Data Synchronization** - Seamlessly sync customer data between CleverTap and other business systems in your n8n workflows

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
| Account ID | Your CleverTap account identifier found in dashboard settings | ✅ |
| Passcode | Account-specific passcode for API authentication | ✅ |
| Region | Data center region (US1, EU1, AP1, etc.) | ✅ |
| API Key | Server-side API key for backend operations | ✅ |

## Resources & Operations

### 1. User Profile

| Operation | Description |
|-----------|-------------|
| Create | Create a new user profile with identity and custom properties |
| Get | Retrieve user profile data by identity or ObjectId |
| Update | Update existing user profile properties and attributes |
| Delete | Remove user profile from CleverTap account |
| Get Events | Fetch event history for a specific user profile |
| Get Properties | List all custom properties for a user profile |

### 2. Event

| Operation | Description |
|-----------|-------------|
| Record | Record custom events with properties and user attribution |
| Get History | Retrieve event history with filtering and date ranges |
| Get Details | Get detailed information about a specific event |
| Batch Record | Upload multiple events in a single API call |
| Get Schema | Retrieve event schema and property definitions |

### 3. Campaign

| Operation | Description |
|-----------|-------------|
| Create | Create new email, push, SMS, or in-app campaigns |
| Get | Retrieve campaign details and configuration |
| Update | Modify campaign settings and targeting parameters |
| Launch | Start campaign execution and message delivery |
| Pause | Temporarily pause active campaign |
| Stop | Permanently stop campaign execution |
| Get Results | Fetch campaign performance metrics and analytics |
| Get List | List all campaigns with filtering options |

### 4. Segment

| Operation | Description |
|-----------|-------------|
| Create | Create dynamic user segments with behavioral criteria |
| Get | Retrieve segment configuration and user count |
| Update | Modify segment definition and targeting rules |
| Delete | Remove segment from account |
| Get Users | List users within a specific segment |
| Get List | Retrieve all segments with metadata |
| Estimate Size | Calculate estimated segment size before creation |

### 5. Analytics

| Operation | Description |
|-----------|-------------|
| Get Counts | Retrieve user counts and growth metrics |
| Get Events Report | Generate custom event analytics reports |
| Get Funnel | Analyze conversion funnels and drop-off points |
| Get Retention | Calculate user retention cohort analysis |
| Get Trends | Track metric trends over time periods |
| Get Real Time | Access real-time engagement metrics |

### 6. Message

| Operation | Description |
|-----------|-------------|
| Send Push | Send targeted push notifications to user segments |
| Send Email | Deliver personalized email campaigns |
| Send SMS | Send SMS messages with tracking and delivery status |
| Send In-App | Trigger in-app messages and notifications |
| Get Status | Check delivery status of sent messages |
| Get Templates | List available message templates |

## Usage Examples

```javascript
// Create user profile with custom properties
{
  "resource": "userProfile",
  "operation": "create",
  "identity": "user@example.com",
  "profileData": {
    "Name": "John Doe",
    "Email": "user@example.com",
    "Phone": "+1234567890",
    "Customer Type": "Premium",
    "Last Purchase": "2024-01-15"
  }
}

// Record purchase event with revenue tracking
{
  "resource": "event",
  "operation": "record",
  "identity": "user@example.com",
  "eventName": "Product Purchased",
  "eventData": {
    "Product Name": "Premium Subscription",
    "Amount": 99.99,
    "Currency": "USD",
    "Category": "Subscription"
  }
}

// Create targeted email campaign
{
  "resource": "campaign",
  "operation": "create",
  "campaignType": "email",
  "name": "Welcome Series - Day 1",
  "subject": "Welcome to our platform!",
  "content": "<html>Welcome {{Name}}! Get started today.</html>",
  "segment": "new_users",
  "schedule": "2024-02-01T10:00:00Z"
}

// Send personalized push notification
{
  "resource": "message",
  "operation": "sendPush",
  "to": "user_segment_id",
  "title": "Special offer just for you!",
  "body": "Hi {{Name}}, enjoy 20% off your next purchase",
  "deepLink": "app://offers/special20"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API credentials or expired token | Verify Account ID, Passcode, and API Key in credentials |
| 403 Forbidden | Insufficient permissions for operation | Check account permissions and API key scope |
| 404 Not Found | Resource (user, campaign, segment) not found | Verify resource ID exists and is accessible |
| 422 Validation Error | Invalid data format or missing required fields | Review API documentation for required fields |
| 429 Rate Limited | Too many API requests in time window | Implement exponential backoff or reduce request frequency |
| 500 Server Error | CleverTap service temporarily unavailable | Retry request after delay or check CleverTap status |

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
- **CleverTap API Documentation**: [CleverTap REST API](https://developer.clevertap.com/docs/server-api-reference)
- **CleverTap Community**: [CleverTap Support](https://support.clevertap.com/)