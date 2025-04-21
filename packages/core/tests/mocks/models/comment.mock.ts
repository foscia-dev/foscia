import {
  attr,
  belongsTo,
  id,
  makeModel,
  morphOne,
  toDateTime,
  toNumber,
  toString,
} from '@foscia/core';
import imageable from '../composables/imageable.mock';

export default class CommentMock extends makeModel('comments', {
  imageable,
  id: id(toNumber(), { nullable: true }),
  lid: id(toString()),
  body: attr(toString()),
  postedAt: attr(toDateTime()),
  postedBy: belongsTo('users'),
  commentable: morphOne(['posts', 'galleries']),
}) {
}
