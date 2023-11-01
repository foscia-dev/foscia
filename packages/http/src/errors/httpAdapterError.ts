import { FosciaError } from '@foscia/core';

export default class HttpAdapterError extends FosciaError {
  public request: Request;

  public constructor(message: string, request: Request) {
    super(message);

    this.request = request;
  }
}
