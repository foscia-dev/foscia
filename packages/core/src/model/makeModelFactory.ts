import makeModelClass from '@foscia/core/model/makeModelClass';
import id from '@foscia/core/model/props/builders/id';
import {
  ModelConfig,
  ModelFactory,
  ModelFlattenDefinition,
  ModelInstance,
  ModelParsedDefinition,
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
  // eslint-disable-next-line max-len
  baseRawDefinition?: D & ThisType<ModelInstance<ModelFlattenDefinition<ModelParsedDefinition<D>>>>,
) => {
  const factory = (
    rawConfig: string | (Partial<ModelConfig> & { type: string; }),
    rawDefinition?: object,
  ) => using(
    typeof rawConfig === 'string' ? { type: rawConfig } : rawConfig,
    ({ type, ...config }) => makeModelClass(type, {
      compareValues: compareModelValues,
      cloneValue: cloneModelValue,
      ...baseConfig,
      ...config,
    }, factory.$hooks, {
      id: id(),
      lid: id(),
      ...baseRawDefinition,
      ...rawDefinition,
    }),
  );

  factory.$hooks = {};

  return factory as ModelFactory<ModelFlattenDefinition<ModelParsedDefinition<D>>>;
};
