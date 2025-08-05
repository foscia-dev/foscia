/* eslint-disable no-param-reassign */
import FosciaError from '@foscia/core/errors/fosciaError';
import { Hookable, HooksDefinition } from '@foscia/core/hooks/types';
import unregisterHook from '@foscia/core/hooks/unregisterHook';

/**
 * Register a hook on a hookable object.
 *
 * @param hookable
 * @param key
 * @param callback
 *
 * @returns The unregister function for the registered hook.
 *
 * @internal
 */
export default function registerHook<D extends HooksDefinition, K extends keyof D>(
  hookable: Hookable<D>,
  key: K,
  callback: D[K],
) {
  if (!hookable.$hooks) {
    throw new FosciaError('Could not register hook, hooks are temporary disabled.');
  }

  hookable.$hooks[key] = [...(hookable.$hooks[key] ?? []), callback] as D[K][];

  return () => unregisterHook(hookable, key, callback);
}
