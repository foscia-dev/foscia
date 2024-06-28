import { AdapterResponseI } from '@foscia/core';
import { HttpResponseReader } from '@foscia/http/types';

export default <Data>(
  response: Response,
  config: { reader: HttpResponseReader<Data> },
): AdapterResponseI<Response, Data | undefined> => ({
  read: async () => (response.status === 204 ? undefined : config.reader(response)),
  get raw() {
    return response;
  },
});
