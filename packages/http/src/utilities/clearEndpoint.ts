/**
 * Clear given endpoint (remove double slashes, etc.).
 *
 * @param endpoint
 *
 * @category Utilities
 */
export default (endpoint: string) => endpoint
  // Remove multiple slashes at start.
  .replace(/^(\/)\/+/g, '$1')
  // Remove multiple slashes inside.
  .replace(/([^:]\/)\/+/g, '$1');
