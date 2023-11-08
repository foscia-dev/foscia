import { attr, hasMany, makeComposable } from '@foscia/core';
import CommentMock from '../models/comment.mock';

export default makeComposable({
  commentsCount: attr(0).sync('pull'),
  comments: hasMany(() => CommentMock),
});
