import type { AnonymousEnhancer, ConsumeModel } from '@foscia/core/actions/types';
import { Hookable, HookCallback, SyncHookCallback } from '@foscia/core/hooks/types';
import {
  SYMBOL_MODEL_CLASS,
  SYMBOL_MODEL_INSTANCE,
  SYMBOL_MODEL_PROP,
  SYMBOL_MODEL_PROP_ATTRIBUTE,
  SYMBOL_MODEL_PROP_FOREIGN,
  SYMBOL_MODEL_PROP_ID,
  SYMBOL_MODEL_PROP_PRIMARY,
  SYMBOL_MODEL_PROP_RELATION,
  SYMBOL_MODEL_RELATION_BELONGS_TO,
  SYMBOL_MODEL_RELATION_HAS_MANY,
  SYMBOL_MODEL_RELATION_HAS_ONE,
  SYMBOL_MODEL_RELATION_MORPH_MANY,
  SYMBOL_MODEL_RELATION_MORPH_ONE,
  SYMBOL_MODEL_RELATION_MORPH_TO,
  SYMBOL_MODEL_SNAPSHOT,
} from '@foscia/core/symbols';
import type { ObjectTransformer } from '@foscia/core/transformers/types';
import {
  Arrayable,
  Awaitable,
  BrandedValue,
  Constructor,
  Dictionary,
  FosciaObject,
  IfAny,
  IfEquals,
  OmitNever,
  Prev,
  UnbrandValue,
  UnionToIntersection,
} from '@foscia/shared';

/**
 * Model instance ID default typing.
 *
 * TODO REMOVE
 */
export type ModelIdType = string | number;

/**
 * Model instance primary value default typing.
 */
export type ModelPrimaryType = string | number;

/**
 * Model instance primary value.
 */
export type ModelPrimary<T = any> = BrandedValue<'primary', UnbrandValue<T>>;

/**
 * Model instance foreign value.
 */
export type ModelForeign<T = any> = BrandedValue<'foreign', UnbrandValue<T>>;

/**
 * Model instance relation value.
 */
export type ModelRelation<T = any> = BrandedValue<'relation', UnbrandValue<T>>;

/**
 * Model instance primary values as a dictionary to support multi-primary models.
 */
export type ModelPrimaryDictionary = Dictionary<ModelPrimaryType | null | undefined>;

/**
 * Sync configuration for a property:
 * - `pull` means the property is only retrieved from the data source and never send to it.
 * - `push` is the opposite.
 *
 * @internal
 */
export type ModelPropSync = 'pull' | 'push';

/**
 * Model scope to apply on a model query.
 *
 * @internal
 */
export type ModelScope<Instance extends object> =
  AnonymousEnhancer<ConsumeModel<Model<Instance>>, any>;

/**
 * Configuration of a model class.
 *
 * @internal
 */
export type ModelConfig<Instance extends object> = {
  /**
   * Scopes to always apply to query.
   *
   * @remarks
   * Scopes can be omitted using `withoutScopes` option on queries.
   */
  scopes?: ModelScope<Instance>[];
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
   * Guess alias from a property's name.
   * Defaults is to keep the property's name.
   */
  guessAlias?: (prop: ModelProp) => string;
  /**
   * Guess a related type from a relation.
   * Defaults is to use the relation name (and pluralize it if it is a "to one"
   * relation).
   */
  guessRelationType?: (relation: ModelRelationProp) => string;
  /**
   * Guess a relation inverse.
   * Defaults is to use the model type (and singularize it if it is a "to many"
   * relation).
   */
  guessRelationInverse?: (relation: ModelRelationProp) => string | string[];
  /**
   * Compare two properties values when comparing snapshots.
   * Defaults to {@link compareModelValues | `compareModelValues`}.
   *
   * @param nextValue
   * @param prevValue
   *
   * @deprecated Use `isSameSnapshotValue` instead.
   */
  compareSnapshotValues: (nextValue: unknown, prevValue: unknown) => boolean;
  /**
   * Compare two properties values when comparing snapshots.
   * Defaults to {@link compareModelValues | `compareModelValues`}.
   *
   * @param nextValue
   * @param prevValue
   */
  isSameSnapshotValue: (nextValue: unknown, prevValue: unknown) => boolean;
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
  // TODO Dynamic typing from instance.
  // TODO Support multiple primary.
  guessIdPath?: (id: ModelIdType) => ModelIdType;
  /**
   * Guess the relation path from the relation.
   * Defaults to the relation name.
   *
   * @remarks
   * This is specific to HTTP implementations (REST, JSON:API).
   */
  guessRelationPath?: (relation: ModelRelationProp) => string;
};

/**
 * Model class decorator factory.
 *
 * @internal
 */
export type ModelClassDecoratorFactory<
  SharedComposable extends ModelComposableDecorator<Constructor> = never,
> =
  & {
    /**
     * Create a model class decorator with given type, configuration and composables.
     *
     * @param dedicatedConfig
     * @param dedicatedComposables
     */<
      Class extends Constructor,
      DedicatedComposable extends ModelComposableDecorator<Class> = never,
    >(
      dedicatedConfig?: string | Partial<{
        /**
         * Dedicated connection to use for model.
         */
        connection: string;
        /**
         * Explicit type to use for model.
         */
        type: string;
        // eslint-disable-next-line max-len
      } & ModelConfig<ModelInstanceUsing<SharedComposable | DedicatedComposable, InstanceType<Class>>>>,
      dedicatedComposables?: DedicatedComposable[],
    ): ModelClassDecorator<SharedComposable | DedicatedComposable, Class>;
    /**
     * Create a model class decorator with given composables.
     *
     * @param dedicatedComposables
     */<
      Class extends Constructor,
      DedicatedComposable extends ModelComposableDecorator<Class> = never,
    >(
      dedicatedComposables: DedicatedComposable[],
    ): ModelClassDecorator<SharedComposable | DedicatedComposable, Class>;
    /**
     * Create a base model class to extend with given composables.
     *
     * @param composables
     *
     * @remarks
     * In the future, when TypeScript will support class decorator mutation
     * (see https://github.com/Microsoft/TypeScript/issues/4881), this function
     * will be removed to improve developers experience. Decorators typings
     * and internal behaviors are already ready for it.
     */
    base<
      DedicatedComposable extends ModelComposableDecorator<ModelUsing<SharedComposable>> = never,
    >(
      composables?: DedicatedComposable[],
    ): ModelUsing<SharedComposable | DedicatedComposable>;
  }
  & Hookable<ModelHooksDefinition>;

/**
 * Model class decorator.
 *
 * @internal
 */
export type ModelClassDecorator<
  Composable extends ModelComposableDecorator,
  Class extends Constructor,
> = (
  target: Class,
  context?: ClassDecoratorContext<Class>,
) => ModelUsing<Composable, Class>;

/**
 * Model composable decorator.
 *
 * @internal
 */
export type ModelComposableDecorator<Class extends Constructor<any> = any> = (
  target: Class,
  context?: ClassDecoratorContext<Class>,
) => Constructor;

/**
 * Model composable decorator with hooks support.
 *
 * @internal
 */
export type ModelComposable<
  Composable extends ModelComposableDecorator = ModelComposableDecorator,
> =
  & Composable
  & Hookable<ModelHooksDefinition>;

/**
 * Model property decorator.
 *
 * @internal
 */
export type ModelPropDecorator<This extends object, T> = (
  target: undefined,
  context: ClassFieldDecoratorContext<This, T> & { name: string; static: false; private: false; },
) => void;

/**
 * Model property.
 *
 * @interface
 *
 * @internal
 */
export interface ModelProp<
  T = any,
  This extends object = any,
  Kind extends symbol = any,
> extends FosciaObject<typeof SYMBOL_MODEL_PROP>, ModelPropFeatures<T> {
  /**
   * Type of model property.
   *
   * @internal
   */
  readonly kind: Kind;
  /**
   * The model the property is attached to.
   */
  readonly parent: Model<This>;
  /**
   * The key the property is attached to.
   */
  readonly key: ModelKey<This>;
  /**
   * Get the property value from instance's internal values.
   */
  readonly get: (instance: This) => T;
  /**
   * Set the property value on instance's internal values.
   */
  readonly set: (instance: This, next: T) => void;
  /**
   * Unset the property value on instance's internal values.
   */
  readonly unset: (instance: This) => void;
}

/**
 * Infer a model property type.
 *
 * @internal
 */
export type InferModelPropType<P extends ModelProp> = ReturnType<P['get']>;

/**
 * Model transformable property.
 *
 * @internal
 */
export interface ModelTransformableProp<T, Deserialized, Serialized> {
  /**
   * Transformer of the property.
   */
  transformer?: ObjectTransformer<T, Deserialized, Serialized>;
}

/**
 * Model aliasable property.
 *
 * @internal
 */
export interface ModelAliasableProp {
  /**
   * Alias of the property.
   */
  alias?: string | undefined;
}

/**
 * Model syncable property.
 *
 * @internal
 */
export interface ModelSyncableProp {
  /**
   * Tells if the property should be synced with the data store.
   */
  sync?: boolean | ModelPropSync;
}

export type ModelPropFeatures<T = any> =
  & ModelSyncableProp
  & ModelAliasableProp
  & ModelTransformableProp<T, unknown, unknown>;

/**
 * Model property configuration.
 *
 * @internal
 */
export type ModelPropConfig<P extends ModelProp> =
  Omit<P, keyof Omit<ModelProp, keyof ModelPropFeatures>>;

/**
 * Model ID property.
 *
 * @interface
 *
 * @internal
 *
 * TODO REMOVE
 */
export type ModelId<
  T = any,
  This extends ModelInstance = any,
> =
  & ModelProp<T, This, typeof SYMBOL_MODEL_PROP_ID>;

/**
 * Model primary property.
 *
 * @interface
 *
 * @internal
 */
export type ModelPrimaryProp<
  T = any,
  This extends object = any,
> = ModelProp<T, This, typeof SYMBOL_MODEL_PROP_PRIMARY>;

/**
 * Model foreign property.
 *
 * @interface
 *
 * @internal
 */
export type ModelForeignProp<
  T = any,
  This extends object = any,
> = ModelProp<T, This, typeof SYMBOL_MODEL_PROP_FOREIGN>;

/**
 * Model attribute property.
 *
 * @interface
 *
 * @internal
 */
export type ModelAttributeProp<
  T = any,
  This extends object = any,
> = ModelProp<T, This, typeof SYMBOL_MODEL_PROP_ATTRIBUTE>;

/**
 * Model relation property.
 *
 * @interface
 *
 * @internal
 */
export type ModelRelationProp<
  T extends Arrayable<ModelInstance> | null = any,
  This extends object = any,
  Kind extends symbol = any,
> =
  & {
    /**
     * Type of relation.
     *
     * @internal
     */
    readonly relationKind: Kind;
    /**
     * Resolve the related model(s).
     */
    // TODO Strict from T.
    // TODO Always required?
    model: () => Awaitable<Arrayable<Model<InferModelRelationInstance<T>>>>;
    /**
     * Scopes to always apply to query.
     *
     * @remarks
     * Scopes can be omitted using `withoutScopes` option on queries.
     */
    scopes?: ModelScope<InferModelRelationInstance<T>>[];
    /**
     * Always lazy load the relation.
     */
    lazy?: boolean;

    /* Specific HTTP config. */

    /**
     * The path to use when requesting relation's endpoint.
     *
     * @remarks
     * This is specific to HTTP implementations (REST, JSON:API).
     */
    path?: string;
  }
  & ModelProp<T, This, typeof SYMBOL_MODEL_PROP_RELATION>;

/**
 * Model to one relation property.
 *
 * @interface
 *
 * @internal
 */
export type ModelToOneProp<
  T extends ModelInstance | null = ModelInstance | null,
  This extends object = any,
  Kind extends symbol = any,
> =
  & {
    /**
     * The key which holds reference in the current instance.
     */
    foreignKey?: ModelForeignKey<This>;
    /**
     * The key which is used as reference in the related instance.
     */
    ownerKey?: ModelPrimaryKey<InferModelRelationInstance<T>>;
  }
  & ModelRelationProp<T, This, Kind>;

/**
 * Model belongs to relation property.
 *
 * @interface
 *
 * @internal
 */
export type ModelBelongsToProp<
  T extends ModelInstance | null = ModelInstance | null,
  This extends object = any,
> = ModelToOneProp<T, This, typeof SYMBOL_MODEL_RELATION_BELONGS_TO>;

/**
 * Model has one or many relation property.
 *
 * @interface
 *
 * @internal
 */
export type ModelHasOneOrManyProp<
  T extends Arrayable<ModelInstance> | null = Arrayable<ModelInstance> | null,
  This extends object = any,
  Kind extends symbol = any,
> =
  & {
    /**
     * The key which holds reference in the related instance.
     */
    foreignKey?: ModelForeignKey<InferModelRelationInstance<T>>;
    /**
     * The key which is used as reference in the current instance.
     */
    localKey?: ModelPrimaryKey<This>;
    /**
     * The inverse relation key on related instances.
     */
    inverse?: ModelToOneRelationKey<InferModelRelationInstance<T>> | boolean;
  }
  & ModelRelationProp<T, This, Kind>;

/**
 * Model has many relation property.
 *
 * @interface
 *
 * @internal
 */
export type ModelHasManyProp<
  T extends ModelInstance[] = ModelInstance[],
  This extends object = any,
> = ModelHasOneOrManyProp<T, This, typeof SYMBOL_MODEL_RELATION_HAS_MANY>;

/**
 * Model has one relation property.
 *
 * @interface
 *
 * @internal
 */
export type ModelHasOneProp<
  T extends ModelInstance | null = ModelInstance | null,
  This extends object = any,
> = ModelHasOneOrManyProp<T, This, typeof SYMBOL_MODEL_RELATION_HAS_ONE>;

/**
 * Model morph to relation property.
 *
 * @interface
 *
 * @internal
 */
export type ModelMorphToProp<
  T extends ModelInstance | null = ModelInstance | null,
  This extends object = any,
> =
  & {
    /**
     * The key to the current instance's attribute holding the reference type.
     */
    foreignTypeKey?: ModelForeignKey<This>;
  }
  & ModelToOneProp<T, This, typeof SYMBOL_MODEL_RELATION_MORPH_TO>;

/**
 * Model has one or many relation property.
 *
 * @interface
 *
 * @internal
 */
export type ModelMorphOneOrManyProp<
  T extends Arrayable<ModelInstance> | null = Arrayable<ModelInstance> | null,
  This extends object = any,
  Kind extends symbol = any,
> =
  & {
    /**
     * The key which holds reference in the related instance.
     */
    foreignTypeKey?: ModelForeignKey<InferModelRelationInstance<T>>;
  }
  & ModelHasOneOrManyProp<T, This, Kind>;

/**
 * Model morph many relation property.
 *
 * @interface
 *
 * @internal
 */
export type ModelMorphManyProp<
  T extends ModelInstance[] = ModelInstance[],
  This extends object = any,
> = ModelMorphOneOrManyProp<T, This, typeof SYMBOL_MODEL_RELATION_MORPH_MANY>;

/**
 * Model morph one relation property.
 *
 * @interface
 *
 * @internal
 */
export type ModelMorphOneProp<
  T extends ModelInstance | null = ModelInstance | null,
  This extends object = any,
> = ModelMorphOneOrManyProp<T, This, typeof SYMBOL_MODEL_RELATION_MORPH_ONE>;

/**
 * Model instance read property hooks' event.
 *
 * @internal
 */
export type ModelInstancePropertyReadHookEvent = {
  readonly instance: ModelInstance;
  readonly prop: ModelProp;
  readonly value: unknown;
};

/**
 * Model instance read property hooks' callback function.
 *
 * @internal
 */
export type ModelInstancePropertyReadHookCallback =
  SyncHookCallback<ModelInstancePropertyReadHookEvent>;

/**
 * Model instance write property hooks' event.
 *
 * @internal
 */
export type ModelInstancePropertyWriteHookEvent = {
  readonly instance: ModelInstance;
  readonly prop: ModelProp;
  readonly prev: unknown | undefined;
  readonly next: unknown;
};

/**
 * Model instance write property hooks' callback function.
 *
 * @internal
 */
export type ModelInstancePropertyWriteHookCallback =
  SyncHookCallback<ModelInstancePropertyWriteHookEvent>;

/**
 * Model hooks' event.
 */
export type ModelHookEvent = {
  readonly model: Model;
};

/**
 * Model hooks' definition dedicated to a model.
 *
 * @internal
 */
export type ModelHooksDefinitionForModel = {
  boot: SyncHookCallback<ModelHookEvent>;
};

/**
 * Model instance hooks' event.
 */
export type ModelInstanceHookEvent = {
  readonly instance: ModelInstance;
};

/**
 * Model instance pull hooks' event.
 */
export type ModelInstancePullHookEvent = {
  readonly instance: ModelInstance;
};

/**
 * Model instance push hooks' event.
 */
export type ModelInstancePushHookEvent = {
  readonly instance: ModelInstance;
  readonly original: ModelSnapshot;
};

/**
 * Model hooks' definition dedicated to an instance.
 *
 * @internal
 */
export type ModelHooksDefinitionForInstance = {
  init: SyncHookCallback<ModelInstanceHookEvent>;
  retrieved: HookCallback<ModelInstancePullHookEvent>;
  creating: HookCallback<ModelInstancePushHookEvent>;
  created: HookCallback<ModelInstancePushHookEvent>;
  updating: HookCallback<ModelInstancePushHookEvent>;
  updated: HookCallback<ModelInstancePushHookEvent>;
  saving: HookCallback<ModelInstancePushHookEvent>;
  saved: HookCallback<ModelInstancePushHookEvent>;
  destroying: HookCallback<ModelInstanceHookEvent>;
  destroyed: HookCallback<ModelInstanceHookEvent>;
};

/**
 * Model hooks' definition dedicated to an instance property.
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
 * Model hooks' definition.
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
 * @internal
 *
 * @remarks
 * Use `strictOf()` to use a stricter version of a model instance.
 */
export interface ModelInstance
  extends FosciaObject<typeof SYMBOL_MODEL_INSTANCE> {
  /**
   * Model this instance was created from.
   */
  readonly $model: Model;
  /**
   * Existence state against data source.
   */
  $exists: boolean;
  /**
   * Raw value of the data source record when available.
   */
  $raw: any | null;
  /**
   * Internal values of the instance's properties.
   *
   * @internal
   */
  $values: Map<string, unknown>;
  /**
   * Latest sync snapshot.
   *
   * @internal
   */
  $original: ModelSnapshot;
  /**
   * Tells which relation is considered to be loaded.
   *
   * @internal
   */
  $loaded: Set<string>;
  /**
   * Initializers called just before boot and init hooks.
   *
   * @internal
   */
  $initializers: Set<(instance: ModelInstance) => void>;
}

/**
 * Model strict type for a given instance.
 *
 * @interface
 *
 * @internal
 */
export type StrictModelInstance<Instance extends ModelInstance> =
  & {
    readonly $model: StrictModel<Instance>;
    $values: Map<ModelKey<Instance>, Instance[ModelKey<Instance>]>;
    $original: ModelSnapshot<Instance>;
    $loaded: Set<ModelRelationKey<Instance>>;
    $initializers: Set<(instance: Instance) => void>;
  }
  & Omit<Instance, '$model' | '$values' | '$original' | '$loaded'>;

/**
 * Model constructor.
 *
 * @interface
 *
 * @internal
 *
 * @remarks
 * Use `strictOf()` to use a stricter version of a model instance.
 */
export type Model<Instance extends object = any> =
  & {
    /**
     * Connection to use for the model.
     */
    readonly $connection: string;
    /**
     * Unique type of the model.
     */
    readonly $type: string;
    /**
     * Configuration of the model.
     *
     * @internal
     */
    readonly $config: ModelConfig<any>;
    /**
     * Schema of the model.
     *
     * @internal
     */
    readonly $schema: Map<string, ModelProp<any, ModelInstance>>;
    /**
     * Composables used by the model.
     *
     * @internal
     */
    readonly $composables: Set<ModelComposableDecorator>;
    /**
     * Tells if the model is in introspection phase (constructing schema).
     *
     * @internal
     */
    $introspecting: boolean;
    /**
     * Tells if the model was already booted (constructed at least once).
     *
     * @internal
     */
    $booted: boolean;
  }
  & Constructor<Instance>
  & Hookable<ModelHooksDefinition>
  & FosciaObject<typeof SYMBOL_MODEL_CLASS>;

/**
 * Model strict type for a given instance.
 *
 * @interface
 *
 * @internal
 */
export type StrictModel<Instance extends ModelInstance> =
  & {
    readonly $config: ModelConfig<Instance>;
    readonly $schema: Map<ModelKey<Instance>, ModelProp<Instance[ModelKey<Instance>], Instance>>;
  }
  & Omit<Model<Instance>, '$config' | '$schema'>;

/**
 * Model using given composable.
 *
 * @internal
 */
export type ModelUsing<
  Composable extends ModelComposableDecorator,
  Class extends Constructor = Constructor,
> =
  & Pick<Class, keyof Class>
  & Model<ModelInstanceUsing<Composable, InstanceType<Class>>>
  & ObjectClassUsing<Composable>;

/**
 * Model instance using given composable.
 *
 * @internal
 */
export type ModelInstanceUsing<
  Composable extends ModelComposableDecorator,
  Instance extends {} = {},
> = ModelInstance & Instance & ObjectInstanceUsing<Composable>;

/**
 * ObjectClass using given composable.
 *
 * @internal
 */
export type ObjectClassUsing<Composable extends ModelComposableDecorator> =
  & Pick<
  UnionToIntersection<ReturnType<Composable>>, keyof UnionToIntersection<ReturnType<Composable>>>;

/**
 * Object instance using given composable.
 *
 * @internal
 */
export type ObjectInstanceUsing<Composable extends ModelComposableDecorator> =
  UnionToIntersection<InstanceType<ReturnType<Composable>>>;

/**
 * Infer model instance.
 *
 * @internal
 */
export type InferModelInstance<T> =
  T extends Model<infer I> ? I
    : T extends ModelInstance ? T
      : never;

/**
 * Infer related model instance from relation type.
 *
 * @internal
 */
export type InferModelRelationInstance<T> =
  T extends ModelRelationProp<infer U> ? InferModelRelationInstance<U>
    : T extends ModelInstance[] ? T[number]
      : T extends ModelInstance ? T
        : never;

/**
 * Infer related model instance from relation type.
 *
 * @internal
 */
export type InferRelatedInstance<T> =
  T extends ModelInstance[] ? T[number]
    : T extends ModelInstance ? T : never;

/**
 * Model values key.
 *
 * @example
 * const keys: ModelKey<Post>[] = ['title', 'body', 'publishedAt', 'comments'];
 */
export type ModelKey<I> = Exclude<string & keyof I, keyof ModelInstance>;

/**
 * Model mutable values key.
 *
 * @example
 * const keys: ModelMutableKey<Post>[] = ['title', 'body'];
 */
export type ModelMutableKey<I> = {
  [K in keyof I]: K extends ModelKey<I>
    ? IfEquals<Pick<I, K>, Record<K, I[K]>, K>
    : never;
}[keyof I];

/**
 * Model primary properties.
 *
 * @internal
 */
export type ModelPrimaryProps<I extends object> = OmitNever<{
  [K in keyof I]: K extends ModelKey<I>
    ? I[K] extends ModelPrimary<infer T> ? ModelPrimaryProp<T, I>
      : never : never;
}>;

/**
 * Model primary properties keys.
 *
 * @internal
 */
export type ModelPrimaryKey<I extends object> = ModelKey<I> & keyof ModelPrimaryProps<I>;

/**
 * Model primary properties values.
 *
 * @internal
 */
export type ModelPrimaryValues<I extends object = any> = Pick<ModelValues<I>, ModelPrimaryKey<I>>;

/**
 * Model primary properties raw values, allowing a direct primary value instead of a dictionary.
 *
 * @internal
 */
export type ModelPrimaryRawValues<I extends object> =
  | Exclude<ModelPrimaryValues<I>[keyof ModelPrimaryValues<I>], object>
  | Partial<ModelPrimaryValues<I>>;

/**
 * Model foreign properties.
 *
 * @internal
 */
export type ModelForeignProps<I extends object> = OmitNever<{
  [K in keyof I]: K extends ModelKey<I>
    ? I[K] extends ModelForeign<infer T> ? ModelForeignProp<T, I>
      : never : never;
}>;

/**
 * Model foreign properties keys.
 *
 * @internal
 */
export type ModelForeignKey<I extends object> = ModelKey<I> & keyof ModelForeignProps<I>;

/**
 * Model foreign properties values.
 *
 * @internal
 */
export type ModelForeignValues<I extends object> = Pick<ModelValues<I>, ModelForeignKey<I>>;

/**
 * Model "to one" relation properties.
 *
 * @internal
 */
export type ModelToOneRelationProps<I extends object> = OmitNever<{
  [K in keyof I]: K extends ModelKey<I>
    ? I[K] extends ModelRelation<ModelInstance | null> ? ModelRelationProp<I[K], I>
      : never : never;
}>;

/**
 * Model "to many" relation properties.
 *
 * @internal
 */
export type ModelToManyRelationProps<I extends object> = OmitNever<{
  [K in keyof I]: K extends ModelKey<I>
    ? I[K] extends ModelRelation<ModelInstance[]> ? ModelRelationProp<I[K], I>
      : never : never;
}>;

/**
 * Model relation properties.
 *
 * @internal
 */
export type ModelRelationProps<I extends object> =
  & ModelToOneRelationProps<I>
  & ModelToManyRelationProps<I>;

/**
 * Model "to one" relation properties keys.
 *
 * @internal
 */
export type ModelToOneRelationKey<I extends object> =
  ModelKey<I> & keyof ModelToOneRelationProps<I>;

/**
 * Model "to many" relation properties keys.
 *
 * @internal
 */
export type ModelToManyRelationKey<I extends object> =
  ModelKey<I> & keyof ModelToManyRelationProps<I>;

/**
 * Model relation values key.
 *
 * @example
 * const keys: ModelRelationKey<Post>[] = ['comments', 'tags'];
 */
export type ModelRelationKey<I extends object> =
  | ModelToOneRelationKey<I>
  | ModelToManyRelationKey<I>;

/**
 * Model relation values key, with nested relations support separated with dots.
 *
 * @example
 * const keys: ModelRelationDotKey<Post>[] = ['comments', 'comments.author', 'tags'];
 */
export type ModelRelationDotKey<I extends object, Depth extends number = 5> =
  [Depth] extends [0]
    ? never
    : ModelKey<I> extends infer K
      ? K extends ModelRelationKey<I>
        ? K | `${K}.${ModelRelationDotKey<InferRelatedInstance<I[K]>, Prev[Depth]>}`
        : K extends ModelKey<I>
          ? IfAny<I[K], K, never>
          : never
      : never;

/**
 * Model non-relation values key.
 *
 * @internal
 */
export type ModelNonRelationKey<I extends object> =
  Exclude<ModelKey<I>, ModelRelationKey<I>>;

/**
 * Model values.
 *
 * @example
 * const values: ModelValues<Post> = { title: 'Hello', body: 'World!', comments: [] };
 */
export type ModelValues<I extends object> = OmitNever<{
  [K in keyof I]: K extends ModelKey<I>
    ? UnbrandValue<I[K]> : never;
}>;

/**
 * Model mutable values.
 *
 * @example
 * const values: ModelMutableValues<Post> = { title: 'Hello', body: 'World!' };
 */
export type ModelMutableValues<I extends object> =
  Pick<I, ModelMutableKey<I>>;

/**
 * Model snapshot only shallow relations tracking.
 *
 * @internal
 */
export interface ModelShallowSnapshot<Instance extends ModelInstance = any>
  extends FosciaObject<typeof SYMBOL_MODEL_SNAPSHOT> {
  /**
   * Instance snapshot is from.
   */
  readonly instance: Instance;
  /**
   * Internal values snapshot of the instance's properties.
   */
  readonly values: Map<ModelKey<Instance>, unknown>;
  /**
   * Latest sync snapshot for instance.
   *
   * @internal
   */
  readonly original?: ModelSnapshot<Instance> | null;
  /**
   * Existence state against data source.
   *
   * @internal
   */
  readonly exists?: boolean;
  /**
   * Raw value of the data source record when available.
   *
   * @internal
   */
  readonly raw?: any | null;
  /**
   * Tells which relation is considered to be loaded.
   *
   * @internal
   */
  readonly loaded?: Set<ModelRelationKey<Instance>>;
}

/**
 * Model snapshot only shallow relations tracking.
 *
 * @internal
 */
export interface ModelSnapshot<Instance extends ModelInstance = any>
  extends Required<ModelShallowSnapshot<Instance>> {
}
