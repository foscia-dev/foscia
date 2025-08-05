import { Hookable } from '@foscia/core/hooks/types';
import { temporaryBackup } from '@foscia/shared';

/* eslint-disable no-param-reassign */

/**
 * Execute a callback with temporary disabled hooks on a hookable object.
 *
 * @param hookable
 * @param callback
 *
 * @category Hooks
 */
export default function withoutHooks<T extends Hookable<any>, R>(
  hookable: T,
  callback: () => R,
): R {
  return temporaryBackup(callback, () => {
    const hooksBackup = hookable.$hooks;

    hookable.$hooks = null;

    return hooksBackup;
  }, (hooksBackup) => {
    hookable.$hooks = hooksBackup;
  });
}
