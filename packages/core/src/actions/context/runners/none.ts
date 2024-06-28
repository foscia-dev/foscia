import raw from '@foscia/core/actions/context/runners/raw';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import { Action, ConsumeAdapter, WithParsedExtension } from '@foscia/core/actions/types';

/**
 * Run the action and ignore the content of the result.
 * Adapter errors are not caught and so may be thrown.
 *
 * @category Runners
 */
const none = <C extends {}>() => async (action: Action<C & ConsumeAdapter>) => {
  await action.run(raw());
};

export default /* @__PURE__ */ appendExtension(
  'none',
  none,
  'run',
) as WithParsedExtension<typeof none, {
  none<C extends {}>(
    this: Action<C & ConsumeAdapter>,
  ): Promise<void>;
}>;
