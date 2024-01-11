import { NotFoundErrorI } from '@foscia/core';
import HttpInvalidRequestError from '@foscia/http/errors/httpInvalidRequestError';

export default class HttpNotFoundError extends HttpInvalidRequestError implements NotFoundErrorI {
  public readonly $FOSCIA_ERROR_NOT_FOUND = true;
}
