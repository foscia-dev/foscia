import { makeActionFactory, makeCache, makeRegistry } from '@foscia/core';
import {
  makeJsonRestAdapter,
  makeJsonRestDeserializer,
  makeJsonRestSerializer,
} from '@foscia/rest';
import CommentMock from './models/comment.mock';
import PostMock from './models/post.mock';

export default function makeJsonRestActionMock() {
  return makeActionFactory({
    ...makeRegistry([PostMock, CommentMock]),
    ...makeCache(),
    ...makeJsonRestDeserializer(),
    ...makeJsonRestSerializer(),
    ...makeJsonRestAdapter({
      baseURL: 'https://example.com/api',
    }),
  });
}
