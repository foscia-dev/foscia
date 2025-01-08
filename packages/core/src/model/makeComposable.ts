import makeDefinition from '@foscia/core/model/makeDefinition';
import {
  ModelComposable,
  ModelFlattenDefinition,
  ModelInstance,
  ModelParsedDefinition,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_COMPOSABLE } from '@foscia/core/symbols';

/**
 * Create a composable definition which will be used by a model factory.
 *
 * @param rawDefinition
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { makeComposable } from '@foscia/core';
 *
 * export default makeComposable({
 *   // Definition...
 * });
 * ```
 */
export default <D extends {} = {}>(
  rawDefinition?: D & ThisType<ModelInstance<ModelFlattenDefinition<ModelParsedDefinition<D>>>>,
) => ({
  $FOSCIA_TYPE: SYMBOL_MODEL_COMPOSABLE,
  def: makeDefinition(rawDefinition),
  $hooks: {},
} as ModelComposable<ModelParsedDefinition<D>>);
