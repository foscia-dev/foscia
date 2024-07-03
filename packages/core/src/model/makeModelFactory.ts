import makeModelClass from '@foscia/core/model/makeModelClass';
import {
  ModelConfig, ModelFactory,
  ModelFlattenDefinition,
  ModelInstance,
  ModelParsedDefinition,
} from '@foscia/core/model/types';

export default <D extends {} = {}>(
  baseConfig?: ModelConfig,
  // eslint-disable-next-line max-len
  baseRawDefinition?: D & ThisType<ModelInstance<ModelFlattenDefinition<ModelParsedDefinition<D>>>>,
) => {
  const factory = (
    rawConfig: string | (ModelConfig & { type: string; }),
    rawDefinition?: object,
  ) => {
    const { type, ...config } = typeof rawConfig === 'string'
      ? { type: rawConfig }
      : rawConfig;

    return makeModelClass(type, {
      ...baseConfig,
      ...config,
    }, factory.$hooks, {
      ...baseRawDefinition,
      ...rawDefinition,
    });
  };

  factory.$hooks = {};

  return factory as ModelFactory<ModelFlattenDefinition<ModelParsedDefinition<D>>>;
};
