import makeValuePropFactory from '@foscia/core/model/props/builders/makeValuePropFactory';
import parseValuePropConfig from '@foscia/core/model/props/builders/parseValuePropConfig';
import {
  ModelAttributeFactory,
  ModelAttributeFactoryConfig,
} from '@foscia/core/model/props/builders/types';
import { ModelAttribute } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_ATTRIBUTE } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';

const attr: {
  /**
   * Create an attribute property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { attr } from '@foscia/core';
   *
   * attr<string>();
   * attr('', { readOnly: true });
   * ```
   */<T, R extends boolean = false>(
    defaultValue?: (T extends object ? never : T) | (() => T),
    config?: Omit<ModelAttributeFactoryConfig<T, R>, 'default'>,
  ): ModelAttributeFactory<T, R>;
  /**
   * Create an attribute property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { attr, toString, toDateTime } from '@foscia/core';
   *
   * attr(toString());
   * attr(toDateTime(), { readOnly: true });
   * ```
   */<T, R extends boolean = false>(
    transformer: ObjectTransformer<T | null, any, any>,
    config?: Omit<ModelAttributeFactoryConfig<T, R>, 'transformer'>,
  ): ModelAttributeFactory<T, R>;
} = <T>(
  config?: ObjectTransformer<T | null> | T | (() => T),
  otherConfig?: ModelAttributeFactoryConfig<T, boolean>,
) => makeValuePropFactory({
  $VALUE_PROP_TYPE: SYMBOL_MODEL_PROP_KIND_ATTRIBUTE,
  ...parseValuePropConfig(config, otherConfig),
} as ModelAttribute, {
  transform: (transformer: ObjectTransformer<unknown>) => ({ transformer }),
}) as ModelAttributeFactory<T, boolean>;

export default attr;
