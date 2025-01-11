import isInstance from '@foscia/core/model/checks/isInstance';
import isModelUsing from '@foscia/core/model/checks/isModelUsing';
import { ModelComposable, ModelInstanceUsing } from '@foscia/core/model/types';

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
  value: unknown,
  composable: C,
): value is ModelInstanceUsing<C> => isInstance(value) && isModelUsing(value.$model, composable);
