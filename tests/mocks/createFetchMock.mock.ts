import { vi } from 'vitest';

export default function createFetchMock() {
  const fetch = vi.fn();

  globalThis.fetch = fetch;

  return fetch;
}
