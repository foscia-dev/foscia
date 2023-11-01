import HttpAdapterError from '@foscia/http/errors/httpAdapterError';

export default class InterruptedError extends HttpAdapterError {
  public source: unknown;

  public constructor(message: string, request: Request, source: unknown) {
    super(message, request);

    this.source = source;
  }
}
