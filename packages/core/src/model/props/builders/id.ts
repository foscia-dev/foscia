import makeValuePropFactory from '@foscia/core/model/props/builders/makeValuePropFactory';
import parseValuePropConfig from '@foscia/core/model/props/builders/parseValuePropConfig';
import {
  ModelIdFactory,
  ModelIdFactoryConfig,
  ModelPendingProp,
} from '@foscia/core/model/props/builders/types';
import { ModelId, ModelIdType } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_ID } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';

const id: {
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
   * id('', { readOnly: true });
   * ```
   */<T extends ModelIdType | null, R extends boolean = false>(
    defaultValue?: (T extends object ? never : T) | (() => T),
    config?: Omit<ModelIdFactoryConfig<T, R>, 'default'>,
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
   * id(toString());
   * id(toString(), { readOnly: true });
   * ```
   */<T extends ModelIdType | null, R extends boolean = false>(
    transformer: ObjectTransformer<T | null, any, any>,
    config?: Omit<ModelIdFactoryConfig<T, R>, 'transformer'>,
  ): ModelIdFactory<T, R>;
} = <T extends ModelIdType | null>(
  config?: ObjectTransformer<T | null> | T | (() => T),
  otherConfig?: ModelIdFactoryConfig<T, boolean>,
) => makeValuePropFactory({
  $VALUE_PROP_TYPE: SYMBOL_MODEL_PROP_KIND_ID,
  ...parseValuePropConfig(config, otherConfig),
} as ModelPendingProp<ModelId>, {
  transform: (transformer: ObjectTransformer<unknown>) => ({ transformer }),
}) as ModelIdFactory<T, boolean>;

export default id;
