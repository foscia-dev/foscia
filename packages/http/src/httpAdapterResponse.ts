import { AdapterResponseI } from '@foscia/core';
import { HttpResponseReader } from '@foscia/http/types';

export default class HttpAdapterResponse implements AdapterResponseI<Response> {
  public constructor(
    private readonly reader: HttpResponseReader,
    public readonly response: Response,
  ) {
  }

  public get raw() {
    return this.response;
  }

  public async read() {
    return this.response.status === 204
      ? undefined
      : this.reader(this.response);
  }
}
