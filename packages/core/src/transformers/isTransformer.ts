import { SYMBOL_MODEL_PROP_TRANSFORMER } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';
import { isFosciaType } from '@foscia/shared';

export default (
  value: unknown,
): value is ObjectTransformer<unknown> => isFosciaType(value, SYMBOL_MODEL_PROP_TRANSFORMER);
