import { AdapterResponseI } from '@foscia/core';
import { HttpResponseReader } from '@foscia/http/types';

export default function makeHttpAdapterResponse<Data>(
  response: Response,
  config: { reader: HttpResponseReader<Data> },
): AdapterResponseI<Response, Data | undefined> {
  const read = async () => (response.status === 204 ? undefined : config.reader(response));

  return {
    read,
    get raw() {
      return response;
    },
  };
}
