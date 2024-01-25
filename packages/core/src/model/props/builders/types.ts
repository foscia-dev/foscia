import {
  Model,
  ModelIdType,
  ModelPropSync,
  ModelRelationConfig,
  PendingModelProp,
  RawModelAttribute,
  RawModelId,
  RawModelRelation,
} from '@foscia/core/model/types';
import { ObjectTransformer } from '@foscia/core/transformers/types';
import { Awaitable, Constructor, Dictionary } from '@foscia/shared';

export type PendingDefinitionModifiers = Dictionary<(...args: any[]) => PendingDefinition>;

export type PendingDefinition = PendingModelProp<Dictionary> & PendingDefinitionModifiers;

export type PendingModelId<T extends ModelIdType | null, R extends boolean> = {
  transform: <NT extends T>(
    transformer: ObjectTransformer<NT | null, any, any>,
  ) => PendingModelId<NT, R>;
  default: <NT extends T>(value: T | (() => T)) => PendingModelId<NT, R>;
  readOnly: <NR extends boolean = true>(readOnly?: NR) => PendingModelId<T, NR>;
  nullable: unknown extends T ? never : (() => PendingModelId<T | null, R>);
} & PendingModelProp<RawModelId<T, R>>;

export type PendingModelAttribute<T, R extends boolean> = {
  transform: <NT extends T>(
    transformer: ObjectTransformer<NT | null, any, any>,
  ) => PendingModelAttribute<NT, R>;
  default: <NT extends T>(value: T | (() => T)) => PendingModelAttribute<NT, R>;
  readOnly: <NR extends boolean = true>(readOnly?: NR) => PendingModelAttribute<T, NR>;
  nullable: unknown extends T ? never : (() => PendingModelAttribute<T | null, R>);
  alias: (alias: string) => PendingModelAttribute<T, R>;
  sync: (alias: boolean | ModelPropSync) => PendingModelAttribute<T, R>;
} & PendingModelProp<RawModelAttribute<T, R>>;

export type PendingModelRelationInstance<M> =
  M extends Constructor<infer I>[] ? I
    : M extends Constructor<infer I> ? I
      : never;

export type PendingModelRelationConfig =
  | string
  | string[]
  | ModelRelationConfig
  | (() => Awaitable<Model | Model[]>);

export type PendingModelRelation<T, R extends boolean> = {
  config: (config: string | string[] | ModelRelationConfig) => PendingModelRelation<T, R>;
  default: <NT extends T>(value: T | (() => T)) => PendingModelRelation<NT, R>;
  readOnly: <NR extends boolean = true>(readOnly?: NR) => PendingModelRelation<T, NR>;
  nullable: unknown extends T ? never : (() => PendingModelRelation<T | null, R>);
  alias: (alias: string) => PendingModelRelation<T, R>;
  sync: (alias: boolean | ModelPropSync) => PendingModelRelation<T, R>;
} & PendingModelProp<RawModelRelation<T, R>>;
