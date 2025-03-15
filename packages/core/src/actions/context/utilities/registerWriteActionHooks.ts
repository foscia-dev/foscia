import onRunning from '@foscia/core/actions/context/enhancers/hooks/onRunning';
import onSuccess from '@foscia/core/actions/context/enhancers/hooks/onSuccess';
import { Action } from '@foscia/core/actions/types';
import runHooks from '@foscia/core/hooks/runHooks';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import { ModelHooksDefinitionForInstance, ModelInstance } from '@foscia/core/model/types';
import { Arrayable } from '@foscia/shared';

/**
 * Register hooks for a write action (create, update or destroy).
 *
 * @param action
 * @param instance
 * @param runningHooks
 * @param successHooks
 * @param exists
 *
 * @internal
 */
export default <C extends {}>(
  action: Action<C>,
  instance: ModelInstance,
  runningHooks: Arrayable<keyof ModelHooksDefinitionForInstance>,
  successHooks: Arrayable<keyof ModelHooksDefinitionForInstance>,
  exists: boolean,
): Action<C> => {
  const snapshot = instance.$original;

  return action(
    onRunning(() => runHooks(instance.$model, runningHooks, instance)),
    onSuccess(async () => {
      // When the original snapshot didn't change, this means the instance
      // haven't been deserialized, so we must mark it synced manually.
      if (instance.$original === snapshot) {
        // eslint-disable-next-line no-param-reassign
        instance.$exists = exists;
        markSynced(instance);
      }

      await runHooks(instance.$model, successHooks, instance);
    }),
  );
};
