import makeDefinition from '@foscia/core/model/makeDefinition';
import makeModelSetup from '@foscia/core/model/makeModelSetup';
import {
  ModelComposable,
  ModelFlattenDefinition,
  ModelInstance,
  ModelParsedDefinition,
  ModelRawSetup,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_COMPOSABLE } from '@foscia/core/symbols';

/**
 * Create a composable definition which will be used by a model factory.
 *
 * @param rawDefinition
 * @param rawSetup
 */
export default <D extends {} = {}>(
  rawDefinition?: D & ThisType<ModelInstance<ModelFlattenDefinition<ModelParsedDefinition<D>>>>,
  rawSetup?: ModelRawSetup<ModelFlattenDefinition<ModelParsedDefinition<D>>>,
) => ({
  $FOSCIA_TYPE: SYMBOL_MODEL_COMPOSABLE,
  $definition: makeDefinition(rawDefinition),
  $setup: makeModelSetup(rawSetup),
} as ModelComposable<ModelParsedDefinition<D>>);
