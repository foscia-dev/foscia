import HttpInvalidRequestError from '@foscia/http/errors/httpInvalidRequestError';

/**
 * Error thrown on HTTP response status `403 Forbidden`.
 *
 * @group Errors
 */
export default class HttpForbiddenError extends HttpInvalidRequestError {
}
