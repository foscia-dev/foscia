import makeAttributeFactory from '@foscia/core/model/props/utilities/makeAttributeFactory';
import {
  InferModelPropNullable,
  InferModelPropReadOnly,
  ModelAttributeFactory,
  ModelAttributeFactoryConfig,
  ModelPropConfig,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_ATTRIBUTE } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';

export default /* @__PURE__ */ makeAttributeFactory(SYMBOL_MODEL_PROP_KIND_ATTRIBUTE) as {
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
   * ```
   */<T>(
    config?: ModelAttributeFactoryConfig<T>,
  ): ModelAttributeFactory<T, false>;
  /**
   * Create an attribute property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { attr } from '@foscia/core';
   *
   * attr<string>({ readOnly: true });
   * ```
   */<T>(
    config: ModelAttributeFactoryConfig<T> & { readOnly: true; },
  ): ModelAttributeFactory<T, true>;
  /**
   * Create an attribute property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { attr } from '@foscia/core';
   *
   * attr('');
   * attr('', { readOnly: true });
   * attr('', { nullable: true });
   * ```
   */<T, C extends ModelPropConfig>(
    defaultValue: (T extends object ? never : T) | (() => T),
    config?: C & Omit<ModelAttributeFactoryConfig<T | InferModelPropNullable<C>>, 'default'>,
  ): ModelAttributeFactory<T | InferModelPropNullable<C>, InferModelPropReadOnly<C>>;
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
   * attr(toDateTime(), { nullable: true });
   * ```
   */<T, C extends ModelPropConfig>(
    transformer: ObjectTransformer<T | null, any, any>,
    config?: C & Omit<ModelAttributeFactoryConfig<T | InferModelPropNullable<C>>, 'transformer'>,
  ): ModelAttributeFactory<T | InferModelPropNullable<C>, InferModelPropReadOnly<C>>;
};
