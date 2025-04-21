import { attr, makeModel, morphOne, toString } from '@foscia/core';

export default class CommentMock extends makeModel('comments', {
  body: attr(toString()),
  commentable: morphOne(['posts', 'galleries']),
}) {
}
