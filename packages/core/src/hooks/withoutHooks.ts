import { Hookable } from '@foscia/core/hooks/types';

/**
 * Temporary disable the hooks of the given object and run callback.
 *
 * @param hookable
 * @param callback
 *
 * @category Hooks
 */
export default <T extends Hookable<any>, R>(
  hookable: T,
  callback: (hookable: T) => R,
): R => {
  const hooksBackup = hookable.$hooks;
  const restoreHooks = () => {
    // eslint-disable-next-line no-param-reassign
    hookable.$hooks = hooksBackup;
  };

  let restoreHooksImmediately = true;
  // eslint-disable-next-line no-param-reassign
  hookable.$hooks = null;

  try {
    const value = callback(hookable);
    if (value instanceof Promise) {
      restoreHooksImmediately = false;

      return new Promise((resolve, reject) => {
        value
          .then((v) => {
            restoreHooks();
            resolve(v);
          })
          .catch((e) => {
            restoreHooks();
            reject(e);
          });
      }) as any;
    }

    return value as any;
  } finally {
    if (restoreHooksImmediately) {
      restoreHooks();
    }
  }
};
