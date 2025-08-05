import { BrandedValue, UnionToIntersection } from '@foscia/shared';
import { EntityProperty } from '../new/entities/properties/types';

/* eslint-disable symbol-description */

export const RECORD_OBJECT_SYMBOL = Symbol();
export const RECORD_OBJECT_FACTORY_SYMBOL = Symbol();
export const RECORD_OBJECT_PLUGIN_SYMBOL = Symbol();
export const RECORD_OBJECT_FACTORY_PLUGIN_SYMBOL = Symbol();
export const RECORD_OBJECT_FACTORY_BUILDER_PLUGIN_SYMBOL = Symbol();

export interface ObjectPluginOld<Kind extends symbol> {
  readonly kind: Kind;
  readonly __ctx: unknown;
  readonly __type: unknown;
}

export type ObjectPluginTypeOld<
  Context,
  Plugin extends Plugin<any>,
> = UnionToIntersection<(Plugin & { __ctx: Context; })['__type']>;

export interface RecordObjectProperty<T, ThisSchema extends object> {
  readonly __parent: ThisSchema;
  readonly __type: T;
}

export interface Attribute<T, ThisSchema extends object = any>
  extends BrandedValue<'attr', RecordObjectProperty<T, ThisSchema>> {
}

export interface BelongsTo<Record extends EntityRecord<any>, ThisSchema extends object>
  extends BrandedValue<'belongsTo', RecordObjectProperty<Record, ThisSchema>> {
}

export interface HasMany<Record extends RecordObject<any>, ThisSchema extends object>
  extends RecordObjectProperty<Record[], ThisSchema> {
}

export type RecordObjectProperties<Schema extends object> = {
  [K in keyof Schema]: Required<Schema>[K] extends RecordObjectProperty<infer T, any> ? T : never;
};

// TODO Features:
//  - relationships: adds `$loaded` property to record (and `relationships` to factory?).
//  - snapshots: adds `$original` property to record.

export interface RecordObjectComposable<Schema extends RawSchema> {
  readonly schema: () => Schema;
}

export interface RecordBuilderPlugin
  extends Plugin<typeof RECORD_OBJECT_FACTORY_BUILDER_PLUGIN_SYMBOL> {
}

export interface RecordFactoryPlugin
  extends Plugin<typeof RECORD_OBJECT_FACTORY_PLUGIN_SYMBOL> {
}

export interface RecordObjectPlugin
  extends Plugin<typeof RECORD_OBJECT_PLUGIN_SYMBOL> {
}

export interface RecordSchema {
  readonly $type: string;
  readonly $connection?: string;
  readonly $plugins?: readonly Plugin<any>[];
}

export interface RawSchema {
  readonly $connection?: string;
  readonly $plugins?: readonly Plugin<any>[];

  [key: string]: any;
}

export type ExtractPlugin<Schema extends RawSchema> = Schema['$plugins'] extends readonly Plugin<any>[]
  ? Schema['$plugins'][number] : never;

export type RecordBuilder<BaseSchema extends RawSchema> =
  & {
    readonly schema: BaseSchema;
    build<Schema extends RawSchema = never>(
      schema: Schema extends never ? never : Omit<Schema, keyof BaseSchema>,
    ): RecordFactory<Schema & BaseSchema>;
  }
  & ObjectPluginProperties<BaseSchema, Extract<ExtractPlugin<BaseSchema>, RecordBuilderPlugin>>;

export type RecordFactory<Schema extends RawSchema> =
  & {
    readonly schema: Schema;
    make(): RecordObject<Schema>;
  }
  & ObjectPluginProperties<Schema, Extract<ExtractPlugin<Schema>, RecordFactoryPlugin>>;

export type RecordObject<Schema extends RawSchema> =
  & {
    readonly $factory: RecordFactory<Schema>;
  }
  & RecordObjectProperties<Schema>
  & ObjectPluginProperties<Schema, Extract<ExtractPlugin<Schema>, RecordObjectPlugin>>;

export interface RecordSnapshot<Schema extends object> {
  readonly values: RecordObjectProperties<Schema>;
}

// -----------------------------------------------------------------------------
//
// Entities
//
// -----------------------------------------------------------------------------

export interface ObjectPlugin<ForBrand> {
  readonly __brand: ForBrand;
  readonly __ctx: unknown;
  readonly __type: unknown;
}

export type ObjectPluginProperties<
  Context,
  Plugin extends ObjectPlugin<any>,
> = UnionToIntersection<(Plugin & { __ctx: Context; })['__type']>;

export type EntityPlugin = ObjectPlugin<'entity'>;

export type EntityRecordPlugin = ObjectPlugin<'record'>;

export type EntityComposablePlugin<Schema extends PendingEntitySchema> =
  & ObjectPlugin<'composable'>
  & { __type: Schema; };

export type EntityPlugins<Schema extends FinalEntitySchema, Extends extends ObjectPlugin<any>> =
  Extract<NonNullable<Schema['$plugins']>[number], Extends>;

export interface PendingEntitySchema {
  readonly $connection?: string;
  readonly $plugins?: readonly ObjectPlugin<any>[];
}

export interface FinalEntitySchema
  extends PendingEntitySchema {
  readonly $type: string;
}

export type ParsedEntitySchemaUnion<Schema extends FinalEntitySchema> =
  | Schema
  | ObjectPluginProperties<Schema, Extract<NonNullable<Schema['$plugins']>[number], EntityComposablePlugin<any>>>;

export type ParsedEntitySchema<Schema extends FinalEntitySchema> =
  & ('$plugins' extends keyof ParsedEntitySchemaUnion<Schema> ? Pick<ParsedEntitySchemaUnion<Schema>, '$plugins'> : { $plugins: Extract<NonNullable<Schema['$plugins']>[number], EntityComposablePlugin<any>> })
  & Omit<Schema & ObjectPluginProperties<Schema, Extract<NonNullable<Schema['$plugins']>[number], EntityComposablePlugin<any>>>, '$plugins'>;

export type EntityComposable<Schema extends PendingEntitySchema> = BrandedValue<'composable', {
  schema(): new () => Schema;
}>;

export type Entity<Schema extends FinalEntitySchema> = BrandedValue<'entity', {
    readonly schema: Schema;

    make(): EntityRecord<Schema>;
    new(): EntityRecord<Schema>;
  }
  & ObjectPluginProperties<Schema, Extract<NonNullable<Schema['$plugins']>[number], EntityPlugin>>>;

export type EntityRecord<Schema extends FinalEntitySchema> = BrandedValue<'record', {
    readonly $entity: Entity<Schema>;
  }
  & EntityRecordProperties<Schema>
  & ObjectPluginProperties<Schema, Extract<NonNullable<Schema['$plugins']>[number], EntityRecordPlugin>>>;

export type EntityRecordProperties<Schema extends FinalEntitySchema> = {
  [K in keyof Schema]: Required<Schema>[K] extends EntityProperty<infer T, any> ? T : never;
};
