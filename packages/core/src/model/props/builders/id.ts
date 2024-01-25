import makePendingProp, { PROP_MODIFIERS } from '@foscia/core/model/props/builders/makePendingProp';
import { PendingModelId } from '@foscia/core/model/props/builders/types';
import { ModelIdType } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_ID } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';

export default function id<T extends ModelIdType | null>(
  config?: ObjectTransformer<T | null, any, any> | T | (() => T),
) {
  const makePendingId = makePendingProp({
    ...PROP_MODIFIERS,
    transform: (transformer: ObjectTransformer<unknown>) => ({ transformer }),
  });

  return makePendingId({
    $FOSCIA_TYPE: SYMBOL_MODEL_PROP_ID,
    transformer: config,
  }) as unknown as PendingModelId<T, false>;
}
