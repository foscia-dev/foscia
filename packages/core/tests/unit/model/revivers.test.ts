/* eslint-disable max-classes-per-file */
import {
  attr,
  hasMany,
  hasOne, makeComposable,
  makeModel,
  makeModelFactory,
  makeModelsReducer,
  makeModelsReviver,
  markSynced,
  ModelCanReduceRevive,
  ModelReduceTools,
  ReducedModelInstanceCustomData,
} from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: reducing and reviving', () => {
  it('should reduce and revive with circular dependencies', () => {
    class PostMock extends makeModel('posts', {
      title: attr(),
      author: hasOne('users'),
      comments: hasMany('comments'),
    }) {
    }

    class UserMock extends makeModel('users', {
      name: attr(),
      favoritePosts: hasMany('posts'),
    }) {
    }

    const post = new PostMock();
    const user = new UserMock();

    post.title = 'Foo';
    markSynced(post);
    post.author = user;
    post.$loaded.author = true;

    user.name = 'John';
    user.favoritePosts = [post];
    user.$exists = true;
    user.$loaded.favoritePosts = true;

    const { reduce } = makeModelsReducer();
    const { revive } = makeModelsReviver({ models: [PostMock, UserMock] });
    const postJSON = JSON.stringify(reduce(post));
    const revivedPost = revive(JSON.parse(postJSON)) as PostMock;

    expect(revivedPost).toStrictEqual(post);
    expect(revivedPost.$loaded).toStrictEqual(post.$loaded);
    expect(revivedPost.$exists).toStrictEqual(post.$exists);
    expect(revivedPost.$original).toStrictEqual(post.$original);
    expect(revivedPost.author).toStrictEqual(user);
    expect(revivedPost.author.$exists).toStrictEqual(user.$exists);
  });

  it('should reduce and revive with fully custom functions', () => {
    class PostMock extends makeModel('posts', {
      title: attr(),
      subtitle: attr(),
    }) {
      public $reduce() {
        return {
          title: `Reduced ${this.title}`,
        };
      }

      public $revive(data: any) {
        this.title = `Revived ${data.title}`;
      }
    }

    const post = new PostMock();
    post.title = 'Foo';
    post.subtitle = 'Bar';

    const { reduce } = makeModelsReducer();
    const { revive } = makeModelsReviver({ models: [PostMock] });
    const postJSON = JSON.stringify(reduce(post));
    const revivedPost = revive(JSON.parse(postJSON)) as PostMock;

    expect(revivedPost.title).toStrictEqual('Revived Reduced Foo');
    expect(revivedPost.subtitle).toBeUndefined();
  });

  it('should reduce and revive with partial custom functions', () => {
    type PostMockData = ReducedModelInstanceCustomData & {
      foo: string;
    };

    class PostMock extends makeModel('posts', {
      title: attr(),
      subtitle: attr(),
    }) implements ModelCanReduceRevive<PostMockData> {
      public foo: string = '';

      public $reduce({ data }: ModelReduceTools) {
        return {
          foo: `Reduced ${this.foo}`,
          ...data(this),
        };
      }

      public $revive(data: PostMockData) {
        this.foo = `Revived ${data.foo}`;
      }
    }

    const post = new PostMock();
    post.title = 'Foo';
    post.subtitle = 'Bar';
    post.foo = 'Baz';

    const { reduce } = makeModelsReducer();
    const { revive } = makeModelsReviver({ models: [PostMock] });
    const postJSON = JSON.stringify(reduce(post));
    const revivedPost = revive(JSON.parse(postJSON)) as PostMock;

    expect(revivedPost.title).toStrictEqual('Foo');
    expect(revivedPost.subtitle).toStrictEqual('Bar');
    expect(revivedPost.foo).toStrictEqual('Revived Reduced Baz');
  });

  it('should reduce and revive with model factory functions', () => {
    const customMakeModel = makeModelFactory({}, {
      foo: 'Foo',
      $reduce({ data }: ModelReduceTools) {
        return {
          foo: `Reduced ${this.foo}`,
          ...data(this),
        };
      },
      $revive(data: any) {
        this.foo = `Revived ${data.foo}`;
      },
    });

    class PostMock extends customMakeModel('posts', {
      title: attr(),
    }) {
    }

    class CommentMock extends customMakeModel('comments', {
      body: attr(),
    }) {
    }

    const post = new PostMock();
    post.title = 'Foo';
    const comment = new CommentMock();
    comment.body = 'Bar';
    comment.foo = 'Baz';

    const { reduce } = makeModelsReducer();
    const { revive } = makeModelsReviver({ models: [PostMock, CommentMock] });
    const revivedPost = revive(reduce(post)) as PostMock;
    const revivedComment = revive(reduce(comment)) as CommentMock;

    expect(revivedPost.title).toStrictEqual('Foo');
    expect(revivedPost.foo).toStrictEqual('Revived Reduced Foo');

    expect(revivedComment.body).toStrictEqual('Bar');
    expect(revivedComment.foo).toStrictEqual('Revived Reduced Baz');
  });

  it('should reduce and revive with composable functions', () => {
    const customComposable = makeComposable({
      foo: 'Foo',
      $reduce({ data }: ModelReduceTools) {
        return {
          foo: `Reduced ${this.foo}`,
          ...data(this),
        };
      },
      $revive(data: any) {
        this.foo = `Revived ${data.foo}`;
      },
    });

    class PostMock extends makeModel('posts', {
      customComposable,
      title: attr(),
    }) {
    }

    class CommentMock extends makeModel('comments', {
      customComposable,
      body: attr(),
    }) {
    }

    const post = new PostMock();
    post.title = 'Foo';
    const comment = new CommentMock();
    comment.body = 'Bar';
    comment.foo = 'Baz';

    const { reduce } = makeModelsReducer();
    const { revive } = makeModelsReviver({ models: [PostMock, CommentMock] });
    const revivedPost = revive(reduce(post)) as PostMock;
    const revivedComment = revive(reduce(comment)) as CommentMock;

    expect(revivedPost.title).toStrictEqual('Foo');
    expect(revivedPost.foo).toStrictEqual('Revived Reduced Foo');

    expect(revivedComment.body).toStrictEqual('Bar');
    expect(revivedComment.foo).toStrictEqual('Revived Reduced Baz');
  });
});
