import isModelUsing from '@foscia/core/model/checks/isModelUsing';
import {
  ModelComposableFactory,
  ModelInstance,
  ModelInstanceUsing,
  ModelComposable,
} from '@foscia/core/model/types';

/**
 * Check if value is a model instance using given composable.
 *
 * @param value
 * @param composable
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { isInstanceUsing } from '@foscia/core';
 *
 * if (isInstanceUsing(myPost, publishable)) {
 *   // `myPost` is strictly typed with `publishable` definition.
 * }
 * ```
 */
export default <C extends ModelComposable>(
  value: ModelInstance,
  composable: ModelComposableFactory<C>,
): value is ModelInstanceUsing<C> => isModelUsing(value.$model, composable);
