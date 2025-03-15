import {
  makeActionFactory,
  makeCache,
  makeLoader,
  makeRegistry,
  makeSimpleLazyLoader,
} from '@foscia/core';
import {
  makeJsonApiAdapter,
  makeJsonApiDeserializer,
  makeJsonApiEagerLoader,
  makeJsonApiSerializer,
} from '@foscia/jsonapi';
import CommentMock from './models/comment.mock';
import PostMock from './models/post.mock';

export default function makeJsonApiActionMock() {
  return makeActionFactory({
    ...makeRegistry([PostMock, CommentMock]),
    ...makeCache(),
    ...makeJsonApiDeserializer(),
    ...makeJsonApiSerializer(),
    ...makeJsonApiAdapter({
      baseURL: 'https://example.com/api/v1',
      middlewares: [(request, next) => {
        request.headers.set('X-Foo-Header', 'bar');

        return next(request);
      }],
    }),
    ...makeLoader({
      eagerLoader: makeJsonApiEagerLoader(),
      lazyLoader: makeSimpleLazyLoader(),
    }),
  });
}
