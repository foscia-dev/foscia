import { Hookable, HookCallback, SyncHookCallback } from '@foscia/core/hooks/types';
import {
  SYMBOL_MODEL_CLASS,
  SYMBOL_MODEL_COMPOSABLE,
  SYMBOL_MODEL_INSTANCE,
  SYMBOL_MODEL_PROP_ATTRIBUTE,
  SYMBOL_MODEL_PROP_ID,
  SYMBOL_MODEL_PROP_PENDING,
  SYMBOL_MODEL_PROP_RELATION,
  SYMBOL_MODEL_RELATION_HAS_MANY,
  SYMBOL_MODEL_RELATION_HAS_ONE,
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
 */
export type ModelConfig = {
  strict?: boolean;
  strictProperties?: boolean;
  strictReadOnly?: boolean;
  path?: Optional<string>;
  guessPath?: Transformer<string>;
  guessIdPath?: Transformer<ModelIdType>;
  guessRelationPath?: Transformer<ModelRelation, string>;
  guessRelationType?: Transformer<ModelRelation, string>;
  guessAlias?: Transformer<string>;
  compareValue?: (nextValue: unknown, prevValue: unknown) => boolean;
  cloneValue?: <T>(value: T) => T;
  [K: string]: any;
};

/**
 * Model composable definition which can be included on any models.
 */
export type ModelComposable<D extends {} = any> =
  & {
    $definition: D;
  }
  & FosciaObject<typeof SYMBOL_MODEL_COMPOSABLE>
  & Hookable<ModelHooksDefinition>;

/**
 * Model instance ID default typing.
 */
export type ModelIdType = string | number;

/**
 * Sync precise configuration for a property (will only do defined action).
 */
export type ModelPropSync = 'pull' | 'push';

/**
 * Normalized part of a property's definition (ID, attribute or relation).
 */
export type ModelPropNormalized<K = string> = {
  key: K;
};

/**
 * Pending definition for a model's property (ID, attribute or relation).
 */
export type PendingModelProp<D extends RawModelProp<any, any>> =
  {
    definition: D;
  }
  & FosciaObject<typeof SYMBOL_MODEL_PROP_PENDING>;

/**
 * Raw definition for a model's property (ID, attribute or relation).
 */
export type RawModelProp<T = unknown, R extends boolean = boolean> = {
  /**
   * Default value for the property.
   */
  default?: T | (() => T) | undefined;
  /**
   * Alias of the property (might be used when (de)serializing).
   */
  alias?: string | undefined;
  /**
   * Makes the property read-only.
   */
  readOnly?: R;
  /**
   * Tells if the property should be synced with the data store.
   */
  sync?: boolean | ModelPropSync;
};

/**
 * Raw Definition for a model's ID.
 */
export type RawModelId<T extends ModelIdType | null = any, R extends boolean = boolean> =
  {
    transformer?: ObjectTransformer<T | null> | undefined;
  }
  & RawModelProp<T, R>
  & FosciaObject<typeof SYMBOL_MODEL_PROP_ID>;

/**
 * Definition for a model's ID.
 */
export type ModelId<K = string, T extends ModelIdType | null = any, R extends boolean = boolean> =
  & ModelPropNormalized<K>
  & RawModelId<T, R>;

/**
 * Raw definition for a model's attribute.
 */
export type RawModelAttribute<T = unknown, R extends boolean = boolean> =
  {
    transformer?: ObjectTransformer<T | null> | undefined;
  }
  & RawModelProp<T, R>
  & FosciaObject<typeof SYMBOL_MODEL_PROP_ATTRIBUTE>;

/**
 * Definition for a model's attribute.
 */
export type ModelAttribute<K = string, T = any, R extends boolean = boolean> =
  & ModelPropNormalized<K>
  & RawModelAttribute<T, R>;

/**
 * Available model relation types.
 */
export type ModelRelationType =
  | typeof SYMBOL_MODEL_RELATION_HAS_ONE
  | typeof SYMBOL_MODEL_RELATION_HAS_MANY;

/**
 * Configuration of a model's relation.
 */
export type ModelRelationConfig = {
  type?: string | string[];
  [K: string]: any;
};

/**
 * Raw definition for a model's relation.
 */
export type RawModelRelation<T = any, R extends boolean = boolean> =
  {
    $RELATION_TYPE: ModelRelationType;
    model?: () => Awaitable<Model | Model[]>;
  }
  & ModelRelationConfig
  & RawModelProp<T, R>
  & FosciaObject<typeof SYMBOL_MODEL_PROP_RELATION>;

/**
 * Definition for a model's attribute.
 */
export type ModelRelation<K = string, T = any, R extends boolean = boolean> =
  & ModelPropNormalized<K>
  & RawModelRelation<T, R>;

/**
 * Infer a model's property type from the property raw definition.
 */
export type ModelInferPropValue<P> = P extends RawModelProp<infer T> ? T : never;

/**
 * A parsed model definition's prop with non attributes/relations properties'
 * descriptors wrapped in holders.
 */
export type ModelParsedDefinitionProp<K, V> =
  V extends RawModelAttribute<any, any> ? V & ModelPropNormalized<K>
    : V extends RawModelRelation<any, any> ? V & ModelPropNormalized<K>
      : V extends RawModelId<any, any> ? V & ModelPropNormalized<K>
        : V extends ModelComposable ? never
          : V extends DescriptorHolder<any> ? V
            : DescriptorHolder<V>;

/**
 * The parsed model definition with non composables/attributes/relations
 * properties' descriptors wrapped in holders.
 */
export type ModelParsedDefinition<D extends {} = {}> = {
  [K in keyof D]: D[K] extends ModelComposable
    ? D[K] : D[K] extends PendingModelProp<RawModelProp<any, any>>
      ? ModelParsedDefinitionProp<K, D[K]['definition']> : ModelParsedDefinitionProp<K, D[K]>;
};

/**
 * The flatten and parsed model definition with composables properties
 * flattened to the definition root.
 */
export type ModelFlattenDefinition<D extends {}> =
  & UnionToIntersection<{} | {
    [K in keyof D]: D[K] extends ModelComposable<infer CD>
      ? ModelFlattenDefinition<CD> : never;
  }[keyof D]>
  & OmitNever<{ [K in keyof D]: D[K] extends ModelComposable ? never : D[K] }>;

/**
 The flatten and parsed model definition from a composable object type.
 */
export type ModelComposableDefinition<C extends ModelComposable<C>> = ModelFlattenDefinition<{
  composable: C;
}>;

/**
 * Extract model's IDs, attributes and relations from the whole definition.
 */
export type ModelSchema<D extends {} = {}> = {
  [K in keyof D]: D[K] extends ModelAttribute<K, any, any>
    ? D[K] : D[K] extends ModelRelation<K, any, any>
      ? D[K] : D[K] extends ModelId<K, any, any>
        ? D[K] : never;
};

/**
 Extract model's relations from the whole definition.
 */
export type ModelSchemaRelations<D extends {} = {}> = {
  [K in keyof D]: D[K] extends ModelRelation<K>
    ? D[K] : never;
};

/**
 * Model instance generic hook callback function.
 *
 * @deprecated Use `HookCallback<ModelInstance>` instead.
 */
export type ModelInstanceHookCallback = HookCallback<ModelInstance>;

/**
 * Model instance read property generic hook callback function.
 */
export type ModelInstancePropertyReadHookCallback = SyncHookCallback<{
  instance: ModelInstance;
  def: ModelId | ModelAttribute | ModelRelation;
  value: unknown;
}>;

/**
 * Model instance write property generic hook callback function.
 */
export type ModelInstancePropertyWriteHookCallback = SyncHookCallback<{
  instance: ModelInstance;
  def: ModelId | ModelAttribute | ModelRelation;
  prev: unknown;
  next: unknown;
}>;

/**
 * Model's hooks definition.
 */
export type ModelHooksDefinition =
  & {
    boot: SyncHookCallback<Model>;
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
 * Extendable model class holding the configuration and schema.
 */
export type ModelClass<D extends {} = any> =
  {
    readonly $type: string;
    readonly $config: ModelConfig;
    readonly $schema: ModelSchema<D>;
    readonly $composables: ModelComposable[];
    $booted: boolean;
  }
  & FosciaObject<typeof SYMBOL_MODEL_CLASS>
  & Hookable<ModelHooksDefinition>;

/**
 * Model class of a dedicated instance.
 * This type is used to keep instance generic typing across actions enhancements.
 */
export type Model<D extends {} = any, I extends ModelInstance<D> = any> =
  & ModelClass<D>
  & Constructor<I>;

/**
 * Model class using a given composable.
 */
export type ModelUsing<C extends ModelComposable> =
  Model<ModelComposableDefinition<C>, ModelInstanceUsing<C>>;

/**
 * Model class which can be configured or extended.
 */
export type ExtendableModel<D extends {} = any, I extends ModelInstance<D> = any> =
  & {
    configure(config: ModelConfig, override?: boolean): ExtendableModel<D, ModelInstance<D>>;
    extend<ND extends {} = {}>(
      // eslint-disable-next-line max-len
      rawDefinition?: ND & ThisType<ModelInstance<D & ModelFlattenDefinition<ModelParsedDefinition<ND>>>>,
      // eslint-disable-next-line max-len
    ): ExtendableModel<D & ModelFlattenDefinition<ModelParsedDefinition<ND>>, ModelInstance<D & ModelFlattenDefinition<ModelParsedDefinition<ND>>>>;
  }
  & Model<D, I>;

/**
 * Model class factory.
 */
export type ModelFactory<
  D extends {} = {},
> = Hookable<ModelHooksDefinition> & (<ND extends {}>(
  rawConfig: string | (ModelConfig & { type: string; }),
  // eslint-disable-next-line max-len
  rawDefinition?: ND & ThisType<ModelInstance<D & ModelFlattenDefinition<ModelParsedDefinition<ND>>>>,
  // eslint-disable-next-line max-len
) => ExtendableModel<D & ModelFlattenDefinition<ModelParsedDefinition<ND>>, ModelInstance<D & ModelFlattenDefinition<ModelParsedDefinition<ND>>>>);

/**
 * Model instance for a dedicated model class.
 * This type is used to keep instance generic typing across actions enhancements.
 */
export type ModelClassInstance<D extends {} = any> = {
  readonly $model: ModelClass<D>;
};

/**
 * Model defaults IDs typing when not defined by definition.
 */
export type ModelIdsDefaults<D extends {}> =
  & (D extends { id: any } ? {} : { id: ModelIdType | null })
  & (D extends { lid: any } ? {} : { lid: ModelIdType | null });

/**
 * Model properties map (IDs/attributes/relations/custom props).
 */
export type ModelDefinitionProperties<D extends {}> = ModelIdsDefaults<D> & {
  [K in keyof D]: D[K] extends ModelAttribute<K, infer T, any>
    ? T : D[K] extends ModelRelation<K, infer T, any>
      ? T : D[K] extends ModelId<K, infer T, any>
        ? T : D[K] extends DescriptorHolder<infer T>
          ? T : D[K];
};

/**
 * Model properties key (only writable IDs/attributes/relations).
 */
export type ModelDefinitionWritableKey<D extends {}> = {
  [K in keyof D]: D[K] extends DescriptorHolder<any>
    ? never
    : D[K] extends RawModelProp<any, true> ? never : K;
}[keyof D] | keyof ModelIdsDefaults<D>;

/**
 * Model properties key (only readonly IDs/attributes/relations).
 */
export type ModelDefinitionReadOnlyKey<D extends {}> = {
  [K in keyof D]: D[K] extends DescriptorHolder<any>
    ? never
    : D[K] extends RawModelProp<any, true> ? K : never;
}[keyof D];

/**
 * Model descriptors key (only custom properties).
 */
export type ModelDefinitionDescriptorKey<D extends {}> = {
  [K in keyof D]: D[K] extends DescriptorHolder<any> ? K : never;
}[keyof D];

/**
 * Model properties map (only writable IDs/attributes/relations).
 */
export type ModelDefinitionWritableValues<D extends {}> =
  Pick<ModelDefinitionProperties<D>, ModelDefinitionWritableKey<D>>;

/**
 * Model properties map (only readonly IDs/attributes/relations).
 */
export type ModelDefinitionReadOnlyValues<D extends {}> =
  Readonly<Pick<ModelDefinitionProperties<D>, ModelDefinitionReadOnlyKey<D>>>;

/**
 * Model properties map (IDs/attributes/relations).
 */
export type ModelDefinitionValues<D extends {}> =
  & ModelDefinitionWritableValues<D>
  & ModelDefinitionReadOnlyValues<D>;

/**
 * Model descriptors map (only custom properties).
 */
export type ModelDefinitionDescriptors<D extends {}> =
  Pick<ModelDefinitionProperties<D>, ModelDefinitionDescriptorKey<D>>;

/**
 * Model instance holding state and values.
 */
export type ModelInstance<D extends {} = any> =
  {
    readonly $model: ModelClass<D>;
    $exists: boolean;
    $loaded: Dictionary<true>;
    $values: Partial<ModelValues<D>>;
    $raw: any;
    $original: ModelSnapshot<D>;
  }
  & ModelDefinitionValues<D>
  & ModelDefinitionDescriptors<D>
  & FosciaObject<typeof SYMBOL_MODEL_INSTANCE>;

/**
 * Model instance using a given composable.
 */
export type ModelInstanceUsing<C extends ModelComposable> =
  ModelInstance<ModelComposableDefinition<C>>;

/**
 * Model class or instance snapshot.
 */
export type ModelSnapshot<M = any> = {
  $model: ModelClass;
  $exists: boolean;
  $raw: any;
  $loaded: Dictionary<true>;
  $values: Partial<ModelValues<M>>;
};

/**
 * Model class or instance.
 */
export type ModelClassOrInstance<D extends {}> = ModelClass<D> | ModelClassInstance<D>;

/**
 * Infer the definition from a model class or model instance.
 */
export type ModelInferDefinition<M> = M extends ModelClassOrInstance<infer D>
  ? D
  : M extends {}
    ? M
    : never;

/**
 * Infer the schema from a model class or model instance.
 */
export type ModelInferSchema<M> = ModelSchema<ModelInferDefinition<M>>;

/**
 * Model class or instance values map (only IDs/attributes/relations).
 */
export type ModelValues<M> = ModelDefinitionValues<ModelInferDefinition<M>>;

/**
 * Model class or instance values map (only writable IDs/attributes/relations).
 */
export type ModelWritableValues<M> = ModelDefinitionWritableValues<ModelInferDefinition<M>>;

/**
 * Model class or instance values map (only readonly IDs/attributes/relations).
 */
export type ModelReadOnlyValues<M> = ModelDefinitionReadOnlyValues<ModelInferDefinition<M>>;

/**
 * Model class or instance IDs/attributes/relations key.
 */
export type ModelKey<M> =
  & string
  & keyof ModelInferSchema<M>
  & keyof ModelValues<M>;

/**
 * Model class or instance relations key (only direct relations).
 *
 * @example
 * const keys: ModelRelationKey<Post>[] = ['comments', 'tags'];
 */
export type ModelRelationKey<M> =
  keyof ModelInferSchema<M> extends infer K
    ? K extends string & keyof ModelInferSchema<M> & keyof ModelValues<M>
      ? ModelInferSchema<M>[K] extends never
        ? never
        : ModelInferSchema<M>[K] extends ModelRelation
          ? K
          : never : never : never;

/**
 * Model class or instance relations key (supports nested relation using dot separator).
 *
 * @example
 * const keys: ModelRelationDotKey<Post>[] = ['comments', 'comments.author', 'tags'];
 */
export type ModelRelationDotKey<M, Depth extends number = 5> =
  [Depth] extends [0]
    ? never
    : keyof ModelInferSchema<M> extends infer K
      ? K extends string & keyof ModelInferSchema<M> & keyof ModelValues<M>
        ? ModelInferSchema<M>[K] extends never
          ? never
          : ModelInferSchema<M>[K] extends ModelRelation<any, infer T>
            ? T extends any[]
              ? K | `${K}.${ModelRelationDotKey<T[number], Prev[Depth]>}`
              : K | `${K}.${ModelRelationDotKey<T, Prev[Depth]>}`
            : never : never : never;
