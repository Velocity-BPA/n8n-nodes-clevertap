# n8n-nodes-clevertap

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for CleverTap, the all-in-one customer engagement and retention platform. This node enables workflow automation for user profiles, events, campaigns, segments, multi-channel messaging, product catalogs, and analytics.

![n8n Community Node](https://img.shields.io/badge/n8n-community%20node-orange)
![CleverTap](https://img.shields.io/badge/CleverTap-Integration-red)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)

## Features

- **User Profile Management**: Upload, retrieve, update, and delete user profiles with subscription management
- **Event Tracking**: Track custom events with properties and timestamps, query event data
- **Campaign Management**: Create and manage multi-channel campaigns (push, email, SMS, WhatsApp)
- **Push Notifications**: Send targeted push notifications to segments or individual users
- **Segmentation**: Create static and live segments, estimate sizes, export users
- **Email Marketing**: Send emails, manage templates, deliver to segments
- **SMS Messaging**: Send SMS messages with DLT template support for India
- **WhatsApp Business**: Send text, media, and template messages via WhatsApp
- **Product Catalog**: Manage product catalogs for personalized recommendations
- **Analytics & Reports**: Access real-time metrics, trends, funnels, cohorts, and retention data
- **Multi-Region Support**: India, Singapore, US, EU, Indonesia, Middle East

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Select **Install**
4. Enter `n8n-nodes-clevertap` and confirm

### Manual Installation

```bash
npm install n8n-nodes-clevertap
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-clevertap.git
cd n8n-nodes-clevertap

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-clevertap

# Restart n8n
n8n start
```

## Credentials Setup

Create CleverTap API credentials in n8n with the following parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Account ID | String | Yes | CleverTap Account/Project ID |
| Passcode | Password | Yes | CleverTap API Passcode |
| Region | Options | Yes | Data center region |

### Getting Your Credentials

1. Log into your [CleverTap Dashboard](https://dashboard.clevertap.com)
2. Navigate to **Settings** > **Project**
3. Copy your **Account ID** (Project ID)
4. Navigate to **Settings** > **Passcode**
5. Generate or copy your existing **Passcode**
6. Note your **Region** (visible in your dashboard URL)

### Supported Regions

| Region | API Endpoint |
|--------|--------------|
| India | api.clevertap.com |
| Singapore | sg1.api.clevertap.com |
| US | us1.api.clevertap.com |
| EU | eu1.api.clevertap.com |
| Indonesia | aps3.api.clevertap.com |
| Middle East | mec1.api.clevertap.com |

## Resources & Operations

### User Profiles (10 Operations)

| Operation | Description |
|-----------|-------------|
| Upload | Upload user profile data with custom attributes |
| Get | Retrieve user profile by identity |
| Get by Email | Retrieve user profile by email address |
| Get by Phone | Retrieve user profile by phone number |
| Delete | Delete user profile |
| Demerge | Separate merged user profiles |
| Get Count | Count profiles matching a query |
| Disassociate | Remove device tokens from profile |
| Subscribe | Update channel subscription preferences |
| Get Subscription Status | Check subscription status for channels |

### Events (7 Operations)

| Operation | Description |
|-----------|-------------|
| Upload | Track custom events with properties |
| Get | Retrieve events for a specific user |
| Get Many | Query events with filters and date range |
| Get Count | Count events with optional grouping |
| Get Property Values | Extract unique values for event properties |
| Get Top Events | List most frequent events |
| Get Timeline | User event history with pagination |

### Campaigns (8 Operations)

| Operation | Description |
|-----------|-------------|
| Create | Create new campaign |
| Create Targeted | Create campaign with targeting rules |
| Create Control Group | Create A/B test with control group |
| Get | Retrieve campaign details |
| Get Many | List all campaigns |
| Get Stats | Get campaign performance statistics |
| Get Report | Generate detailed campaign report |
| Stop | Stop a running campaign |

### Push Notifications (7 Operations)

| Operation | Description |
|-----------|-------------|
| Send | Send push notification |
| Send to Segment | Push to an entire segment |
| Send to Identity | Push to specific user(s) |
| Create Web Push | Create web push notification |
| Create Mobile Push | Create Android/iOS push |
| Schedule | Schedule push for future delivery |
| Cancel | Cancel scheduled push |

### Segments (7 Operations)

| Operation | Description |
|-----------|-------------|
| Create | Create static or live segment |
| Get | Retrieve segment by ID |
| Get Many | List all segments |
| Get Users | Get users in a segment |
| Estimate | Estimate segment size |
| Delete | Delete a segment |
| Download Users | Export segment users to file |

### Email (7 Operations)

| Operation | Description |
|-----------|-------------|
| Send | Send email to users |
| Send to Segment | Email entire segment |
| Send Template | Send using saved template |
| Get Templates | List email templates |
| Create Template | Create new template |
| Update Template | Modify existing template |
| Delete Template | Remove template |

### SMS (5 Operations)

| Operation | Description |
|-----------|-------------|
| Send | Send SMS message |
| Send to Segment | SMS to entire segment |
| Get Providers | List configured SMS providers |
| Create Template | Create SMS template |
| Get Templates | List SMS templates |

### WhatsApp (6 Operations)

| Operation | Description |
|-----------|-------------|
| Send | Send WhatsApp message |
| Send Template | Send HSM template message |
| Send Media | Send image/document/video |
| Get Templates | List WhatsApp templates |
| Create Template | Create new template |
| Get Conversations | Retrieve conversation threads |

### Product Catalog (8 Operations)

| Operation | Description |
|-----------|-------------|
| Upload | Batch upload catalog items |
| Get | Retrieve single catalog item |
| Get Many | List catalog items with filters |
| Update | Update catalog item |
| Delete | Remove catalog item |
| Create Catalog | Create new product catalog |
| Get Catalogs | List all catalogs |
| Delete Catalog | Remove entire catalog |

### Reports (8 Operations)

| Operation | Description |
|-----------|-------------|
| Get Real-Time | Live metrics and KPIs |
| Get Trends | Event trends with daily breakdown |
| Get Message Report | Multi-channel messaging stats |
| Get Revenue Report | Revenue analytics |
| Get Uninstall Report | App uninstall tracking |
| Get Funnel Report | Conversion funnel analysis |
| Get Cohort Report | Cohort analysis by time period |
| Get Retention Report | User retention metrics |

## Usage Examples

### Upload User Profile

```json
{
  "identity": "user-12345",
  "profileData": {
    "Name": "John Doe",
    "Email": "john@example.com",
    "Phone": "+12025551234",
    "Gender": "M",
    "DOB": "15-05-1990",
    "plan": "premium",
    "signupDate": "2024-01-15"
  }
}
```

### Track Event

```json
{
  "identity": "user-12345",
  "eventName": "Product Viewed",
  "eventData": {
    "product_id": "SKU-789",
    "product_name": "Wireless Headphones",
    "price": 99.99,
    "category": "Electronics"
  }
}
```

### Create Push Campaign

```json
{
  "name": "Flash Sale Alert",
  "campaignType": "mobile_push",
  "title": "🔥 Flash Sale - 50% Off!",
  "body": "Limited time offer on your favorite items",
  "deepLink": "myapp://sales/flash",
  "segment": "active_shoppers"
}
```

### Send WhatsApp Template

```json
{
  "to": ["+12025551234"],
  "templateName": "order_confirmation",
  "templateParams": {
    "order_id": "ORD-12345",
    "amount": "$149.99",
    "delivery_date": "March 20, 2024"
  }
}
```

## CleverTap Concepts

### User Identity

CleverTap uses a unique identity string (max 1024 characters) to identify users across devices. Common identity strategies include email addresses, user IDs, or custom identifiers.

### Event Tracking

Events represent user actions with optional properties. Events power segmentation, campaigns, and analytics. Timestamps can be current or historical for data imports.

### Profile vs System Properties

- **System Properties**: Reserved fields like Name, Email, Phone, Gender, DOB
- **Custom Properties**: User-defined attributes for personalization

### Subscription Channels

Users can subscribe/unsubscribe from channels independently (email, push, SMS, WhatsApp), enabling compliance with preferences and regulations.

### Segments

- **Static Segments**: Fixed user lists, updated manually
- **Live Segments**: Dynamic segments with real-time membership updates

## Rate Limits

| Endpoint Type | Rate Limit |
|---------------|------------|
| Upload (profiles/events) | 500 requests/second |
| Campaigns | 3 requests/second |
| Query endpoints | 10 requests/second |
| Export endpoints | 1 request/second |

### Batch Limits

- Profile upload: 1000 records per request
- Event upload: 1000 records per request
- Campaign targets: 100 identities per request

## Error Handling

The node handles common CleverTap API errors:

| Code | Description | Resolution |
|------|-------------|------------|
| 400 | Bad Request | Check request format and parameters |
| 401 | Unauthorized | Verify Account ID and Passcode |
| 403 | Forbidden | Check rate limits or feature access |
| 404 | Not Found | Verify resource exists |
| 429 | Rate Limited | Reduce request frequency |
| 500 | Server Error | Retry with exponential backoff |

## Security Best Practices

1. **Never expose credentials** in workflows or logs
2. **Use environment variables** for sensitive data
3. **Validate user input** before sending to API
4. **Implement rate limiting** in high-volume workflows
5. **Use HTTPS** for all webhook endpoints
6. **Regularly rotate** API passcodes
7. **Monitor API usage** for anomalies

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in watch mode
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Format code
npm run format
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

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes linting and tests before submitting.

## Support

- **Documentation**: [CleverTap Developer Docs](https://developer.clevertap.com)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-clevertap/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)

## Acknowledgments

- [CleverTap](https://clevertap.com) for their comprehensive customer engagement platform
- [n8n](https://n8n.io) for the workflow automation framework
- The open-source community for continuous inspiration
