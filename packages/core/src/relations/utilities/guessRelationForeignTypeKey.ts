import { ModelInstance, ModelMorphToProp, ModelNonRelationKey } from '@foscia/core/models/types';

/**
 * Guess morph to relation foreign type key.
 *
 * @param prop
 *
 * @internal
 */
export default <T extends ModelInstance | null, I extends ModelInstance>(
  prop: ModelMorphToProp<T, I>,
) => prop.foreignKey ?? `${prop.key}Type` as ModelNonRelationKey<I>;
