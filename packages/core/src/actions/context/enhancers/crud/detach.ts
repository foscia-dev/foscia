import ActionName from '@foscia/core/actions/actionName';
import updateRelation from '@foscia/core/actions/context/enhancers/crud/updateRelation';
import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeId,
  ConsumeModel,
  ConsumeRelation,
  ConsumeSerializer,
} from '@foscia/core/actions/types';
import {
  Model,
  ModelClassInstance,
  ModelInferPropValue,
  ModelInstance,
  ModelRelationKey,
  ModelSchema,
  ModelSchemaRelations,
} from '@foscia/core/model/types';

export default function detach<
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
) {
  return (action: Action<C & ConsumeSerializer<Record, Related, Data>, E>) => action.use(
    updateRelation(instance, relation, value, ActionName.DETACH_RELATION),
  );
}

type EnhancerExtension = ActionParsedExtension<{
  detach<
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
  ): Action<C & ConsumeModel<Model<D, I>> & ConsumeRelation<RD[K]> & ConsumeId, E>;
}>;

detach.extension = makeEnhancersExtension({ detach }) as EnhancerExtension;
