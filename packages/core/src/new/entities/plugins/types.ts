/* eslint-disable max-classes-per-file */
import {
  ENTITY_COMPOSABLE_PLUGIN,
  ENTITY_PLUGIN,
  ENTITY_RECORD_PLUGIN,
  ENTITY_SCHEMA_PLUGIN,
} from '@foscia/core/new/entities/plugins/consts';
import {
  Entity,
  EntityLike,
  EntityRecord,
  EntityRecordLike,
  SchemaFragment,
  InferSchemaPlugins,
} from '@foscia/core/new/entities/types';
import { Identified } from '@foscia/core/new/shared/identity/types';
import { ApplyPlugins, Plugin } from '@foscia/core/new/shared/plugins/types';

/**
 * Entity plugin which overload schema.
 *
 * @internal
 */
export interface EntitySchemaPlugin<Input extends SchemaFragment, Output>
  extends Plugin<Input, Output>, Identified<typeof ENTITY_SCHEMA_PLUGIN> {
}

/**
 * Entity plugin which provides additional schema.
 *
 * @internal
 */
export interface EntityComposablePlugin<Input extends SchemaFragment, Output>
  extends Plugin<Input, Output>, Identified<typeof ENTITY_COMPOSABLE_PLUGIN> {
}

/**
 * Entity plugin which provides additional properties.
 *
 * @internal
 */
export interface EntityPlugin<Input extends Entity, Output>
  extends Plugin<Input, Output>, Identified<typeof ENTITY_PLUGIN> {
}

/**
 * Entity record plugin which provides additional properties.
 *
 * @internal
 */
export interface EntityRecordPlugin<Input extends EntityRecord, Output>
  extends Plugin<Input, Output>, Identified<typeof ENTITY_RECORD_PLUGIN> {
}

export type ExpandEntityPlugins<Input extends EntityLike> =
  ApplyPlugins<Input, Extract<InferSchemaPlugins<Input>, EntityPlugin<any, any>>>;

export type ExpandEntityRecordPlugins<Input extends EntityRecordLike> =
  ApplyPlugins<Input, Extract<InferSchemaPlugins<Input>, EntityRecordPlugin<any, any>>>;
