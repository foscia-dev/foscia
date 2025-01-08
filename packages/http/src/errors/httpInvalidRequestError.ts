import HttpResponseError from '@foscia/http/errors/httpResponseError';

/**
 * Error thrown on any HTTP response status `4xx`.
 *
 * @group Errors
 */
export default class HttpInvalidRequestError extends HttpResponseError {
}
