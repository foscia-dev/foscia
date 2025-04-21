import { attr, makeModel, morphMany, toDateTime } from '@foscia/core';
import commentable from '../composables/commentable.mock';

export default class PostMock extends makeModel('posts', {
  commentable,
  title: attr<string>(),
  body: attr<string | null>(),
  publishedAt: attr(toDateTime(), { nullable: true, readOnly: true }),
  relatedContents: morphMany(['posts', 'galleries']),
}) {
}
