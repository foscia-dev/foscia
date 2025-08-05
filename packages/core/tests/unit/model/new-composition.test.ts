/* eslint-disable max-classes-per-file */
import attr from '@foscia/core/props/decorators/attr';
import belongsTo from '@foscia/core/relations/decorators/belongsTo';
import hasMany from '@foscia/core/relations/decorators/hasMany';
import makeComposable from '@foscia/core/models/definition/decorators/makeComposable';
import makeModelDecorator from '@foscia/core/models/definition/decorators/makeModel';
import morphMany from '@foscia/core/relations/decorators/morphMany';
import morphTo from '@foscia/core/relations/decorators/morphTo';
import { ModelInstanceUsing } from '@foscia/core/models/types';
import fill from '@foscia/core/models/utilities/fill';
import { Constructor, kebabCase, pluralize } from '@foscia/shared';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: composition', () => {
  it('should make models with decorators', () => {
    const id = makeComposable((model) => class Id extends model {
      static newId() {
        return 42;
      }

      @attr() id = Id.newId();
    });

    const publishable = makeComposable((model) => class Publishable extends model {
      @attr() publishedAt = null as Date | null;

      get published() {
        return !!this.publishedAt;
      }
    });

    const commentable = makeComposable((model) => class Commentable extends model {
      @morphMany(() => Comment) comments!: Comment[];
    });

    type Commentable = ModelInstanceUsing<typeof commentable>;

    const model = makeModelDecorator({
      composables: [id],
      guessType: (name) => pluralize(kebabCase(name)),
    });

    @model()
    class User extends model.base() {
      @attr() name!: string;

      @hasMany(() => Post) posts!: Post[];
    }

    @model()
    class Comment extends model.base() {
      @attr() body!: string;

      @attr() authorId!: number;

      @belongsTo(() => User) author!: User;

      @attr() commentableId!: number;

      @attr() commentableType!: string;

      @morphTo() commentable!: Commentable;
    }

    @model({
      include: ['author', 'comments'],
    })
    class Post extends model.base([
      publishable,
      commentable,
    ]) {
      @attr() title!: string;

      @attr() body!: string;

      @attr() authorId!: number;

      @belongsTo(() => User) author!: User;
    }

    expect(User.newId()).toStrictEqual(42);
    expect(User.$connection).toStrictEqual('default');
    expect(User.$type).toStrictEqual('users');

    const emptyUser = new User();
    expect(emptyUser.$model).toStrictEqual(User);
    expect(emptyUser.$exists).toStrictEqual(false);
    expect(emptyUser.id).toStrictEqual(42);
    expect(emptyUser.name).toStrictEqual(undefined);
    const filledUser = fill(new User(), { id: 43, name: 'john' });
    expect(filledUser.$model).toStrictEqual(User);
    expect(filledUser.$exists).toStrictEqual(false);
    expect(filledUser.id).toStrictEqual(43);
    expect(filledUser.name).toStrictEqual('john');

    expect(Post.newId()).toStrictEqual(42);
    expect(Post.$connection).toStrictEqual('default');
    expect(Post.$type).toStrictEqual('posts');

    const emptyPost = new Post();
    expect(emptyPost.$model).toStrictEqual(Post);
    expect(emptyPost.$exists).toStrictEqual(false);
    expect(emptyPost.id).toStrictEqual(42);
    expect(emptyPost.title).toStrictEqual(undefined);
    expect(emptyPost.publishedAt).toStrictEqual(null);
    expect(emptyPost.published).toStrictEqual(false);
    expect(emptyPost.author).toStrictEqual(undefined);
    expect(emptyPost.authorId).toStrictEqual(undefined);

    const filledPost = fill(new Post(), {
      title: 'Hello World',
      publishedAt: new Date(),
      author: filledUser,
    });
    expect(filledPost.$model).toStrictEqual(Post);
    expect(filledPost.$exists).toStrictEqual(false);
    expect(filledPost.id).toStrictEqual(42);
    expect(filledPost.title).toStrictEqual('Hello World');
    expect(filledPost.publishedAt).toBeInstanceOf(Date);
    expect(filledPost.published).toStrictEqual(true);
    expect(filledPost.author).toStrictEqual(filledUser);
    expect(filledPost.authorId).toStrictEqual(filledUser.id);
  });

  it('should make composable with inherited typing', () => {
    const sluggable = makeComposable(
      (model: Constructor<{ title: string; }>) => class Commentable extends model {
        get slug() {
          return this.title.toLowerCase();
        }
      },
    );

    const model = makeModelDecorator();

    // @ts-expect-error
    @model('comments', [sluggable])
    class Comment {
    }

    @model('posts', [sluggable])
    class Post {
      @attr() title!: string;
    }

    expect(Comment).toBeTruthy();
    expect(Post).toBeTruthy();
  });
});
