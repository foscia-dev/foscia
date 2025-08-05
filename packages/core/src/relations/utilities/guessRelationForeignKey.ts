import {
  ModelBelongsToProp,
  ModelInstance,
  ModelMorphToProp,
  ModelNonRelationKey,
} from '@foscia/core/models/types';

/**
 * Guess belongs/morph to relation foreign key.
 *
 * @param prop
 *
 * @internal
 */
export default <T extends ModelInstance | null, I extends ModelInstance>(
  prop: ModelBelongsToProp<T, I> | ModelMorphToProp<T, I>,
): string => prop.foreignKey ?? `${prop.key}Id` as ModelNonRelationKey<I>;
