import makeValuePropFactory from '@foscia/core/model/props/builders/makeValuePropFactory';
import { ModelIdFactory } from '@foscia/core/model/props/builders/types';
import { ModelId, ModelIdType } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_ID } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';

/**
 * Create an ID property factory.
 *
 * @param config
 *
 * @category Factories
 */
export default <T extends ModelIdType | null>(
  config?: ObjectTransformer<T | null, any, any> | T | (() => T),
) => makeValuePropFactory({
  $VALUE_PROP_TYPE: SYMBOL_MODEL_PROP_KIND_ID,
  default: typeof config !== 'object' ? config : undefined,
  transformer: typeof config === 'object' ? config : undefined,
} as ModelId, {
  transform: (transformer: ObjectTransformer<T | null>) => ({ transformer }),
}) as ModelIdFactory<T, false>;
