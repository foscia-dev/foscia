import { Model } from '@foscia/core/model/types';

/**
 * Resolve morph type to store on morph to relation.
 *
 * @param model
 *
 * @internal
 *
 * @todo Make it customizable (probably `morphType` on model's configuration).
 */
export default (model: Model) => (
  model.$connection === 'default' ? model.$type : `${model.$connection}:${model.$type}`
);
