/**
 * @fileoverview Unit tests for CleverTap constants
 *
 * [Velocity BPA Licensing Notice]
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 * For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
 */

import {
  CLEVERTAP_REGIONS,
  BATCH_SIZE,
  RATE_LIMITS,
  CAMPAIGN_TYPES,
  SEGMENT_TYPES,
  WHATSAPP_MESSAGE_TYPES,
  COHORT_TYPES,
  GENDER_OPTIONS,
  SUBSCRIPTION_CHANNELS,
} from '../../nodes/CleverTap/constants/constants';

describe('CleverTap Constants', () => {
  describe('CLEVERTAP_REGIONS', () => {
    it('should have all required regions', () => {
      expect(CLEVERTAP_REGIONS).toHaveProperty('India');
      expect(CLEVERTAP_REGIONS).toHaveProperty('Singapore');
      expect(CLEVERTAP_REGIONS).toHaveProperty('US');
      expect(CLEVERTAP_REGIONS).toHaveProperty('EU');
      expect(CLEVERTAP_REGIONS).toHaveProperty('Indonesia');
      expect(CLEVERTAP_REGIONS).toHaveProperty('Middle East');
    });

    it('should have valid URLs for all regions', () => {
      Object.values(CLEVERTAP_REGIONS).forEach((url) => {
        expect(url).toMatch(/^https:\/\/.*api\.clevertap\.com\/1$/);
      });
    });

    it('should have India as default region', () => {
      expect(CLEVERTAP_REGIONS.India).toBe('https://api.clevertap.com/1');
    });
  });

  describe('BATCH_SIZE', () => {
    it('should be 1000', () => {
      expect(BATCH_SIZE).toBe(1000);
    });
  });

  describe('RATE_LIMITS', () => {
    it('should have upload rate limit', () => {
      expect(RATE_LIMITS).toHaveProperty('upload');
      expect(RATE_LIMITS.upload).toBe(500);
    });

    it('should have campaign rate limit', () => {
      expect(RATE_LIMITS).toHaveProperty('campaign');
      expect(RATE_LIMITS.campaign).toBe(3);
    });

    it('should have query rate limit', () => {
      expect(RATE_LIMITS).toHaveProperty('query');
      expect(RATE_LIMITS.query).toBe(10);
    });

    it('should have export rate limit', () => {
      expect(RATE_LIMITS).toHaveProperty('export');
      expect(RATE_LIMITS.export).toBe(1);
    });
  });

  describe('CAMPAIGN_TYPES', () => {
    it('should include all campaign types', () => {
      const values = CAMPAIGN_TYPES.map(t => t.value);
      expect(values).toContain('mobile_push');
      expect(values).toContain('web_push');
      expect(values).toContain('email');
      expect(values).toContain('sms');
      expect(values).toContain('whatsapp');
    });

    it('should have 5 campaign types', () => {
      expect(CAMPAIGN_TYPES).toHaveLength(5);
    });

    it('should have name and value properties', () => {
      CAMPAIGN_TYPES.forEach(type => {
        expect(type).toHaveProperty('name');
        expect(type).toHaveProperty('value');
      });
    });
  });

  describe('SEGMENT_TYPES', () => {
    it('should include static and live types', () => {
      const values = SEGMENT_TYPES.map(t => t.value);
      expect(values).toContain('static');
      expect(values).toContain('live');
    });

    it('should have 2 segment types', () => {
      expect(SEGMENT_TYPES).toHaveLength(2);
    });
  });

  describe('WHATSAPP_MESSAGE_TYPES', () => {
    it('should include all message types', () => {
      const values = WHATSAPP_MESSAGE_TYPES.map(t => t.value);
      expect(values).toContain('text');
      expect(values).toContain('image');
      expect(values).toContain('document');
      expect(values).toContain('template');
    });
  });

  describe('COHORT_TYPES', () => {
    it('should include all cohort types', () => {
      const values = COHORT_TYPES.map(t => t.value);
      expect(values).toContain('days');
      expect(values).toContain('weeks');
      expect(values).toContain('months');
    });

    it('should have 3 cohort types', () => {
      expect(COHORT_TYPES).toHaveLength(3);
    });
  });

  describe('GENDER_OPTIONS', () => {
    it('should include M and F options', () => {
      const values = GENDER_OPTIONS.map(g => g.value);
      expect(values).toContain('M');
      expect(values).toContain('F');
    });
  });

  describe('SUBSCRIPTION_CHANNELS', () => {
    it('should include all subscription channels', () => {
      const values = SUBSCRIPTION_CHANNELS.map(c => c.value);
      expect(values).toContain('MSG-email');
      expect(values).toContain('MSG-push');
      expect(values).toContain('MSG-sms');
      expect(values).toContain('MSG-whatsapp');
    });

    it('should have 4 subscription channels', () => {
      expect(SUBSCRIPTION_CHANNELS).toHaveLength(4);
    });
  });
});
