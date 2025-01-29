import { FLAG_ERROR_NOT_FOUND } from '@foscia/core';
import HttpInvalidRequestError from '@foscia/http/errors/httpInvalidRequestError';
import { FosciaFlaggedObject } from '@foscia/shared';

/**
 * Error thrown on HTTP response status `404 Not Found`.
 *
 * @group Errors
 */
export default class HttpNotFoundError
  extends HttpInvalidRequestError
  implements FosciaFlaggedObject {
  public readonly $FOSCIA_FLAGS = FLAG_ERROR_NOT_FOUND;
}
