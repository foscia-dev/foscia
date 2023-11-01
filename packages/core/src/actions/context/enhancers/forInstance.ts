import context from '@foscia/core/actions/context/enhancers/context';
import forId from '@foscia/core/actions/context/enhancers/forId';
import forModel from '@foscia/core/actions/context/enhancers/forModel';
import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import { Action, ActionParsedExtension, ConsumeId, ConsumeInstance, ConsumeModel } from '@foscia/core/actions/types';
import { Model, ModelClassInstance, ModelInstance } from '@foscia/core/model/types';

/**
 * Target the given instance.
 * Use its type and other applicable model's context.
 *
 * @param instance
 *
 * @category Enhancers
 */
export default function forInstance<
  C extends {},
  D extends {},
  I extends ModelInstance<D>,
>(instance: ModelClassInstance<D> & I) {
  return (action: Action<C>) => action
    .use(forModel(instance.$model as Model<D, I>))
    .use(context({ instance: instance as I }))
    .use(forId(instance.id ?? undefined));
}

type EnhancerExtension = ActionParsedExtension<{
  forInstance<C extends {}, E extends {}, D extends {}, I extends ModelInstance<D>>(
    this: Action<C, E>,
    instance: ModelClassInstance<D> & I,
  ): Action<C & ConsumeModel<Model<D, I>> & ConsumeInstance<I> & ConsumeId, E>;
}>;

forInstance.extension = makeEnhancersExtension({ forInstance }) as EnhancerExtension;
