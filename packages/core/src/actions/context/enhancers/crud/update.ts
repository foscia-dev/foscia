import ActionName from '@foscia/core/actions/actionName';
import context from '@foscia/core/actions/context/enhancers/context';
import instanceData from '@foscia/core/actions/context/enhancers/crud/instanceData';
import onRunning from '@foscia/core/actions/context/enhancers/hooks/onRunning';
import onSuccess from '@foscia/core/actions/context/enhancers/hooks/onSuccess';
import query from '@foscia/core/actions/context/enhancers/query';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import {
  Action,
  ConsumeId,
  ConsumeInstance,
  ConsumeModel,
  ConsumeSerializer,
  WithParsedExtension,
} from '@foscia/core/actions/types';
import runHooks from '@foscia/core/hooks/runHooks';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import { Model, ModelClassInstance, ModelInstance } from '@foscia/core/model/types';

/**
 * Prepare context for an instance update.
 *
 * @param instance
 *
 * @category Enhancers
 */
const update = <
  C extends {},
  E extends {},
  D extends {},
  I extends ModelInstance<D>,
  Record,
  Related,
  Data,
>(
  instance: ModelClassInstance<D> & I,
) => (
  action: Action<C & ConsumeSerializer<Record, Related, Data>, E>,
) => action.use(
  query<C & ConsumeSerializer<Record, Related, Data>, E, D, I>(instance),
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
);

export default /* @__PURE__ */ appendExtension(
  'update',
  update,
  'use',
) as WithParsedExtension<typeof update, {
  update<
    C extends {},
    E extends {},
    D extends {},
    I extends ModelInstance<D>,
    Record,
    Related,
    Data,
  >(
    this: Action<C & ConsumeSerializer<Record, Related, Data>, E>,
    instance: ModelClassInstance<D> & I,
  ): Action<C & ConsumeModel<Model<D, I>> & ConsumeInstance<I> & ConsumeId, E>;
}>;
