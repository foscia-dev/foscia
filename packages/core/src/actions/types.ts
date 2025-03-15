import ActionKind from '@foscia/core/actions/context/actionKind';
import type {
  InferRelationUpdateValue,
} from '@foscia/core/actions/context/enhancers/crud/updateRelation';
import type { AllData, RetypedDeserializedData } from '@foscia/core/actions/context/runners/all';
import type { CachedData } from '@foscia/core/actions/context/runners/cachedOr';
import type { OneData } from '@foscia/core/actions/context/runners/oneOr';
import type {
  ResolveModelContext,
} from '@foscia/core/actions/context/utilities/resolveContextModels';
import type {
  ActionVariadicRunFunction,
  ActionVariadicRunMethod,
  ActionVariadicUseFunction,
  ActionVariadicUseMethod,
} from '@foscia/core/actions/variadic';
import type { Hookable, HookCallback } from '@foscia/core/hooks/types';
import type { Model, ModelIdType, ModelInstance, ModelRelation } from '@foscia/core/model/types';
import { ParsedRawInclude, ParsedIncludeMap } from '@foscia/core/relations/types';
import {
  SYMBOL_ACTION,
  SYMBOL_ACTION_ENHANCER,
  SYMBOL_ACTION_RUNNER,
  SYMBOL_ACTION_WHEN,
} from '@foscia/core/symbols';
import {
  Adapter,
  DeserializedData,
  Deserializer,
  InstancesCache,
  ModelsRegistry,
  RelationsLoader,
  Serializer,
} from '@foscia/core/types';
import { Awaitable, Constructor, FosciaObject, IfAny } from '@foscia/shared';

export type {
  AllData,
  OneData,
  CachedData,
  RetypedDeserializedData,
  ResolveModelContext,
  InferRelationUpdateValue,
};

export * from '@foscia/core/actions/variadic';

/**
 * Action hooks definition.
 *
 * @internal
 */
export type ActionHooksDefinition = {
  running: HookCallback<{ action: Action; runner: AnonymousRunner<any, any>; }>;
  success: HookCallback<{ action: Action; result: unknown; }>;
  error: HookCallback<{ action: Action; error: unknown; }>;
  finally: HookCallback<{ action: Action; }>;
};

/**
 * Action.
 *
 * @typeParam Context The current context of the action.
 *
 * @interface
 */
export type Action<Context extends {} = {}> =
  & {
    /**
     * Retrieve the current context after applying all queued enhancers.
     *
     * TODO Rename to `context` or `ctx`.
     */
    useContext(): Promise<Context>;
    /**
     * Update the current context.
     *
     * @param newContext
     *
     * TODO Rename to `updateCtx`?
     */
    updateContext<NewContext extends {}>(
      newContext: NewContext,
    ): Action<NewContext>;
    /**
     * Queue an enhancer which will update the current context.
     * Enhancer will apply on next context compute, run or immediate apply.
     *
     * @param enhancer
     */
    use<NewContext extends {} = Context>(
      enhancer: AnonymousEnhancer<Context, NewContext>,
    ): Action<NewContext>;
    /**
     * Run the action.
     *
     * @param runner
     */
    run<Result>(
      runner: AnonymousRunner<Context, Result>,
    ): Promise<Awaited<Result>>;
    /**
     * Run the given callback on action and keep track for call stack.
     * It will also dequeue enhancements after the callback, to keep
     * track of call stack depth.
     *
     * @param callback
     * @param call
     *
     * @internal
     */
    track<Result>(
      callback: (action: Action<Context>) => Result,
      call?: AnonymousEnhancer<any, any> | AnonymousRunner<any, any>,
    ): Promise<Awaited<Result>>;
    /**
     * Get the tree of action calls (enhancers or runners).
     *
     * @internal
     */
    calls(): ActionCall[];
  }
  & ActionVariadicUseMethod<Context>
  & ActionVariadicRunMethod<Context>
  & ActionVariadicUseFunction<Context>
  & ActionVariadicRunFunction<Context>
  & Hookable<ActionHooksDefinition>
  & FosciaObject<typeof SYMBOL_ACTION>;

/**
 * Action factory.
 *
 * @internal
 *
 * TODO Default context to {}.
 */
export type ActionFactory<Context extends {}> =
  & (() => Action<Context>)
  & { connectionId: string; }
  & ActionVariadicUseFunction<Context>
  & ActionVariadicRunFunction<Context>;

/**
 * Middleware to impact an action result or behavior.
 *
 * @internal
 */
export type ActionMiddleware<Context extends {}, Result> = (
  value: Action<Context>,
  next: (value: Action) => Promise<Result>,
) => Awaitable<Result>;

/**
 * Action call (enhancer or runner) tree node.
 *
 * @internal
 */
export type ActionCall = {
  call: AnonymousEnhancer<any, any> | AnonymousRunner<any, any>;
  calls: ActionCall[];
};

/**
 * Function to enhance an action context.
 */
export type AnonymousEnhancer<C extends {}, NC extends {}> = (
  action: Action<C>,
) => Awaitable<Action<NC> | void>;

/**
 * Function to create a result from a contextualized action.
 */
export type AnonymousRunner<C extends {}, R> = (
  action: Action<C>,
) => R;

/**
 * {@link AnonymousEnhancer | `AnonymousEnhancer`} with metadata properties.
 *
 * @internal
 */
export type Enhancer =
  & AnonymousEnhancer<any, any>
  & ContextFunctionMetadata<typeof SYMBOL_ACTION_ENHANCER>;

/**
 * {@link AnonymousRunner | `AnonymousRunner`} with metadata properties.
 *
 * @internal
 */
export type Runner =
  & AnonymousRunner<any, any>
  & ContextFunctionMetadata<typeof SYMBOL_ACTION_RUNNER>;

/**
 * {@link when | `when`} {@link AnonymousEnhancer | `AnonymousEnhancer`}
 * or {@link AnonymousRunner | `AnonymousRunner`} with metadata properties.
 *
 * @internal
 */
export type When =
  & (AnonymousEnhancer<any, any> | AnonymousRunner<any, any>)
  & ContextFunctionMetadata<typeof SYMBOL_ACTION_WHEN>;

/**
 * Metadata properties available on enhancers, runners and when.
 *
 * @internal
 */
export type ContextFunctionMetadata<S extends symbol> =
  & {
    readonly meta: {
      readonly name: string;
      readonly args: any[];
      readonly factory: Function;
    };
  }
  & FosciaObject<S>;

/**
 * Infer the query instance from context.
 *
 * This type should be used to infer the instance returned by an action runner.
 *
 * @internal
 */
export type InferQueryInstance<C extends {}> =
  C extends { queryAs: Constructor<infer I>[] } ? I extends ModelInstance ? I : never
    : C extends { relation: ModelRelation<Array<infer I>> }
      ? I extends ModelInstance ? I : never
      : C extends { relation: ModelRelation<infer I> } ? I extends ModelInstance ? I : never
        : C extends { instance: infer I } ? I extends ModelInstance ? I : never
          : C extends { model: Constructor<infer I> } ? I extends ModelInstance ? I : never
            : never;

/**
 * Infer the query model or instance from context.
 *
 * This type should be used to infer the model/instance properties to strict
 * type context enhancers and runners.
 *
 * @internal
 */
export type InferQueryModelOrInstance<C extends {}> =
  C extends { queryAs: Constructor<infer I>[] } ? I extends ModelInstance ? I : never
    : C extends { relation: ModelRelation<Array<infer I>> }
      ? I extends ModelInstance ? I : never
      : C extends { relation: ModelRelation<infer I> } ? I extends ModelInstance ? I : never
        : C extends { instance: infer I } ? I
          : C extends { model: infer M } ? M
            : InferQueryInstance<C>;

/**
 * Consumed context from an action or context object.
 *
 * @internal
 */
export type ConsumedContextFrom<
  Key extends string & keyof Relevant,
  Relevant extends {},
  Context extends {},
  Default,
// eslint-disable-next-line max-len
> = Exclude<(Context extends Relevant ? IfAny<Context, Relevant, Context>[Key] : Relevant[Key]) | Default, undefined>;

/**
 * Define the middlewares to run.
 *
 * @internal
 */
export type ConsumeActionMiddlewares<C extends {} = {}, R = unknown> = {
  middlewares?: ActionMiddleware<C, R>[];
};

/**
 * Define action to run on data source.
 *
 * @internal
 */
export type ConsumeActionKind = {
  actionKind: ActionKind | string;
};

/**
 * Define action connection ID to compare it with other actions.
 *
 * @internal
 */
export type ConsumeActionConnectionId = {
  actionConnectionId: string;
};

/**
 * Define data to send to data source.
 *
 * @internal
 */
export type ConsumeData = {
  data: unknown;
};

/**
 * Define the query model without affecting data source request.
 *
 * @internal
 */
export type ConsumeQueryAs<M extends Model = Model> = {
  queryAs: M[];
};

/**
 * Define the model to query.
 */
export type ConsumeModel<M extends Model = Model> = {
  model: M;
};

/**
 * Define the instance to query.
 */
export type ConsumeInstance<I extends ModelInstance = ModelInstance> = {
  instance: I;
};

/**
 * Define the relation to query.
 */
export type ConsumeRelation<R extends ModelRelation = ModelRelation> = {
  relation: R;
};

/**
 * Define the ID to query.
 */
export type ConsumeId = {
  id: ModelIdType;
};

/**
 * Define the relations to eager load.
 *
 * @internal
 */
export type ConsumeEagerLoads = {
  eagerLoads: (ParsedRawInclude | ParsedIncludeMap)[];
};

/**
 * Define the callback to finish relations eager loading.
 *
 * @internal
 */
export type ConsumeLazyEagerLoadCallback = {
  lazyEagerLoadCallback: (instances: ModelInstance[]) => Awaitable<void>;
};

/**
 * Define the cache implementation to use.
 *
 * @internal
 */
export type ConsumeCache = {
  cache: InstancesCache;
};

/**
 * Define the registry implementation to use.
 *
 * @internal
 */
export type ConsumeRegistry = {
  registry: ModelsRegistry;
};

/**
 * Define the adapter implementation to use.
 *
 * @internal
 */
export type ConsumeAdapter<RawData = any, Data = any> = {
  adapter: Adapter<RawData, Data>;
};

/**
 * Define the deserializer implementation to use.
 *
 * @internal
 */
export type ConsumeDeserializer<
  Data = any,
  Deserialized extends DeserializedData = any,
> = {
  deserializer: Deserializer<Data, Deserialized>;
};

/**
 * Define the serializer implementation to use.
 *
 * @internal
 */
export type ConsumeSerializer<Record = any, Related = any, Data = any> = {
  serializer: Serializer<Record, Related, Data>;
};

/**
 * Define the relations loader implementation to use.
 *
 * @internal
 */
export type ConsumeLoader = {
  loader: RelationsLoader;
};
