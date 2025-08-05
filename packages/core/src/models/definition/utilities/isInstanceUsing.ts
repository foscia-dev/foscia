import isModelUsing from '@foscia/core/models/definition/utilities/isModelUsing';
import {
  ModelComposable,
  ModelComposableFactory,
  ModelInstance,
  ModelInstanceUsing,
} from '@foscia/core/models/oldTypes';

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
export default function isInstanceUsing<C extends ModelComposable>(
  value: ModelInstance,
  composable: ModelComposableFactory<C>,
): value is ModelInstanceUsing<C> {
  return isModelUsing(value.$model, composable);
}
