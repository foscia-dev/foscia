import { NotFoundErrorI } from '@foscia/core';
import InvalidRequestError from '@foscia/http/errors/invalidRequestError';

export default class NotFoundError extends InvalidRequestError implements NotFoundErrorI {
  public readonly $FOSCIA_ERROR_NOT_FOUND = true;
}
