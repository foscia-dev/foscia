import HttpInvalidRequestError from '@foscia/http/errors/httpInvalidRequestError';

/**
 * Error thrown on HTTP response status `429 Too Many Requests`.
 *
 * @group Errors
 */
export default class HttpTooManyRequestsError extends HttpInvalidRequestError {
}
