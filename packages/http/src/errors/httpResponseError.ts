import HttpAdapterError from '@foscia/http/errors/httpAdapterError';

/**
 * Error thrown on any HTTP response status `4xx` or `5xx`.
 *
 * @group Errors
 */
export default abstract class HttpResponseError extends HttpAdapterError {
  public response: Response;

  public constructor(
    request: Request,
    response: Response,
  ) {
    super(response.statusText, request);

    this.response = response;
  }
}
