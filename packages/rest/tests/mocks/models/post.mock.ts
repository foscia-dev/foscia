import { attr, hasMany, makeModel, toDateTime } from '@foscia/core';
import CommentMock from './comment.mock';

export default class PostMock extends makeModel('posts', {
  title: attr<string>(),
  body: attr<string | null>(),
  comments: hasMany(() => CommentMock),
  publishedAt: attr(toDateTime()).nullable().readOnly(),
}) {
}
