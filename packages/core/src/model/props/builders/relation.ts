import makePendingProp, { PROP_MODIFIERS } from '@foscia/core/model/props/builders/makePendingProp';
import {
  PendingModelRelation,
  PendingModelRelationConfig,
} from '@foscia/core/model/props/builders/types';
import { ModelInstance, ModelRelationType } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_RELATION } from '@foscia/core/symbols';

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
