import HttpResponseError from '@foscia/http/errors/httpResponseError';

/**
 * Error thrown on any HTTP response status `5xx`.
 *
 * @group Errors
 */
export default class HttpServerError extends HttpResponseError {
}
