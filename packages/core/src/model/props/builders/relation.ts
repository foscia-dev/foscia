import makePendingProp, { PROP_MODIFIERS } from '@foscia/core/model/props/builders/makePendingProp';
import {
  Model,
  ModelInstance,
  ModelPropSync,
  ModelRelationType,
  PendingModelProp,
  RawModelRelation,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_RELATION } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

export type PendingModelRelation<T, R extends boolean> = {
  to: <NT>(to: PendingModelRelationTo<NT>) => PendingModelRelation<T extends any[] ? NT[] : NT, R>;
  default: <NT extends T>(value: T | (() => T)) => PendingModelRelation<NT, R>;
  readOnly: <NR extends boolean = true>(readOnly?: NR) => PendingModelRelation<T, NR>;
  nullable: unknown extends T ? never : (() => PendingModelRelation<T | null, R>);
  alias: (alias: string) => PendingModelRelation<T, R>;
  sync: (alias: boolean | ModelPropSync) => PendingModelRelation<T, R>;
} & PendingModelProp<RawModelRelation<T, R>>;

export type InferPendingModelRelationModel<I> =
  I extends any[] ? Model<any, I[number]>
    : I extends ModelInstance ? Model<any, I>
      : I;

export type PendingModelRelationTo<I> =
  | string
  | (() => Awaitable<InferPendingModelRelationModel<I>>)
  | { model?: (() => Awaitable<InferPendingModelRelationModel<I>>); type?: string; path?: string; };

export default function relation<I>(
  relationType: ModelRelationType,
  config?: PendingModelRelationTo<I>,
) {
  const resolveConfig = (configValue: PendingModelRelationTo<any>) => {
    if (typeof configValue === 'string') {
      return { type: configValue };
    }

    if (typeof configValue === 'function') {
      return { model: configValue };
    }

    return configValue;
  };

  const makePendingRelation = makePendingProp({
    ...PROP_MODIFIERS,
    to: resolveConfig,
  });

  return makePendingRelation({
    $FOSCIA_TYPE: SYMBOL_MODEL_PROP_RELATION,
    $RELATION_TYPE: relationType,
    ...resolveConfig(config ?? {}),
  }) as unknown as PendingModelRelation<I, false>;
}
