import { makeActionFactory } from '@foscia/core';
import { makeHttpAdapter } from '@foscia/http';

export default function makeHttpActionMock() {
  return makeActionFactory({
    ...makeHttpAdapter({
      baseURL: 'https://example.com',
    }),
  });
}
