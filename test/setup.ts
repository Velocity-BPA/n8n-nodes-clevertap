/**
 * @fileoverview Jest test setup for n8n-nodes-clevertap
 *
 * [Velocity BPA Licensing Notice]
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 * For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
 */

// Suppress console.warn for licensing notices during tests
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const message = args[0];
  if (typeof message === 'string' && message.includes('Velocity BPA Licensing Notice')) {
    return;
  }
  originalWarn.apply(console, args);
};

// Set test environment variables
process.env.NODE_ENV = 'test';

// Global test timeout
jest.setTimeout(10000);

// Clean up after all tests
afterAll(() => {
  console.warn = originalWarn;
});
