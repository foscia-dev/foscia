import {
  Model,
  ModelAttribute,
  ModelId,
  ModelIdType,
  ModelProp,
  ModelPropFactory,
  ModelPropSync,
  ModelRelation,
  ModelRelationConfig,
} from '@foscia/core/model/types';
import { ObjectTransformer } from '@foscia/core/transformers/types';
import { Awaitable, Constructor } from '@foscia/shared';

/**
 * Default prop factory definition object type.
 *
 * @internal
 */
export type ModelPropFactoryDefinition<P extends ModelProp> =
  Partial<P> & ThisType<P & { key: any; }>;

/**
 * Model ID factory object.
 *
 * @internal
 */
export type ModelIdFactory<T extends ModelIdType | null, R extends boolean> = {
  /**
   * Define a transformer.
   *
   * @param transformer
   */
  transform: <NT extends T>(
    transformer: ObjectTransformer<NT | null, any, any>,
  ) => ModelIdFactory<NT, R>;
  /**
   * Define default value.
   * Object values should be provided with a factory function to avoid
   * defining the same reference on multiple instance.
   *
   * @param value
   */
  default: <NT extends T>(value: T | (() => T)) => ModelIdFactory<NT, R>;
  /**
   * Mark read-only.
   *
   * @param readOnly
   */
  readOnly: <NR extends boolean = true>(readOnly?: NR) => ModelIdFactory<T, NR>;
  /**
   * Mark nullable.
   */
  nullable: () => ModelIdFactory<T | null, R>;
} & ModelPropFactory<ModelId<string, T, R>>;

/**
 * Model attribute factory object.
 *
 * @internal
 */
export type ModelAttributeFactory<T, R extends boolean> = {
  /**
   * Define a transformer.
   *
   * @param transformer
   */
  transform: <NT extends T>(
    transformer: ObjectTransformer<NT | null, any, any>,
  ) => ModelAttributeFactory<NT, R>;
  /**
   * Define default value.
   * Object values should be provided with a factory function to avoid
   * defining the same reference on multiple instance.
   *
   * @param value
   */
  default: <NT extends T>(value: T | (() => T)) => ModelAttributeFactory<NT, R>;
  /**
   * Mark read-only.
   *
   * @param readOnly
   */
  readOnly: <NR extends boolean = true>(readOnly?: NR) => ModelAttributeFactory<T, NR>;
  /**
   * Mark nullable.
   */
  nullable: () => ModelAttributeFactory<T | null, R>;
  /**
   * Define the alias to use for data source interactions.
   *
   * @param alias
   */
  alias: (alias: string) => ModelAttributeFactory<T, R>;
  /**
   * Define when the property should be synced with data source.
   *
   * @param sync
   */
  sync: (sync: boolean | ModelPropSync) => ModelAttributeFactory<T, R>;
} & ModelPropFactory<ModelAttribute<string, T, R>>;

/**
 * Infer related instance types from relationship models.
 *
 * @internal
 */
export type InferModelRelationFactoryInstance<M> =
  M extends Constructor<infer I>[] ? I
    : M extends Constructor<infer I> ? I
      : never;

/**
 * Model relationship factory configuration object.
 *
 * @internal
 */
export type ModelRelationFactoryConfig =
  | string
  | string[]
  | ModelRelationConfig
  | (() => Awaitable<Model | Model[]>);

/**
 * Model relationship factory object.
 *
 * @internal
 */
export type ModelRelationFactory<T, R extends boolean> = {
  /**
   * Define the related types or the configuration object.
   *
   * @param config
   */
  config: (config: string | string[] | ModelRelationConfig) => ModelRelationFactory<T, R>;
  /**
   * Define default value.
   * Object values should be provided with a factory function to avoid
   * defining the same reference on multiple instance.
   *
   * @param value
   */
  default: <NT extends T>(value: T | (() => T)) => ModelRelationFactory<NT, R>;
  /**
   * Mark read-only.
   *
   * @param readOnly
   */
  readOnly: <NR extends boolean = true>(readOnly?: NR) => ModelRelationFactory<T, NR>;
  /**
   * Mark nullable.
   */
  nullable: () => ModelRelationFactory<T | null, R>;
  /**
   * Define the alias to use for data source interactions.
   *
   * @param alias
   */
  alias: (alias: string) => ModelRelationFactory<T, R>;
  /**
   * Define when the property should be synced with data source.
   *
   * @param sync
   */
  sync: (sync: boolean | ModelPropSync) => ModelRelationFactory<T, R>;
} & ModelPropFactory<ModelRelation<string, T, R>>;
