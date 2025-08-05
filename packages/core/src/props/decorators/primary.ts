import {
  ModelPrimary,
  ModelPrimaryProp,
  ModelPropConfig,
  ModelPropDecorator,
} from '@foscia/core/models/types';
import initModelPropDescriptor from '@foscia/core/props/internals/initModelPropDescriptor';
import makePropDecorator from '@foscia/core/props/internals/makeModelPropDecorator';
import parseModelTransformablePropConfig
  from '@foscia/core/props/internals/parseModelTransformablePropConfig';
import { SYMBOL_MODEL_PROP_PRIMARY } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';

/**
 * Create a primary decorator.
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { model, primary } from '@foscia/core';
 *
 * @model()
 * class Post extends model.base() {
 *   @primary() id!: string;
 * }
 * ```
 */
function primary<This extends object, T>(
  config?: ModelPropConfig<ModelPrimaryProp<T, This>>,
): ModelPropDecorator<This, ModelPrimary<T>>;

/**
 * Create a primary decorator.
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { model, primary } from '@foscia/core';
 *
 * @model()
 * class Post extends model.base() {
 *   @primary(toString()) id!: string;
 * }
 * ```
 */
function primary<This extends object, T>(
  transformer: ObjectTransformer<T, any, any>,
  config?: Omit<ModelPropConfig<ModelPrimaryProp<T, This>>, 'transformer'>,
): ModelPropDecorator<This, ModelPrimary<T>>;

function primary<This extends object, T>(
  transformer?: ObjectTransformer<T, any, any> | ModelPropConfig<ModelPrimaryProp<T, This>>,
  config?: ModelPropConfig<ModelPrimaryProp<T, This>>,
) {
  return makePropDecorator<ModelPrimaryProp<T, This>>((data) => {
    const prop = {
      kind: SYMBOL_MODEL_PROP_PRIMARY,
      ...parseModelTransformablePropConfig(config ?? {}, transformer),
      ...data,
    } as const;

    initModelPropDescriptor(prop);

    return prop;
  });
}

export default primary;
