import ActionName from '@foscia/core/actions/actionName';
import context from '@foscia/core/actions/context/enhancers/context';
import onRunning from '@foscia/core/actions/context/enhancers/hooks/onRunning';
import onSuccess from '@foscia/core/actions/context/enhancers/hooks/onSuccess';
import query from '@foscia/core/actions/context/enhancers/query';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import {
  Action,
  ConsumeId,
  ConsumeInstance,
  ConsumeModel,
  WithParsedExtension,
} from '@foscia/core/actions/types';
import runHooks from '@foscia/core/hooks/runHooks';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import { Model, ModelClassInstance, ModelInstance } from '@foscia/core/model/types';

/**
 * Prepare context for an instance deletion.
 *
 * @param instance
 *
 * @category Enhancers
 */
const destroy = <
  C extends {},
  E extends {},
  D extends {},
  I extends ModelInstance<D>,
>(instance: ModelClassInstance<D> & I) => (action: Action<C, E>) => action.use(
  query<C, E, D, I>(instance),
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
);

export default /* @__PURE__ */ appendExtension(
  'destroy',
  destroy,
  'use',
) as WithParsedExtension<typeof destroy, {
  destroy<C extends {}, E extends {}, D extends {}, I extends ModelInstance<D>>(
    this: Action<C, E>,
    instance: ModelClassInstance<D> & I,
  ): Action<C & ConsumeModel<Model<D, I>> & ConsumeInstance<I> & ConsumeId, E>;
}>;
