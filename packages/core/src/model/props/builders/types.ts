import {
  ModelAttribute,
  ModelId,
  ModelIdType,
  ModelProp,
  ModelPropFactory,
  ModelPropSync,
  ModelRelation,
  ModelRelationKey,
} from '@foscia/core/model/types';
import { ObjectTransformer } from '@foscia/core/transformers/types';
import { Arrayable, Constructor } from '@foscia/shared';

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
 * Model ID factory object config.
 *
 * @internal
 */
export type ModelIdFactoryConfig<T extends ModelIdType | null, R extends boolean> =
  Pick<ModelId<string, T, R>, 'transformer' | 'default' | 'readOnly'>;

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
 * Model attribute factory object config.
 *
 * @internal
 */
export type ModelAttributeFactoryConfig<T, R extends boolean> =
  Pick<ModelAttribute<string, T, R>, 'transformer' | 'default' | 'readOnly' | 'alias' | 'sync'>;

/**
 * Infer related instance types from relationship models.
 *
 * @internal
 */
export type InferModelRelationFactoryInstance<M> =
  M extends Constructor<infer I>[] ? I extends object ? I : never
    : M extends Constructor<infer I> ? I extends object ? I : never
      : never;

/**
 * Infer a model's relation possible inverse key.
 *
 * @internal
 */
export type InferModelRelationInverseKey<T> = 0 extends (1 & T)
  ? string
  : T extends (infer I)[]
    ? ModelRelationKey<I>
    : ModelRelationKey<T>;

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
  config: (
    config: string | string[] | ModelRelationFactorySpecialConfig<T>,
  ) => ModelRelationFactory<T, R>;
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
  /**
   * Define the inverse of the relation.
   *
   * @param inverse
   */
  inverse: (inverse?: InferModelRelationInverseKey<T> | boolean) => ModelRelationFactory<T, R>;
} & ModelPropFactory<ModelRelation<string, T, R>>;

/**
 * Model relation factory object options.
 *
 * @internal
 */
export type ModelRelationFactoryConfig<T extends Arrayable<object> | null, R extends boolean> =
  & ModelRelationFactorySpecialConfig<T>
  & Pick<ModelRelation<string, T, R>, 'default' | 'readOnly' | 'alias' | 'sync'>;

/**
 * Model relation factory object special options.
 *
 * @internal
 */
export type ModelRelationFactorySpecialConfig<T> = {
  /**
   * The related type(s) to help Foscia resolving related models.
   */
  type?: string | string[];
  /**
   * The inverse relation key on related instances.
   */
  inverse?: InferModelRelationInverseKey<T> | boolean;

  // Specific HTTP config.

  /**
   * The path to use when requesting relation's endpoint.
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  path?: string;
};
