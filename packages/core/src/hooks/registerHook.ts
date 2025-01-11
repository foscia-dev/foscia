/* eslint-disable no-param-reassign */
import { Hookable, HooksDefinition } from '@foscia/core/hooks/types';
import unregisterHook from '@foscia/core/hooks/unregisterHook';
import { tap } from '@foscia/shared';

/**
 * Register a hook on a hookable object.
 * Return value is a function which unregister the hook.
 *
 * @param hookable
 * @param key
 * @param callback
 *
 * @category Hooks
 */
export default <D extends HooksDefinition, K extends keyof D>(
  hookable: Hookable<D>,
  key: K,
  callback: D[K],
) => tap(() => unregisterHook(hookable, key, callback), () => {
  if (hookable.$hooks !== null) {
    hookable.$hooks[key] = [...(hookable.$hooks[key] ?? []), callback] as D[K][];
  }
});
