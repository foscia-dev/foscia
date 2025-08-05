import isModelRelation from '@foscia/core/models/definition/utilities/isModelRelation';
import { ModelHasOneOrManyProp, ModelInstance, ModelProp } from '@foscia/core/models/types';
import {
  SYMBOL_MODEL_RELATION_HAS_MANY,
  SYMBOL_MODEL_RELATION_HAS_ONE,
  SYMBOL_MODEL_RELATION_MORPH_MANY,
  SYMBOL_MODEL_RELATION_MORPH_ONE,
} from '@foscia/core/symbols';
import { Arrayable } from '@foscia/shared/types';

/**
 * Check if value is a model relation property.
 *
 * @param value
 *
 * @category Utilities
 */
export default function isModelHasOneOrManyRelation<I extends ModelInstance>(
  value: ModelProp<any, I> | unknown,
): value is ModelHasOneOrManyProp<Arrayable<ModelInstance> | null, I> {
  return isModelRelation(value)
    && [
      SYMBOL_MODEL_RELATION_HAS_ONE,
      SYMBOL_MODEL_RELATION_HAS_MANY,
      SYMBOL_MODEL_RELATION_MORPH_ONE,
      SYMBOL_MODEL_RELATION_MORPH_MANY,
    ].indexOf(value.relationKind) !== -1;
}
