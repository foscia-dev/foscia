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

const detach = <
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
) => updateRelation<C, E, D, RD, I, K, Record, Related, Data>(
  instance,
  relation,
  value,
  ActionName.DETACH_RELATION,
);

export default /* @__PURE__ */ appendExtension(
  'detach',
  detach,
  'use',
) as WithParsedExtension<typeof detach, {
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
