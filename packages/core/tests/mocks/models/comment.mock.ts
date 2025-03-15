import { attr, hasOne, id, makeModel, toDateTime, toNumber, toString } from '@foscia/core';
import imageable from '../composables/imageable.mock';
import UserMock from './user.mock';

export default class CommentMock extends makeModel('comments', {
  imageable,
  id: id(toNumber(), { nullable: true }),
  lid: id(toString()),
  body: attr(toString()),
  postedAt: attr(toDateTime()),
  postedBy: hasOne(() => UserMock),
}) {
}
