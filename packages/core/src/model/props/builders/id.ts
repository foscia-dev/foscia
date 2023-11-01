import makePendingProp, { PROP_MODIFIERS } from '@foscia/core/model/props/builders/makePendingProp';
import { ModelIdType, PendingModelProp, RawModelId } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_ID } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';

type PendingModelId<T extends ModelIdType | null, R extends boolean> = {
  transform: <NT extends T>(
    transformer: ObjectTransformer<NT | null>,
  ) => PendingModelId<NT, R>;
  default: <NT extends T>(value: T | (() => T)) => PendingModelId<NT, R>;
  readOnly: <NR extends boolean = true>(readOnly?: NR) => PendingModelId<T, NR>;
  nullable: unknown extends T ? never : (() => PendingModelId<T | null, R>);
} & PendingModelProp<RawModelId<T, R>>;

export default function id<T extends ModelIdType | null>(
  config?: ObjectTransformer<T | null> | T | (() => T),
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
