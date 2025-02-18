import { ModelRelation } from '@foscia/core/model/types';
import { camelCase, singularize } from '@foscia/shared';

/**
 * Guess possible relation inverse keys.
 *
 * @param def
 *
 * @internal
 */
export default (def: ModelRelation) => [
  camelCase(singularize(def.parent.$type)),
].filter((k) => k !== undefined) as string[];
