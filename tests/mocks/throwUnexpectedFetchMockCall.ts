export default (request: Request) => {
  throw new Error(`[tests] Unexpected fetch call: ${request.url}`);
};
