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

export type ActionHooksDefinition<C extends {} = any> = {
  running: HookCallback<{ context: C; runner: Function; }>;
  success: HookCallback<{ context: C; result: unknown; }>;
  error: HookCallback<{ context: C; error: unknown; }>;
  finally: HookCallback<{ context: C; }>;
};

export type Action<Context extends {} = {}, Extension extends {} = {}> =
  & {
    useContext(): Promise<Context>;
    updateContext<NewContext extends {}>(
      newContext: NewContext,
    ): Action<NewContext, Extension>;
    use<NewContext extends {} = Context>(
      enhancer: ContextEnhancer<Context, Extension, NewContext>,
    ): Action<NewContext, Extension>;
    run<Result>(
      runner: ContextRunner<Context, Extension, Result>,
    ): Promise<Awaited<Result>>;
  }
  & ActionVariadicUse<Context, Extension>
  & Hookable<ActionHooksDefinition<Context>>
  & ExtendedAction<Extension>;

export type ActionClass<Context extends {} = {}, Extension extends {} = {}> = {
  extends<NewExtension extends {} = {}>(
    newExtensions?: NewExtension & ThisType<Action<Context, Extension & NewExtension>>,
  ): ActionClass<Context, Extension & NewExtension>;
} & Constructor<Action<Context, Extension>>;

export type ActionFactory<Args extends any[], Context extends {}, Extension extends {}> = (
  ...args: Args
) => Action<Context, Extension>;

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
  C extends { relation: RawModelRelation<Array<infer I>> }
    ? I extends ModelInstance ? I : never
    : C extends { relation: RawModelRelation<infer I> }
      ? I extends ModelInstance ? I : never
      : C extends { model: Constructor<infer I> }
        ? I extends ModelInstance ? I : never : never;

export type ConsumeAction = {
  action: 'read' | 'create' | 'update' | 'destroy' | string;
};

export type ConsumeData = {
  data: unknown;
};

export type ConsumeModel<M extends Model = Model> = {
  model: M;
};

export type ConsumeModelPath = {
  modelPath: string;
};

export type ConsumeInstance<I extends ModelInstance = ModelInstance> = {
  instance: I;
};

export type ConsumeRelation<R extends ModelRelation = ModelRelation> = {
  relation: R;
};

export type ConsumeRelationPath = {
  relationPath: string;
};

export type ConsumeId = {
  id?: ModelIdType;
};

export type ConsumeInclude = {
  include?: string[];
};

export type ConsumeCache = { cache: CacheI; };

export type ConsumeRegistry = { registry: RegistryI; };

export type ConsumeAdapter<AdapterData = unknown> = {
  adapter: AdapterI<AdapterData>;
};

export type ConsumeDeserializer<
  AdapterData = unknown,
  Data extends DeserializedData = DeserializedData,
> = {
  deserializer: DeserializerI<AdapterData, Data>;
};

export type ConsumeSerializer<Data = unknown> = {
  serializer: SerializerI<Data>;
};
