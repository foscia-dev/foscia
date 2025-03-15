import { ModelProp } from '@foscia/core/model/types';

/**
 * Retrieve or guess a property alias.
 *
 * @param prop
 *
 * @internal
 */
export default (prop: ModelProp) => prop.alias ?? (
  prop.parent.$config.guessAlias?.(prop) ?? prop.key
);
