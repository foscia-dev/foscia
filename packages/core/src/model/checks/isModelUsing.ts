import {
  Model,
  ModelComposableFactory,
  ModelUsing,
  ModelComposable,
} from '@foscia/core/model/types';

/**
 * Check if value is a model using given composable.
 *
 * @param value
 * @param composable
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { isModelUsing } from '@foscia/core';
 *
 * if (isModelUsing(Post, publishable)) {
 *   // `Post` is strictly typed with `publishable` definition.
 * }
 * ```
 */
export default <C extends ModelComposable>(
  value: Model,
  composable: ModelComposableFactory<C>,
): value is ModelUsing<C> => value.$composables.some((c) => c.factory === composable);
