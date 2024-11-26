import { Value } from '@foscia/shared/types';

/**
 * Run callback if it is a function, otherwise return value.
 *
 * @param valueOrCallback
 *
 * @internal
 */
export default <T>(valueOrCallback: T): Value<T> => (
  typeof valueOrCallback === 'function'
    ? valueOrCallback()
    : valueOrCallback as Value<T>
);
