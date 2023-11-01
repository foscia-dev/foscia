import { attr, hasMany, makeModel, toDate } from '@foscia/core';
import type CommentMock from './comment.mock';

export default class PostMock extends makeModel('posts', {
  title: attr<string>(),
  body: attr<string | null>(),
  commentsCount: attr(0).sync('pull'),
  comments: hasMany<CommentMock>(),
  publishedAt: attr(toDate()).nullable().readOnly(),
  get published() {
    return !!this.publishedAt;
  },
}) {
}
