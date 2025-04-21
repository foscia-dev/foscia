import { makeRegistry, TypeCheckCustomTypes } from '@foscia/core';
import CommentMock from './models/comment.mock';
import GalleryMock from './models/gallery.mock';
import PostMock from './models/post.mock';

const registry = makeRegistry([
  CommentMock,
  GalleryMock,
  PostMock,
] as const);

declare global {
  namespace Foscia {
    interface CustomTypes {
      check: TypeCheckCustomTypes<typeof registry, this>;
      models: {
        comments: CommentMock;
        galleries: GalleryMock;
        posts: PostMock;
      };
    }
  }
}

export default registry;
