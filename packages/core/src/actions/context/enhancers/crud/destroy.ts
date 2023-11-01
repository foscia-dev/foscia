import context from '@foscia/core/actions/context/enhancers/context';
import forInstance from '@foscia/core/actions/context/enhancers/forInstance';
import changeInstanceExistence
  from '@foscia/core/actions/context/enhancers/hooks/changeInstanceExistence';
import onRunning from '@foscia/core/actions/context/enhancers/hooks/onRunning';
import onSuccess from '@foscia/core/actions/context/enhancers/hooks/onSuccess';
import runInstanceHooks from '@foscia/core/actions/context/enhancers/hooks/runInstanceHooks';
import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeId,
  ConsumeInstance,
  ConsumeModel,
} from '@foscia/core/actions/types';
import { Model, ModelClassInstance, ModelInstance } from '@foscia/core/model/types';

/**
 * Prepare context for an instance deletion.
 *
 * @param instance
 *
 * @category Enhancers
 */
export default function destroy<
  C extends {},
  D extends {},
  I extends ModelInstance<D>,
>(instance: ModelClassInstance<D> & I) {
  return (action: Action<C>) => action
    .use(forInstance<C, D, I>(instance))
    .use(context({ action: 'destroy' }))
    .use(changeInstanceExistence(false))
    .use(onRunning(runInstanceHooks(instance, ['destroying'])))
    .use(onSuccess(runInstanceHooks(instance, ['destroyed'])));
}

type EnhancerExtension = ActionParsedExtension<{
  destroy<C extends {}, E extends {}, D extends {}, I extends ModelInstance<D>>(
    this: Action<C, E>,
    instance: ModelClassInstance<D> & I,
  ): Action<C & ConsumeModel<Model<D, I>> & ConsumeInstance<I> & ConsumeId, E>;
}>;

destroy.extension = makeEnhancersExtension({ destroy }) as EnhancerExtension;
