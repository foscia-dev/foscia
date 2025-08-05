import { ModelAttributeProp, ModelPropConfig, ModelPropDecorator } from '@foscia/core/models/types';
import initModelPropDescriptor from '@foscia/core/props/internals/initModelPropDescriptor';
import makePropDecorator from '@foscia/core/props/internals/makeModelPropDecorator';
import parseModelTransformablePropConfig
  from '@foscia/core/props/internals/parseModelTransformablePropConfig';
import { SYMBOL_MODEL_PROP_ATTRIBUTE } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';

/**
 * Create an attribute decorator.
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { model, attr } from '@foscia/core';
 *
 * @model()
 * class Post extends model.base() {
 *   @attr() title = '';
 * }
 * ```
 */
function attr<This extends object, T>(
  config?: ModelPropConfig<ModelAttributeProp<T, This>>,
): ModelPropDecorator<This, T>;

/**
 * Create an attribute decorator.
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { model, attr } from '@foscia/core';
 *
 * @model()
 * class Post extends model.base() {
 *   @attr(toDateTime()) publishedAt: Date | null = null;
 * }
 * ```
 */
function attr<This extends object, T>(
  transformer: ObjectTransformer<T, any, any>,
  config?: Omit<ModelPropConfig<ModelAttributeProp<T, This>>, 'transformer'>,
): ModelPropDecorator<This, T>;

function attr<This extends object, T>(
  transformer?: ObjectTransformer<T, any, any> | ModelPropConfig<ModelAttributeProp<T, This>>,
  config?: ModelPropConfig<ModelAttributeProp<T, This>>,
) {
  return makePropDecorator<ModelAttributeProp<T, This>>((data) => {
    const prop = {
      kind: SYMBOL_MODEL_PROP_ATTRIBUTE,
      ...parseModelTransformablePropConfig(config ?? {}, transformer),
      ...data,
    } as const;

    initModelPropDescriptor(prop);

    return prop;
  });
}

export default attr;
