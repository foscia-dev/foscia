import makeModelClass from '@foscia/core/model/makeModelClass';
import makeModelSetup from '@foscia/core/model/makeModelSetup';
import {
  ExtendableModel,
  ModelConfig,
  ModelFlattenDefinition,
  ModelInstance,
  ModelParsedDefinition,
  ModelRawSetup,
} from '@foscia/core/model/types';

export default <ND extends {} = {}>(
  baseConfig?: ModelConfig,
  // eslint-disable-next-line max-len
  baseRawDefinition?: ND & ThisType<ModelInstance<ModelFlattenDefinition<ModelParsedDefinition<ND>>>>,
  baseRawSetup?: ModelRawSetup<ModelFlattenDefinition<ModelParsedDefinition<ND>>>,
) => {
  const baseSetup = makeModelSetup(baseRawSetup);

  return <D extends {} = {}>(
    rawConfig: string | (ModelConfig & { type: string; }),
    // eslint-disable-next-line max-len
    rawDefinition?: D & ThisType<ModelInstance<ModelFlattenDefinition<ModelParsedDefinition<ND & D>>>>,
    rawSetup?: ModelRawSetup<ModelFlattenDefinition<ModelParsedDefinition<ND & D>>>,
  ) => {
    const setup = makeModelSetup(rawSetup);

    const { type, ...config } = typeof rawConfig === 'string'
      ? { type: rawConfig }
      : rawConfig;

    return makeModelClass(
      type,
      {
        ...baseConfig,
        ...config,
      },
      {
        boot: [...baseSetup.boot, ...setup.boot],
        init: [...baseSetup.init, ...setup.init],
      },
      {
        ...baseRawDefinition,
        ...rawDefinition,
      },
      // eslint-disable-next-line max-len
    ) as ExtendableModel<ModelFlattenDefinition<ModelParsedDefinition<ND & D>>, ModelInstance<ModelFlattenDefinition<ModelParsedDefinition<ND & D>>>>;
  };
};
