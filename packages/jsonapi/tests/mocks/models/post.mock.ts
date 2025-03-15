import { attr, hasMany, hasOne, makeModel, toDateTime } from '@foscia/core';
import type CommentMock from './comment.mock';

export default class PostMock extends makeModel('posts', {
  title: attr<string>(),
  body: attr<string | null>(),
  comments: hasMany<CommentMock[]>('comments'),
  bestComment: hasOne<CommentMock>('comments').nullable(),
  publishedAt: attr(toDateTime(), { nullable: true, readOnly: true }),
}) {
}
