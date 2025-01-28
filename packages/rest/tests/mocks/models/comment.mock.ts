import { attr, hasOne, makeModel, toString } from '@foscia/core';
import type GalleryMock from './gallery.mock';
import type Post from './post.mock';

export default class CommentMock extends makeModel('comments', {
  body: attr(toString()),
  commentable: hasOne<Post | GalleryMock>(['posts', 'galleries']),
}) {
}
