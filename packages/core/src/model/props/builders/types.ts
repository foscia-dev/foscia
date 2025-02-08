import {
  ModelAssembled,
  ModelAttribute,
  ModelComposableFactory,
  ModelId,
  ModelIdType,
  ModelProp,
  ModelPropSync,
  ModelRelation,
  ModelRelationKey,
} from '@foscia/core/model/types';
import { ObjectTransformer } from '@foscia/core/transformers/types';
import { Arrayable, Constructor, Dictionary, IfAny } from '@foscia/shared';

/**
 * Pending property.
 *
 * @internal
 */
export type ModelPendingProp<P extends ModelProp> =
  Omit<P, '$FOSCIA_TYPE' | 'factory' | 'parent' | 'key' | '_type'> & ThisType<P>;

/**
 * Model chainable property factory.
 *
 * @internal
 */
export type ModelPropChainableFactory<
  P extends ModelProp,
  M extends Dictionary<(...args: any[]) => Partial<P>>,
> =
  & { [K in keyof M]: (...args: Parameters<M[K]>) => ModelPropChainableFactory<P, M>; }
  & ModelComposableFactory<P>;

/**
 * Model ID factory.
 *
 * @interface
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
} & ModelComposableFactory<ModelId<T, R>>;

/**
 * Model ID factory object config.
 *
 * @interface
 *
 * @internal
 */
export type ModelIdFactoryConfig<T extends ModelIdType | null, R extends boolean> =
  Pick<ModelId<T, R>, 'transformer' | 'default' | 'readOnly'>;

/**
 * Model attribute factory.
 *
 * @interface
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
} & ModelComposableFactory<ModelAttribute<T, R>>;

/**
 * Model attribute factory object config.
 *
 * @interface
 *
 * @internal
 */
export type ModelAttributeFactoryConfig<T, R extends boolean> =
  Pick<ModelAttribute<T, R>, 'transformer' | 'default' | 'readOnly' | 'alias' | 'sync'>;

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
export type InferModelRelationInverseKey<T> =
  IfAny<T, string, ModelRelationKey<T extends (infer I)[] ? I : T>>;

/**
 * Model relationship factory.
 *
 * @interface
 */
export type ModelRelationFactory<T, R extends boolean> = {
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
  /**
   * Define the path to use when requesting relation's endpoint.
   *
   * @param path
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  path: (path: string) => ModelRelationFactory<T, R>;
} & ModelComposableFactory<ModelRelation<T, R>>;

/**
 * Model relation factory object options.
 *
 * @interface
 *
 * @internal
 */
export type ModelRelationFactoryConfig<T extends Arrayable<object> | null, R extends boolean> =
  & {
    /**
     * The inverse relation key on related instances.
     */
    inverse?: InferModelRelationInverseKey<T> | boolean;
  }
  & Pick<ModelRelation<T, R>, 'type' | 'path' | 'default' | 'readOnly' | 'alias' | 'sync'>;

/**
 * Model assembled/memoized property factory.
 *
 * @interface
 *
 * @since 0.13.0
 * @experimental
 */
export type ModelAssembledFactory<T, R extends boolean> = {
  /**
   * Define the alias to use for data source interactions.
   *
   * @param alias
   */
  alias: (alias: string) => ModelAssembledFactory<T, R>;
  /**
   * Define when the property should be synced with data source.
   *
   * @param sync
   */
  sync: (sync?: boolean | ModelPropSync) => ModelAssembledFactory<T, R>;
  /**
   * Define if the computed value should be memoized.
   *
   * @param memo
   */
  memo: (memo?: boolean) => ModelAssembledFactory<T, R>;
} & ModelComposableFactory<ModelAssembled<T, R>>;

/**
 * Model memoized factory object config.
 *
 * @interface
 *
 * @internal
 */
export type ModelAssembledFactoryConfig<T> =
  Pick<ModelAssembled<T>, 'alias' | 'sync' | 'memo'>;
