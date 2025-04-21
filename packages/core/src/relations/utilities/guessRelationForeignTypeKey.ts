import { ModelMorphTo } from '@foscia/core/model/types';

/**
 * Guess morph to relation foreign type key.
 *
 * @param prop
 *
 * @internal
 */
export default (prop: ModelMorphTo) => prop.foreignKey ?? `${prop.key}Type`;
