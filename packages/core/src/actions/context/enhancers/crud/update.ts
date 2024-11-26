import ActionName from '@foscia/core/actions/actionName';
import context from '@foscia/core/actions/context/enhancers/context';
import instanceData from '@foscia/core/actions/context/enhancers/crud/instanceData';
import onRunning from '@foscia/core/actions/context/enhancers/hooks/onRunning';
import onSuccess from '@foscia/core/actions/context/enhancers/hooks/onSuccess';
import query from '@foscia/core/actions/context/enhancers/query';
import makeEnhancer from '@foscia/core/actions/makeEnhancer';
import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
import runHooks from '@foscia/core/hooks/runHooks';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import { ModelInstance } from '@foscia/core/model/types';

/**
 * Prepare context for an instance update.
 *
 * @param instance
 *
 * @category Enhancers
 * @provideContext model, instance, id
 * @requireContext serializer
 *
 * @example
 * ```typescript
 * import { update, none } from '@foscia/core';
 *
 * await action().run(update(post), none());
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('update', <
  C extends {},
  I extends ModelInstance,
  Record,
  Related,
  Data,
>(
  instance: I,
) => (
  action: Action<C & ConsumeSerializer<Record, Related, Data>>,
) => action.use(
  query(instance),
  context({
    action: ActionName.UPDATE,
    // Rewrite ID to ensure update targets the record termination point
    // even if $exists is false.
    id: (instance as ModelInstance).id,
  }),
  instanceData(instance),
  onRunning(() => runHooks(instance.$model, ['updating', 'saving'], instance)),
  onSuccess(async () => {
    // eslint-disable-next-line no-param-reassign
    instance.$exists = true;
    markSynced(instance);
    await runHooks(instance.$model, ['updated', 'saved'], instance);
  }),
));
