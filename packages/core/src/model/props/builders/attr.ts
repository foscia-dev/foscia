import makeValuePropFactory from '@foscia/core/model/props/builders/makeValuePropFactory';
import { ModelAttributeFactory } from '@foscia/core/model/props/builders/types';
import { ModelAttribute } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_ATTRIBUTE } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';

/**
 * Create an attribute property factory.
 *
 * @param config
 *
 * @category Factories
 */
export default <T>(
  config?: ObjectTransformer<T | null, any, any> | T | (() => T),
) => makeValuePropFactory({
  $VALUE_PROP_TYPE: SYMBOL_MODEL_PROP_KIND_ATTRIBUTE,
  default: typeof config !== 'object' ? config : undefined,
  transformer: typeof config === 'object' ? config : undefined,
} as ModelAttribute, {
  transform: (transformer: ObjectTransformer<T | null>) => ({ transformer }),
}) as ModelAttributeFactory<T, false>;
