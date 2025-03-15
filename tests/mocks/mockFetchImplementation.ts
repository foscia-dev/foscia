import { expect, Mock } from 'vitest';
import throwUnexpectedFetchMockCall from './throwUnexpectedFetchMockCall';

export type FetchMockResponses = [string | Partial<Request>, any][];

export default (fetchMock: Mock, rawResponses: FetchMockResponses) => {
  const responses = rawResponses.map(([request, response]) => [
    typeof request === 'string' ? { url: request } : request,
    async (req: Request) => {
      if (response === undefined) {
        return { status: 204 };
      }

      if (typeof response === 'function') {
        return response(req);
      }

      return { status: 200, json: () => Promise.resolve(response) };
    },
  ] as const);

  const findResponse = (request: Request) => responses.find(
    ([req]) => (Object.keys(req) as (keyof Request)[]).every((key) => req[key] === request[key]),
  );

  fetchMock.mockImplementation((request) => {
    const response = findResponse(request);

    if (response) {
      return response[1](request);
    }

    throwUnexpectedFetchMockCall(request);
  });

  return () => {
    expect(fetchMock).toHaveBeenCalledTimes(responses.length);
    fetchMock.mock.calls.forEach(([request]) => {
      expect(findResponse(request)).toBeTruthy();
    });
  };
}
