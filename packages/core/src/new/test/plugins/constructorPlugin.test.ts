/* eslint-disable max-classes-per-file */
import makeEntity from '@foscia/core/new/entities/makeEntity';
import constructorPlugin from '@foscia/core/new/entities/plugins/constructorPlugin';
import { EntityRecordOf } from '@foscia/core/new/entities/types';
import { expect, expectTypeOf } from 'vitest';

describe('constructor plugin', () => {
  it('should not initially support constructor signature', () => {
    const DummyEntity = makeEntity(class {
      $type = 'dummies';
    });

    // @ts-expect-error
    expect(() => new DummyEntity())
      .toThrowError();
  });

  it('should add constructor signature', () => {
    const DummyEntity = makeEntity(class {
      $type = 'dummies';

      $plugins = [constructorPlugin()];
    });

    const dummy = new DummyEntity();

    expect(dummy.$entity).toStrictEqual(DummyEntity);
    expectTypeOf(dummy).toEqualTypeOf<EntityRecordOf<typeof DummyEntity>>();
  });
});
