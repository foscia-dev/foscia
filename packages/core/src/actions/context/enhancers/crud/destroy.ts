import ActionName from '@foscia/core/actions/actionName';
import context from '@foscia/core/actions/context/enhancers/context';
import onRunning from '@foscia/core/actions/context/enhancers/hooks/onRunning';
import onSuccess from '@foscia/core/actions/context/enhancers/hooks/onSuccess';
import query from '@foscia/core/actions/context/enhancers/query';
import makeEnhancer from '@foscia/core/actions/makeEnhancer';
import { Action } from '@foscia/core/actions/types';
import runHooks from '@foscia/core/hooks/runHooks';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import { ModelInstance } from '@foscia/core/model/types';

/**
 * Prepare context for an instance deletion.
 *
 * @param instance
 *
 * @category Enhancers
 * @provideContext model, instance, id
 *
 * @example
 * ```typescript
 * import { destroy, none } from '@foscia/core';
 *
 * await action().run(destroy(post), none());
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('destroy', <
  C extends {},
  I extends ModelInstance,
>(instance: I) => (action: Action<C>) => action.use(
  query(instance),
  context({
    action: ActionName.DESTROY,
    // Rewrite ID to ensure destroy targets the record termination point
    // even if $exists is false.
    id: (instance as ModelInstance).id,
  }),
  onRunning(() => runHooks(instance.$model, 'destroying', instance)),
  onSuccess(async () => {
    // eslint-disable-next-line no-param-reassign
    instance.$exists = false;
    markSynced(instance);
    await runHooks(instance.$model, 'destroyed', instance);
  }),
));
