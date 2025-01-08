import { Hookable, HooksDefinition } from '@foscia/core/hooks/types';

/**
 * Unregister a hook from a hookable object.
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
) => {
  if (hookable.$hooks !== null) {
    const index = hookable.$hooks[key]?.indexOf(callback);
    if (index !== undefined && index !== -1) {
      hookable.$hooks[key]!.splice(index, 1);
    }
  }
};
