import makePendingProp, { PROP_MODIFIERS } from '@foscia/core/model/props/builders/makePendingProp';
import {
  Model,
  ModelInstance,
  ModelPropSync,
  ModelRelationConfig,
  ModelRelationType,
  PendingModelProp,
  RawModelRelation,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_RELATION } from '@foscia/core/symbols';
import { Awaitable, Constructor } from '@foscia/shared';

export type PendingModelRelationInstance<M extends Model | Model[]> =
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

/**
 * Make a pending relation definition.
 *
 * @param relationType
 * @param config
 *
 * @internal
 */
export default function relation(
  relationType: ModelRelationType,
  config?: PendingModelRelationConfig,
) {
  const resolveConfig = (configValue: PendingModelRelationConfig) => {
    if (typeof configValue === 'string' || Array.isArray(configValue)) {
      return { type: configValue };
    }

    if (typeof configValue === 'function') {
      return { model: configValue };
    }

    return { ...configValue };
  };

  const makePendingRelation = makePendingProp({
    ...PROP_MODIFIERS,
    config: resolveConfig,
  });

  return makePendingRelation({
    $FOSCIA_TYPE: SYMBOL_MODEL_PROP_RELATION,
    $RELATION_TYPE: relationType,
    ...resolveConfig(config ?? {}),
  }) as unknown as PendingModelRelation<ModelInstance | ModelInstance[] | null, false>;
}
