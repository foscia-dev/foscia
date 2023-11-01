export default function createFetchResponse(options: Partial<Response> = {}) {
  return {
    noContent: () => () => Promise.resolve({
      status: 204,
      ...options,
    }),
    json: (body: any) => () => Promise.resolve({
      status: 200,
      ...options,
      json: () => Promise.resolve(body),
    }),
  };
}
