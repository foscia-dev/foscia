import { attr, hasMany, hasOne, makeModel, toDateTime } from '@foscia/core';
import CommentMock from './comment.mock';

export default class PostMock extends makeModel('posts', {
  title: attr<string>(),
  body: attr<string | null>(),
  comments: hasMany(() => CommentMock),
  bestComment: hasOne(() => CommentMock, { nullable: true }),
  publishedAt: attr(toDateTime(), { nullable: true, readOnly: true }),
}) {
}
