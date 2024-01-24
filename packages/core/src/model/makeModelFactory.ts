import makeModelClass from '@foscia/core/model/makeModelClass';
import {
  ExtendableModel,
  ModelConfig,
  ModelInstance,
  ModelParsedDefinition,
} from '@foscia/core/model/types';

export default function makeModelFactory<ND extends {} = {}>(
  baseConfig?: ModelConfig,
  baseRawDefinition?: ND & ThisType<ModelInstance<ModelParsedDefinition<ND>>>,
) {
  return <D extends {} = {}>(
    rawConfig: string | (ModelConfig & { type: string; }),
    rawDefinition?: D & ThisType<ModelInstance<ModelParsedDefinition<ND & D>>>,
  ) => {
    const { type, ...config } = typeof rawConfig === 'string'
      ? { type: rawConfig }
      : rawConfig;

    return makeModelClass(type, {
      ...baseConfig,
      ...config,
    }).extend({
      ...baseRawDefinition,
      ...rawDefinition,
      // eslint-disable-next-line max-len
    }) as ExtendableModel<ModelParsedDefinition<ND & D>, ModelInstance<ModelParsedDefinition<ND & D>>>;
  };
}
