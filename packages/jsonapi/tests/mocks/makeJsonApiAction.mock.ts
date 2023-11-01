import { makeJsonApi } from '@foscia/jsonapi';
import CommentMock from './models/comment.mock';
import PostMock from './models/post.mock';

export default function makeJsonApiActionMock() {
  const { action } = makeJsonApi({
    models: [PostMock, CommentMock],
    http: {
      baseURL: 'https://example.com/api/v1',
    },
  });

  return action;
}
