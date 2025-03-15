import { AnonymousEnhancer, ConsumeModel } from '@foscia/core/actions/types';
import { Hookable, HookCallback, SyncHookCallback } from '@foscia/core/hooks/types';
import { RawInclude } from '@foscia/core/relations/types';
import {
  SYMBOL_MODEL_CLASS,
  SYMBOL_MODEL_COMPOSABLE,
  SYMBOL_MODEL_INSTANCE,
  SYMBOL_MODEL_PROP,
  SYMBOL_MODEL_PROP_KIND_ATTRIBUTE,
  SYMBOL_MODEL_PROP_KIND_ID,
  SYMBOL_MODEL_PROP_KIND_RELATION,
  SYMBOL_MODEL_RELATION_HAS_MANY,
  SYMBOL_MODEL_RELATION_HAS_ONE,
  SYMBOL_MODEL_SNAPSHOT,
} from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';
import {
  Arrayable,
  Awaitable,
  Constructor,
  DescriptorHolder,
  DescriptorHolderOf,
  Dictionary,
  FosciaObject,
  IfAny,
  OmitNever,
  Prev,
  RestoreDescriptorHolder,
  UnionToIntersection,
} from '@foscia/shared';

/**
 * Configuration of a model class.
 *
 * @internal
 */
export type ModelConfig<M extends Model = Model> = {
  /**
   * Enable all strict policies on models.
   * Defaults as `undefined`.
   *
   * @remarks
   * Enabling or disabling a specific policy will supersede the strict setting.
   */
  strict?: boolean;
  /**
   * Enable strict properties.
   * Defaults to `false`.
   *
   * @remarks
   * When enabled, getting an instance's property value will throw an error
   * if the value has not been set nor retrieved from data source.
   */
  strictProperties?: boolean;
  /**
   * Enable strict properties.
   * Defaults to `false`.
   *
   * @remarks
   * When enabled, writing a read-only instance's property will throw an error.
   */
  strictReadOnly?: boolean;
  /**
   * Guess a related type from a relation.
   * Defaults is to use the relation name (and pluralize it if it is a "to one"
   * relation).
   */
  guessRelationType?: (relation: ModelRelation) => string;
  /**
   * Guess a relation inverse.
   * Defaults is to use the model type (and singularize it if it is a "to many"
   * relation).
   */
  guessRelationInverse?: (relation: ModelRelation) => string | string[];
  /**
   * Guess alias from a property's name.
   * Defaults is to keep the property's name.
   */
  guessAlias?: (prop: ModelProp) => string;
  /**
   * Compare two properties values when comparing snapshots.
   * Defaults to {@link compareModelValues | `compareModelValues`}.
   *
   * @param nextValue
   * @param prevValue
   */
  compareSnapshotValues: (nextValue: unknown, prevValue: unknown) => boolean;
  /**
   * Clone a property value when creating a snapshot.
   * Defaults to {@link cloneModelValue | `cloneModelValue`}.
   *
   * @param value
   */
  cloneSnapshotValue: <T>(value: T) => T;
  /**
   * Tells if snapshots of related instances should be using
   * {@link ModelSnapshot | `ModelSnapshot`} or
   * {@link ModelLimitedSnapshot | `ModelLimitedSnapshot`}
   * to reduced memory footprint and improve performance.
   * Defaults to `true` (uses {@link ModelLimitedSnapshot | `ModelLimitedSnapshot`}).
   */
  limitedSnapshots?: boolean;

  /**
   * Sub-relations to always include.
   */
  include?: RawInclude<M>;
  /**
   * Callback to customize the query.
   * Defining it can prevent requests merging and degrade performance.
   * If your goal is to only include relations, use `include`.
   */
  query?: AnonymousEnhancer<ConsumeModel<M>, any>;

  // Specific HTTP config.

  /**
   * Define the base URL to use.
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  baseURL?: string;
  /**
   * Define the path to use.
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  path?: string;
  /**
   * Guess the path from the model type.
   * Defaults to the model type.
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  guessPath?: (type: string) => string;
  /**
   * Guess the ID path from the model ID.
   * Defaults to converting the ID to string.
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  guessIdPath?: (id: ModelIdType) => ModelIdType;
  /**
   * Guess the relation path from the relation.
   * Defaults to the relation name.
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  guessRelationPath?: (relation: ModelRelation) => string;
};

/**
 * Model composable which adds features and typings to a model.
 *
 * @interface
 *
 * @internal
 */
export interface ModelComposable {
  /**
   * The factory which produced the composable.
   *
   * @internal
   */
  readonly factory: ModelComposableFactory<any>;
  /**
   * The model the composable is bind to.
   *
   * @internal
   */
  readonly parent: Model;
  /**
   * The key the composable is bind to.
   *
   * @internal
   */
  readonly key: string;
  /**
   * Init the composable to a parent model's instance.
   *
   * @internal
   */
  readonly init?: (instance: ModelInstance) => void;
  /**
   * Stores the composable typing for type resolution.
   *
   * @ignore
   */
  readonly _type: {};
}

/**
 * Model composable factory typing.
 *
 * @internal
 */
export type ModelPendingComposable<C extends ModelComposable> =
  Omit<C, 'factory' | 'parent' | 'key' | '_type'> & ThisType<C>;

/**
 * Model composable factory.
 *
 * @typeParam C Composable which the factory binds.
 *
 * @interface
 *
 * @internal
 */
export type ModelComposableFactory<C extends ModelComposable = ModelComposable> =
  & {
    /**
     * Create and bind the composable to a model.
     */
    readonly bind: (ctx: { parent: Model, key: string }) => C;
    /**
     * Pending composable built by the factory.
     */
    composable: ModelPendingComposable<C>;
  }
  & FosciaObject<typeof SYMBOL_MODEL_COMPOSABLE>;

/**
 * Model instance ID default typing.
 */
export type ModelIdType = string | number;

/**
 * Sync configuration for a property. `pull` means the property is only retrieved
 * from the data source and never send to it. `push` is the opposite.
 *
 * @internal
 */
export type ModelPropSync = 'pull' | 'push';

/**
 * Model property.
 *
 * @internal
 */
export interface ModelProp<T = any, R extends boolean = boolean>
  extends ModelComposable, FosciaObject<typeof SYMBOL_MODEL_PROP> {
  /**
   * Type produced by the property.
   *
   * @ignore
   */
  readonly _type: R extends false ? Record<this['key'], T> : Readonly<Record<this['key'], T>>;
  /**
   * Alias of the property (might be used when (de)serializing).
   */
  alias?: string | undefined;
  /**
   * Tells if the property should be synced with the data store.
   */
  sync?: boolean | ModelPropSync;
  /**
   * Tells if the property is read-only.
   */
  readOnly?: R;
  /**
   * Transformer for the property.
   */
  transformer?: ObjectTransformer<T | null>;
}

/**
 * Pending property.
 *
 * @internal
 */
export type ModelPendingProp<P extends ModelProp> =
  Omit<P, '$FOSCIA_TYPE' | 'factory' | 'parent' | 'key' | '_type'> & ThisType<P>;

/**
 * Pending property factory.
 *
 * @internal
 */
export type ModelPendingPropFactory<F extends ModelComposableFactory<ModelProp>> =
  Omit<F, '$FOSCIA_TYPE' | 'bind' | 'composable' | '_type' | '_readOnly' | '_factory'>;

/**
 * Model property factory with modified type and read-only state.
 *
 * @internal
 */
export type ModelPropModifiedFactory<
  F extends ModelPropFactory<any, any>,
  T,
  R extends boolean,
> = (F & { readonly _type: T | null; readonly _readOnly: R; })['_factory'];

/**
 * Model property factory.
 *
 * @internal
 */
export interface ModelPropFactory<T = any, R extends boolean = boolean> {
  /**
   * The final factory implementation.
   *
   * @ignore
   */
  readonly _factory: unknown;
  /**
   * The final type of the property created by the factory implementation.
   *
   * @ignore
   */
  readonly _type: unknown;
  /**
   The final read-only state of the property created by the factory implementation.
   *
   * @ignore
   */
  readonly _readOnly: boolean;

  /**
   * Define the alias to use for data source interactions.
   *
   * @param alias
   */
  alias: (alias: string) => ModelPropModifiedFactory<this, T, R>;
  /**
   * Define when the property should be synced with data source.
   *
   * @param sync
   */
  sync: (sync: boolean | ModelPropSync) => ModelPropModifiedFactory<this, T, R>;
  /**
   * Define a transformer.
   *
   * @param transformer
   */
  transform: <NT extends T>(
    transformer: ObjectTransformer<NT | null, any, any>,
  ) => ModelPropModifiedFactory<this, NT, R>;
}

/**
 * Model value property stored inside the instance internal values.
 *
 * @interface
 *
 * @internal
 */
export type ModelValueProp<
  T = any,
  R extends boolean = boolean,
  K extends symbol = any,
> =
  & {
    /**
     * Kind of value property.
     *
     * @internal
     */
    readonly $VALUE_PROP_KIND: K;
    /**
     * Default value for the property.
     */
    default?: T | (() => T) | undefined;
  }
  & ModelProp<T, R>;

/**
 * Model value property factory.
 *
 * @internal
 */
export interface ModelValuePropFactory<T = any, R extends boolean = boolean>
  extends ModelPropFactory<T, R> {
  /**
   * Define read-only state.
   *
   * @param readOnly
   */
  readOnly: <NR extends boolean = true>(readOnly?: NR) => ModelPropModifiedFactory<this, T, NR>;
  /**
   * Define default value.
   * Object values should be provided with a factory function to avoid
   * defining the same reference on multiple instance.
   *
   * @param value
   */
  default: <NT extends T>(value: NT | (() => NT)) => ModelPropModifiedFactory<this, NT, R>;
  /**
   * Mark nullable.
   */
  nullable: () => ModelPropModifiedFactory<this, T | null, R>;
}

/**
 * Model ID property.
 *
 * @interface
 */
export type ModelId<T = any, R extends boolean = boolean> =
  & ModelValueProp<T, R, typeof SYMBOL_MODEL_PROP_KIND_ID>;

/**
 * Model ID factory.
 */
export interface ModelIdFactory<T, R extends boolean>
  extends ModelComposableFactory<ModelId<T, R>>, ModelValuePropFactory<T, R> {
  readonly _factory: ModelIdFactory<this['_type'], this['_readOnly']>;
  /**
   * @ignore
   */
  alias: (alias: string) => ModelPropModifiedFactory<this, T, R>;
  /**
   * @ignore
   */
  sync: (sync: boolean | ModelPropSync) => ModelPropModifiedFactory<this, T, R>;
}

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
 * Model attribute property.
 *
 * @interface
 */
export type ModelAttribute<T = any, R extends boolean = boolean> =
  & ModelValueProp<T, R, typeof SYMBOL_MODEL_PROP_KIND_ATTRIBUTE>;

/**
 * Model attribute factory.
 */
export interface ModelAttributeFactory<T, R extends boolean>
  extends ModelComposableFactory<ModelAttribute<T, R>>, ModelValuePropFactory<T, R> {
  readonly _factory: ModelAttributeFactory<this['_type'], this['_readOnly']>;
}

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
 * Model relation property.
 *
 * @interface
 *
 * @internal
 */
export type ModelRelation<
  T = any,
  R extends boolean = boolean,
  K extends symbol = any,
> =
  {
    /**
     * Kind of relation.
     *
     * @internal
     */
    readonly $RELATION_KIND: K;
    /**
     * Resolve the related model(s).
     */
    model?: () => Awaitable<Model | Model[]>;
    /**
     * The related type(s) to help Foscia resolving related models.
     */
    type?: string | string[];
    /**
     * The inverse relation key on related instances.
     */
    inverse?: string | boolean;
    /**
     * Sub-relations to always include.
     */
    include?: RawInclude;
    /**
     * Callback to customize the relation query.
     * Defining it can prevent requests merging and degrade performance.
     */
    query?: AnonymousEnhancer<ConsumeModel, any>;

    // Specific HTTP config.

    /**
     * The path to use when requesting relation's endpoint.
     *
     * @remarks
     * This is specific to HTTP implementations (REST, JSON:API).
     */
    path?: string;
  }
  & ModelValueProp<T, R, typeof SYMBOL_MODEL_PROP_KIND_RELATION>;

/**
 * Model has one relation property.
 *
 * @interface
 */
export type ModelHasOne<T = any, R extends boolean = boolean> =
  & ModelRelation<T, R, typeof SYMBOL_MODEL_RELATION_HAS_ONE>;

/**
 * Model has many relation property.
 *
 * @interface
 */
export type ModelHasMany<T = any, R extends boolean = boolean> =
  & ModelRelation<T, R, typeof SYMBOL_MODEL_RELATION_HAS_MANY>;

/**
 * Infer related instance types from relationship types strings.
 *
 * @internal
 */
export type InferModelRelationInstanceFromTypes<T> =
  Foscia.CustomTypes extends { models: infer M; }
    ? M extends {} ? T extends string & keyof M ? M[T]
      : T extends (infer ST)[] ? InferModelRelationInstanceFromTypes<ST>
        : never : never : never;

/**
 * Infer related instance types from relationship models.
 *
 * @internal
 */
export type InferModelRelationInstanceFromModels<M> =
  M extends Constructor<infer I>[] ? I extends object ? I : never
    : M extends Constructor<infer I> ? I extends object ? I : never
      : never;

/**
 * Infer related instance types from relation type.
 *
 * @internal
 */
export type InferModelRelationInstanceFromValue<T> = T extends (infer I)[] ? I : T;

/**
 * Infer related instance types from relation type.
 *
 * @internal
 */
export type InferModelRelationModelFromValue<T> =
  InferModelRelationInstanceFromValue<T> extends infer I
    ? I extends ModelInstance ? Model<I['_definition'], I>
      : never : never;

/**
 * Infer a model's relation possible inverse key.
 *
 * @internal
 */
export type InferModelRelationInverseKey<T> =
  IfAny<T, string, ModelRelationKey<InferModelRelationInstanceFromValue<T>>>;

/**
 * Model relation abstract factory.
 *
 * @internal
 */
export interface ModelRelationFactory<T, R extends boolean>
  extends ModelValuePropFactory<T, R> {
  /**
   * @ignore
   * @internal
   */
  transform: <NT extends T>(
    transformer: ObjectTransformer<NT | null, any, any>,
  ) => ModelPropModifiedFactory<this, NT, R>;
  /**
   * Define the inverse of the relation.
   *
   * @param inverse
   */
  inverse: (
    inverse?: InferModelRelationInverseKey<T> | boolean,
  ) => ModelPropModifiedFactory<this, T, R>;
  /**
   * Define sub-relations to always include.
   */
  include: (
    include: RawInclude<InferModelRelationModelFromValue<T>>,
  ) => ModelPropModifiedFactory<this, T, R>;
  /**
   * Define the callback to customize the relation query.
   * Defining it can prevent requests merging and degrade performance.
   * If your goal is to only include relations, use `include`.
   */
  query: (
    callback: AnonymousEnhancer<ConsumeModel<InferModelRelationModelFromValue<T>>, any>,
  ) => ModelPropModifiedFactory<this, T, R>;

  /**
   * Define the path to use when requesting relation's endpoint.
   *
   * @param path
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  path: (path: string) => ModelPropModifiedFactory<this, T, R>;
}

/**
 * Model has one relationship factory.
 */
export interface ModelHasOneFactory<T, R extends boolean>
  extends ModelComposableFactory<ModelHasOne<T, R>>, ModelRelationFactory<T, R> {
  readonly _factory: ModelHasOneFactory<this['_type'], this['_readOnly']>;
}

/**
 * Model has many relationship factory.
 */
export interface ModelHasManyFactory<T, R extends boolean>
  extends ModelComposableFactory<ModelHasMany<T, R>>, ModelRelationFactory<T, R> {
  readonly _factory: ModelHasManyFactory<this['_type'], this['_readOnly']>;
  /**
   * @deprecated Has many relations cannot be nullable.
   */
  nullable: never;
}

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
    /**
     * Sub-relations to always include.
     */
    include?: RawInclude<InferModelRelationModelFromValue<T>>;
    /**
     * Callback to customize the relation query.
     * Defining it can prevent requests merging and degrade performance.
     * If your goal is to only include relations, use `include`.
     */
    query?: AnonymousEnhancer<ConsumeModel<InferModelRelationModelFromValue<T>>, any>;
  }
  & Pick<ModelRelation<T, R>, 'path' | 'default' | 'readOnly' | 'alias' | 'sync'>;

/**
 * Model has one relation factory object options.
 *
 * @interface
 *
 * @internal
 */
export type ModelHasOneFactoryConfig<T extends object | null, R extends boolean> =
  & ModelRelationFactoryConfig<T, R>;

/**
 * Model has many relation factory object options.
 *
 * @interface
 *
 * @internal
 */
export type ModelHasManyFactoryConfig<T extends object[], R extends boolean> =
  & ModelRelationFactoryConfig<T, R>;

/**
 * Model instance read property generic hook callback function.
 *
 * @internal
 */
export type ModelInstancePropertyReadHookCallback = SyncHookCallback<{
  readonly instance: ModelInstance;
  readonly prop: ModelProp;
  readonly value: unknown;
}>;

/**
 * Model instance write property generic hook callback function.
 *
 * @internal
 */
export type ModelInstancePropertyWriteHookCallback = SyncHookCallback<{
  readonly instance: ModelInstance;
  readonly prop: ModelProp;
  readonly prev: unknown;
  readonly next: unknown;
}>;

/**
 * Model hooks definition dedicated to a model.
 *
 * @internal
 */
export type ModelHooksDefinitionForModel = {
  boot: SyncHookCallback<Model>;
};

/**
 * Model hooks definition dedicated to an instance.
 *
 * @internal
 */
export type ModelHooksDefinitionForInstance = {
  init: SyncHookCallback<ModelInstance>;
  retrieved: HookCallback<ModelInstance>;
  creating: HookCallback<ModelInstance>;
  created: HookCallback<ModelInstance>;
  updating: HookCallback<ModelInstance>;
  updated: HookCallback<ModelInstance>;
  saving: HookCallback<ModelInstance>;
  saved: HookCallback<ModelInstance>;
  destroying: HookCallback<ModelInstance>;
  destroyed: HookCallback<ModelInstance>;
};

/**
 * Model hooks definition dedicated to an instance property.
 *
 * @internal
 */
export type ModelHooksDefinitionForInstanceProperty =
  & {
    'property:reading': ModelInstancePropertyReadHookCallback;
    'property:read': ModelInstancePropertyReadHookCallback;
    'property:writing': ModelInstancePropertyWriteHookCallback;
    'property:write': ModelInstancePropertyWriteHookCallback;
  }
  & Record<`property:reading:${string}`, ModelInstancePropertyReadHookCallback>
  & Record<`property:read:${string}`, ModelInstancePropertyReadHookCallback>
  & Record<`property:writing:${string}`, ModelInstancePropertyWriteHookCallback>
  & Record<`property:write:${string}`, ModelInstancePropertyWriteHookCallback>;

/**
 * Model hooks definition.
 *
 * @internal
 */
export type ModelHooksDefinition =
  & ModelHooksDefinitionForModel
  & ModelHooksDefinitionForInstance
  & ModelHooksDefinitionForInstanceProperty;

/**
 * Model instance.
 *
 * @typeParam D Flatten definition of the model.
 *
 * @interface
 */
export type ModelInstance<D extends {} = any> =
  {
    /**
     * Model this instance was created from.
     */
    readonly $model: Model<D, ModelInstance<D>>;
    /**
     * Tells if instance exists in data source.
     * This is `true` for retrieved or saved instance.
     */
    $exists: boolean;
    /**
     * Internal values of the instance's properties.
     */
    $values: Partial<ModelValues<D>>;
    /**
     * Raw value of the data source record when available.
     */
    $raw: any | null;
    /**
     * Latest sync snapshot.
     */
    $original: ModelSnapshot<D>;
    /**
     * Tells which relation is considered to be loaded.
     *
     * @internal
     */
    $loaded: Dictionary<true>;
    /**
     * Stores the flatten definition for type resolution.
     *
     * @ignore
     */
    readonly _definition: D;
    /**
     * Stores the schema for type resolution.
     *
     * @ignore
     */
    readonly _schema: ModelSchema<D>;
  }
  & ModelProperties<D>
  & FosciaObject<typeof SYMBOL_MODEL_INSTANCE>;

/**
 * Model class.
 *
 * @typeParam D Flatten definition of the model.
 * @typeParam I Instance of the model.
 * @typeParam C Connection for the model.
 * @typeParam T Type of the model.
 *
 * @interface
 */
export type Model<
  D extends {} = any,
  I extends ModelInstance = any,
  T extends string = string,
  C extends string = string,
> =
  & {
    /**
     * Connection to use for the model.
     */
    readonly $connection: C;
    /**
     * Unique type of the model.
     */
    readonly $type: T;
    /**
     * Configuration of the model.
     * Its properties can change during the model lifecycle.
     */
    readonly $config: ModelConfig;
    /**
     * Schema of the model.
     *
     * @internal
     */
    readonly $schema: ModelSchema<D>;
    /**
     * Composables used by the model.
     *
     * @internal
     */
    readonly $composables: ModelComposable[];
    /**
     * Tells if the model definition is parsed.
     *
     * @internal
     */
    $parsed: boolean;
    /**
     * Tells if the model was already booted (constructed at least once).
     *
     * @internal
     */
    $booted: boolean;
    /**
     * Stores the flatten definition for type resolution.
     *
     * @ignore
     */
    readonly _definition: D;
    /**
     * Stores the schema for type resolution.
     *
     * @ignore
     */
    readonly _schema: ModelSchema<D>;
  }
  & Constructor<I>
  & Hookable<ModelHooksDefinition>
  & FosciaObject<typeof SYMBOL_MODEL_CLASS>;

/**
 * Model class raw config passed to the factory.
 *
 * @internal
 */
export type ModelFactoryRawConfig<
  M extends Model = Model,
  T extends string = string,
  C extends string = 'default',
> =
  | (Partial<ModelConfig<M>> & { connection?: C; type: T; })
  | `${C}:${T}`
  | T;

/**
 * Model class factory.
 *
 * @internal
 */
export type ModelFactory<
  D extends {} = {},
> = Hookable<ModelHooksDefinition> & (<
  ND extends {},
  T extends string = string,
  C extends string = 'default',
>(
  // eslint-disable-next-line max-len
  rawConfig: ModelFactoryRawConfig<Model<D & ModelParsedFlattenDefinition<ND>, ModelInstance<D & ModelParsedFlattenDefinition<ND>>, T, C>, T, C>,
  rawDefinition?: ND & ThisType<ModelInstance<D & ModelParsedFlattenDefinition<ND>>>,
  // eslint-disable-next-line max-len
) => Model<D & ModelParsedFlattenDefinition<ND>, ModelInstance<D & ModelParsedFlattenDefinition<ND>>, T, C>);

/**
 * Model instance snapshot.
 *
 * @interface
 */
export type ModelSnapshot<M = any> = {
  readonly $instance: ModelInstance;
  readonly $original: ModelSnapshot | null;
  readonly $exists: boolean;
  readonly $raw: any;
  readonly $loaded: Dictionary<true>;
  readonly $values: Partial<Readonly<ModelSnapshotValues<InferModelDefinition<M>>>>;
} & FosciaObject<typeof SYMBOL_MODEL_SNAPSHOT>;

/**
 * Model instance snapshot which only contains ID and LID
 * and is used to track related records inside a snapshot.
 *
 * @interface
 */
export type ModelLimitedSnapshot<M = any> = {
  readonly $instance: ModelInstance;
  readonly $exists: boolean;
  readonly $values: Partial<Readonly<OmitNever<{
    [K in keyof ModelSnapshotValues<InferModelDefinition<M>>]: K extends 'id' | 'lid'
      ? ModelSnapshotValues<InferModelDefinition<M>>[K]
      : never;
  }>>>;
} & FosciaObject<typeof SYMBOL_MODEL_SNAPSHOT>;

/**
 * Model class using a given composable or composable factory.
 */
export type ModelUsing<C extends ModelComposableFactory | ModelComposable> =
  Model<InferModelComposableDefinition<C>, ModelInstanceUsing<C>>;

/**
 * Model instance using a given composable or composable factory.
 */
export type ModelInstanceUsing<C extends ModelComposableFactory | ModelComposable> =
  ModelInstance<InferModelComposableDefinition<C>>;

/**
 * Parsed model definition with non-composable properties stored into
 * descriptor holders.
 *
 * @internal
 */
export type ModelParsedDefinition<D extends {}> = {
  [K in keyof D]: D[K] extends ModelComposableFactory<any> | DescriptorHolder<any, any>
    ? D[K] : DescriptorHolderOf<D, K>;
};

/**
 * Flatten non-properties composables to the definition's root.
 *
 * @internal
 */
export type ModelFlattenComposables<D extends {}> = UnionToIntersection<{} | {
  [K in keyof D]: D[K] extends ModelComposableFactory<infer C>
    ? C extends ModelProp ? never : ModelFlattenDefinition<(C & { key: K })['_type']>
    : never;
}[keyof D]>;

/**
 * Extract root properties composables or descriptors.
 *
 * @internal
 */
export type ModelRootProperties<D extends {}> = OmitNever<{
  [K in keyof D]: D[K] extends ModelComposableFactory<infer C>
    ? C extends ModelProp ? (D[K] & { key: K; }) : never : D[K];
}>;

/**
 * Flatten definition typing with non-properties composable typings resolved to
 * the definition root.
 *
 * @internal
 */
export type ModelFlattenDefinition<D extends {}> =
  & ModelFlattenComposables<D>
  & ModelRootProperties<D>;

/**
 * {@link ModelParsedDefinition | `ModelParsedDefinition`} of a model
 * {@link ModelFlattenDefinition | `ModelFlattenDefinition`}.
 *
 * @internal
 */
export type ModelParsedFlattenDefinition<D extends {}> =
  ModelParsedDefinition<ModelFlattenDefinition<D>>;

/**
 * Model real schema from definition.
 *
 * @internal
 */
export type ModelRealSchema<D extends {}> = OmitNever<{
  [K in keyof D]: D[K] extends ModelComposableFactory<infer C>
    ? C extends ModelProp ? C : never : never;
}>;

/**
 * Model default schema from definition.
 *
 * @internal
 */
export type ModelDefaultSchema<D extends {}> =
  & (ModelRealSchema<D> extends { id: any } ? {} : { id: ModelId<ModelIdType | null, false>; })
  & (ModelRealSchema<D> extends { lid: any } ? {} : { lid: ModelId<ModelIdType | null, false>; });

/**
 * Model schema from definition.
 *
 * @internal
 */
export type ModelSchema<D extends {}> =
  IfAny<D, Dictionary<ModelProp>, ModelRealSchema<D> & ModelDefaultSchema<D>>;

/**
 * Model real properties from definition.
 *
 * @internal
 */
export type ModelDefinitionRealProperties<D extends {}> = UnionToIntersection<{} | {
  [K in keyof D]: D[K] extends ModelComposableFactory<infer C> ? (C & { key: K })['_type']
    : RestoreDescriptorHolder<D[K], K>;
}[keyof D]>;

/**
 * Model default properties from definition.
 *
 * @internal
 */
export type ModelDefinitionDefaultProperties<D extends {}> =
  & (ModelRealSchema<D> extends { id: any } ? {} : { id: ModelIdType | null; })
  & (ModelRealSchema<D> extends { lid: any } ? {} : { lid: ModelIdType | null; });

/**
 * Model properties from definition.
 *
 * @internal
 */
export type ModelDefinitionProperties<D extends {}> =
  & IfAny<D, Record<string, any>, ModelDefinitionRealProperties<D>>
  & IfAny<D, {}, ModelDefinitionDefaultProperties<D>>;

/**
 * Model real snapshot values from definition.
 *
 * @internal
 */
export type ModelRealSnapshotValues<D extends {}> = OmitNever<{
  [K in keyof D]: D[K] extends ModelComposableFactory<infer C>
    ? C extends ModelRelation<infer T, any>
      ? T extends (infer I)[]
        ? (ModelLimitedSnapshot<I> | ModelSnapshot<I>)[]
        : (ModelLimitedSnapshot<T> | ModelSnapshot<T>)
      : C extends ModelProp<infer T, any>
        ? T : never : never;
}>;

/**
 * Model default snapshot values from definition.
 *
 * @internal
 */
export type ModelDefaultSnapshotValues<D extends {}> =
  & (ModelRealSchema<D> extends { id: any } ? {} : { id: ModelIdType | null; })
  & (ModelRealSchema<D> extends { lid: any } ? {} : { lid: ModelIdType | null; });

/**
 * Model snapshot values from definition.
 *
 * @internal
 */
export type ModelSnapshotValues<D extends {}> =
  IfAny<D, any, ModelRealSnapshotValues<D> & ModelDefaultSnapshotValues<D>>;

/**
 * Infer the definition from a composable or a composable factory.
 *
 * @internal
 */
export type InferModelComposableDefinition<C extends ModelComposableFactory | ModelComposable> =
  C extends ModelComposableFactory<infer T> ? T['_type']
    : C extends ModelComposable ? C['_type']
      : {};

/**
 * Infer the definition from a model class, a model instance or a definition.
 *
 * @internal
 */
export type InferModelDefinition<M> =
  M extends FosciaObject<typeof SYMBOL_MODEL_CLASS | typeof SYMBOL_MODEL_INSTANCE> & {
    readonly _definition: infer D
  } ? D extends {} ? D : never : M extends {} ? M : never;

/**
 * Infer the schema from a model class, a model instance or a definition.
 *
 * @internal
 */
export type InferModelSchema<M> =
  M extends FosciaObject<typeof SYMBOL_MODEL_CLASS | typeof SYMBOL_MODEL_INSTANCE> & {
    readonly _schema: infer D
  } ? D extends {} ? D : never : M extends {} ? ModelSchema<M> : never;

/**
 * Infer a schema property from a model class, a model instance or a definition
 * and ensure it extends the given `P` generic type.
 *
 * @internal
 */
export type InferModelSchemaProp<M, K, P extends ModelProp = ModelProp> =
  K extends keyof InferModelSchema<M>
    ? InferModelSchema<M>[K] extends P
      ? InferModelSchema<M>[K]
      : never : never;

/**
 * Model class or instance properties (IDs, attributes, relations and
 * any other custom properties or methods).
 */
export type ModelProperties<M> = ModelDefinitionProperties<InferModelDefinition<M>>;

/**
 * Model class or instance values (IDs, attributes and relations).
 *
 * @example
 * const values: Partial<ModelValues<Post>> = { title: 'Hello' };
 */
export type ModelValues<M> = Pick<ModelProperties<M>, ModelKey<M>>;

/**
 * Model class or instance values' possible keys
 * (IDs, attributes and relations).
 *
 * @example
 * const keys: ModelKey<Post>[] = ['title', 'body', 'publishedAt', 'comments'];
 */
export type ModelKey<M> =
  & string
  & keyof InferModelSchema<M>
  & keyof ModelProperties<M>;

/**
 * Model class or instance values' possible keys that are not readonly
 * (IDs, attributes and relations).
 *
 * @example
 * const keys: ModelWritableKey<Post>[] = ['title', 'body', 'comments'];
 */
export type ModelWritableKey<M> = ModelKey<M> & {
  [K in keyof InferModelSchema<M>]: InferModelSchema<M>[K] extends ModelProp<any, false>
    ? K
    : never;
}[keyof InferModelSchema<M>];

/**
 * Model class or instance direct relations' possible keys.
 *
 * @example
 * const keys: ModelRelationKey<Post>[] = ['comments', 'tags'];
 */
export type ModelRelationKey<M> = ModelKey<M> & {
  [K in keyof InferModelSchema<M>]: InferModelSchema<M>[K] extends ModelRelation
    ? K
    : InferModelSchema<M>[K] extends ModelProp<infer T>
      ? IfAny<T, K, never>
      : never;
}[keyof InferModelSchema<M>];

/**
 * Model class or instance direct relations' possible keys, possibly chained
 * using a dot (`.`) to their related models direct or deeper relations' keys.
 *
 * @example
 * const keys: ModelRelationDotKey<Post>[] = ['comments', 'comments.author', 'tags'];
 */
export type ModelRelationDotKey<M, Depth extends number = 5> =
  [Depth] extends [0]
    ? never
    : ModelKey<M> extends infer K
      ? K extends ModelKey<M>
        ? InferModelSchema<M>[K] extends never
          ? never
          : InferModelSchema<M>[K] extends ModelRelation<infer T, any>
            ? K | `${K}.${ModelRelationDotKey<T extends any[] ? T[number] : T, Prev[Depth]>}`
            : InferModelSchema<M>[K] extends ModelProp<infer T, any>
              ? IfAny<T, K, never>
              : never : never : never;
