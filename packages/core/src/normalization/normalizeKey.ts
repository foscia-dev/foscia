import { Model, ModelKey } from '@foscia/core/model/types';
import { using } from '@foscia/shared';

/**
 * Normalize a property key using its alias or a guessed alias if available.
 *
 * @param model
 * @param key
 *
 * @internal
 */
export default <M extends Model>(
  model: M,
  key: ModelKey<M>,
) => using(model.$schema[key], (def) => def.alias ?? (
  model.$config.guessAlias?.(def.key) ?? def.key
));
