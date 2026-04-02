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

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
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
describe('Profile Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accountId: 'test-account-id',
        passcode: 'test-passcode',
        baseUrl: 'https://api.clevertap.com/1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('uploadProfiles operation', () => {
    it('should upload profiles successfully', async () => {
      const mockProfiles = [
        { email: 'test@example.com', name: 'Test User' }
      ];
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('uploadProfiles')
        .mockReturnValueOnce(mockProfiles);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: 'success' });

      const result = await executeProfileOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/upload',
        headers: {
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode',
          'Content-Type': 'application/json',
        },
        body: { d: mockProfiles },
        json: true,
      });

      expect(result).toEqual([{ json: { status: 'success' }, pairedItem: { item: 0 } }]);
    });

    it('should handle upload profiles error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('uploadProfiles');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeProfileOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getProfile operation', () => {
    it('should get profile successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProfile')
        .mockReturnValueOnce('email')
        .mockReturnValueOnce('test@example.com');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ profile: { email: 'test@example.com' } });

      const result = await executeProfileOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/profile.json',
        headers: {
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode',
          'Content-Type': 'application/json',
        },
        body: { email: 'test@example.com' },
        json: true,
      });

      expect(result).toEqual([{ json: { profile: { email: 'test@example.com' } }, pairedItem: { item: 0 } }]);
    });

    it('should handle get profile error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getProfile');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Profile not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeProfileOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Profile not found' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getProfileCounts operation', () => {
    it('should get profile counts successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProfileCounts')
        .mockReturnValueOnce({ event_name: 'purchase' })
        .mockReturnValueOnce('2023-01-01')
        .mockReturnValueOnce('2023-01-31');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ count: 100 });

      const result = await executeProfileOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/counts.json',
        headers: {
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode',
          'Content-Type': 'application/json',
        },
        body: {
          event_name: 'purchase',
          from: '2023-01-01',
          to: '2023-01-31',
        },
        json: true,
      });

      expect(result).toEqual([{ json: { count: 100 }, pairedItem: { item: 0 } }]);
    });

    it('should handle get profile counts error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getProfileCounts');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid query'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeProfileOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Invalid query' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Event Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accountId: 'test-account',
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
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('uploadEvents')
      .mockReturnValueOnce([
        {
          identity: 'user123',
          evtName: 'Product Viewed',
          evtData: [{ name: 'product_id', value: 'prod123' }],
        },
      ]);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: 'success' });

    const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.clevertap.com/1/upload',
      headers: {
        'X-CleverTap-Account-Id': 'test-account',
        'X-CleverTap-Passcode': 'test-passcode',
        'Content-Type': 'application/json',
      },
      json: true,
      body: {
        d: [
          {
            identity: 'user123',
            evtName: 'Product Viewed',
            evtData: { product_id: 'prod123' },
          },
        ],
      },
    });

    expect(result).toEqual([{ json: { status: 'success' }, pairedItem: { item: 0 } }]);
  });

  it('should handle upload events error', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('uploadEvents')
      .mockReturnValueOnce([]);

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should get events successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getEvents')
      .mockReturnValueOnce('2023-01-01T00:00:00.000Z')
      .mockReturnValueOnce('2023-01-31T00:00:00.000Z')
      .mockReturnValueOnce({ identity: 'user123' });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ records: [] });

    const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.clevertap.com/1/events.json',
      headers: {
        'X-CleverTap-Account-Id': 'test-account',
        'X-CleverTap-Passcode': 'test-passcode',
        'Content-Type': 'application/json',
      },
      json: true,
      body: {
        from: '20230101',
        to: '20230131',
        identity: 'user123',
      },
    });

    expect(result).toEqual([{ json: { records: [] }, pairedItem: { item: 0 } }]);
  });

  it('should handle get events error', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getEvents')
      .mockReturnValueOnce('2023-01-01T00:00:00.000Z')
      .mockReturnValueOnce('2023-01-31T00:00:00.000Z')
      .mockReturnValueOnce({});

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

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
			},
		};
	});

	describe('sendPushCampaign', () => {
		it('should send push campaign successfully', async () => {
			const mockResponse = { status: 'success', id: '12345' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendPushCampaign')
				.mockReturnValueOnce({ segment: 'all' })
				.mockReturnValueOnce({ title: 'Test Push', body: 'Test message' });
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.clevertap.com/1/send/push.json',
				headers: {
					'X-CleverTap-Account-Id': 'test-account-id',
					'X-CleverTap-Passcode': 'test-passcode',
					'Content-Type': 'application/json',
				},
				body: {
					to: { segment: 'all' },
					content: { title: 'Test Push', body: 'Test message' },
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle errors when sending push campaign', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendPushCampaign')
				.mockReturnValueOnce({ segment: 'all' })
				.mockReturnValueOnce({ title: 'Test Push', body: 'Test message' });
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('sendEmailCampaign', () => {
		it('should send email campaign successfully', async () => {
			const mockResponse = { status: 'success', id: '67890' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendEmailCampaign')
				.mockReturnValueOnce({ email: 'test@example.com' })
				.mockReturnValueOnce('Email body content')
				.mockReturnValueOnce('Test Email Subject');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.clevertap.com/1/send/email.json',
				headers: {
					'X-CleverTap-Account-Id': 'test-account-id',
					'X-CleverTap-Passcode': 'test-passcode',
					'Content-Type': 'application/json',
				},
				body: {
					to: { email: 'test@example.com' },
					content: {
						subject: 'Test Email Subject',
						body: 'Email body content',
					},
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getCampaignStats', () => {
		it('should get campaign statistics successfully', async () => {
			const mockResponse = { stats: { sent: 100, delivered: 95, opened: 50 } };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCampaignStats')
				.mockReturnValueOnce('campaign123')
				.mockReturnValueOnce('2023-01-01T00:00:00.000Z')
				.mockReturnValueOnce('2023-01-31T23:59:59.000Z');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.clevertap.com/1/message/stats.json',
				headers: {
					'X-CleverTap-Account-Id': 'test-account-id',
					'X-CleverTap-Passcode': 'test-passcode',
				},
				qs: {
					campaign_id: 'campaign123',
					from: '2023-01-01',
					to: '2023-01-31',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getCampaignTargets', () => {
		it('should get campaign targets successfully', async () => {
			const mockResponse = { targets: [{ email: 'user1@example.com' }, { email: 'user2@example.com' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCampaignTargets')
				.mockReturnValueOnce({ segment: 'active_users', limit: 100 });
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCampaignOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.clevertap.com/1/targets.json',
				headers: {
					'X-CleverTap-Account-Id': 'test-account-id',
					'X-CleverTap-Passcode': 'test-passcode',
					'Content-Type': 'application/json',
				},
				body: { segment: 'active_users', limit: 100 },
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
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
        baseUrl: 'https://api.clevertap.com/1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getSegments operation', () => {
    it('should retrieve segments successfully', async () => {
      const mockSegments = { status: 'success', records: [{ id: 1, name: 'Test Segment' }] };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getSegments';
        if (param === 'segmentFilters') return { event_name: 'Purchase' };
        return {};
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSegments);

      const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockSegments);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/segments.json',
        headers: expect.objectContaining({
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode'
        }),
        body: { event_name: 'Purchase' },
        json: true
      });
    });

    it('should handle getSegments errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getSegments';
        return {};
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('estimateSegmentSize operation', () => {
    it('should estimate segment size successfully', async () => {
      const mockEstimate = { status: 'success', estimated_size: 1500 };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'estimateSegmentSize';
        if (param === 'queryConditions') return { event_property: [{ name: 'Category', operator: 'equals', value: 'Electronics' }] };
        if (param === 'fromDate') return '20231201';
        if (param === 'toDate') return '20231231';
        return {};
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockEstimate);

      const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockEstimate);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/segment/estimate.json',
        headers: expect.objectContaining({
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode'
        }),
        body: {
          event_property: [{ name: 'Category', operator: 'equals', value: 'Electronics' }],
          from: '20231201',
          to: '20231231'
        },
        json: true
      });
    });
  });

  describe('getCohorts operation', () => {
    it('should get cohorts successfully', async () => {
      const mockCohorts = { status: 'success', cohorts: [{ period: 0, users: 1000 }] };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getCohorts';
        if (param === 'eventCriteria') return { event_name: 'App Install' };
        if (param === 'timeRanges') return { from: '20231201', to: '20231231', periods: 7 };
        if (param === 'returnEvent') return 'Purchase';
        return {};
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockCohorts);

      const result = await executeSegmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockCohorts);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clevertap.com/1/cohorts.json',
        headers: expect.objectContaining({
          'X-CleverTap-Account-Id': 'test-account-id',
          'X-CleverTap-Passcode': 'test-passcode'
        }),
        body: {
          event_name: 'App Install',
          from: '20231201',
          to: '20231231',
          periods: 7,
          return_event: 'Purchase'
        },
        json: true
      });
    });
  });
});

describe('Report Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accountId: 'test-account',
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

  it('should get real-time analytics successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getRealTimeAnalytics')
      .mockReturnValueOnce({ event_name: 'test_event' })
      .mockReturnValueOnce('1h')
      .mockReturnValueOnce({});
    
    const mockResponse = {
      status: 'success',
      data: {
        events: 100,
        users: 50,
      },
    };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeReportOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.clevertap.com/1/now.json',
      headers: {
        'X-CleverTap-Account-Id': 'test-account',
        'X-CleverTap-Passcode': 'test-passcode',
        'Content-Type': 'application/json',
      },
      body: {
        event_filters: { event_name: 'test_event' },
        time_window: '1h',
      },
      json: true,
    });
  });

  it('should get top reports successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTopReports')
      .mockReturnValueOnce('events')
      .mockReturnValueOnce('2023-01-01T00:00:00.000Z')
      .mockReturnValueOnce('2023-01-31T00:00:00.000Z')
      .mockReturnValueOnce({});
    
    const mockResponse = {
      status: 'success',
      data: {
        top_events: [
          { event: 'login', count: 500 },
          { event: 'purchase', count: 200 },
        ],
      },
    };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeReportOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.clevertap.com/1/top.json',
      headers: {
        'X-CleverTap-Account-Id': 'test-account',
        'X-CleverTap-Passcode': 'test-passcode',
        'Content-Type': 'application/json',
      },
      body: {
        report_type: 'events',
        from: '2023-01-01',
        to: '2023-01-31',
      },
      json: true,
    });
  });

  it('should get trend reports successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTrendReports')
      .mockReturnValueOnce('login,purchase')
      .mockReturnValueOnce('2023-01-01T00:00:00.000Z')
      .mockReturnValueOnce('2023-01-31T00:00:00.000Z')
      .mockReturnValueOnce({});
    
    const mockResponse = {
      status: 'success',
      data: {
        trends: [
          { event: 'login', trend: 'increasing' },
          { event: 'purchase', trend: 'stable' },
        ],
      },
    };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeReportOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.clevertap.com/1/trends.json',
      headers: {
        'X-CleverTap-Account-Id': 'test-account',
        'X-CleverTap-Passcode': 'test-passcode',
        'Content-Type': 'application/json',
      },
      body: {
        events: ['login', 'purchase'],
        from: '2023-01-01',
        to: '2023-01-31',
      },
      json: true,
    });
  });

  it('should handle errors when continue on fail is enabled', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getRealTimeAnalytics');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeReportOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });

  it('should throw error when continue on fail is disabled', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getRealTimeAnalytics');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(
      executeReportOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(
      executeReportOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});
});
