import { hasMany, makeComposable } from '@foscia/core';
import CommentMock from '../models/comment.mock';

export default makeComposable({
  comments: hasMany(() => CommentMock),
});
