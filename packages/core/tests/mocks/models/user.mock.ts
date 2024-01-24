import { attr, hasMany, makeModel } from '@foscia/core';
import type CommentMock from './comment.mock';

export default class UserMock extends makeModel('users', {
  name: attr<string>(),
  email: attr<string>(),
  comments: hasMany<CommentMock[]>(),
}) {
}
