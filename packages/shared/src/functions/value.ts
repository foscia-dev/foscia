import { Value } from '@foscia/shared/types';

export default <T>(valueOrCallback: T): Value<T> => (
  typeof valueOrCallback === 'function'
    ? valueOrCallback()
    : valueOrCallback as Value<T>
);
