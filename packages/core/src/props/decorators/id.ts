import initModelPropDescriptor
  from '@foscia/core/props/internals/initModelPropDescriptor';
import makePropDecorator from '@foscia/core/props/internals/makeModelPropDecorator';
import parseModelTransformablePropConfig
  from '@foscia/core/props/internals/parseModelTransformablePropConfig';
import { ModelId, ModelPropConfig, ModelPropDecorator } from '@foscia/core/models/types';
import { SYMBOL_MODEL_PROP_ID } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';
import { tap } from '@foscia/shared/index';

const id: {
  /**
   * Create an ID decorator.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { model, id } from '@foscia/core';
   *
   * @model()
   * class Post extends model.base() {
   *   @id() id!: string;
   * }
   * ```
   */<This extends object, T extends string | number | null>(
    config?: ModelPropConfig<ModelId<T>>,
  ): ModelPropDecorator<This, T>;
  /**
   * Create an ID decorator.
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { model, id } from '@foscia/core';
   *
   * @model()
   * class Post extends model.base() {
   *   @id(toString()) id!: string;
   * }
   * ```
   */<This extends object, T extends string | number | null>(
    transformer: ObjectTransformer<T | null, any, any>,
    config?: Omit<ModelPropConfig<ModelId<T>>, 'transformer'>,
  ): ModelPropDecorator<This, T>;
} = <T extends string | number | null>(
  transformer?: ObjectTransformer<T | null, any, any> | ModelPropConfig<ModelId<T>>,
  config?: ModelPropConfig<ModelId<T>>,
) => makePropDecorator((data): ModelId<T> => tap({
  kind: SYMBOL_MODEL_PROP_ID,
  ...parseModelTransformablePropConfig(transformer, config),
  ...data,
}, initModelPropDescriptor));

export default id;
