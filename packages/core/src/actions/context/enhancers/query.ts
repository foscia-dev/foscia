import context from '@foscia/core/actions/context/enhancers/context';
import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeId,
  ConsumeInstance,
  ConsumeModel,
  ConsumeRelation,
  ContextEnhancer,
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
 * Query the given model.
 *
 * @param model
 *
 * @category Enhancers
 */
function query<
  C extends {},
  E extends {},
  M extends Model,
>(model: M): ContextEnhancer<C, E, C & ConsumeModel<M>>;

/**
 * Query the given model record by ID.
 *
 * @param model
 * @param id
 *
 * @category Enhancers
 */
function query<
  C extends {},
  E extends {},
  M extends Model,
>(model: M, id: ModelIdType): ContextEnhancer<C, E, C & ConsumeModel<M> & ConsumeId>;

/**
 * Query the given model instance.
 *
 * @param instance
 *
 * @category Enhancers
 */
function query<
  C extends {},
  E extends {},
  D extends {},
  I extends ModelInstance<D>,
>(
  instance: ModelClassInstance<D> & I,
): ContextEnhancer<C, E, C & ConsumeModel<Model<D, I>> & ConsumeInstance<I> & ConsumeId>;

/**
 * Query the given model instance's relation.
 *
 * @param instance
 * @param relation
 *
 * @category Enhancers
 */
function query<
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

function query(
  modelOrInstance: Model | ModelInstance,
  idOrRelation?: ModelIdType | ModelRelationKey<any>,
) {
  return isModel(modelOrInstance)
    ? context({ model: modelOrInstance, id: idOrRelation })
    : context({
      model: modelOrInstance.$model,
      instance: idOrRelation ? undefined : modelOrInstance,
      id: modelOrInstance.$exists ? modelOrInstance.id : undefined,
      relation: idOrRelation && modelOrInstance.$model.$schema[idOrRelation],
    });
}

export default query;

type EnhancerExtension = ActionParsedExtension<{
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

query.extension = makeEnhancersExtension({ query }) as EnhancerExtension;
