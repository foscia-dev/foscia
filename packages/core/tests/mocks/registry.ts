import { makeRegistry, TypeCheckCustomTypes } from '@foscia/core';
import FileMock from './models/file.mock';
import GalleryMock from './models/gallery.mock';
import PostMock from './models/post.mock';
import TreeNodeMock from './models/treeNode.mock';
import UserMock from './models/user.mock';

const registry = makeRegistry([
  FileMock,
  GalleryMock,
  PostMock,
  UserMock,
  TreeNodeMock,
] as const);

declare global {
  namespace Foscia {
    interface CustomTypes {
      check: TypeCheckCustomTypes<typeof registry, this>;
      models: {
        files: FileMock;
        galleries: GalleryMock;
        posts: PostMock;
        users: UserMock;
        'tree-nodes': TreeNodeMock;
      };
    }
  }
}

export default registry;
