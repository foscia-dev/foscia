import { Model, ModelKey, ModelValueProp } from '@foscia/core/model/types';
import { using } from '@foscia/shared';

/**
 * Normalize a property key using its alias or a guessed alias if available.
 *
 * @param model
 * @param key
 *
 * @internal
 */
export default <D extends {}>(
  model: Model<D>,
  key: ModelKey<Model<D>>,
) => using(model.$schema[key] as unknown as ModelValueProp, (def) => def.alias ?? (
  model.$config.guessAlias ? model.$config.guessAlias(def.key) : def.key
));
