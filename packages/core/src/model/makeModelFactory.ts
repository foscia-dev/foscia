import mergeEnhancers from '@foscia/core/actions/context/utilities/mergeEnhancers';
import parseConnectionType from '@foscia/core/connections/parseConnectionType';
import makeDefinition from '@foscia/core/model/composition/makeDefinition';
import makeModelClass from '@foscia/core/model/makeModelClass';
import id from '@foscia/core/model/props/id';
import {
  Model,
  ModelConfig,
  ModelFactory,
  ModelFactoryRawConfig,
  ModelInstance,
  ModelParsedFlattenDefinition,
} from '@foscia/core/model/types';
import cloneModelValue from '@foscia/core/model/utilities/cloneModelValue';
import compareModelValues from '@foscia/core/model/utilities/compareModelValues';

/**
 * Create a model factory.
 *
 * @param baseConfig
 * @param baseRawDefinition
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { makeModelFactory } from '@foscia/core';
 *
 * export default makeModelFactory({
 *   // Common configuration...
 * }, {
 *   // Common definition...
 * });
 * ```
 */
export default <D extends {} = {}>(
  // eslint-disable-next-line max-len
  baseConfig?: Partial<ModelConfig<Model<ModelParsedFlattenDefinition<D>, ModelInstance<ModelParsedFlattenDefinition<D>>>>>,
  baseRawDefinition?: D & ThisType<ModelInstance<ModelParsedFlattenDefinition<D>>>,
) => {
  const parseConfig = (
    rawConfig: ModelFactoryRawConfig,
  ): Partial<ModelConfig> & { type: string; connection?: string; } => {
    if (typeof rawConfig === 'string') {
      const [connection, type] = parseConnectionType(rawConfig);

      return { type, connection };
    }

    return rawConfig;
  };

  const factory = (
    rawConfig: ModelFactoryRawConfig,
    rawDefinition?: object,
  ) => {
    const { connection, type, ...config } = parseConfig(rawConfig);

    return makeModelClass(connection ?? 'default', type, {
      compareSnapshotValues: compareModelValues,
      cloneSnapshotValue: cloneModelValue,
      ...baseConfig,
      ...config,
      query: mergeEnhancers(baseConfig?.query, config.query) ?? undefined,
    } as ModelConfig, factory.$hooks, {
      id: id(),
      lid: id(),
      ...makeDefinition(baseRawDefinition),
      ...makeDefinition(rawDefinition),
    });
  };

  factory.$hooks = {};

  return factory as unknown as ModelFactory<ModelParsedFlattenDefinition<D>>;
};
