import type { ActionFactory } from '@foscia/core';
import type { ActionFactoryMock, ActionMockableFactory } from '@foscia/test/types';

/**
 * Creates a proxy of an action factory which can be mocked.
 *
 * @param factory
 *
 * @category Factories
 * @experimental
 */
export default <A extends any[], C extends {}>(
  factory: ActionFactory<A, C>,
): ActionMockableFactory<A, C> => {
  const mockableFactory = (...args: A) => (
    mockableFactory.$mock
      ? mockableFactory.$mock.make(...args)
      : mockableFactory.$real(...args)
  );

  mockableFactory.$mock = null as ActionFactoryMock<A, C> | null;
  mockableFactory.$real = factory;

  return mockableFactory;
};
