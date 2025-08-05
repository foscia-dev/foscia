import { ENTITY_PLUGIN } from '@foscia/core/new/entities/plugins/consts';
import { EntityPlugin } from '@foscia/core/new/entities/plugins/types';
import { Entity } from '@foscia/core/new/entities/types';
import identify from '@foscia/core/new/shared/identity/identify';
import makePlugin from '@foscia/core/new/shared/plugins/makePlugin';
import { ApplyPlugins, Plugin } from '@foscia/core/new/shared/plugins/types';

export default function makeEntityPlugin<
  Output extends object,
  Input extends Entity = Entity,
>(
  applyPlugin: (input: Input) => ApplyPlugins<Input, Plugin<Input, Output>>,
  verifyInput?: (value: unknown) => value is Input,
): EntityPlugin<Input, Output> {
  return identify(ENTITY_PLUGIN, makePlugin<Input, Output>(applyPlugin, verifyInput));
}
