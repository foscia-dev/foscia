/* eslint-disable max-classes-per-file */
import makeEntity from '@foscia/core/new/entities/makeEntity';
import attributesPlugin from '@foscia/core/new/entities/plugins/attributesPlugin';
import makeComposable from '@foscia/core/new/entities/plugins/makeComposable';
import attr from '@foscia/core/new/entities/properties/attr';
import { Attribute } from '@foscia/core/new/entities/properties/types';
import { Entity, EntityRecord, EntityRecordOf } from '@foscia/core/new/entities/types';
import { expect, expectTypeOf } from 'vitest';

describe('attributes plugin', () => {
  it('should make entities with overloaded attributes', () => {
    const baseDummy = makeComposable(class {
      $plugins = [attributesPlugin()];
    });

    const publishableDummy = makeComposable(class {
      @attr() readonly publishedAt: Date | null = null;
    });

    const titleAndPublishableDummy = makeComposable(class {
      $plugins = [baseDummy, publishableDummy];

      @attr() title = 'Dummies!';
    });

    const bodyDummy = makeComposable(class {
      @attr() body?: string;
    });

    const DummyEntity = makeEntity(class {
      $type = 'dummies';

      $plugins = [titleAndPublishableDummy, bodyDummy];

      @attr() readonly createdAt!: Date;
    });

    type ExpectedPlugins =
      | ReturnType<typeof attributesPlugin>
      | typeof baseDummy
      | typeof publishableDummy
      | typeof titleAndPublishableDummy
      | typeof bodyDummy;

    expectTypeOf(DummyEntity).toExtend<Entity>();
    expectTypeOf(DummyEntity).not.toExtend<{ absent: any; }>();
    expectTypeOf(DummyEntity.schema).not.toExtend<{ absent: any; }>();
    expectTypeOf(DummyEntity.schema).toEqualTypeOf<{
      readonly $type: string;
      readonly $plugins: readonly ExpectedPlugins[];
      readonly title: Readonly<Attribute<string>>;
      readonly body: Readonly<Attribute<string>>;
      readonly publishedAt: Readonly<Attribute<Date | null>>;
      readonly createdAt: Readonly<Attribute<Date>>;
    }>();

    const dummy = DummyEntity.make();

    expectTypeOf(dummy).toExtend<EntityRecord>();
    expectTypeOf(dummy).not.toExtend<{ absent: any; }>();
    expectTypeOf(dummy).toEqualTypeOf<EntityRecordOf<typeof DummyEntity>>();
    expectTypeOf(dummy.title).toEqualTypeOf<string>();
    expectTypeOf(dummy.body).toEqualTypeOf<string | undefined>();
    expectTypeOf(dummy.publishedAt).toEqualTypeOf<Date | null>();
    expectTypeOf(dummy.createdAt).toEqualTypeOf<Date>();

    expect(dummy.title).toStrictEqual('Dummy!');
    expect(dummy.body).toStrictEqual(undefined);
    expect(dummy.publishedAt).toBeInstanceOf(Date);
    expect(dummy.createdAt).toStrictEqual(undefined);
  });
});
