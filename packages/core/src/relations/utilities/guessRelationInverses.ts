import { configuration } from '@foscia/core/configuration';
import { ModelRelation } from '@foscia/core/model/types';
import { camelCase, singularize } from '@foscia/shared';

/**
 * Guess possible relation inverse keys.
 *
 * @param prop
 *
 * @internal
 */
export default (prop: ModelRelation) => [
  camelCase(
    (configuration.utilities?.singularize ?? singularize)(prop.parent.$type),
  ),
].filter((k) => k !== undefined) as string[];
