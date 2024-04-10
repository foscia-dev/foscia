import { attr, hasMany, hasOne, makeModel, toDateTime } from '@foscia/core';
import type CommentMock from './comment.mock';

export default class PostMock extends makeModel('posts', {
  title: attr<string>(),
  body: attr<string | null>(),
  comments: hasMany<CommentMock[]>(),
  bestComment: hasOne<CommentMock>().nullable(),
  publishedAt: attr(toDateTime()).nullable().readOnly(),
}) {
}
