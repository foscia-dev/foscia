import context from '@foscia/core/actions/context/enhancers/context';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import {
  Action,
  ConsumeId,
  ConsumeInstance,
  ConsumeModel,
  ConsumeRelation,
  ContextEnhancer,
  WithParsedExtension,
} from '@foscia/core/actions/types';
import isModel from '@foscia/core/model/checks/isModel';
import {
  Model,
  ModelClassInstance,
  ModelIdType,
  ModelInstance,
  ModelRelationKey,
  ModelSchema,
  ModelSchemaRelations,
} from '@foscia/core/model/types';

/**
 * Query the given model, instance or relation.
 *
 * @param modelOrInstance
 * @param idOrRelation
 *
 * @category Enhancers
 */
const query: {
  <C extends {}, E extends {}, M extends Model>(
    model: M,
  ): ContextEnhancer<C, E, C & ConsumeModel<M>>;
  <C extends {}, E extends {}, M extends Model>(
    model: M,
    id: ModelIdType,
  ): ContextEnhancer<C, E, C & ConsumeModel<M> & ConsumeId>;
  <C extends {}, E extends {}, D extends {}, I extends ModelInstance<D>>(
    instance: ModelClassInstance<D> & I,
  ): ContextEnhancer<C, E, C & ConsumeModel<Model<D, I>> & ConsumeInstance<I> & ConsumeId>;
  <
    C extends {},
    E extends {},
    D extends {},
    RD extends ModelSchemaRelations<D>,
    I extends ModelInstance<D>,
    K extends keyof ModelSchema<D> & keyof RD & string,
  >(
    instance: ModelClassInstance<D> & I,
    relation: ModelRelationKey<D> & K,
  ): ContextEnhancer<C, E, C & ConsumeModel<Model<D, I>> & ConsumeRelation<RD[K]> & ConsumeId>;
} = (
  modelOrInstance: Model | ModelInstance,
  idOrRelation?: ModelIdType | ModelRelationKey<any>,
) => (
  isModel(modelOrInstance)
    ? context({ model: modelOrInstance, id: idOrRelation })
    : context({
      model: modelOrInstance.$model,
      instance: idOrRelation ? undefined : modelOrInstance,
      id: modelOrInstance.$exists ? modelOrInstance.id : undefined,
      relation: idOrRelation && modelOrInstance.$model.$schema[idOrRelation],
    })
);

export default /* @__PURE__ */ appendExtension(
  'query',
  query,
  'use',
) as WithParsedExtension<typeof query, {
  query<C extends {}, E extends {}, M extends Model>(
    this: Action<C, E>,
    model: M,
  ): Action<C & ConsumeModel<M>, E>;
  query<C extends {}, E extends {}, M extends Model>(
    this: Action<C, E>,
    model: M,
    id: ModelIdType,
  ): Action<C & ConsumeModel<M> & ConsumeId, E>;
  query<C extends {}, E extends {}, D extends {}, I extends ModelInstance<D>>(
    this: Action<C, E>,
    instance: ModelClassInstance<D> & I,
  ): Action<C & ConsumeModel<Model<D, I>> & ConsumeInstance<I> & ConsumeId, E>;
  query<
    C extends {},
    E extends {},
    D extends {},
    RD extends ModelSchemaRelations<D>,
    I extends ModelInstance<D>,
    K extends keyof ModelSchema<D> & keyof RD & string,
  >(
    this: Action<C, E>,
    instance: ModelClassInstance<D> & I,
    relation: ModelRelationKey<D> & K,
    // eslint-disable-next-line max-len
  ): Action<C & ConsumeModel<Model<D, I>> & ConsumeRelation<RD[K]> & ConsumeInstance<I> & ConsumeId, E>;
}>;
