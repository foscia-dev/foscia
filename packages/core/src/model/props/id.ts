import makeAttributeFactory from '@foscia/core/model/props/utilities/makeAttributeFactory';
import {
  InferModelPropNullable,
  InferModelPropReadOnly,
  ModelIdFactory,
  ModelIdFactoryConfig,
  ModelIdType,
  ModelPropConfig,
} from '@foscia/core/model/types';
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
   * ```
   */<T extends ModelIdType | null>(
    config?: ModelIdFactoryConfig<T>,
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
   * ```
   */<T extends ModelIdType | null>(
    config: ModelIdFactoryConfig<T> & { readOnly: true; },
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
   * id('');
   * id('', { readOnly: true });
   * id('', { nullable: true });
   * ```
   */<T extends ModelIdType | null, C extends ModelPropConfig>(
    defaultValue: (T extends object ? never : T) | (() => T),
    config?: C & Omit<ModelIdFactoryConfig<T | InferModelPropNullable<C>>, 'default'>,
  ): ModelIdFactory<T | InferModelPropNullable<C>, InferModelPropReadOnly<C>>;
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
   * id(toString(), { nullable: true });
   * ```
   */<T extends ModelIdType | null, C extends ModelPropConfig>(
    transformer: ObjectTransformer<T | null, any, any>,
    config?: C & Omit<ModelIdFactoryConfig<T | InferModelPropNullable<C>>, 'transformer'>,
  ): ModelIdFactory<T | InferModelPropNullable<C>, InferModelPropReadOnly<C>>;
};
