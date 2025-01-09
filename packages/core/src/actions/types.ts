import ActionName from '@foscia/core/actions/actionName';
import { ActionVariadicRun } from '@foscia/core/actions/actionVariadicRun';
import { ActionVariadicUse } from '@foscia/core/actions/actionVariadicUse';
import { Hookable, HookCallback } from '@foscia/core/hooks/types';
import { Model, ModelIdType, ModelInstance, ModelRelation } from '@foscia/core/model/types';
import {
  SYMBOL_ACTION_CONTEXT_ENHANCER,
  SYMBOL_ACTION_CONTEXT_FUNCTION_FACTORY,
  SYMBOL_ACTION_CONTEXT_RUNNER,
  SYMBOL_ACTION_CONTEXT_WHEN,
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

export * from '@foscia/core/actions/actionVariadicUse';
export * from '@foscia/core/actions/actionVariadicRun';

/**
 * Action hooks definition.
 *
 * @internal
 */
export type ActionHooksDefinition = {
  running: HookCallback<{ action: Action; runner: ContextRunner<any, any>; }>;
  success: HookCallback<{ action: Action; result: unknown; }>;
  error: HookCallback<{ action: Action; error: unknown; }>;
  finally: HookCallback<{ action: Action; }>;
};

/**
 * Action.
 *
 * @typeParam Context The current context of the action.
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
      enhancer: ContextEnhancer<Context, NewContext>,
    ): Action<NewContext>;
    /**
     * Run the action.
     *
     * @param runner
     */
    run<Result>(
      runner: ContextRunner<Context, Result>,
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
      call?: ContextEnhancer<any, any> | ContextRunner<any, any>,
    ): Promise<Awaited<Result>>;
    /**
     * Get the tree of action calls (enhancers or runners).
     *
     * @internal
     */
    calls(): ActionCall[];
  }
  & ActionVariadicUse<Context>
  & ActionVariadicRun<Context>
  & Hookable<ActionHooksDefinition>;

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
 * Action factory.
 *
 * @internal
 */
export type ActionFactory<Args extends any[], Context extends {}> = (
  ...args: Args
) => Action<Context>;

/**
 * Action call (enhancer or runner) tree node.
 *
 * @internal
 */
export type ActionCall = {
  call: ContextEnhancer<any, any> | ContextRunner<any, any>;
  calls: ActionCall[];
};

/**
 * Function to enhance the action context.
 */
export type ContextEnhancer<C extends {}, NC extends {}> = (
  action: Action<C>,
) => Awaitable<Action<NC> | void>;

/**
 * Function to create a result from a contextualized action.
 */
export type ContextRunner<C extends {}, R> = (
  action: Action<C>,
) => R;

/**
 * Available types for a context function.
 *
 * @internal
 */
export type ContextFunctionType =
  | typeof SYMBOL_ACTION_CONTEXT_WHEN
  | typeof SYMBOL_ACTION_CONTEXT_ENHANCER
  | typeof SYMBOL_ACTION_CONTEXT_RUNNER;

/**
 * Conditional context function.
 *
 * @internal
 */
export type ContextWhenFunction = {
  (): ContextEnhancer<any, any> | ContextRunner<any, any>;
  readonly meta: { readonly factory: ContextFunctionFactory; readonly args: any[]; };
} & FosciaObject<typeof SYMBOL_ACTION_CONTEXT_WHEN>;

/**
 * Enhancer context function.
 *
 * @internal
 */
export type ContextEnhancerFunction = {
  (): ContextEnhancer<any, any>;
  readonly meta: { readonly factory: ContextFunctionFactory; readonly args: any[]; };
} & FosciaObject<typeof SYMBOL_ACTION_CONTEXT_ENHANCER>;

/**
 * Runner context function.
 *
 * @internal
 */
export type ContextRunnerFunction = {
  (): ContextRunner<any, any>;
  readonly meta: { readonly factory: ContextFunctionFactory; readonly args: any[]; };
} & FosciaObject<typeof SYMBOL_ACTION_CONTEXT_RUNNER>;

/**
 * Available context functions.
 *
 * @internal
 */
export type ContextFunction =
  | ContextWhenFunction
  | ContextEnhancerFunction
  | ContextRunnerFunction;

/**
 * Factory to produce a context function.
 *
 * @internal
 */
export type ContextFunctionFactory =
  & {
    (...args: any[]): ContextFunction;
    readonly meta: { readonly name: string; };
  }
  & FosciaObject<typeof SYMBOL_ACTION_CONTEXT_FUNCTION_FACTORY>;

/**
 * Infer the query instance from context.
 *
 * This type should be used to infer the instance returned by an action runner.
 *
 * @internal
 */
export type InferQueryInstance<C extends {}> =
  C extends { queryAs: Constructor<infer I>[] } ? I extends ModelInstance ? I : never
    : C extends { relation: ModelRelation<any, Array<infer I>> }
      ? I extends ModelInstance ? I : never
      : C extends { relation: ModelRelation<any, infer I> } ? I extends ModelInstance ? I : never
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
    : C extends { relation: ModelRelation<any, Array<infer I>> }
      ? I extends ModelInstance ? I : never
      : C extends { relation: ModelRelation<any, infer I> } ? I extends ModelInstance ? I : never
        : C extends { instance: infer I } ? I
          : C extends { model: infer M } ? M
            : InferQueryInstance<C>;

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
 * Define the middlewares to run.
 *
 * @internal
 */
export type ConsumeMiddlewares<C extends {}, R> = {
  middlewares?: ActionMiddleware<C, R>[];
};

/**
 * Context dependency which can be lazy-loaded.
 *
 * @internal
 */
type ResolvableContextDependency<T> = T | (() => Awaitable<T>);

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
export type ConsumeDeserializer<Data, Deserialized extends DeserializedData = DeserializedData> = {
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
