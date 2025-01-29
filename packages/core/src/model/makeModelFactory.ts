import makeDefinition from '@foscia/core/model/composition/makeDefinition';
import makeModelClass from '@foscia/core/model/makeModelClass';
import id from '@foscia/core/model/props/builders/id';
import {
  ModelConfig,
  ModelFactory,
  ModelInstance,
  ModelParsedFlattenDefinition,
} from '@foscia/core/model/types';
import cloneModelValue from '@foscia/core/model/utilities/cloneModelValue';
import compareModelValues from '@foscia/core/model/utilities/compareModelValues';
import { using } from '@foscia/shared';

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
  baseConfig?: Partial<ModelConfig>,
  baseRawDefinition?: D & ThisType<ModelInstance<ModelParsedFlattenDefinition<D>>>,
) => {
  const factory = (
    rawConfig: string | (Partial<ModelConfig> & { type: string; }),
    rawDefinition?: object,
  ) => using(
    typeof rawConfig === 'string' ? { type: rawConfig } : rawConfig,
    ({ type, ...config }) => makeModelClass(type, {
      compareSnapshotValues: compareModelValues,
      cloneSnapshotValue: cloneModelValue,
      ...baseConfig,
      ...config,
    }, factory.$hooks, {
      id: id(),
      lid: id(),
      ...makeDefinition(baseRawDefinition),
      ...makeDefinition(rawDefinition),
    }),
  );

  factory.$hooks = {};

  return factory as unknown as ModelFactory<ModelParsedFlattenDefinition<D>>;
};
