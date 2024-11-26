import HttpAdapterError from '@foscia/http/errors/httpAdapterError';

/**
 * Error thrown when HTTP adapter catch a {@link !fetch | `fetch`} error.
 *
 * @group Errors
 */
export default class HttpInterruptedError<Source = unknown> extends HttpAdapterError {
  public readonly source: Source;

  public constructor(message: string, request: Request, source: Source) {
    super(message, request);

    this.source = source;
  }
}
