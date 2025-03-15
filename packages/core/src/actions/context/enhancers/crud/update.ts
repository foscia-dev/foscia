import ActionKind from '@foscia/core/actions/context/actionKind';
import context from '@foscia/core/actions/context/enhancers/context';
import instanceData from '@foscia/core/actions/context/enhancers/crud/instanceData';
import query from '@foscia/core/actions/context/enhancers/query';
import registerWriteActionHooks
  from '@foscia/core/actions/context/utilities/registerWriteActionHooks';
import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
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
 * await action(update(post), none());
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
) => registerWriteActionHooks(action(
  query(instance),
  context({
    actionKind: ActionKind.UPDATE,
    // Rewrite ID to ensure update targets the record termination point
    // even if $exists is false.
    id: (instance as ModelInstance).id,
  }),
  instanceData(instance),
), instance, ['updating', 'saving'], ['updated', 'saved'], true));
