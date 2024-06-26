import associate from '@foscia/core/actions/context/enhancers/crud/associate';
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
  ModelInstance,
  ModelRelationKey,
  ModelSchema,
  ModelSchemaRelations,
} from '@foscia/core/model/types';

const dissociate = <
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
) => associate<C, E, D, RD, I, K, Record, Related, Data>(instance, relation, null as any);

export default /* @__PURE__ */ appendExtension(
  'dissociate',
  dissociate,
  'use',
) as WithParsedExtension<typeof dissociate, {
  dissociate<
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
  ): Action<C & ConsumeModel<Model<D, I>> & ConsumeRelation<RD[K]> & ConsumeId, E>;
}>;
