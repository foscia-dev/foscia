import { attr, makeModel } from '@foscia/core';
import commentable from '../composables/commentable.mock';

export default class GalleryMock extends makeModel('galleries', {
  commentable,
  title: attr<string>(),
}) {
}
