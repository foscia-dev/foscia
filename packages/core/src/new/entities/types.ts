import type { ENTITY, ENTITY_RECORD } from '@foscia/core/new/entities/consts';
import type {
  EntityComposablePlugin,
  EntitySchemaPlugin,
  ExpandEntityPlugins,
  ExpandEntityRecordPlugins,
} from '@foscia/core/new/entities/plugins/types';
import type { EntityProperty } from '@foscia/core/new/entities/properties/types';
import { Identified } from '@foscia/core/new/shared/identity/types';
import { ApplyPlugins, Plugin } from '@foscia/core/new/shared/plugins/types';
import { IfEquals } from '@foscia/shared';

/**
 * Entity holding a schema definition and able to make new records.
 *
 * @interface
 */
export type Entity<Schema extends EntitySchema = EmptySchema> =
  ExpandEntityPlugins<Identified<typeof ENTITY> & SchemaAware<Schema> & {
    /**
     * Schema for the entity.
     */
    readonly schema: LockedSchema<Schema>;

    /**
     * Make a new entity record.
     */
    make(): EntityRecord<Schema>;
  }>;

/**
 * Entity record holding the record values.
 *
 * @interface
 */
export type EntityRecord<Schema extends EntitySchema = EmptySchema> =
  ExpandEntityRecordPlugins<Identified<typeof ENTITY_RECORD> & SchemaAware<Schema> & {
    /**
     * Parent entity of this record.
     */
    readonly $entity: Entity<Schema>;
  } & {
    [K in keyof Omit<Schema, keyof EntitySchema>]: Required<Schema>[K] extends EntityProperty<any>
      ? Schema[K] extends EntityProperty<infer T> | infer U
        ? T | IfEquals<Schema[K], U, never, U>
        : never
      : never;
  }>;

const test: EntityRecord;
const test2: keyof typeof test;
const test3: EntityRecord<AnySchemaFragment & EmptySchema>;
const test4: keyof typeof test3;

/**
 * Entity from an entity, a record or a schema.
 */
export type EntityOf<Inferable extends SchemaInferable> =
  Entity<InferSchema<Inferable>>;

/**
 * Entity record from an entity, a record or a schema.
 */
export type EntityRecordOf<Inferable extends SchemaInferable> =
  EntityRecord<InferSchema<Inferable>>;

/**
 * Internal type to match entity without creating a type reference circularity.
 *
 * @internal
 */
export type EntityLike = Identified<typeof ENTITY> & SchemaAware<any>;

/**
 * Internal type to match entity record without creating a type reference circularity.
 *
 * @internal
 */
export type EntityRecordLike = Identified<typeof ENTITY_RECORD> & SchemaAware<any>;

// -----------------------------------------------------------------------------
// region Entity schema
// -----------------------------------------------------------------------------

/**
 * Private key for schema type witness.
 */
declare const SCHEMA_AWARE_WITNESS: unique symbol;

/**
 * Object aware of its original schema state.
 */
export type SchemaAware<Schema extends SchemaFragment> = {
  /**
   * Schema type witness.
   */
  readonly [SCHEMA_AWARE_WITNESS]: Schema;
};

/**
 * Types from which a schema can be inferred.
 *
 * @internal
 */
export type SchemaInferable =
  | EntityLike
  | EntityRecordLike
  | EntitySchema
  | SchemaFragment
  | AnySchemaFragment;

/**
 * Infer schema from an entity, a record or a schema.
 *
 * @internal
 */
export type InferSchema<From extends SchemaInferable> =
  From extends EntityLike | EntityRecordLike
    ? From[typeof SCHEMA_AWARE_WITNESS]
    : From extends EntitySchema
      ? From
      : From extends SchemaFragment
        ? From & { $type: never; }
        : never;

/**
 * Infer schema plugins from an entity, a record or a schema.
 *
 * @internal
 */
export type InferSchemaPlugins<From extends SchemaInferable> =
  '$plugins' extends keyof InferSchema<From>
    ? InferSchema<From>['$plugins'] extends readonly Plugin<any, any>[]
      ? InferSchema<From>['$plugins'][number]
      : never
    : never;

/**
 * Schema for an empty entity.
 *
 * @internal
 */
export interface EmptySchema {
  /**
   * Type string identifying the entity.
   */
  readonly $type: string;
}

/**
 * Schema for an entity.
 *
 * @internal
 */
export interface EntitySchema extends EmptySchema {
  /**
   * Connection identifier the entity is interacting with.
   */
  // TODO Branded?
  readonly $connection?: string;
  /**
   * Plugins to apply to entity and records.
   */
  readonly $plugins?: readonly Plugin<any, any>[];
}

/**
 * Schema fragment for an entity composition.
 *
 * @remarks
 * When a user given fragment inference is expected, prefer using
 * {@link AnySchemaFragment} to avoid TypeScript's weak type detection.
 *
 * @internal
 */
export interface SchemaFragment extends Omit<EntitySchema, '$type'> {
}

/**
 * Schema fragment with explicit `any` properties.
 *
 * @privateRemarks
 * This is necessary to avoid triggering TypeScript's weak type detection for
 * fragments without `$` special properties.
 * When no user given fragment inference is expected, prefer using
 * {@link SchemaFragment} for a more strict typing.
 *
 * @internal
 */
export type AnySchemaFragment = SchemaFragment & Record<string, any>;

/**
 * Merge two entity schemas fragments.
 *
 * @internal
 */
export type MergeSchemaFragments<
  PrevFragment extends SchemaFragment,
  NextFragment extends SchemaFragment,
> =
  & Omit<NextFragment, '$plugins'>
  & { $plugins: (InferSchemaPlugins<PrevFragment> | InferSchemaPlugins<NextFragment>)[]; };

export type EntitySchemaPluginOutput<Input extends SchemaFragment> =
  ApplyPlugins<Input, Extract<InferSchemaPlugins<Input>, EntityComposablePlugin<any, any>>>;

export type EntitySchemaPluginOutput2<Input extends SchemaFragment> =
  ApplyPlugins<Input, Extract<InferSchemaPlugins<Input>, EntitySchemaPlugin<any, any>>>;

/**
 * Flatten a schema or schema fragment to its final parsed state.
 *
 * @remarks
 * Schema are flatten by only one level.
 *
 * @internal
 */
export type FinalEntitySchema<Fragment extends SchemaFragment> =
  & FinalSchemaFragment<Fragment>
  & (Fragment extends EntitySchema ? { $type: Fragment['$type']; } : {});

export type FinalSchemaFragment<Fragment extends SchemaFragment> = EntitySchemaPluginOutput2<
  EntitySchemaPluginOutput<Fragment> extends SchemaFragment
    ? MergeSchemaFragments<Fragment, EntitySchemaPluginOutput<Fragment>>
    : Fragment>;

/**
 * Lock a schema by making all of its properties readonly.
 */
export type LockedSchema<Schema extends EntitySchema = EmptySchema> = Readonly<{
  [K in keyof Schema]-?: Required<Schema>[K] extends EntityProperty<any>
    ? Readonly<Required<Schema>[K]>
    : Readonly<Schema[K]>;
}>;

// -----------------------------------------------------------------------------
// endregion
// -----------------------------------------------------------------------------
