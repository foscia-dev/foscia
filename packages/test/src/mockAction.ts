import makeActionFactoryMock from '@foscia/test/makeActionFactoryMock';
import { ActionMockableFactory } from '@foscia/test/types';

/**
 * Starts mocking a mockable action factory.
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
  factory.$mock = makeActionFactoryMock(factory.$real);

  return factory.$mock;
};
