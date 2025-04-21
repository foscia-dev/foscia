import { ModelBelongsTo, ModelMorphTo } from '@foscia/core/model/types';

/**
 * Guess belongs/morph to relation owner key.
 *
 * @param prop
 *
 * @internal
 */
export default (prop: ModelBelongsTo | ModelMorphTo) => prop.ownerKey ?? 'id';
