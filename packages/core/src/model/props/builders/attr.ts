import makePendingProp, { PROP_MODIFIERS } from '@foscia/core/model/props/builders/makePendingProp';
import { PendingModelAttribute } from '@foscia/core/model/props/builders/types';
import { SYMBOL_MODEL_PROP_ATTRIBUTE } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';

export default <T>(
  config?: ObjectTransformer<T | null, any, any> | T | (() => T),
) => makePendingProp({
  ...PROP_MODIFIERS,
  transform: (transformer: ObjectTransformer<unknown>) => ({ transformer }),
})({
  $FOSCIA_TYPE: SYMBOL_MODEL_PROP_ATTRIBUTE,
  default: typeof config !== 'object' ? config : undefined,
  transformer: typeof config === 'object' ? config : undefined,
}) as unknown as PendingModelAttribute<T, false>;
