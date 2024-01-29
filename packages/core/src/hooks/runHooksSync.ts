import { Hookable, HookCallback, HooksDefinition } from '@foscia/core/hooks/types';
import { Arrayable, wrap } from '@foscia/shared';

/**
 * Sequentially run multiple hooks of a hookable object (synchronously).
 *
 * @param hookable
 * @param hooks
 * @param event
 */
export default function runHooksSync<D extends HooksDefinition, K extends keyof D>(
  hookable: Hookable<D>,
  hooks: Arrayable<K>,
  event: D[K] extends HookCallback<infer E> ? E : never,
) {
  wrap(hooks).forEach((hook) => {
    const hookCallbacks = hookable.$hooks?.[hook] ?? [];

    hookCallbacks.map((callback) => callback(event));
  });
}
