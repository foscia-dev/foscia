import { ModelBelongsTo, ModelMorphTo } from '@foscia/core/model/types';

/**
 * Guess belongs/morph to relation foreign key.
 *
 * @param prop
 *
 * @internal
 */
export default (prop: ModelBelongsTo | ModelMorphTo) => prop.foreignKey ?? `${prop.key}Id`;
