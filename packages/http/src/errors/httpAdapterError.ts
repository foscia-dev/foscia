import { FosciaError } from '@foscia/core';

/**
 * Base error class thrown by the adapter.
 *
 * @group Errors
 */
export default class HttpAdapterError extends FosciaError {
  public request: Request;

  public constructor(message: string, request: Request) {
    super(message);

    this.request = request;
  }
}
