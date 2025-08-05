import isModelProp from '@foscia/core/models/definition/utilities/isModelProp';
import {
  ModelInstance,
  ModelPrimary,
  ModelPrimaryProp,
  ModelProp,
} from '@foscia/core/models/types';
import { SYMBOL_MODEL_PROP_PRIMARY } from '@foscia/core/symbols';

/**
 * Check if value is a model primary property.
 *
 * @param value
 *
 * @category Utilities
 */
export default function isModelPrimary<I extends ModelInstance>(
  value: ModelProp<any, I> | unknown,
): value is ModelPrimaryProp<ModelPrimary, I> {
  return isModelProp(value) && value.kind === SYMBOL_MODEL_PROP_PRIMARY;
}
