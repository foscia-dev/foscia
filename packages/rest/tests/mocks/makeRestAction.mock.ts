import { makeActionFactory, makeCache, makeRegistry } from '@foscia/core';
import { makeRestAdapter, makeRestDeserializer, makeRestSerializer } from '@foscia/rest';
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
  });
}
