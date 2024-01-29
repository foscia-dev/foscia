/* eslint-disable no-param-reassign */
import { Hookable } from '@foscia/core/hooks/types';

export default function withoutHooks<T extends Hookable<any>, R>(
  hookable: T,
  callback: (hookable: T) => R,
): R extends Promise<infer A> ? Promise<A> : R {
  const hooksBackup = hookable.$hooks;
  let restoreHooksImmediately = true;

  hookable.$hooks = null;

  try {
    const value = callback(hookable);
    if (value instanceof Promise) {
      restoreHooksImmediately = false;

      return new Promise((resolve, reject) => {
        value
          .then((v) => {
            hookable.$hooks = hooksBackup;
            resolve(v);
          })
          .catch((e) => {
            hookable.$hooks = hooksBackup;
            reject(e);
          });
      }) as any;
    }

    return value as any;
  } finally {
    if (restoreHooksImmediately) {
      hookable.$hooks = hooksBackup;
    }
  }
}
