import { Hookable, HookCallback, HooksDefinition } from '@foscia/core/hooks/types';
import { Arrayable, sequentialTransform, wrap } from '@foscia/shared';

/**
 * Sequentially run multiple hooks of a hookable object.
 *
 * @param hookable
 * @param hooks
 * @param event
 *
 * @category Hooks
 */
export default <D extends HooksDefinition, K extends keyof D>(
  hookable: Hookable<D>,
  hooks: Arrayable<K>,
  event: D[K] extends HookCallback<infer E> ? E : never,
) => sequentialTransform(wrap(hooks).map((hook) => async () => {
  const hookCallbacks = hookable.$hooks?.[hook] ?? [];

  await sequentialTransform(hookCallbacks.map((callback) => async () => {
    await callback(event);
  }));
}));
