import forId from '@foscia/core/actions/context/enhancers/forId';
import forModel from '@foscia/core/actions/context/enhancers/forModel';
import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import { Action, ActionParsedExtension, ConsumeId, ConsumeModel } from '@foscia/core/actions/types';
import { Model, ModelIdType } from '@foscia/core/model/types';

/**
 * Target a given model record using its ID.
 *
 * @param model
 * @param id
 *
 * @category Enhancers
 */
export default function find<
  C extends {},
  M extends Model,
>(model: M, id: ModelIdType) {
  return (action: Action<C>) => action
    .use(forModel(model))
    .use(forId(id));
}

type EnhancerExtension = ActionParsedExtension<{
  find<C extends {}, E extends {}, M extends Model>(
    this: Action<C, E>,
    model: M,
    id: ModelIdType,
  ): Action<C & ConsumeModel<M> & ConsumeId, E>;
}>;

find.extension = makeEnhancersExtension({ find }) as EnhancerExtension;
