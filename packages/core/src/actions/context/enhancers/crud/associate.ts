import updateRelation from '@foscia/core/actions/context/enhancers/crud/updateRelation';
import syncRelationValue from '@foscia/core/actions/context/enhancers/crud/utils/syncRelationValue';
import onSuccess from '@foscia/core/actions/context/enhancers/hooks/onSuccess';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import {
  Action,
  ConsumeId,
  ConsumeModel,
  ConsumeRelation,
  ConsumeSerializer,
  WithParsedExtension,
} from '@foscia/core/actions/types';
import {
  Model,
  ModelClassInstance,
  ModelInferPropValue,
  ModelInstance,
  ModelRelation,
  ModelRelationKey,
  ModelSchema,
  ModelSchemaRelations,
} from '@foscia/core/model/types';

function associate<
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
    onSuccess(
      () => syncRelationValue(instance, instance.$model.$schema[relation] as ModelRelation, value),
    ),
  );
}

export default /* @__PURE__ */ appendExtension(
  'associate',
  associate,
  'use',
) as WithParsedExtension<typeof associate, {
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
  ): Action<C & ConsumeModel<Model<D, I>> & ConsumeRelation<RD[K]> & ConsumeId, E>;
}>;
