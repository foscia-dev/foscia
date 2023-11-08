import { attr, hasOne, id, makeModel, toDate, toNumber, toString } from '@foscia/core';
import UserMock from './user.mock';

export default class CommentMock extends makeModel('comments', {
  id: id(toNumber()).nullable(),
  lid: id(toString()),
  body: attr(toString()),
  postedAt: attr(toDate()),
  postedBy: hasOne(() => UserMock),
}) {
}
