import makeAttributeFactory from '@foscia/core/model/props/utilities/makeAttributeFactory';
import { ModelAttributeFactory, ModelAttributeFactoryConfig } from '@foscia/core/model/types';
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
   * attr({ default: '' });
   * ```
   */<T>(
    config?: Omit<ModelAttributeFactoryConfig<T, boolean>, 'readOnly'>,
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
   * attr({ default: '', readOnly: true });
   * ```
   */<T>(
    config: Omit<ModelAttributeFactoryConfig<T, boolean>, 'readOnly'> & { readOnly: true; },
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
   * attr({ default: '', nullable: true });
   * ```
   */<T>(
    config: Omit<ModelAttributeFactoryConfig<T, boolean>, 'readOnly'> & { nullable: true; },
  ): ModelAttributeFactory<T | null, false>;
  /**
   * Create an attribute property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { attr } from '@foscia/core';
   *
   * attr<string>({ nullable: true, readOnly: true });
   * ```
   */<T>(
    config: Omit<ModelAttributeFactoryConfig<T, boolean>, 'readOnly'> & {
      readOnly: true; nullable: true;
    },
  ): ModelAttributeFactory<T | null, true>;
  /**
   * Create an attribute property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { attr } from '@foscia/core';
   *
   * attr('', { readOnly: true });
   * ```
   */<T, R extends boolean = false>(
    defaultValue: (T extends object ? never : T) | (() => T),
    config?: Omit<ModelAttributeFactoryConfig<T, R>, 'default'>,
  ): ModelAttributeFactory<T, R>;
  /**
   * Create an attribute property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { attr } from '@foscia/core';
   *
   * attr('', { nullable: true, readOnly: true });
   * ```
   */<T, R extends boolean = false>(
    defaultValue: (T extends object ? never : T) | (() => T),
    config: Omit<ModelAttributeFactoryConfig<T, R>, 'default'> & { nullable: true; },
  ): ModelAttributeFactory<T | null, R>;
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
  /**
   * Create an attribute property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { attr, toString, toDateTime } from '@foscia/core';
   *
   * attr(toString(), { nullable: true });
   * attr(toDateTime(), { nullable: true, readOnly: true });
   * ```
   */<T, R extends boolean = false>(
    transformer: ObjectTransformer<T | null, any, any>,
    config: Omit<ModelAttributeFactoryConfig<T, R>, 'transformer'> & { nullable: true },
  ): ModelAttributeFactory<T | null, R>;
};
