import { attr, makeModel, toDateTime } from '@foscia/core';
import commentable from '../composables/commentable';

export default class PostMock extends makeModel('posts', {
  ...commentable,
  title: attr<string>(),
  body: attr<string | null>(),
  publishedAt: attr(toDateTime()).nullable().readOnly(),
}) {
  get published() {
    return !!this.publishedAt;
  }
}
