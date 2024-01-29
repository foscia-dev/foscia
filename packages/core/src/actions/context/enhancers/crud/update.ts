import context from '@foscia/core/actions/context/enhancers/context';
import instanceData from '@foscia/core/actions/context/enhancers/crud/instanceData';
import forInstance from '@foscia/core/actions/context/enhancers/forInstance';
import changeInstanceExistence
  from '@foscia/core/actions/context/enhancers/hooks/changeInstanceExistence';
import onRunning from '@foscia/core/actions/context/enhancers/hooks/onRunning';
import onSuccess from '@foscia/core/actions/context/enhancers/hooks/onSuccess';
import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeId,
  ConsumeInstance,
  ConsumeModel,
  ConsumeSerializer,
} from '@foscia/core/actions/types';
import runHooks from '@foscia/core/hooks/runHooks';
import { Model, ModelClassInstance, ModelInstance } from '@foscia/core/model/types';

/**
 * Prepare context for an instance update.
 *
 * @param instance
 *
 * @category Enhancers
 */
export default function update<
  C extends {},
  D extends {},
  I extends ModelInstance<D>,
  Record,
  Related,
  Data,
>(instance: ModelClassInstance<D> & I) {
  return (action: Action<C & ConsumeSerializer<Record, Related, Data>>) => action
    .use(forInstance<C & ConsumeSerializer<Record, Related, Data>, D, I>(instance))
    .use(context({ action: 'update' }))
    .use(instanceData(instance))
    .use(changeInstanceExistence(true))
    .use(onRunning(() => runHooks(instance.$model, ['updating', 'saving'], instance)))
    .use(onSuccess(() => runHooks(instance.$model, ['updated', 'saved'], instance)));
}

type EnhancerExtension = ActionParsedExtension<{
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

update.extension = makeEnhancersExtension({ update }) as EnhancerExtension;
