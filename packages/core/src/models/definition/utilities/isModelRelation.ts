import isModelProp from '@foscia/core/models/definition/utilities/isModelProp';
import { ModelInstance, ModelProp, ModelRelationProp } from '@foscia/core/models/types';
import { SYMBOL_MODEL_PROP_RELATION } from '@foscia/core/symbols';
import { Arrayable } from '@foscia/shared/types';

/**
 * Check if value is a model relation property.
 *
 * @param value
 *
 * @category Utilities
 */
export default function isModelRelation<I extends ModelInstance>(
  value: ModelProp<any, I> | unknown,
): value is ModelRelationProp<Arrayable<ModelInstance> | null, I> {
  return isModelProp(value) && value.kind === SYMBOL_MODEL_PROP_RELATION;
}
