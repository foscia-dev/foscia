import { attr, hasMany, makeModel, toDateTime } from '@foscia/core';
import commentable from '../composables/commentable';
import type GalleryMock from './gallery.mock';

export default class PostMock extends makeModel('posts', {
  commentable,
  title: attr<string>(),
  body: attr<string | null>(),
  publishedAt: attr(toDateTime()).nullable().readOnly(),
  relatedContents: hasMany<(PostMock | GalleryMock)[]>(['posts', 'galleries']),
}) {
}
