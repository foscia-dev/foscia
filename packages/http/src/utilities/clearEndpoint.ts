export default function clearEndpoint(endpoint: string) {
  return endpoint.replace(/([^:]\/)\/+/g, '$1');
}
