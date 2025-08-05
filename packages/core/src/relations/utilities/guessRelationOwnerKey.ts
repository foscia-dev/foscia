import {
  InferRelatedInstance,
  ModelBelongsToProp,
  ModelInstance,
  ModelMorphToProp,
  ModelNonRelationKey,
} from '@foscia/core/models/types';

/**
 * Guess belongs/morph to relation owner key.
 *
 * @param prop
 *
 * @internal
 */
export default <T extends ModelInstance | null, I extends ModelInstance>(
  prop: ModelBelongsToProp<T, I> | ModelMorphToProp<T, I>,
) => prop.ownerKey ?? 'id' as ModelNonRelationKey<InferRelatedInstance<T>>;
