import { ActionAdapterResponse } from '@foscia/core';
import { HttpResponseReader } from '@foscia/http/types';

/**
 * Make an HTTP adapter response from the given response and reader.
 *
 * @param response
 * @param config
 *
 * @internal
 */
export default function makeHttpAdapterResponse<Data>(
  response: Response,
  config: { reader: HttpResponseReader<Data> },
): ActionAdapterResponse<Response, Data | undefined> {
  let read = false;
  let data: Promise<Data>;

  return {
    raw: response,
    read: async () => {
      if (!read && response.status !== 204) {
        data = config.reader(response);
        read = true;
      }

      return data;
    },
  };
}
