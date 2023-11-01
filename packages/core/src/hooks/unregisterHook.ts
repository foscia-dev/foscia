import { Hookable, HooksDefinition } from '@foscia/core/hooks/types';

export default function unregisterHook<D extends HooksDefinition, K extends keyof D>(
  hookable: Hookable<D>,
  key: K,
  callback: D[K],
) {
  if (hookable.$hooks !== null) {
    const index = hookable.$hooks[key]?.indexOf(callback);
    if (index !== undefined && index !== -1) {
      hookable.$hooks[key]!.splice(index, 1);
    }
  }
}
