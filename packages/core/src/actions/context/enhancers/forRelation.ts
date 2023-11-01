import context from '@foscia/core/actions/context/enhancers/context';
import forInstance from '@foscia/core/actions/context/enhancers/forInstance';
import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeId,
  ConsumeInstance,
  ConsumeModel,
  ConsumeRelation,
} from '@foscia/core/actions/types';
import {
  Model,
  ModelClassInstance,
  ModelInstance,
  ModelRelationKey,
  ModelSchema,
  ModelSchemaRelations,
} from '@foscia/core/model/types';

/**
 * Target the given instance's relation.
 * Use its type and other applicable model/relation context.
 *
 * @param instance
 * @param relationKey
 *
 * @category Enhancers
 */
export default function forRelation<
  C extends {},
  D extends {},
  I extends ModelInstance<D>,
  K extends keyof ModelSchema<D>,
>(instance: ModelClassInstance<D> & I, relationKey: ModelRelationKey<D> & K) {
  return (action: Action<C>) => {
    const relation = instance.$model.$schema[relationKey] as D[K];

    return action
      .use(forInstance(instance))
      .use(context({
        relation,
      }));
  };
}

type EnhancerExtension = ActionParsedExtension<{
  forRelation<
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

forRelation.extension = makeEnhancersExtension({ forRelation }) as EnhancerExtension;
