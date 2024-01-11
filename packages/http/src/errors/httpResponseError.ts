import HttpAdapterError from '@foscia/http/errors/httpAdapterError';

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
