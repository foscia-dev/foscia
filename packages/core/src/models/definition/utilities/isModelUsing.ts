import {
  Model,
  ModelComposable,
  ModelComposableFactory,
  ModelUsing,
} from '@foscia/core/models/oldTypes';

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
export default function isModelUsing<C extends ModelComposable>(
  value: Model,
  composable: ModelComposableFactory<C>,
): value is ModelUsing<C> {
  return value.$composables.some((c) => c.factory === composable);
}
