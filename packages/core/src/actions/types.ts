import { ActionVariadicUse } from '@foscia/core/actions/actionVariadicUse';
import { Hookable, HookCallback } from '@foscia/core/hooks/types';
import {
  Model,
  ModelIdType,
  ModelInstance,
  ModelRelation,
  RawModelRelation,
} from '@foscia/core/model/types';
import {
  AdapterI,
  CacheI,
  DeserializedData,
  DeserializerI,
  RegistryI,
  SerializerI,
} from '@foscia/core/types';
import { Awaitable, Constructor, DescriptorHolder } from '@foscia/shared';

export * from '@foscia/core/actions/actionVariadicUse';

export type ActionHooksDefinition = {
  running: HookCallback<{ context: {}; runner: Function; }>;
  success: HookCallback<{ context: {}; result: unknown; }>;
  error: HookCallback<{ context: {}; error: unknown; }>;
  finally: HookCallback<{ context: {}; }>;
};

export type Action<Context extends {} = {}, Extensions extends {} = {}> =
  & {
    useContext(): Promise<Context>;
    updateContext<NewContext extends {}>(
      newContext: NewContext,
    ): Action<NewContext, Extensions>;
    use<NewContext extends {} = Context>(
      enhancer: ContextEnhancer<Context, Extensions, NewContext>,
    ): Action<NewContext, Extensions>;
    run<Result>(
      runner: ContextRunner<Context, Extensions, Result>,
    ): Promise<Awaited<Result>>;
  }
  & ActionVariadicUse<Context, Extensions>
  & Hookable<ActionHooksDefinition>
  & ExtendedAction<Extensions>;

export type ActionClass<Context extends {} = {}, Extensions extends {} = {}> = {
  extend<NewExtension extends {} = {}>(
    newExtensions?: NewExtension & ThisType<Action<Context, Extensions & NewExtension>>,
  ): ActionClass<Context, Extensions & NewExtension>;
} & Constructor<Action<Context, Extensions>>;

export type ActionFactory<Args extends any[], Context extends {}, Extensions extends {}> = (
  ...args: Args
) => Action<Context, Extensions>;

export type ActionParsedExtension<E extends {} = {}> = {
  [K in keyof E]: E[K] extends DescriptorHolder<any> ? E[K] : DescriptorHolder<E[K]>;
};

export type ExtendedAction<E extends {}> = {
  [K in keyof E]: E[K] extends DescriptorHolder<infer T> ? T : E[K];
};

export type ContextEnhancer<C extends {}, E extends {}, NC extends {}> = (
  action: Action<C, E>,
) => Awaitable<Action<NC, E> | Action<NC> | void>;

export type ContextRunner<C extends {}, E extends {}, R> = (
  action: Action<C, E>,
) => R;

export type InferConsumedInstance<C extends {}> =
  C extends { relation: RawModelRelation<Array<infer I>> } ? I extends ModelInstance ? I : never
    : C extends { relation: RawModelRelation<infer I> } ? I extends ModelInstance ? I : never
      : C extends { instance: infer I } ? I extends ModelInstance ? I : never
        : C extends { model: Constructor<infer I> } ? I extends ModelInstance ? I : never
          : never;

export type InferConsumedModelOrInstance<C extends {}> =
  C extends { relation: RawModelRelation<Array<infer I>> } ? I extends ModelInstance ? I : never
    : C extends { relation: RawModelRelation<infer I> } ? I extends ModelInstance ? I : never
      : C extends { model: infer M } ? M
        : InferConsumedInstance<C>;

export type ConsumeAction = {
  action: 'read' | 'create' | 'update' | 'destroy' | string;
};

export type ConsumeData = {
  data: unknown;
};

export type ConsumeModel<M extends Model = Model> = {
  model: M;
};

export type ConsumeInstance<I extends ModelInstance = ModelInstance> = {
  instance: I;
};

export type ConsumeRelation<R extends ModelRelation = ModelRelation> = {
  relation: R;
};

export type ConsumeId = {
  id?: ModelIdType;
};

export type ConsumeInclude = {
  include?: string[];
};

export type ResolvableContextDependency<T> = T | (() => Awaitable<T>);

export type ConsumeCache = {
  cache: ResolvableContextDependency<CacheI>;
};

export type ConsumeRegistry = {
  registry: ResolvableContextDependency<RegistryI>;
};

export type ConsumeAdapter<RawData = unknown, Data = unknown> = {
  adapter: ResolvableContextDependency<AdapterI<RawData, Data>>;
};

export type ConsumeDeserializer<Data, Deserialized extends DeserializedData = DeserializedData> = {
  deserializer: ResolvableContextDependency<DeserializerI<Data, Deserialized>>;
};

export type ConsumeSerializer<Record = unknown, Related = unknown, Data = unknown> = {
  serializer: ResolvableContextDependency<SerializerI<Record, Related, Data>>;
};
