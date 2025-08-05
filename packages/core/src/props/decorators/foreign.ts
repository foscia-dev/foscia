import {
  ModelForeign,
  ModelForeignProp,
  ModelPropConfig,
  ModelPropDecorator,
} from '@foscia/core/models/types';
import initModelPropDescriptor from '@foscia/core/props/internals/initModelPropDescriptor';
import makePropDecorator from '@foscia/core/props/internals/makeModelPropDecorator';
import parseModelTransformablePropConfig
  from '@foscia/core/props/internals/parseModelTransformablePropConfig';
import { SYMBOL_MODEL_PROP_FOREIGN } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';

/**
 * Create a foreign decorator.
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { model, foreign } from '@foscia/core';
 *
 * @model()
 * class Post extends model.base() {
 *   @foreign() authorId!: string;
 * }
 * ```
 */
function foreign<This extends object, T>(
  config?: ModelPropConfig<ModelForeignProp<T, This>>,
): ModelPropDecorator<This, ModelForeign<T>>;

/**
 * Create a foreign decorator.
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { model, foreign } from '@foscia/core';
 *
 * @model()
 * class Post extends model.base() {
 *   @foreign(toString()) authorId!: string;
 * }
 * ```
 */
function foreign<This extends object, T>(
  transformer: ObjectTransformer<T, any, any>,
  config?: Omit<ModelPropConfig<ModelForeignProp<T, This>>, 'transformer'>,
): ModelPropDecorator<This, ModelForeign<T>>;

function foreign<This extends object, T>(
  transformer?: ObjectTransformer<T, any, any> | ModelPropConfig<ModelForeignProp<T, This>>,
  config?: ModelPropConfig<ModelForeignProp<T, This>>,
) {
  return makePropDecorator<ModelForeignProp<T, This>>((data) => {
    const prop = {
      kind: SYMBOL_MODEL_PROP_FOREIGN,
      ...parseModelTransformablePropConfig(config ?? {}, transformer),
      ...data,
    } as const;

    initModelPropDescriptor(prop);

    return prop;
  });
}

export default foreign;
