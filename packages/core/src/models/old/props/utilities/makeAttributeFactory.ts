import makePropFactory from '@foscia/core/models/old/props/utilities/makePropFactory';
import makeValuePropInit from '@foscia/core/models/old/props/utilities/makeValuePropInit';
import {
  ModelAttributeFactory,
  ModelAttributeFactoryConfig,
  ModelIdFactory,
  ModelIdFactoryConfig,
} from '@foscia/core/models/oldTypes';
import { SYMBOL_MODEL_PROP_ATTRIBUTE, SYMBOL_MODEL_PROP_ID } from '@foscia/core/symbols';
import isTransformer from '@foscia/core/transformers/isTransformer';

const parseConfig = (
  config?: any,
  otherConfig?: ModelIdFactoryConfig<any> | ModelAttributeFactoryConfig<any>,
) => {
  if (isTransformer(config)) {
    return { transformer: config, ...otherConfig };
  }

  return config && typeof config === 'object' ? config : { default: config, ...otherConfig };
};

/**
 * Make an attribute factory.
 *
 * @param kind
 *
 * @internal
 */
export default (
  kind: typeof SYMBOL_MODEL_PROP_ID | typeof SYMBOL_MODEL_PROP_ATTRIBUTE,
) => (
  config?: any,
  otherConfig?: ModelIdFactoryConfig<any> | ModelAttributeFactoryConfig<any>,
) => makePropFactory<ModelIdFactory<any, any> | ModelAttributeFactory<any, any>>({
  $VALUE_PROP_KIND: kind,
  ...makeValuePropInit(),
  ...parseConfig(config, otherConfig),
});
