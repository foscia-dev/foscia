export default function createFetchResponse(options: Partial<Response> = {}) {
  return {
    noContent: () => () => Promise.resolve({
      status: 204,
      ...options,
    }),
    json: (body: any, status = 200) => () => Promise.resolve({
      status,
      ...options,
      json: () => Promise.resolve(body),
    }),
  };
}
