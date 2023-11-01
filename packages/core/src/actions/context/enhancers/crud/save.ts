import create from '@foscia/core/actions/context/enhancers/crud/create';
import update from '@foscia/core/actions/context/enhancers/crud/update';
import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeId,
  ConsumeInstance,
  ConsumeModel,
  ConsumeSerializer,
} from '@foscia/core/actions/types';
import { Model, ModelClassInstance, ModelInstance } from '@foscia/core/model/types';

/**
 * Prepare context for an instance creation or update depending on its existence
 * state. Calls "update" if the instance exists, otherwise call "create".
 *
 * @param instance
 *
 * @category Enhancers
 */
export default function save<
  C extends {},
  SD,
  D extends {},
  I extends ModelInstance<D>,
>(instance: ModelClassInstance<D> & I) {
  return (action: Action<C & ConsumeSerializer<SD>>) => (
    instance.$exists
      ? action.use(update(instance))
      : action.use(create(instance))
  ) as Action<C & ConsumeModel<Model<D, I>> & ConsumeInstance<I> & ConsumeId>;
}

type EnhancerExtension = ActionParsedExtension<{
  save<C extends {}, E extends {}, SD, D extends {}, I extends ModelInstance<D>>(
    this: Action<C & ConsumeSerializer<SD>, E>,
    instance: ModelClassInstance<D> & I,
  ): Action<C & ConsumeModel<Model<D, I>> & ConsumeInstance<I> & ConsumeId, E>;
}>;

save.extension = makeEnhancersExtension({ save }) as EnhancerExtension;
