/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { CleverTap } from '../nodes/CleverTap/CleverTap.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('CleverTap Node', () => {
  let node: CleverTap;

  beforeAll(() => {
    node = new CleverTap();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('CleverTap');
      expect(node.description.name).toBe('clevertap');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('UserProfile Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accountId: 'test-account-id',
        passcode: 'test-passcode',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('uploadProfiles operation', () => {
    it('should upload profiles successfully', async () => {
      const mockProfiles = [
        {
          identity: 'user123',
          profileData: {
            Name: 'John Doe',
            Email: 'john@example.com',
          },
        },
      ];

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'uploadProfiles';
          case 'profiles':
            return mockProfiles;
          case 'type':
            return 'profile';
          default:
            return null;
        }
      });

      const mockResponse = { status: 'success', processed: 1 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUserProfileOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/upload',
        headers: {
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode',
          'Content-Type': 'application/json',
        },
        json: { d: mockProfiles },
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle upload profiles error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'uploadProfiles';
          case 'profiles':
            return [];
          case 'type':
            return 'profile';
          default:
            return null;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeUserProfileOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getProfiles operation', () => {
    it('should get profiles successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getProfiles';
          case 'identity':
            return 'user123';
          case 'objectId':
            return '';
          case 'email':
            return '';
          case 'from':
            return '';
          case 'to':
            return '';
          default:
            return null;
        }
      });

      const mockResponse = { record: { Name: 'John Doe', Email: 'john@example.com' } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUserProfileOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/profiles.json',
        headers: {
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode',
          'Content-Type': 'application/json',
        },
        json: { identity: 'user123' },
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getProfilePush operation', () => {
    it('should get profile push details successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getProfilePush';
          case 'identity':
            return 'user123';
          case 'objectId':
            return '';
          default:
            return null;
        }
      });

      const mockResponse = { push_token: 'token123', platform: 'android' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUserProfileOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/profiles/push',
        headers: {
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode',
          'Content-Type': 'application/json',
        },
        json: { identity: 'user123' },
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getProfileCounts operation', () => {
    it('should get profile counts successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getProfileCounts';
          case 'userType':
            return 'active';
          case 'from':
            return '2023-01-01';
          case 'to':
            return '2023-12-31';
          default:
            return null;
        }
      });

      const mockResponse = { count: 1500, active_users: 1200 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUserProfileOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/counts.json',
        headers: {
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode',
          'Content-Type': 'application/json',
        },
        json: { user_type: 'active', from: '2023-01-01', to: '2023-12-31' },
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Event Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accountId: 'test-account-id',
        passcode: 'test-passcode',
        baseUrl: 'https://api.clevertap.com/1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should upload events successfully', async () => {
    const mockResponse = { status: 'success', processed: 1 };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'uploadEvents';
        case 'events': return '[{"evtName": "test_event", "evtData": {"key": "value"}}]';
        case 'type': return 'event';
        default: return '';
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.clevertap.com/1/upload',
      headers: {
        'X-CleverTap-Account-Id': 'test-account-id',
        'X-CleverTap-Passcode': 'test-passcode',
        'Content-Type': 'application/json',
      },
      body: {
        d: [{"evtName": "test_event", "evtData": {"key": "value"}}],
        type: 'event',
      },
      json: true,
    });
  });

  it('should get events successfully', async () => {
    const mockResponse = { records: [{ event: 'test_event' }] };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getEvents';
        case 'identity': return 'user123';
        case 'objectId': return 'obj123';
        case 'from': return '2023-01-01';
        case 'to': return '2023-01-31';
        case 'eventsList': return 'event1, event2';
        default: return '';
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.clevertap.com/1/events.json',
      headers: {
        'X-CleverTap-Account-Id': 'test-account-id',
        'X-CleverTap-Passcode': 'test-passcode',
        'Content-Type': 'application/json',
      },
      body: {
        identity: 'user123',
        objectId: 'obj123',
        from: '2023-01-01',
        to: '2023-01-31',
        events: ['event1', 'event2'],
      },
      json: true,
    });
  });

  it('should get event counts successfully', async () => {
    const mockResponse = { counts: { total: 100 } };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getEventCounts';
        case 'eventName': return 'test_event';
        case 'from': return '2023-01-01';
        case 'to': return '2023-01-31';
        case 'groups': return '["country", "city"]';
        default: return '';
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.clevertap.com/1/counts.json',
      headers: {
        'X-CleverTap-Account-Id': 'test-account-id',
        'X-CleverTap-Passcode': 'test-passcode',
        'Content-Type': 'application/json',
      },
      body: {
        event_name: 'test_event',
        from: '2023-01-01',
        to: '2023-01-31',
        groups: ['country', 'city'],
      },
      json: true,
    });
  });

  it('should get event trends successfully', async () => {
    const mockResponse = { trends: { daily: [10, 20, 30] } };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getEventTrends';
        case 'eventName': return 'test_event';
        case 'from': return '2023-01-01';
        case 'to': return '2023-01-31';
        case 'groups': return '[]';
        default: return '';
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.clevertap.com/1/trends.json',
      headers: {
        'X-CleverTap-Account-Id': 'test-account-id',
        'X-CleverTap-Passcode': 'test-passcode',
        'Content-Type': 'application/json',
      },
      body: {
        event_name: 'test_event',
        from: '2023-01-01',
        to: '2023-01-31',
      },
      json: true,
    });
  });

  it('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'uploadEvents';
        case 'events': return '[]';
        case 'type': return 'event';
        default: return '';
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeEventOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
  });

  it('should continue on fail when enabled', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'uploadEvents';
        case 'events': return '[]';
        case 'type': return 'event';
        default: return '';
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('Campaign Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accountId: 'test-account-id',
        passcode: 'test-passcode',
        baseUrl: 'https://api.clevertap.com/1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('sendPushCampaign', () => {
    it('should send push campaign successfully', async () => {
      const mockResponse = { status: 'success', message: 'Campaign sent' };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'sendPushCampaign';
          case 'to':
            return { segment_id: '123' };
          case 'notification':
            return { title: 'Test', body: 'Message' };
          case 'platformSpecific':
            return {};
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/send/push.json',
        headers: {
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode',
          'Content-Type': 'application/json',
        },
        body: {
          to: { segment_id: '123' },
          notification: { title: 'Test', body: 'Message' },
        },
        json: true,
      });
    });

    it('should handle push campaign errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'sendPushCampaign';
          case 'to':
            return { segment_id: '123' };
          case 'notification':
            return { title: 'Test', body: 'Message' };
          case 'platformSpecific':
            return {};
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
    });
  });

  describe('sendEmailCampaign', () => {
    it('should send email campaign successfully', async () => {
      const mockResponse = { status: 'success', message: 'Email sent' };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'sendEmailCampaign';
          case 'to':
            return { segment_id: '123' };
          case 'subject':
            return 'Test Subject';
          case 'body':
            return 'Test Body';
          case 'from':
            return 'test@example.com';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('createCampaignTarget', () => {
    it('should create campaign target successfully', async () => {
      const mockResponse = { status: 'success', target_id: '456' };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'createCampaignTarget';
          case 'targetName':
            return 'Test Target';
          case 'query':
            return { event_name: 'App Launched' };
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getCampaigns', () => {
    it('should get campaigns successfully', async () => {
      const mockResponse = { campaigns: [{ id: '123', name: 'Test Campaign' }] };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getCampaigns';
          case 'from':
            return '2023-01-01';
          case 'to':
            return '2023-12-31';
          case 'campaignType':
            return 'push';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getCampaignResults', () => {
    it('should get campaign results successfully', async () => {
      const mockResponse = { results: { sent: 100, delivered: 95, opened: 50 } };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getCampaignResults';
          case 'campaignId':
            return '123';
          case 'from':
            return '2023-01-01';
          case 'to':
            return '2023-12-31';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('Segment Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accountId: 'test-account-id',
        passcode: 'test-passcode',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createSegment operation', () => {
    it('should create a segment successfully', async () => {
      const mockResponse = {
        status: 'success',
        segment_id: 'seg123',
        estimated_size: 1000,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createSegment';
          case 'segment_name': return 'Test Segment';
          case 'query': return { event_name: 'App Launched' };
          case 'estimate_only': return false;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSegmentOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle createSegment error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createSegment';
          case 'segment_name': return 'Test Segment';
          case 'query': return { event_name: 'App Launched' };
          case 'estimate_only': return false;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('API Error')
      );

      await expect(executeSegmentOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      )).rejects.toThrow('API Error');
    });
  });

  describe('getSegments operation', () => {
    it('should get segments successfully', async () => {
      const mockResponse = {
        status: 'success',
        segments: [
          { id: 'seg1', name: 'Segment 1' },
          { id: 'seg2', name: 'Segment 2' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getSegments';
          case 'cursor': return '';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSegmentOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getSegmentUsers operation', () => {
    it('should get segment users successfully', async () => {
      const mockResponse = {
        status: 'success',
        users: [
          { id: 'user1', email: 'user1@example.com' },
          { id: 'user2', email: 'user2@example.com' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getSegmentUsers';
          case 'segment_id': return 'seg123';
          case 'cursor': return '';
          case 'format': return 'json';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSegmentOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle getSegmentUsers error with continueOnFail', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getSegmentUsers';
          case 'segment_id': return 'seg123';
          case 'cursor': return '';
          case 'format': return 'json';
          default: return undefined;
        }
      });

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('Segment not found')
      );

      const result = await executeSegmentOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Segment not found');
    });
  });
});

describe('Analytics Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accountId: 'test-account-id',
        passcode: 'test-passcode',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getCounts', () => {
    it('should successfully get count metrics', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getCounts';
          case 'userType': return 'all';
          case 'eventName': return 'app_launched';
          case 'fromDate': return '2023-01-01';
          case 'toDate': return '2023-01-31';
          default: return undefined;
        }
      });

      const mockResponse = {
        count: 1250,
        from: '2023-01-01',
        to: '2023-01-31',
        user_type: 'all',
        event_name: 'app_launched'
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/counts.json',
        headers: {
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode',
          'Content-Type': 'application/json',
        },
        body: {
          user_type: 'all',
          event_name: 'app_launched',
          from: '2023-01-01',
          to: '2023-01-31',
        },
        json: true,
      });
    });
  });

  describe('getTrends', () => {
    it('should successfully get trending data', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTrends';
          case 'eventName': return 'purchase';
          case 'fromDate': return '2023-01-01';
          case 'toDate': return '2023-01-31';
          case 'groups': return 'platform,country';
          default: return undefined;
        }
      });

      const mockResponse = {
        trends: [
          { date: '2023-01-01', count: 150 },
          { date: '2023-01-02', count: 180 },
        ]
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getCohorts', () => {
    it('should successfully get cohort analysis', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getCohorts';
          case 'eventName': return 'first_purchase';
          case 'fromDate': return '2023-01-01';
          case 'toDate': return '2023-01-31';
          case 'period': return 'weekly';
          default: return undefined;
        }
      });

      const mockResponse = {
        cohorts: [
          { week: 1, retention: 0.75 },
          { week: 2, retention: 0.60 },
        ]
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getFunnelAnalytics', () => {
    it('should successfully get funnel analysis', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getFunnelAnalytics';
          case 'funnelId': return 'funnel_123';
          case 'fromDate': return '2023-01-01';
          case 'toDate': return '2023-01-31';
          default: return undefined;
        }
      });

      const mockResponse = {
        funnel_id: 'funnel_123',
        steps: [
          { step: 1, users: 1000 },
          { step: 2, users: 750 },
          { step: 3, users: 500 },
        ]
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle API errors when continueOnFail is true', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getCounts';
          default: return undefined;
        }
      });

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const items = [{ json: {} }];
      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });
});

describe('Message Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accountId: 'test-account-id',
        passcode: 'test-passcode',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('sendPushMessage', () => {
    it('should send push message successfully', async () => {
      const mockResponse = { status: 'success', message_id: '123' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'sendPushMessage';
          case 'to': return 'user123@example.com';
          case 'notification': return '{"title":"Test","body":"Test message"}';
          case 'platform_specific': return '{"android":{"priority":"high"}}';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/send/push.json',
        headers: {
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode',
          'Content-Type': 'application/json',
        },
        body: {
          to: 'user123@example.com',
          notification: { title: 'Test', body: 'Test message' },
          platform_specific: { android: { priority: 'high' } },
        },
        json: true,
      });
    });

    it('should handle invalid notification JSON', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'sendPushMessage';
          case 'to': return 'user123@example.com';
          case 'notification': return 'invalid json';
          case 'platform_specific': return '{}';
          default: return '';
        }
      });

      await expect(executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects
        .toThrow('Invalid notification JSON');
    });
  });

  describe('sendEmailMessage', () => {
    it('should send email message successfully', async () => {
      const mockResponse = { status: 'success', message_id: 'email123' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'sendEmailMessage';
          case 'to': return 'user@example.com';
          case 'subject': return 'Test Subject';
          case 'body': return 'Test email body';
          case 'from': return 'sender@example.com';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/send/email.json',
        headers: {
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode',
          'Content-Type': 'application/json',
        },
        body: {
          to: 'user@example.com',
          subject: 'Test Subject',
          body: 'Test email body',
          from: 'sender@example.com',
        },
        json: true,
      });
    });
  });

  describe('sendSmsMessage', () => {
    it('should send SMS message successfully', async () => {
      const mockResponse = { status: 'success', message_id: 'sms123' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'sendSmsMessage';
          case 'to': return '+1234567890';
          case 'body': return 'Test SMS message';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/send/sms.json',
        headers: {
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode',
          'Content-Type': 'application/json',
        },
        body: {
          to: '+1234567890',
          body: 'Test SMS message',
        },
        json: true,
      });
    });
  });

  describe('createMessageTarget', () => {
    it('should create message target successfully', async () => {
      const mockResponse = { status: 'success', target_id: 'target123' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'createMessageTarget';
          case 'target_name': return 'Test Target';
          case 'query': return '{"age":{"$gt":18}}';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/targets/create.json',
        headers: {
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode',
          'Content-Type': 'application/json',
        },
        body: {
          target_name: 'Test Target',
          query: { age: { $gt: 18 } },
        },
        json: true,
      });
    });
  });

  describe('getMessages', () => {
    it('should get messages successfully', async () => {
      const mockResponse = { messages: [{ id: '1', type: 'push' }] };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'getMessages';
          case 'from': return '2023-01-01';
          case 'to': return '2023-01-31';
          case 'message_type': return 'push';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/messages/list.json',
        headers: {
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode',
          'Content-Type': 'application/json',
        },
        body: {
          from: '2023-01-01',
          to: '2023-01-31',
          message_type: 'push',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors when continueOnFail is true', async () => {
      const mockError = new Error('API Error');
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'sendPushMessage';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });

    it('should throw error when continueOnFail is false', async () => {
      const mockError = new Error('API Error');
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'sendPushMessage';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
      mockExecuteFunctions.continueOnFail.mockReturnValue(false);

      await expect(executeMessageOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects
        .toThrow('API Error');
    });
  });
});
});
