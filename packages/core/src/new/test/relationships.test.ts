/* eslint-disable max-classes-per-file */
import makeEntity from '@foscia/core/new/entities/makeEntity';
import { Attribute, BelongsTo } from '@foscia/core/new/entities/properties/types';
import { Entity, EntityRecord, EntityRecordOf } from '@foscia/core/new/entities/types';
import { expect, expectTypeOf } from 'vitest';

describe('relationships', () => {
  it('should support shallow relations', () => {
    const User = makeEntity(class {
      $type = 'users';

      post!: BelongsTo<User, this>;
    });

    type User = EntityRecordOf<typeof User>;

    const Post = makeEntity(class {
      $type = 'posts';

      author!: BelongsTo<User, this>;
    });

    type Post = EntityRecordOf<typeof Post>;

    expectTypeOf(Dummy).toExtend<Entity>();
    expect(Dummy.schema).toStrictEqual({ $type: 'dummies' });

    const dummy = Dummy.make();

    expectTypeOf(dummy).toExtend<EntityRecord>();
    expectTypeOf(dummy).toEqualTypeOf<EntityRecordOf<typeof Dummy>>();
    expect(dummy.$entity).toBe(Dummy);
  });

  it('should support shallow entities', () => {
    const Dummy = makeEntity(class {
      $type = 'dummies';

      title!: Attribute<string, this>;
    });

    expectTypeOf(Dummy).toExtend<Entity>();

    const dummy = Dummy.make();

    expectTypeOf(dummy).toExtend<EntityRecord>();
    expectTypeOf(dummy).toEqualTypeOf<EntityRecordOf<typeof Dummy>>();
    expect(dummy.title).toStrictEqual('Dummy!');
  });

  it('should support deep entities', () => {

  });

  it('should support deeper entities', () => {

  });
});
