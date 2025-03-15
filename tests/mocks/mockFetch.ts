import { vi } from 'vitest';
import mockFetchImplementation, { FetchMockResponses } from './mockFetchImplementation';
import throwUnexpectedFetchMockCall from './throwUnexpectedFetchMockCall';

export default (rawResponses?: FetchMockResponses) => {
  const prevFetch = globalThis.fetch;

  const fetchMock = vi.fn<(...args: any[]) => any>((req) => {
    throwUnexpectedFetchMockCall(req);
  });

  globalThis.fetch = fetchMock;

  const unMockFetch = () => {
    globalThis.fetch = prevFetch;
  };

  if (rawResponses) {
    const confirmImplementationUsage = mockFetchImplementation(fetchMock, rawResponses);

    return {
      fetchMock,
      unMockFetch: () => {
        confirmImplementationUsage();
        unMockFetch();
      },
    };
  }

  return { fetchMock, unMockFetch };
};
