import raw from '@foscia/core/actions/context/runners/raw';
import makeRunner from '@foscia/core/actions/makeRunner';
import { Action, ConsumeAdapter } from '@foscia/core/actions/types';

/**
 * Run the action and ignore the content of the result.
 * Adapter errors are not caught and so may be thrown.
 *
 * @category Runners
 * @requireContext adapter
 *
 * @example
 * ```typescript
 * import { destroy, none } from '@foscia/core';
 *
 * await action().run(destroy(post), none());
 * ```
 */
export default makeRunner('none', <C extends {}>() => async (
  action: Action<C & ConsumeAdapter>,
) => {
  await action.run(raw());
});
