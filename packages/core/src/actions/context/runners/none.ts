import raw from '@foscia/core/actions/context/runners/raw';
import { ConsumeAdapter, AnonymousRunner } from '@foscia/core/actions/types';
import makeRunner from '@foscia/core/actions/utilities/makeRunner';

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
 * await action(destroy(post), none());
 * ```
 */
export default makeRunner('none', raw as {
  <C extends {}>(): AnonymousRunner<C & ConsumeAdapter, Promise<void>>;
});
