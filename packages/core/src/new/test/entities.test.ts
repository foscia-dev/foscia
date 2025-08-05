/* eslint-disable max-classes-per-file */
import makeEntity from '@foscia/core/new/entities/makeEntity';
import makeComposable from '@foscia/core/new/entities/plugins/makeComposable';
import attr from '@foscia/core/new/entities/properties/attr';
import { Attribute } from '@foscia/core/new/entities/properties/types';
import { Entity, EntityRecord, EntityRecordOf } from '@foscia/core/new/entities/types';
import { expect, expectTypeOf } from 'vitest';

describe('entities', () => {
  it('should make entities with empty schema', () => {
    const DummyEntity = makeEntity(class {
      $type = 'dummies';
    });

    expect(DummyEntity.schema).toStrictEqual({ $type: 'dummies' });

    const dummy = DummyEntity.make();

    expect(dummy.$entity).toBe(DummyEntity);

    expectTypeOf(DummyEntity).toExtend<Entity>();
    expectTypeOf(DummyEntity).not.toExtend<{ absent: any; }>();
    expectTypeOf(DummyEntity.schema).not.toExtend<{ absent: any; }>();
    expectTypeOf(DummyEntity.schema).toEqualTypeOf<{
      readonly $type: string;
    }>();
    expectTypeOf(dummy).toExtend<EntityRecord>();
    expectTypeOf(dummy).not.toExtend<{ absent: any; }>();
    expectTypeOf(dummy).toEqualTypeOf<EntityRecordOf<typeof DummyEntity>>();
    expectTypeOf(dummy.$entity).toEqualTypeOf<typeof DummyEntity>();
  });

  it('should make entities with shallow schema', () => {
    const DummyEntity = makeEntity(class {
      $type = 'dummies';

      @attr() title!: Attribute<string>;

      @attr() body?: Attribute<string>;

      @attr() readonly publishedAt!: Attribute<Date | null>;

      @attr() readonly createdAt!: Attribute<Date>;
    });

    expectTypeOf(DummyEntity).toExtend<Entity>();
    expectTypeOf(DummyEntity).not.toExtend<{ absent: any; }>();
    expectTypeOf(DummyEntity.schema).not.toExtend<{ absent: any; }>();
    expectTypeOf(DummyEntity.schema).toEqualTypeOf<{
      readonly $type: string;
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

    expect(dummy).to.have.key('title');
    expect(dummy).to.have.key('body');
    expect(dummy).to.have.key('publishedAt');
    expect(dummy).to.have.key('createdAt');
    expect(dummy.title).toStrictEqual(undefined);
    expect(dummy.body).toStrictEqual(undefined);
    expect(dummy.publishedAt).toStrictEqual(undefined);
    expect(dummy.createdAt).toStrictEqual(undefined);

    dummy.title = 'Dummy!';
    dummy.body = 'More dummies!';
    // @ts-expect-error
    dummy.publishedAt = new Date();
    // @ts-expect-error
    dummy.createdAt = new Date();

    expect(dummy.title).toStrictEqual('Dummy!');
    expect(dummy.body).toStrictEqual('More dummies!');
    expect(dummy.publishedAt).toBeInstanceOf(Date);
    expect(dummy.createdAt).toBeInstanceOf(Date);
  });

  it('should make entities with composed schema', () => {
    const publishableDummy = makeComposable(class {
      @attr() readonly publishedAt!: Attribute<Date | null>;
    });

    const DummyEntity = makeEntity(class {
      $type = 'dummies';

      $plugins = [publishableDummy];

      @attr() title!: Attribute<string>;

      @attr() body?: Attribute<string>;

      @attr() readonly createdAt!: Attribute<Date>;
    });

    type ExpectedPlugins = typeof publishableDummy;

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

    expect(dummy).to.have.key('title');
    expect(dummy).to.have.key('body');
    expect(dummy).to.have.key('publishedAt');
    expect(dummy).to.have.key('createdAt');
    expect(dummy.title).toStrictEqual(undefined);
    expect(dummy.body).toStrictEqual(undefined);
    expect(dummy.publishedAt).toStrictEqual(undefined);
    expect(dummy.createdAt).toStrictEqual(undefined);

    dummy.title = 'Dummy!';
    dummy.body = 'More dummies!';
    // @ts-expect-error
    dummy.publishedAt = new Date();
    // @ts-expect-error
    dummy.createdAt = new Date();

    expect(dummy.title).toStrictEqual('Dummy!');
    expect(dummy.body).toStrictEqual('More dummies!');
    expect(dummy.publishedAt).toBeInstanceOf(Date);
    expect(dummy.createdAt).toBeInstanceOf(Date);
  });

  it('should make entities with deeply composed schema', () => {
    const publishableDummy = makeComposable(class Publishable {
      @attr() readonly publishedAt!: Attribute<Date | null>;
    });

    const titleAndPublishableDummy = makeComposable(class Title {
      $plugins = [publishableDummy];

      @attr() title!: Attribute<string>;
    });

    const bodyDummy = makeComposable(class Body {
      @attr() body?: Attribute<string>;
    });

    const DummyEntity = makeEntity(class {
      $type = 'dummies';

      $plugins = [titleAndPublishableDummy, bodyDummy];

      @attr() readonly createdAt!: Attribute<Date>;
    });

    type ExpectedPlugins =
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

    expect(dummy).to.have.key('title');
    expect(dummy).to.have.key('body');
    expect(dummy).to.have.key('publishedAt');
    expect(dummy).to.have.key('createdAt');
    expect(dummy.title).toStrictEqual(undefined);
    expect(dummy.body).toStrictEqual(undefined);
    expect(dummy.publishedAt).toStrictEqual(undefined);
    expect(dummy.createdAt).toStrictEqual(undefined);

    dummy.title = 'Dummy!';
    dummy.body = 'More dummies!';
    // @ts-expect-error
    dummy.publishedAt = new Date();
    // @ts-expect-error
    dummy.createdAt = new Date();

    expect(dummy.title).toStrictEqual('Dummy!');
    expect(dummy.body).toStrictEqual('More dummies!');
    expect(dummy.publishedAt).toBeInstanceOf(Date);
    expect(dummy.createdAt).toBeInstanceOf(Date);
  });
});
