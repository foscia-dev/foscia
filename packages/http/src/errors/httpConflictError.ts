import HttpInvalidRequestError from '@foscia/http/errors/httpInvalidRequestError';

/**
 * Error thrown on HTTP response status `409 Conflict`.
 *
 * @group Errors
 */
export default class HttpConflictError extends HttpInvalidRequestError {
}
