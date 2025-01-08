import { RefManager } from '@foscia/core/cache/types';
import { ModelInstance } from '@foscia/core/model/types';

/**
 * Make a {@link RefManager | `RefManager`} using
 * {@link !WeakRef | `WeakRef`} to retain instance refs.
 *
 * @category Factories
 * @since 0.13.0
 */
export default () => ({
  ref: (instance: ModelInstance) => new WeakRef(instance),
  value: (ref: WeakRef<ModelInstance>) => ref.deref(),
} as RefManager<WeakRef<ModelInstance>>);
