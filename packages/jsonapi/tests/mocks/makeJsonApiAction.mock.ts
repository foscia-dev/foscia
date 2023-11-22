import { makeActionFactory, makeCache, makeRegistry } from '@foscia/core';
import {
  makeJsonApiAdapter,
  makeJsonApiDeserializer,
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
      requestTransformers: [(request) => {
        request.headers.set('X-Foo-Header', 'bar');

        return request;
      }],
    }),
  });
}
