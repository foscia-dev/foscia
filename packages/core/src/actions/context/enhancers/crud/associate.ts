import updateRelation from '@foscia/core/actions/context/enhancers/crud/updateRelation';
import syncRelationValueOnSuccess from '@foscia/core/actions/context/enhancers/hooks/syncRelationValueOnSuccess';
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
import {
  ModelInferPropValue,
  Model,
  ModelClassInstance,
  ModelInstance,
  ModelRelationKey,
  ModelSchema,
  ModelSchemaRelations,
} from '@foscia/core/model/types';

export default function associate<
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
  value: ModelInferPropValue<RD[K]>,
) {
  return (action: Action<C & ConsumeSerializer<Record, Related, Data>, E>) => action.use(
    updateRelation(instance, relation, value),
    syncRelationValueOnSuccess(value),
  );
}

type EnhancerExtension = ActionParsedExtension<{
  associate<
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
    value: ModelInferPropValue<RD[K]>,
    // eslint-disable-next-line max-len
  ): Action<C & ConsumeModel<Model<D, I>> & ConsumeRelation<RD[K]> & ConsumeInstance<I> & ConsumeId, E>;
}>;

associate.extension = makeEnhancersExtension({ associate }) as EnhancerExtension;
