import makePendingProp, { PROP_MODIFIERS } from '@foscia/core/model/props/builders/makePendingProp';
import { ModelPropSync, PendingModelProp, RawModelAttribute } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_ATTRIBUTE } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';

type PendingModelAttribute<T, R extends boolean> = {
  transform: <NT extends T>(
    transformer: ObjectTransformer<NT | null>,
  ) => PendingModelAttribute<NT, R>;
  default: <NT extends T>(value: T | (() => T)) => PendingModelAttribute<NT, R>;
  readOnly: <NR extends boolean = true>(readOnly?: NR) => PendingModelAttribute<T, NR>;
  nullable: unknown extends T ? never : (() => PendingModelAttribute<T | null, R>);
  alias: (alias: string) => PendingModelAttribute<T, R>;
  sync: (alias: boolean | ModelPropSync) => PendingModelAttribute<T, R>;
} & PendingModelProp<RawModelAttribute<T, R>>;

export default function attr<T>(
  config?: ObjectTransformer<T | null> | T | (() => T),
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
