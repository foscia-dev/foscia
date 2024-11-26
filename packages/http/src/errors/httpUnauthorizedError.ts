import HttpInvalidRequestError from '@foscia/http/errors/httpInvalidRequestError';

/**
 * Error thrown on HTTP response status `401 Unauthorized`.
 *
 * @group Errors
 */
export default class HttpUnauthorizedError extends HttpInvalidRequestError {
}
