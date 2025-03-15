import { configuration } from '@foscia/core/configuration';
import isPluralRelation from '@foscia/core/model/props/checks/isPluralRelation';
import { ModelRelation } from '@foscia/core/model/types';
import { pluralize } from '@foscia/shared';

/**
 * Guess a relation type using its name.
 *
 * @param prop
 *
 * @internal
 */
export default (prop: ModelRelation) => (
  isPluralRelation(prop) ? prop.key : (configuration.utilities?.pluralize ?? pluralize)(prop.key)
);
