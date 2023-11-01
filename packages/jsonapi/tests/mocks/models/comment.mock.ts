import { attr, makeModel, toString } from '@foscia/core';

export default class CommentMock extends makeModel('comments', {
  body: attr(toString()),
}) {
}
