import { attr, hasOne, id, makeModel, toDateTime, toNumber, toString } from '@foscia/core';
import UserMock from './user.mock';

export default class CommentMock extends makeModel('comments', {
  id: id(toNumber()).nullable(),
  lid: id(toString()),
  body: attr(toString()),
  postedAt: attr(toDateTime()),
  postedBy: hasOne(() => UserMock),
}) {
}
