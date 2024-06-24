import ActionName from '@foscia/core/actions/actionName';
import updateRelation from '@foscia/core/actions/context/enhancers/crud/updateRelation';
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
  ModelRelationKey,
  ModelSchema,
  ModelSchemaRelations,
} from '@foscia/core/model/types';

function attach<
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
    updateRelation(instance, relation, value, ActionName.ATTACH_RELATION),
  );
}

export default /* @__PURE__ */ appendExtension(
  'attach',
  attach,
  'use',
) as WithParsedExtension<typeof attach, {
  attach<
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
