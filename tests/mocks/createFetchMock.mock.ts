import { vi } from 'vitest';

// TODO Improve this.
export default function createFetchMock() {
  const fetch = vi.fn<(...args: any[]) => any>((req) => {
    throw new Error(`[tests] Unexpected fetch call: ${req.url}`);
  });

  globalThis.fetch = fetch;

  return fetch;
}
