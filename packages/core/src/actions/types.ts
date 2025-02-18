import ActionName from '@foscia/core/actions/context/actionName';
import type {
  InferRelationUpdateValue,
} from '@foscia/core/actions/context/enhancers/crud/updateRelation';
import type {
  GuessContextModelContext,
} from '@foscia/core/actions/context/guessers/guessContextModel';
import type { AllData } from '@foscia/core/actions/context/runners/all';
import type { CachedData } from '@foscia/core/actions/context/runners/cachedOr';
import type { OneData } from '@foscia/core/actions/context/runners/oneOr';
import type {
  RetypedDeserializedData,
} from '@foscia/core/actions/context/utilities/deserializeInstances';
import {
  ActionVariadicRunFunction,
  ActionVariadicRunMethod,
  ActionVariadicUseFunction,
  ActionVariadicUseMethod,
} from '@foscia/core/actions/variadic';
import { Hookable, HookCallback } from '@foscia/core/hooks/types';
import { Model, ModelIdType, ModelInstance, ModelRelation } from '@foscia/core/model/types';
import {
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
  Serializer,
} from '@foscia/core/types';
import { Awaitable, Constructor, FosciaObject } from '@foscia/shared';

export type {
  AllData,
  OneData,
  CachedData,
  RetypedDeserializedData,
  GuessContextModelContext,
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
     */
    useContext(): Promise<Context>;
    /**
     * Update the current context.
     *
     * @param newContext
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
  & Hookable<ActionHooksDefinition>;

/**
 * Action factory.
 *
 * @internal
 */
export type ActionFactory<Context extends {}> =
  & (() => Action<Context>)
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
 * Define the middlewares to run.
 *
 * @internal
 */
export type ConsumeActionMiddlewares<C extends {}, R> = {
  middlewares?: ActionMiddleware<C, R>[];
};

/**
 * Define action to run on data source.
 *
 * @internal
 */
export type ConsumeAction = {
  action: ActionName | string;
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
  id?: ModelIdType;
};

/**
 * Define the relations to include.
 *
 * @internal
 */
export type ConsumeInclude = {
  include?: string[];
};

/**
 * Context dependency which can be lazy-loaded.
 *
 * @internal
 */
export type ResolvableContextDependency<T> = T | (() => Awaitable<T>);

/**
 * Define the cache implementation to use.
 *
 * @internal
 */
export type ConsumeCache = {
  cache: ResolvableContextDependency<InstancesCache>;
};

/**
 * Define the registry implementation to use.
 *
 * @internal
 */
export type ConsumeRegistry = {
  registry: ResolvableContextDependency<ModelsRegistry>;
};

/**
 * Define the adapter implementation to use.
 *
 * @internal
 */
export type ConsumeAdapter<RawData = unknown, Data = unknown> = {
  adapter: ResolvableContextDependency<Adapter<RawData, Data>>;
};

/**
 * Define the deserializer implementation to use.
 *
 * @internal
 */
export type ConsumeDeserializer<
  Data = unknown,
  Deserialized extends DeserializedData = DeserializedData,
> = {
  deserializer: ResolvableContextDependency<Deserializer<Data, Deserialized>>;
};

/**
 * Define the serializer implementation to use.
 *
 * @internal
 */
export type ConsumeSerializer<Record = unknown, Related = unknown, Data = unknown> = {
  serializer: ResolvableContextDependency<Serializer<Record, Related, Data>>;
};
