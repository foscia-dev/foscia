import { makeJsonRest } from '@foscia/rest';
import CommentMock from './models/comment.mock';
import PostMock from './models/post.mock';

export default function makeJsonRestActionMock() {
  const { action } = makeJsonRest({
    models: [PostMock, CommentMock],
    http: {
      baseURL: 'https://example.com/api',
    },
  });

  return action;
}
