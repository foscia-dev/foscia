import { AdapterResponse } from '@foscia/core';
import { HttpResponseReader } from '@foscia/http/types';

/**
 * Make an HTTP adapter response from the given response and reader.
 *
 * @param response
 * @param config
 *
 * @internal
 */
export default <Data>(
  response: Response,
  config: { reader: HttpResponseReader<Data> },
): AdapterResponse<Response, Data | undefined> => ({
  read: async () => (response.status === 204 ? undefined : config.reader(response)),
  get raw() {
    return response;
  },
});
