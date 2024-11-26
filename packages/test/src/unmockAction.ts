import { ActionMockableFactory } from '@foscia/test/types';

/**
 * Stops mocking a mockable action factory.
 *
 * @param factory
 *
 * @category Utilities
 * @experimental
 */
export default <A extends any[], C extends {}>(
  factory: ActionMockableFactory<A, C>,
) => {
  // eslint-disable-next-line no-param-reassign
  factory.$mock = null;
};
