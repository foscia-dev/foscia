import { ActionMockableFactory } from '@foscia/test/types';

/**
 * Stops mocking a mockable action factory.
 *
 * @param factory
 */
export default function unmockAction<A extends any[], C extends {}, E extends {}>(
  factory: ActionMockableFactory<A, C, E>,
) {
  // eslint-disable-next-line no-param-reassign
  factory.$mock = null;
}
