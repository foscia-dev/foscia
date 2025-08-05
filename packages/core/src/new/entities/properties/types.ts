import {
  ENTITY_ATTRIBUTE,
  ENTITY_BELONGS_TO,
  ENTITY_FOREIGN,
  ENTITY_PRIMARY,
  ENTITY_PROPERTY,
  ENTITY_PROPERTY_CONFIG,
  ENTITY_RELATION,
} from '@foscia/core/new/entities/properties/consts';
import {
  AnySchemaFragment,
  EntityRecord,
  EntityRecordOf,
  InferSchema,
  SchemaInferable,
} from '@foscia/core/new/entities/types';
import { Identified } from '@foscia/core/new/shared/identity/types';
import { OmitNever } from '@foscia/shared';

/**
 * Private key for entity's property type witness.
 */
declare const PROPERTY_TYPE_WITNESS: unique symbol;

/**
 * Pending entity property config.
 *
 * @remarks
 * This is used as an intermediary layer to allow unordered decorator usage.
 */
export interface EntityPropertyConfig
  extends Identified<typeof ENTITY_PROPERTY_CONFIG> {
  readonly config: Record<string, unknown>;
}

/**
 * Entity property, defined within a schema.
 *
 * @internal
 */
export interface EntityProperty<T>
  extends Identified<typeof ENTITY_PROPERTY> {
  [PROPERTY_TYPE_WITNESS]: T;
}

/**
 * Entity primary property.
 */
export interface Primary<T>
  extends EntityProperty<T>, Identified<typeof ENTITY_PRIMARY> {
}

export type ForeignKey<Schema extends object> =
  & keyof Schema
  & (PrimaryKeyOf<Schema> | ForeignKeyOf<Schema> | AttributeKeyOf<Schema>);

/**
 * Entity attribute property.
 */
export interface Foreign<
  Schema extends object,
  Key extends ForeignKey<Schema>,
>
  extends EntityProperty<Schema[Key]>, Identified<typeof ENTITY_FOREIGN> {
  foreignSchema: Schema;
  foreignKey: Key;
}

/**
 * Entity attribute (scalar or object values).
 */
export interface Attribute<T>
  extends EntityProperty<T>, Identified<typeof ENTITY_ATTRIBUTE> {
}

export type InferRelationOf<Related extends EntityRecord | AnySchemaFragment>
  = Related extends EntityRecord ? Related : EntityRecordOf<Related>;

export type InferRelationRecord<
  T extends AnySchemaFragment[] | AnySchemaFragment | null | undefined,
> =
  T extends AnySchemaFragment[]
    ? EntityRecordOf<T[number]>
    : T extends AnySchemaFragment | infer U
      ? EntityRecordOf<NonNullable<T>> | U
      : never;

export type InferRelationSchema<
  T extends EntityRecord[] | EntityRecord | null | undefined,
> = T extends EntityRecord[]
  ? InferSchema<T[number]>
  : InferSchema<NonNullable<T>>;

/**
 * Entity relationship with other entities.
 *
 * @internal
 */
export interface Relation<
  T extends EntityRecord[] | EntityRecord | null | undefined,
> extends EntityProperty<T>, Identified<typeof ENTITY_RELATION> {
}

export interface BelongsTo<
  Schema extends object,
  // ThisSchema extends AnyEntitySchemaFragment,
> extends EntityProperty<unknown>,
  Identified<typeof ENTITY_BELONGS_TO> {
  // current: ThisSchema;
  related: Schema;
  // foreignKey?: EntityAttributeKey<NonNullable<Schema>>;
  // ownerKey?: EntityAttributeKey<ThisSchema>;
}

// -----------------------------------------------------------------------------
// region Entity keys
// -----------------------------------------------------------------------------

export type PropertyKeyOf<
  Inferable extends SchemaInferable,
  Extending extends EntityProperty<any>,
> = {
  [K in keyof InferSchema<Inferable>]: InferSchema<Inferable>[K] extends Extending
    ? K : never;
}[keyof InferSchema<Inferable>];

export type PrimaryKeyOf<Inferable extends SchemaInferable> =
  PropertyKeyOf<Inferable, Primary<any>>;

export type ForeignKeyOf<Inferable extends SchemaInferable> =
  PropertyKeyOf<Inferable, Foreign<any, any>>;

export type AttributeKeyOf<Inferable extends SchemaInferable> =
  PropertyKeyOf<Inferable, Attribute<any>>;

export type ReferenceKeyOf<Inferable extends SchemaInferable> =
  | PrimaryKeyOf<Inferable>
  | ForeignKeyOf<Inferable>
  | AttributeKeyOf<Inferable>;

export type RelationKeyOf<Inferable extends SchemaInferable> =
  PropertyKeyOf<Inferable, Relation<any>>;

/**
 * Entity property key.
 */
export type EntityKey<Inferable extends SchemaInferable> = {
  [K in keyof InferSchema<Inferable>]: InferSchema<Inferable>[K] extends EntityProperty<any>
    ? K : never;
}[keyof InferSchema<Inferable>];

export type EntityAttributeKey<E extends SchemaInferable> = {
  [K in keyof InferSchema<E>]: InferSchema<E>[K] extends Attribute<any>
    ? K : never;
}[keyof InferSchema<E>];

// -----------------------------------------------------------------------------
// endregion
// region Entity values
// -----------------------------------------------------------------------------

/**
 * Entity property values object.
 */
export type EntityValues<Inferable extends SchemaInferable> = OmitNever<{
  [K in keyof InferSchema<Inferable>]: InferSchema<Inferable>[K] extends EntityProperty<infer T>
    ? T : never;
}>;

// -----------------------------------------------------------------------------
// endregion
// -----------------------------------------------------------------------------
