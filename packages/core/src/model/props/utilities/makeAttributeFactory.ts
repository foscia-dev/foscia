import buildPropFactoryModifiers
  from '@foscia/core/model/props/utilities/buildPropFactoryModifiers';
import makePropFactory from '@foscia/core/model/props/utilities/makePropFactory';
import makeValuePropInit from '@foscia/core/model/props/utilities/makeValuePropInit';
import makeValuePropModifiers from '@foscia/core/model/props/utilities/makeValuePropModifiers';
import {
  ModelAttributeFactory,
  ModelAttributeFactoryConfig,
  ModelIdFactory,
  ModelIdFactoryConfig,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_ATTRIBUTE, SYMBOL_MODEL_PROP_KIND_ID } from '@foscia/core/symbols';
import isTransformer from '@foscia/core/transformers/isTransformer';

const parseConfig = (
  config?: any,
  otherConfig?: ModelIdFactoryConfig<any, boolean> | ModelAttributeFactoryConfig<any, boolean>,
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
  kind: typeof SYMBOL_MODEL_PROP_KIND_ID | typeof SYMBOL_MODEL_PROP_KIND_ATTRIBUTE,
) => (
  config?: any,
  otherConfig?: ModelIdFactoryConfig<any, boolean> | ModelAttributeFactoryConfig<any, boolean>,
) => makePropFactory<ModelIdFactory<any, any> | ModelAttributeFactory<any, any>>({
  $VALUE_PROP_KIND: kind,
  ...makeValuePropInit(),
  ...parseConfig(config, otherConfig),
}, {
  ...buildPropFactoryModifiers<ModelIdFactory<any, any> | ModelAttributeFactory<any, any>>({
    ...makeValuePropModifiers(),
  }),
});
