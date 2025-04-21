import {
  makeActionFactory,
  makeCache,
  makePreloadedLazyLoader,
  makeSmartLoader,
} from '@foscia/core';
import { param } from '@foscia/http';
import {
  makeRestAdapter,
  makeRestDeserializer,
  makeRestEagerLoader,
  makeRestSerializer,
} from '@foscia/rest';
import registry from './registry';

export default function makeRestActionMock() {
  return makeActionFactory({
    registry,
    ...makeCache(),
    ...makeRestDeserializer(),
    ...makeRestSerializer(),
    ...makeRestAdapter({
      baseURL: 'https://example.com/api',
    }),
    ...makeSmartLoader({
      eagerLoader: makeRestEagerLoader({ param: 'include' }),
      lazyLoader: makePreloadedLazyLoader({
        prepare: (action, references) => action(param('ids', references.map((r) => r.id))),
      }),
    }),
  });
}
