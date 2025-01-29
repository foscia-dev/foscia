import { ModelComposable } from '@foscia/core/model/types';

/**
 * Model composable factory typing.
 *
 * @internal
 */
export type ModelPendingComposable<C extends ModelComposable> =
  Omit<C, 'factory' | 'parent' | 'key' | '_type'> & ThisType<C>;
