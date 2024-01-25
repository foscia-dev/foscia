import makePendingProp, { PROP_MODIFIERS } from '@foscia/core/model/props/builders/makePendingProp';
import { PendingModelAttribute } from '@foscia/core/model/props/builders/types';
import { SYMBOL_MODEL_PROP_ATTRIBUTE } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';

export default function attr<T>(
  config?: ObjectTransformer<T | null, any, any> | T | (() => T),
) {
  const makePendingAttribute = makePendingProp({
    ...PROP_MODIFIERS,
    transform: (transformer: ObjectTransformer<unknown>) => ({ transformer }),
  });

  return makePendingAttribute({
    $FOSCIA_TYPE: SYMBOL_MODEL_PROP_ATTRIBUTE,
    default: typeof config !== 'object' ? config : undefined,
    transformer: typeof config === 'object' ? config : undefined,
  }) as unknown as PendingModelAttribute<T, false>;
}
