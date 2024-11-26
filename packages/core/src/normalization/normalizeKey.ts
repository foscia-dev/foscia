import { Model, ModelKey, ModelValueProp } from '@foscia/core/model/types';

/**
 * Normalize a property key using its alias or a guessed alias if available.
 *
 * @param model
 * @param key
 */
export default <D extends {}>(
  model: Model<D>,
  key: ModelKey<Model<D>>,
) => {
  const def = model.$schema[key] as unknown as ModelValueProp;

  return def.alias ?? (
    model.$config.guessAlias ? model.$config.guessAlias(def.key) : def.key
  );
};
