import makeAttributeFactory from '@foscia/core/model/props/utilities/makeAttributeFactory';
import { ModelIdFactory, ModelIdFactoryConfig, ModelIdType } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_ID } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';

export default /* @__PURE__ */ makeAttributeFactory(SYMBOL_MODEL_PROP_KIND_ID) as {
  /**
   * Create an ID property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { id } from '@foscia/core';
   *
   * id<string>();
   * id({ default: '' });
   * ```
   */<T extends ModelIdType | null>(
    config?: Omit<ModelIdFactoryConfig<T, boolean>, 'readOnly'>,
  ): ModelIdFactory<T, false>;
  /**
   * Create an ID property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { id } from '@foscia/core';
   *
   * id<string>({ readOnly: true });
   * id({ default: '', readOnly: true });
   * ```
   */<T extends ModelIdType | null>(
    config: Omit<ModelIdFactoryConfig<T, boolean>, 'readOnly'> & { readOnly: true; },
  ): ModelIdFactory<T, true>;
  /**
   * Create an ID property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { id } from '@foscia/core';
   *
   * id({ default: '', nullable: true });
   * ```
   */<T extends ModelIdType | null>(
    config: Omit<ModelIdFactoryConfig<T, boolean>, 'readOnly'> & { nullable: true; },
  ): ModelIdFactory<T | null, false>;
  /**
   * Create an ID property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { id } from '@foscia/core';
   *
   * id<string>({ nullable: true, readOnly: true });
   * ```
   */<T extends ModelIdType | null>(
    config: Omit<ModelIdFactoryConfig<T, boolean>, 'readOnly'> & {
      readOnly: true; nullable: true;
    },
  ): ModelIdFactory<T | null, true>;
  /**
   * Create an ID property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { id } from '@foscia/core';
   *
   * id('', { readOnly: true });
   * ```
   */<T extends ModelIdType | null, R extends boolean = false>(
    defaultValue: (T extends object ? never : T) | (() => T),
    config?: Omit<ModelIdFactoryConfig<T, R>, 'default'>,
  ): ModelIdFactory<T, R>;
  /**
   * Create an ID property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { id } from '@foscia/core';
   *
   * id('', { nullable: true, readOnly: true });
   * ```
   */<T extends ModelIdType | null, R extends boolean = false>(
    defaultValue: (T extends object ? never : T) | (() => T),
    config: Omit<ModelIdFactoryConfig<T, R>, 'default'> & { nullable: true; },
  ): ModelIdFactory<T | null, R>;
  /**
   * Create an ID property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { id, toString } from '@foscia/core';
   *
   * id(toString());
   * id(toString(), { readOnly: true });
   * ```
   */<T extends ModelIdType | null, R extends boolean = false>(
    transformer: ObjectTransformer<T | null, any, any>,
    config?: Omit<ModelIdFactoryConfig<T, R>, 'transformer'>,
  ): ModelIdFactory<T, R>;
  /**
   * Create an ID property factory.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { id, toString } from '@foscia/core';
   *
   * id(toString(), { nullable: true });
   * id(toString(), { nullable: true, readOnly: true });
   * ```
   */<T extends ModelIdType | null, R extends boolean = false>(
    transformer: ObjectTransformer<T | null, any, any>,
    config: Omit<ModelIdFactoryConfig<T, R>, 'transformer'> & { nullable: true; },
  ): ModelIdFactory<T | null, R>;
};
