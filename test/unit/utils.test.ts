/**
 * @fileoverview Unit tests for CleverTap utility functions
 *
 * [Velocity BPA Licensing Notice]
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 * For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
 */

import {
  convertProfileData,
  formatDateOfBirth,
  parseCommaSeparated,
  validateIdentity,
  delay,
  calculateBackoffDelay,
  parseCleverTapError,
  cleanEmptyValues,
  mergeCustomKeyValues,
} from '../../nodes/CleverTap/utils';

describe('CleverTap Utils', () => {
  describe('convertProfileData', () => {
    it('should convert n8n profile data to CleverTap format', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+12025551234',
      };
      const result = convertProfileData(input);
      expect(result).toHaveProperty('Name', 'John Doe');
      expect(result).toHaveProperty('Email', 'john@example.com');
      expect(result).toHaveProperty('Phone', '+12025551234');
    });

    it('should handle empty input', () => {
      const result = convertProfileData({});
      expect(result).toEqual({});
    });

    it('should preserve custom properties', () => {
      const input = {
        name: 'John',
        customProperties: {
          customField: 'custom value',
        },
      };
      const result = convertProfileData(input);
      expect(result).toHaveProperty('Name', 'John');
      expect(result).toHaveProperty('customField', 'custom value');
    });
  });

  describe('formatDateOfBirth', () => {
    it('should format date string to DD-MM-YYYY', () => {
      const result = formatDateOfBirth('1990-05-15');
      expect(result).toBe('15-05-1990');
    });

    it('should handle ISO date format', () => {
      const result = formatDateOfBirth('1990-12-25T00:00:00.000Z');
      expect(result).toBe('25-12-1990');
    });

    it('should return empty string for invalid date', () => {
      const result = formatDateOfBirth('invalid-date');
      expect(result).toBe('');
    });

    it('should return empty string for empty input', () => {
      const result = formatDateOfBirth('');
      expect(result).toBe('');
    });
  });

  describe('parseCommaSeparated', () => {
    it('should parse comma-separated string into array', () => {
      const result = parseCommaSeparated('one, two, three');
      expect(result).toEqual(['one', 'two', 'three']);
    });

    it('should handle single value', () => {
      const result = parseCommaSeparated('single');
      expect(result).toEqual(['single']);
    });

    it('should trim whitespace', () => {
      const result = parseCommaSeparated('  one  ,  two  ,  three  ');
      expect(result).toEqual(['one', 'two', 'three']);
    });

    it('should return empty array for empty string', () => {
      const result = parseCommaSeparated('');
      expect(result).toEqual([]);
    });

    it('should filter out empty values', () => {
      const result = parseCommaSeparated('one,,two,,,three');
      expect(result).toEqual(['one', 'two', 'three']);
    });
  });

  describe('validateIdentity', () => {
    it('should return true for valid identity', () => {
      const result = validateIdentity('user123');
      expect(result).toBe(true);
    });

    it('should return true for identity at max length', () => {
      const identity = 'a'.repeat(1024);
      const result = validateIdentity(identity);
      expect(result).toBe(true);
    });

    it('should return false for identity exceeding max length', () => {
      const identity = 'a'.repeat(1025);
      const result = validateIdentity(identity);
      expect(result).toBe(false);
    });

    it('should return false for empty identity', () => {
      const result = validateIdentity('');
      expect(result).toBe(false);
    });
  });

  describe('delay', () => {
    it('should delay for specified milliseconds', async () => {
      const start = Date.now();
      await delay(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(95);
      expect(elapsed).toBeLessThan(200);
    });
  });

  describe('calculateBackoffDelay', () => {
    it('should calculate exponential backoff', () => {
      expect(calculateBackoffDelay(0)).toBe(500);
      expect(calculateBackoffDelay(1)).toBe(1000);
      expect(calculateBackoffDelay(2)).toBe(2000);
      expect(calculateBackoffDelay(3)).toBe(4000);
    });

    it('should cap at maximum delay', () => {
      const result = calculateBackoffDelay(10);
      expect(result).toBeLessThanOrEqual(30000);
    });

    it('should use custom base delay', () => {
      expect(calculateBackoffDelay(0, 1000)).toBe(1000);
      expect(calculateBackoffDelay(1, 1000)).toBe(2000);
    });
  });

  describe('parseCleverTapError', () => {
    it('should extract error message from response', () => {
      const response = { error: 'Invalid credentials' };
      const result = parseCleverTapError(response);
      expect(result).toBe('Invalid credentials');
    });

    it('should handle nested error object', () => {
      const response = { error: { message: 'Rate limit exceeded' } };
      const result = parseCleverTapError(response);
      expect(result).toBe('Rate limit exceeded');
    });

    it('should return default message for unknown error', () => {
      const response = {};
      const result = parseCleverTapError(response);
      expect(result).toBe('Unknown CleverTap API error');
    });

    it('should handle string response', () => {
      const result = parseCleverTapError('Error occurred');
      expect(result).toBe('Error occurred');
    });
  });

  describe('cleanEmptyValues', () => {
    it('should remove null values', () => {
      const input = { a: 1, b: null, c: 3 };
      const result = cleanEmptyValues(input);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should remove undefined values', () => {
      const input = { a: 1, b: undefined, c: 3 };
      const result = cleanEmptyValues(input);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should remove empty strings', () => {
      const input = { a: 'hello', b: '', c: 'world' };
      const result = cleanEmptyValues(input);
      expect(result).toEqual({ a: 'hello', c: 'world' });
    });

    it('should keep zero and false values', () => {
      const input = { a: 0, b: false, c: 'test' };
      const result = cleanEmptyValues(input);
      expect(result).toEqual({ a: 0, b: false, c: 'test' });
    });

    it('should handle empty object', () => {
      const result = cleanEmptyValues({});
      expect(result).toEqual({});
    });
  });

  describe('mergeCustomKeyValues', () => {
    it('should merge key-value pairs into object', () => {
      const base = { existing: 'value' };
      const keyValues = [
        { key: 'custom1', value: 'value1' },
        { key: 'custom2', value: 'value2' },
      ];
      const result = mergeCustomKeyValues(base, keyValues);
      expect(result).toEqual({
        existing: 'value',
        custom1: 'value1',
        custom2: 'value2',
      });
    });

    it('should handle empty key-values array', () => {
      const base = { existing: 'value' };
      const result = mergeCustomKeyValues(base, []);
      expect(result).toEqual({ existing: 'value' });
    });

    it('should override existing keys', () => {
      const base = { key1: 'original' };
      const keyValues = [{ key: 'key1', value: 'updated' }];
      const result = mergeCustomKeyValues(base, keyValues);
      expect(result).toEqual({ key1: 'updated' });
    });

    it('should handle empty base object', () => {
      const keyValues = [{ key: 'new', value: 'value' }];
      const result = mergeCustomKeyValues({}, keyValues);
      expect(result).toEqual({ new: 'value' });
    });
  });
});
