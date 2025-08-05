import { ModelAliasableProp } from '@foscia/core/models/types';

/**
 * Get the alias to use for a property.
 *
 * @param prop
 *
 * @internal
 */
export default function aliasProp(prop: ModelAliasableProp) {
  return prop.alias ? prop.alias : null;
}
