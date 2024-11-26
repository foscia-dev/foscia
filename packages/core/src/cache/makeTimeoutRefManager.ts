import { RefManager, TimeoutRef, TimeoutRefConfig } from '@foscia/core/cache/types';
import { ModelInstance } from '@foscia/core/model/types';

/**
 * Create a timeout ref object.
 *
 * @param instance
 * @param config
 */
const makeTimeoutRef = <T>(instance: T, config: TimeoutRefConfig): TimeoutRef<T> => {
  let removeTimeout: ReturnType<typeof setTimeout> | undefined;
  const scheduleRemove = () => {
    clearTimeout(removeTimeout);
    removeTimeout = setTimeout(() => {
      removeTimeout = undefined;
    }, config.timeout);
  };

  scheduleRemove();

  return {
    deref: () => {
      if (removeTimeout === undefined) {
        return undefined;
      }

      scheduleRemove();

      return instance;
    },
  };
};

/**
 * Make a {@link RefManager | `RefManager`} using
 * {@link !setTimeout | `setTimeout`} to retain instance refs.
 *
 * @param config
 *
 * @category Factories
 * @since 0.13.0
 * @experimental
 */
export default (config: TimeoutRefConfig) => ({
  ref: (instance: ModelInstance) => makeTimeoutRef(instance, config),
  value: (ref: TimeoutRef<ModelInstance>) => ref.deref(),
} as RefManager<TimeoutRef<ModelInstance>>);
