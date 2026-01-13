/**
 * @fileoverview Unit tests for CleverTap transport functions
 *
 * [Velocity BPA Licensing Notice]
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 * For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
 */

import {
  getRegionUrl,
  formatDateForCleverTap,
  getUnixTimestamp,
  validatePhoneNumber,
  validateEmail,
  buildSegmentQuery,
} from '../../nodes/CleverTap/transport';

describe('CleverTap Transport', () => {
  describe('getRegionUrl', () => {
    it('should return India URL for India region', () => {
      const result = getRegionUrl('India');
      expect(result).toBe('https://api.clevertap.com/1');
    });

    it('should return Singapore URL for Singapore region', () => {
      const result = getRegionUrl('Singapore');
      expect(result).toBe('https://sg1.api.clevertap.com/1');
    });

    it('should return US URL for US region', () => {
      const result = getRegionUrl('US');
      expect(result).toBe('https://us1.api.clevertap.com/1');
    });

    it('should return EU URL for EU region', () => {
      const result = getRegionUrl('EU');
      expect(result).toBe('https://eu1.api.clevertap.com/1');
    });

    it('should return Indonesia URL for Indonesia region', () => {
      const result = getRegionUrl('Indonesia');
      expect(result).toBe('https://aps3.api.clevertap.com/1');
    });

    it('should return Middle East URL for Middle East region', () => {
      const result = getRegionUrl('Middle East');
      expect(result).toBe('https://mec1.api.clevertap.com/1');
    });

    it('should return US URL for unknown region', () => {
      const result = getRegionUrl('Unknown');
      expect(result).toBe('https://us1.api.clevertap.com/1');
    });
  });

  describe('formatDateForCleverTap', () => {
    it('should format date to YYYYMMDD', () => {
      const date = new Date('2024-03-15');
      const result = formatDateForCleverTap(date);
      expect(result).toBe(20240315);
    });

    it('should handle single digit months and days', () => {
      const date = new Date('2024-01-05');
      const result = formatDateForCleverTap(date);
      expect(result).toBe(20240105);
    });

    it('should format ISO string date', () => {
      const result = formatDateForCleverTap('2024-12-25');
      expect(result).toBe(20241225);
    });
  });

  describe('getUnixTimestamp', () => {
    it('should return Unix timestamp in seconds', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      const result = getUnixTimestamp(date);
      expect(result).toBe(1704067200);
    });

    it('should handle current date', () => {
      const now = new Date();
      const result = getUnixTimestamp(now);
      expect(result).toBeCloseTo(Math.floor(now.getTime() / 1000), -1);
    });

    it('should handle string date', () => {
      const result = getUnixTimestamp('2024-06-15T12:00:00Z');
      expect(result).toBe(1718452800);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate phone number with country code', () => {
      const result = validatePhoneNumber('+12025551234');
      expect(result).toBe(true);
    });

    it('should validate phone number with spaces', () => {
      const result = validatePhoneNumber('+1 202 555 1234');
      expect(result).toBe(true);
    });

    it('should validate phone number with dashes', () => {
      const result = validatePhoneNumber('+1-202-555-1234');
      expect(result).toBe(true);
    });

    it('should reject phone without country code', () => {
      const result = validatePhoneNumber('2025551234');
      expect(result).toBe(false);
    });

    it('should reject empty phone number', () => {
      const result = validatePhoneNumber('');
      expect(result).toBe(false);
    });

    it('should reject invalid phone number', () => {
      const result = validatePhoneNumber('not-a-phone');
      expect(result).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate valid email', () => {
      const result = validateEmail('user@example.com');
      expect(result).toBe(true);
    });

    it('should validate email with subdomain', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result).toBe(true);
    });

    it('should validate email with plus sign', () => {
      const result = validateEmail('user+tag@example.com');
      expect(result).toBe(true);
    });

    it('should reject email without @', () => {
      const result = validateEmail('userexample.com');
      expect(result).toBe(false);
    });

    it('should reject email without domain', () => {
      const result = validateEmail('user@');
      expect(result).toBe(false);
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result).toBe(false);
    });
  });

  describe('buildSegmentQuery', () => {
    it('should build simple property query', () => {
      const result = buildSegmentQuery({
        property: 'Country',
        operator: 'equals',
        value: 'US',
      });
      expect(result).toEqual({
        common_profile_prop: {
          Country: { eq: 'US' },
        },
      });
    });

    it('should handle contains operator', () => {
      const result = buildSegmentQuery({
        property: 'Name',
        operator: 'contains',
        value: 'John',
      });
      expect(result).toEqual({
        common_profile_prop: {
          Name: { contains: 'John' },
        },
      });
    });

    it('should handle event-based query', () => {
      const result = buildSegmentQuery({
        eventName: 'Purchase',
        eventOperator: 'count',
        eventValue: 5,
      });
      expect(result).toHaveProperty('event_queries');
    });
  });
});
