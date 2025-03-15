import {
  makeActionFactory,
  makeCache,
  makePreloadedLazyLoader,
  makeRegistry,
  makeSmartLoader,
} from '@foscia/core';
import { param } from '@foscia/http';
import {
  makeRestAdapter,
  makeRestDeserializer,
  makeRestEagerLoader,
  makeRestSerializer,
} from '@foscia/rest';
import CommentMock from './models/comment.mock';
import GalleryMock from './models/gallery.mock';
import PostMock from './models/post.mock';

export default function makeRestActionMock() {
  return makeActionFactory({
    ...makeRegistry([PostMock, CommentMock, GalleryMock]),
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
