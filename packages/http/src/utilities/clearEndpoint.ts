export default (endpoint: string) => endpoint.replace(/([^:]\/)\/+/g, '$1');
