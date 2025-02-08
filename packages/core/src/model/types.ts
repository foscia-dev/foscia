import { Hookable, HookCallback, SyncHookCallback } from '@foscia/core/hooks/types';
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
  Awaitable,
  Constructor,
  DescriptorHolder,
  DescriptorHolderOf,
  Dictionary,
  FosciaObject,
  IfAny,
  OmitNever,
  Optional,
  Prev,
  RestoreDescriptorHolder,
  Transformer,
  UnionToIntersection,
} from '@foscia/shared';

/**
 * Configuration of a model class.
 *
 * @internal
 */
export type ModelConfig = {
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
   * Guess a related type from a relation definition.
   * Defaults is to use the relation name (and pluralize it if it is a "to one"
   * relation).
   */
  guessRelationType?: Transformer<ModelRelation, string>;
  /**
   * Guess a relation inverse.
   * Defaults is to use the model type (and singularize it if it is a "to many"
   * relation).
   */
  guessRelationInverse?: Transformer<ModelRelation, string[] | string>;
  /**
   * Guess alias from a property's name.
   * Defaults is to keep the property's name.
   */
  guessAlias?: Transformer<string>;
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

  // Specific HTTP config.

  /**
   * Define the base URL to use.
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  baseURL?: Optional<string>;
  /**
   * Define the path to use.
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  path?: Optional<string>;
  /**
   * Guess the path from the model type.
   * Defaults to the model type.
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  guessPath?: Transformer<string>;
  /**
   * Guess the ID path from the model ID.
   * Defaults to converting the ID to string.
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  guessIdPath?: Transformer<ModelIdType>;
  /**
   * Guess the relation path from the relation definition.
   * Defaults to the relation name.
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  guessRelationPath?: Transformer<ModelRelation, string>;
};

/**
 * Model composable which adds features and typings to a model.
 *
 * @interface
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
   */
  readonly parent: Model;
  /**
   * The key the composable is bind to.
   */
  readonly key: string;
  /**
   * Init the composable to a parent model's instance.
   */
  readonly init?: (instance: ModelInstance) => void;
  /**
   * Stores the composable typing for type resolution.
   *
   * @internal
   */
  readonly _type: {};
}

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
  readonly readOnly?: R;

  readonly _type: R extends false ? Record<this['key'], T> : Readonly<Record<this['key'], T>>;
}

/**
 * Model value property stored inside the instance internal values.
 *
 * @interface
 *
 * @internal
 */
export type ModelValueProp<T = any, R extends boolean = boolean> =
  & {
    /**
     * Default value for the property.
     */
    default?: T | (() => T) | undefined;
  }
  & ModelProp<T, R>;

/**
 * Model assembled/memoized property.
 *
 * @interface
 *
 * @since 0.13.0
 * @experimental
 */
export type ModelAssembled<T = any, R extends boolean = boolean> =
  & {
    /**
     * Tells if the assembled property getter is memoized (enabled by default).
     */
    memo?: boolean;
  }
  & ModelProp<T, R>;

/**
 * Model ID property.
 *
 * @interface
 */
export type ModelId<T extends ModelIdType | null = any, R extends boolean = boolean> =
  {
    /**
     * Type of property.
     *
     * @internal
     */
    readonly $VALUE_PROP_TYPE: typeof SYMBOL_MODEL_PROP_KIND_ID;
    transformer?: ObjectTransformer<T | null>;
  }
  & ModelValueProp<T, R>;

/**
 * Model attribute property.
 *
 * @interface
 */
export type ModelAttribute<T = any, R extends boolean = boolean> =
  {
    /**
     * Type of property.
     *
     * @internal
     */
    readonly $VALUE_PROP_TYPE: typeof SYMBOL_MODEL_PROP_KIND_ATTRIBUTE;
    transformer?: ObjectTransformer<T | null>;
  }
  & ModelValueProp<T, R>;

/**
 * Available model relation types.
 *
 * @internal
 */
export type ModelRelationType =
  | typeof SYMBOL_MODEL_RELATION_HAS_ONE
  | typeof SYMBOL_MODEL_RELATION_HAS_MANY;

/**
 * Model relation property.
 *
 * @interface
 */
export type ModelRelation<T = any, R extends boolean = boolean> =
  {
    /**
     * Type of property.
     *
     * @internal
     */
    readonly $VALUE_PROP_TYPE: typeof SYMBOL_MODEL_PROP_KIND_RELATION;
    /**
     * Type of relation.
     *
     * @internal
     */
    readonly $RELATION_TYPE: ModelRelationType;
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

    // Specific HTTP config.

    /**
     * The path to use when requesting relation's endpoint.
     *
     * @remarks
     * This is specific to HTTP implementations (REST, JSON:API).
     */
    path?: string;
  }
  & ModelValueProp<T, R>;

/**
 * Model instance read property generic hook callback function.
 *
 * @internal
 */
export type ModelInstancePropertyReadHookCallback = SyncHookCallback<{
  readonly instance: ModelInstance;
  readonly def: ModelProp;
  readonly value: unknown;
}>;

/**
 * Model instance write property generic hook callback function.
 *
 * @internal
 */
export type ModelInstancePropertyWriteHookCallback = SyncHookCallback<{
  readonly instance: ModelInstance;
  readonly def: ModelProp;
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
     * @internal
     */
    readonly _definition: D;
    /**
     * Stores the schema for type resolution.
     *
     * @internal
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
 *
 * @interface
 */
export type Model<D extends {} = any, I extends ModelInstance<D> = any> =
  & {
    /**
     * Unique type of the model.
     */
    readonly $type: string;
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
     * @internal
     */
    readonly _definition: D;
    /**
     * Stores the schema for type resolution.
     *
     * @internal
     */
    readonly _schema: ModelSchema<D>;
  }
  & Constructor<I>
  & Hookable<ModelHooksDefinition>
  & FosciaObject<typeof SYMBOL_MODEL_CLASS>;

/**
 * Model class which can be configured or extended to another model.
 *
 * @internal
 */
export type ExtendableModel<D extends {} = any, I extends ModelInstance<D> = any> =
  & {
    /**
     * Create a new model class with an overwritten configuration.
     *
     * @param config
     * @param override
     */
    configure(
      config: Partial<ModelConfig>,
      override?: boolean,
    ): ExtendableModel<D, ModelInstance<D>>;
    /**
     * Create a new model class with an extended definition.
     *
     * @param rawDefinition
     */
    extend<ND extends {} = {}>(
      rawDefinition?: ND & ThisType<ModelInstance<D & ModelParsedFlattenDefinition<ND>>>,
      // eslint-disable-next-line max-len
    ): ExtendableModel<D & ModelParsedFlattenDefinition<ND>, ModelInstance<D & ModelParsedFlattenDefinition<ND>>>;
  }
  & Model<D, I>;

/**
 * Model class factory.
 *
 * @internal
 */
export type ModelFactory<
  D extends {} = {},
> = Hookable<ModelHooksDefinition> & (<ND extends {}>(
  rawConfig: string | (Partial<ModelConfig> & { type: string; }),
  rawDefinition?: ND & ThisType<ModelInstance<D & ModelParsedFlattenDefinition<ND>>>,
  // eslint-disable-next-line max-len
) => ExtendableModel<D & ModelParsedFlattenDefinition<ND>, ModelInstance<D & ModelParsedFlattenDefinition<ND>>>);

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
