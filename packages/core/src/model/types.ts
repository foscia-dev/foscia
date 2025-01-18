import { Hookable, HookCallback, SyncHookCallback } from '@foscia/core/hooks/types';
import {
  SYMBOL_MODEL_CLASS,
  SYMBOL_MODEL_COMPOSABLE,
  SYMBOL_MODEL_INSTANCE,
  SYMBOL_MODEL_PROP,
  SYMBOL_MODEL_PROP_FACTORY,
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
  Dictionary,
  FosciaObject,
  OmitNever,
  Optional,
  Prev,
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
  compareValues: (nextValue: unknown, prevValue: unknown) => boolean;
  /**
   * Clone a property value when creating a snapshot.
   * Defaults to {@link cloneModelValue | `cloneModelValue`}.
   *
   * @param value
   */
  cloneValue: <T>(value: T) => T;
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
 * Model composable which can be included on any model definition.
 *
 * @typeParam D Definition of the composable.
 *
 * @internal
 */
export type ModelComposable<D extends {} = any> =
  & {
    /**
     * Definition of the composable.
     *
     * @internal
     */
    readonly def: D;
  }
  & FosciaObject<typeof SYMBOL_MODEL_COMPOSABLE>
  & Hookable<ModelHooksDefinition>;

/**
 * Model instance ID default typing.
 */
export type ModelIdType = string | number;

/**
 * Factory for a model property.
 *
 * @typeParam P Model property created by the factory.
 *
 * @internal
 */
export type ModelPropFactory<P extends ModelProp<any> = ModelProp<any>> =
  & {
    /**
     * Create the model property for a model and key.
     */
    readonly make: (parent: Model, key: string) => P;
  }
  & FosciaObject<typeof SYMBOL_MODEL_PROP_FACTORY>;

/**
 * Model property appended to a model schema.
 *
 * @internal
 */
export type ModelProp<K = string, T = any, R extends boolean = boolean> =
  & {
    /**
     * Boot the property before it is appended to a model schema.
     * At this step, the model schema is not complete and should not be accessed.
     */
    readonly boot?: (model: Model) => void;
    /**
     * Bind the property to the given instance.
     * Usually, this will use `Object.defineProperty` to configure
     * the property behavior.
     */
    readonly bind?: (instance: ModelInstance) => void;
    /**
     * The model the property is attached to.
     */
    readonly parent: Model;
    /**
     * The key the property uses in the model schema and instances.
     */
    readonly key: K;
    /**
     * The type the property's value is of.
     * This is a generic type annotation only property and should not be accessed.
     *
     * @internal
     */
    readonly __type__: T;
    /**
     * Tells if the property is read-only.
     * This is a generic type annotation only property and should not be accessed.
     *
     * @internal
     */
    readonly __readOnly__: R;
  }
  & FosciaObject<typeof SYMBOL_MODEL_PROP>;

/**
 * Sync configuration for a property. `pull` means the property is only retrieved
 * from the data source and never send to it. `push` is the opposite.
 *
 * @internal
 */
export type ModelPropSync = 'pull' | 'push';

/**
 * Model property which holds a value that can be exchanged with the data source.
 *
 * @internal
 */
export type ModelValueProp<
  K = string,
  T = unknown,
  R extends boolean = boolean,
> =
  & {
    /**
     * Tells if the property is read-only.
     */
    readonly readOnly?: R;
    /**
     * Default value for the property.
     */
    default?: T | (() => T) | undefined;
    /**
     * Alias of the property (might be used when (de)serializing).
     */
    alias?: string | undefined;
    /**
     * Tells if the property should be synced with the data store.
     */
    sync?: boolean | ModelPropSync;
  }
  & ModelProp<K, T, R>;

/**
 * Model ID property definition.
 */
export type ModelId<K = string, T extends ModelIdType | null = any, R extends boolean = boolean> =
  {
    /**
     * Type of property.
     *
     * @internal
     */
    readonly $VALUE_PROP_TYPE: typeof SYMBOL_MODEL_PROP_KIND_ID;
    transformer?: ObjectTransformer<T | null>;
  }
  & ModelValueProp<K, T, R>;

/**
 * Model attribute property definition.
 */
export type ModelAttribute<K = string, T = any, R extends boolean = boolean> =
  {
    /**
     * Type of property.
     *
     * @internal
     */
    readonly $VALUE_PROP_TYPE: typeof SYMBOL_MODEL_PROP_KIND_ATTRIBUTE;
    transformer?: ObjectTransformer<T | null>;
  }
  & ModelValueProp<K, T, R>;

/**
 * Available model relation types.
 *
 * @internal
 */
export type ModelRelationType =
  | typeof SYMBOL_MODEL_RELATION_HAS_ONE
  | typeof SYMBOL_MODEL_RELATION_HAS_MANY;

/**
 * Configuration of a model's relation.
 *
 * @internal
 */
export type ModelRelationConfig = {
  /**
   * The related type(s) to help Foscia resolving related models.
   */
  type?: string | string[];

  // Specific HTTP config.

  /**
   * The path to use when requesting relation's endpoint.
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  path?: string;
};

/**
 * Model sync relation property definition.
 */
export type ModelRelation<K = string, T = any, R extends boolean = boolean> =
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
    model?: () => Awaitable<Model | Model[]>;
  }
  & ModelRelationConfig
  & ModelValueProp<K, T, R>;

/**
 * Infer a model's property type from the property definition.
 *
 * @internal
 */
export type InferModelValuePropType<P> = P extends ModelValueProp<any, infer T> ? T : never;

/**
 * The parsed model definition with non composables/attributes/relations
 * properties' descriptors wrapped in holders.
 *
 * @internal
 */
export type ModelParsedDefinition<D extends {} = {}> = {
  [K in keyof D]: D[K] extends ModelComposable | ModelPropFactory | DescriptorHolder<any>
    ? D[K] : DescriptorHolder<D[K]>
};

/**
 * The flatten and parsed model definition with composables properties
 * flattened to the definition root.
 *
 * @internal
 */
export type ModelFlattenDefinition<D extends {}> =
  & UnionToIntersection<{} | {
    [K in keyof D]: D[K] extends ModelComposable<infer CD>
      ? ModelFlattenDefinition<CD> : never;
  }[keyof D]>
  & OmitNever<{ [K in keyof D]: D[K] extends ModelComposable ? never : D[K] }>;

/**
 * The flatten and parsed model definition from a composable object type.
 *
 * @internal
 */
export type ModelDefinitionFromComposable<C extends ModelComposable<C>> = ModelFlattenDefinition<{
  __composable__: C;
}>;

/**
 * Extract model's properties from definition factories.
 *
 * @internal
 */
export type ModelSchema<D extends {} = {}> = {
  readonly [K in keyof D]: D[K] extends ModelPropFactory<infer P>
    ? P & { key: K; } : never;
};

/**
 * Model instance read property generic hook callback function.
 *
 * @internal
 */
export type ModelInstancePropertyReadHookCallback = SyncHookCallback<{
  readonly instance: ModelInstance;
  readonly def: ModelValueProp;
  readonly value: unknown;
}>;

/**
 * Model instance write property generic hook callback function.
 *
 * @internal
 */
export type ModelInstancePropertyWriteHookCallback = SyncHookCallback<{
  readonly instance: ModelInstance;
  readonly def: ModelValueProp;
  readonly prev: unknown;
  readonly next: unknown;
}>;

/**
 * Model's hooks definition dedicated to a model.
 *
 * @internal
 */
export type ModelHooksDefinitionForModel = {
  boot: SyncHookCallback<Model>;
};

/**
 * Model's hooks definition dedicated to an instance.
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
 * Model's hooks definition dedicated to an instance property.
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
 * Model's hooks definition.
 *
 * @internal
 */
export type ModelHooksDefinition =
  & ModelHooksDefinitionForModel
  & ModelHooksDefinitionForInstance
  & ModelHooksDefinitionForInstanceProperty;

/**
 * Model class.
 *
 * @typeParam D Definition of the model.
 * @typeParam I Instance of the model.
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
     * It is parsed once on first property get (usually on first constructor call)
     * and will be cached afterward. It should not be updated afterward.
     */
    readonly $schema: ModelSchema<D>;
    /**
     * Composables used by the model.
     *
     * @internal
     */
    readonly $composables: ModelComposable[];
    /**
     * Tells if the model was already booted (constructed at least once).
     *
     * @internal
     */
    $booted: boolean;
  }
  & Constructor<I>
  & Hookable<ModelHooksDefinition>
  & FosciaObject<typeof SYMBOL_MODEL_CLASS>;

/**
 * Model class using a given composable.
 */
export type ModelUsing<C extends ModelComposable> =
  Model<ModelDefinitionFromComposable<C>, ModelInstanceUsing<C>>;

/**
 * Model class which can be configured or extended.
 *
 * @internal
 */
export type ExtendableModel<D extends {} = any, I extends ModelInstance<D> = any> =
  & {
    /**
     * Create a new model class with an extended configuration.
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
      // eslint-disable-next-line max-len
      rawDefinition?: ND & ThisType<ModelInstance<D & ModelFlattenDefinition<ModelParsedDefinition<ND>>>>,
      // eslint-disable-next-line max-len
    ): ExtendableModel<D & ModelFlattenDefinition<ModelParsedDefinition<ND>>, ModelInstance<D & ModelFlattenDefinition<ModelParsedDefinition<ND>>>>;
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
  // eslint-disable-next-line max-len
  rawDefinition?: ND & ThisType<ModelInstance<D & ModelFlattenDefinition<ModelParsedDefinition<ND>>>>,
  // eslint-disable-next-line max-len
) => ExtendableModel<D & ModelFlattenDefinition<ModelParsedDefinition<ND>>, ModelInstance<D & ModelFlattenDefinition<ModelParsedDefinition<ND>>>>);

/**
 * Model defaults IDs typing when not defined by definition.
 *
 * @internal
 */
export type ModelIdsDefaults<D extends {}> =
  & (D extends { id: any } ? {} : { id: ModelIdType | null })
  & (D extends { lid: any } ? {} : { lid: ModelIdType | null });

/**
 * Model properties map (IDs/attributes/relations/custom props).
 *
 * @internal
 */
export type ModelDefinitionProperties<D extends {}> = ModelIdsDefaults<D> & {
  [K in keyof D]: D[K] extends ModelPropFactory<ModelProp<any, infer T, any>>
    ? T : D[K] extends DescriptorHolder<infer T>
      ? T : D[K];
};

/**
 * Model properties key (only writable IDs/attributes/relations).
 *
 * @internal
 */
export type ModelDefinitionWritableKey<D extends {}> = {
  [K in keyof D]: D[K] extends DescriptorHolder<any>
    ? never
    : D[K] extends ModelPropFactory<ModelValueProp<any, any, false>> ? K : never;
}[keyof D] | keyof ModelIdsDefaults<D>;

/**
 * Model properties key (only readonly IDs/attributes/relations).
 *
 * @internal
 */
export type ModelDefinitionReadOnlyKey<D extends {}> = {
  [K in keyof D]: D[K] extends DescriptorHolder<any>
    ? never
    : D[K] extends ModelPropFactory<ModelValueProp<any, any, true>> ? K : never;
}[keyof D];

/**
 * Model descriptors key (only custom properties).
 *
 * @internal
 */
export type ModelDefinitionDescriptorKey<D extends {}> = {
  [K in keyof D]: D[K] extends DescriptorHolder<any> ? K : never;
}[keyof D];

/**
 * Model properties map (only writable IDs/attributes/relations).
 *
 * @internal
 */
export type ModelDefinitionWritableValues<D extends {}> =
  Pick<ModelDefinitionProperties<D>, ModelDefinitionWritableKey<D>>;

/**
 * Model properties map (only readonly IDs/attributes/relations).
 *
 * @internal
 */
export type ModelDefinitionReadOnlyValues<D extends {}> =
  Readonly<Pick<ModelDefinitionProperties<D>, ModelDefinitionReadOnlyKey<D>>>;

/**
 * Model properties map (IDs/attributes/relations).
 *
 * @internal
 */
export type ModelDefinitionValues<D extends {}> =
  & ModelDefinitionWritableValues<D>
  & ModelDefinitionReadOnlyValues<D>;

/**
 * Model values map for a snapshot (IDs/attributes/relations).
 *
 * @internal
 */
export type ModelSnapshotDefinitionValues<D extends {}> = ModelIdsDefaults<D> & {
  [K in keyof D]: D[K] extends ModelPropFactory<ModelRelation<any, infer T, any>>
    ? T extends (infer I)[]
      ? (ModelLimitedSnapshot<I> | ModelSnapshot<I>)[]
      : (ModelLimitedSnapshot<T> | ModelSnapshot<T>)
    : D[K] extends ModelPropFactory<ModelProp<any, infer T, any>>
      ? T
      : D[K] extends ModelPropFactory<ModelProp<any, any, any>> ? any : never;
};

/**
 * Model values map for a limited snapshot (IDs/attributes/relations).
 *
 * @internal
 */
export type ModelLimitedSnapshotDefinitionValues<D extends {}> = ModelIdsDefaults<D> & {
  [K in keyof ModelSnapshotDefinitionValues<D>]: K extends 'id' | 'lid'
    ? ModelSnapshotDefinitionValues<D>[K] : never;
};

/**
 * Model descriptors map (only custom properties).
 *
 * @internal
 */
export type ModelDefinitionDescriptors<D extends {}> =
  Pick<ModelDefinitionProperties<D>, ModelDefinitionDescriptorKey<D>>;

/**
 * Model instance holding state and values.
 *
 * @typeParam D Definition of the model instance.
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
     * Tells which relation is considered to be loaded.
     */
    $loaded: Dictionary<true>;
    /**
     * Internal values of the instance's properties.
     */
    $values: Partial<ModelValues<D>>;
    /**
     * Raw value of the data source record.
     */
    $raw: any;
    /**
     * Latest synced snapshot.
     */
    $original: ModelSnapshot<D>;
  }
  & ModelDefinitionValues<D>
  & ModelDefinitionDescriptors<D>
  & FosciaObject<typeof SYMBOL_MODEL_INSTANCE>;

/**
 * Model instance using a given composable.
 */
export type ModelInstanceUsing<C extends ModelComposable> =
  ModelInstance<ModelDefinitionFromComposable<C>>;

/**
 * Model instance snapshot which only contains ID and LID
 * and is used to track related records inside a snapshot.
 */
export type ModelLimitedSnapshot<M = any> = {
  readonly $instance: ModelInstance;
  readonly $exists: boolean;
  readonly $values: Partial<Readonly<ModelLimitedSnapshotValues<M>>>;
} & FosciaObject<typeof SYMBOL_MODEL_SNAPSHOT>;

/**
 * Model instance snapshot.
 */
export type ModelSnapshot<M = any> = {
  readonly $instance: ModelInstance;
  readonly $original: ModelSnapshot | null;
  readonly $exists: boolean;
  readonly $raw: any;
  readonly $loaded: Dictionary<true>;
  readonly $values: Partial<Readonly<ModelSnapshotValues<M>>>;
} & FosciaObject<typeof SYMBOL_MODEL_SNAPSHOT>;

/**
 * Infer the definition from a model class or model instance.
 *
 * @internal
 */
export type InferModelDefinition<M> = M extends Model<infer D>
  ? D : M extends ModelInstance<infer D> ? D
    : M extends {}
      ? M
      : never;

/**
 * Infer the schema from a model class or model instance.
 *
 * @internal
 */
export type InferModelSchema<M> = ModelSchema<InferModelDefinition<M>>;

/**
 * Infer a schema property from a model class or model instance
 * and ensure it extends the given `P` generic type.
 *
 * @internal
 */
export type InferModelSchemaProp<M, K, P extends ModelProp = ModelProp> =
  K extends keyof ModelSchema<InferModelDefinition<M>>
    ? ModelSchema<InferModelDefinition<M>>[K] extends P
      ? ModelSchema<InferModelDefinition<M>>[K]
      : never : never;

/**
 * Model snapshot values map (only IDs/attributes/relations).
 */
export type ModelSnapshotValues<M> = ModelSnapshotDefinitionValues<InferModelDefinition<M>>;

/**
 * Model limited snapshot values map (only IDs).
 */
export type ModelLimitedSnapshotValues<
  M,
> = ModelLimitedSnapshotDefinitionValues<InferModelDefinition<M>>;

/**
 * Model class or instance values map (only IDs/attributes/relations).
 */
export type ModelValues<M> = ModelDefinitionValues<InferModelDefinition<M>>;

/**
 * Model class or instance values map (only writable IDs/attributes/relations).
 */
export type ModelWritableValues<M> = ModelDefinitionWritableValues<InferModelDefinition<M>>;

/**
 * Model class or instance values map (only readonly IDs/attributes/relations).
 */
export type ModelReadOnlyValues<M> = ModelDefinitionReadOnlyValues<InferModelDefinition<M>>;

/**
 * Model class or instance IDs/attributes/relations key.
 */
export type ModelKey<M> =
  & string
  & keyof InferModelSchema<M>
  & keyof ModelValues<M>;

/**
 * Model class or instance relations key (only direct relations).
 *
 * @example
 * const keys: ModelRelationKey<Post>[] = ['comments', 'tags'];
 */
export type ModelRelationKey<M> =
  keyof InferModelSchema<M> extends infer K
    ? K extends ModelKey<M>
      ? InferModelSchema<M>[K] extends never
        ? never
        : InferModelSchema<M>[K] extends ModelRelation<K>
          ? K
          : InferModelSchema<M>[K] extends ModelProp<K, infer T>
            ? 0 extends (1 & T) ? K
              : never : never : never : never;

/**
 * Model class or instance relations key (supports nested relation using dot separator).
 *
 * @example
 * const keys: ModelRelationDotKey<Post>[] = ['comments', 'comments.author', 'tags'];
 */
export type ModelRelationDotKey<M, Depth extends number = 5> =
  [Depth] extends [0]
    ? never
    : keyof InferModelSchema<M> extends infer K
      ? K extends ModelKey<M>
        ? InferModelSchema<M>[K] extends never
          ? never
          : InferModelSchema<M>[K] extends ModelRelation<K, infer T>
            ? T extends any[]
              ? K | `${K}.${ModelRelationDotKey<T[number], Prev[Depth]>}`
              : K | `${K}.${ModelRelationDotKey<T, Prev[Depth]>}`
            : InferModelSchema<M>[K] extends ModelProp<K, infer T>
              ? 0 extends (1 & T) ? K : never
              : never : never : never;
