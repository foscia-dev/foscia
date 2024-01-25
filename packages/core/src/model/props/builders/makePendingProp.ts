import {
  PendingDefinition,
  PendingDefinitionModifiers,
} from '@foscia/core/model/props/builders/types';
import type { ModelPropSync } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_PENDING } from '@foscia/core/symbols';
import { Dictionary } from '@foscia/shared';

export const PROP_MODIFIERS = {
  default: (value: unknown | (() => unknown)) => ({ default: value }),
  alias: (alias: string) => ({ alias }),
  readOnly: (readOnly?: boolean) => ({ readOnly }),
  sync: (sync: boolean | ModelPropSync) => ({ sync }),
  nullable: () => ({}),
};

export default function makePendingProp(
  modifiers: Dictionary<(...args: any[]) => Dictionary>,
) {
  const makePendingPropBuilder = (definition: Dictionary): PendingDefinition => ({
    $FOSCIA_TYPE: SYMBOL_MODEL_PROP_PENDING,
    definition,
    ...Object.entries(modifiers).reduce((prev, [key, modifier]) => ({
      ...prev,
      [key]: (...args) => makePendingPropBuilder({
        ...definition,
        ...modifier(...args),
      }),
    }), {} as PendingDefinitionModifiers),
  } as PendingDefinition);

  return makePendingPropBuilder;
}
