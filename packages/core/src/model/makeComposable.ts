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
 */
export default <D extends {} = {}>(
  rawDefinition?: D & ThisType<ModelInstance<ModelFlattenDefinition<ModelParsedDefinition<D>>>>,
) => ({
  $FOSCIA_TYPE: SYMBOL_MODEL_COMPOSABLE,
  $definition: makeDefinition(rawDefinition),
  $hooks: {},
} as ModelComposable<ModelParsedDefinition<D>>);
