import ActionName from '@foscia/core/actions/actionName';
import context from '@foscia/core/actions/context/enhancers/context';
import query from '@foscia/core/actions/context/enhancers/query';
import serializeRelation from '@foscia/core/actions/context/utils/serializeRelation';
import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeId,
  ConsumeInstance,
  ConsumeModel,
  ConsumeRelation,
  ConsumeSerializer,
} from '@foscia/core/actions/types';
import isSingularRelationDef from '@foscia/core/model/checks/isSingularRelationDef';
import {
  ModelInferPropValue,
  Model,
  ModelClassInstance,
  ModelInstance,
  ModelRelationKey,
  ModelSchema,
  ModelSchemaRelations,
} from '@foscia/core/model/types';
import { wrap } from '@foscia/shared';

type UpdateRelationActionName =
  | ActionName.UPDATE_RELATION
  | ActionName.ATTACH_RELATION
  | ActionName.DETACH_RELATION;

export default function updateRelation<
  C extends {},
  E extends {},
  D extends {},
  RD extends ModelSchemaRelations<D>,
  I extends ModelInstance<D>,
  K extends keyof ModelSchema<D> & keyof RD & string,
  Record,
  Related,
  Data,
>(
  instance: ModelClassInstance<D> & I,
  relation: ModelRelationKey<D> & K,
  value: ModelInferPropValue<RD[K]> | NonNullable<ModelInferPropValue<RD[K]>>[number],
  actionName: UpdateRelationActionName = ActionName.UPDATE_RELATION,
) {
  return async (action: Action<C & ConsumeSerializer<Record, Related, Data>, E>) => {
    const wrappedValue = isSingularRelationDef(instance.$model.$schema[relation] as RD[K])
      ? value : wrap(value);

    return action.use(
      query(instance, relation),
      context({
        action: actionName,
        data: await serializeRelation(action, instance, relation, wrappedValue),
      }),
      // eslint-disable-next-line max-len
    ) as unknown as Action<C & ConsumeModel<Model<D, I>> & ConsumeRelation<RD[K]> & ConsumeInstance<I> & ConsumeId, E>;
  };
}

type EnhancerExtension = ActionParsedExtension<{
  updateRelation<
    C extends {},
    E extends {},
    D extends {},
    RD extends ModelSchemaRelations<D>,
    I extends ModelInstance<D>,
    K extends keyof ModelSchema<D> & keyof RD & string,
    Record,
    Related,
    Data,
  >(
    this: Action<C & ConsumeSerializer<Record, Related, Data>, E>,
    instance: ModelClassInstance<D> & I,
    relation: ModelRelationKey<D> & K,
    value: ModelInferPropValue<RD[K]> | NonNullable<ModelInferPropValue<RD[K]>>[number],
    action?: UpdateRelationActionName,
    // eslint-disable-next-line max-len
  ): Action<C & ConsumeModel<Model<D, I>> & ConsumeRelation<RD[K]> & ConsumeInstance<I> & ConsumeId, E>;
}>;

updateRelation.extension = makeEnhancersExtension({ updateRelation }) as EnhancerExtension;
