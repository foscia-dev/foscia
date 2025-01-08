import { NotFoundErrorI } from '@foscia/core';
import HttpInvalidRequestError from '@foscia/http/errors/httpInvalidRequestError';

/**
 * Error thrown on HTTP response status `404 Not Found`.
 *
 * @group Errors
 */
export default class HttpNotFoundError extends HttpInvalidRequestError implements NotFoundErrorI {
  public readonly $FOSCIA_ERROR_NOT_FOUND = true;
}
