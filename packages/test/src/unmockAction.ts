import { ActionMockableFactory } from '@foscia/test/types';

/**
 * Stops mocking a mockable action factory.
 *
 * @param factory
 *
 * @category Utilities
 * @experimental
 */
export default <C extends {}>(
  factory: ActionMockableFactory<C>,
) => {
  // eslint-disable-next-line no-param-reassign
  factory.$mock = null;
};
