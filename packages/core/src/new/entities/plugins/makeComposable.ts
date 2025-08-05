import { ENTITY_COMPOSABLE_PLUGIN } from '@foscia/core/new/entities/plugins/consts';
import { EntityComposablePlugin } from '@foscia/core/new/entities/plugins/types';
import { AnySchemaFragment, FinalSchemaFragment } from '@foscia/core/new/entities/types';
import identify from '@foscia/core/new/shared/identity/identify';
import makePlugin from '@foscia/core/new/shared/plugins/makePlugin';

export default function makeComposable<
  Output extends AnySchemaFragment,
  Input extends AnySchemaFragment,
>(
  FragmentConstructor: new () => Output,
  verifyInput?: (value: unknown) => value is Input,
): EntityComposablePlugin<Input, FinalSchemaFragment<Output>> {
  return identify(ENTITY_COMPOSABLE_PLUGIN, makePlugin<Input, Output>((fragment) => {
    const nextFragment = new FragmentConstructor();

    return Object.assign(fragment, {
      $plugins: [...(fragment.$plugins ?? []), ...(nextFragment.$plugins ?? [])],
      ...nextFragment,
    });
  }, verifyInput));
}
