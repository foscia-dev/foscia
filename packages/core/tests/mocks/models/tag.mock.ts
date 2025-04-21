import { makeModel, morphMany } from '@foscia/core';
import PostMock from './post.mock';
import UserMock from './user.mock';

export default class TagMock extends makeModel('tags', {
  taggables: morphMany(() => [PostMock, UserMock]),
}) {
}
