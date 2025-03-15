import { ActionFactory, AnonymousEnhancer, AnonymousRunner, configuration } from '@foscia/core';
import type { ActionFactoryMock, ActionMockableFactory } from '@foscia/test/types';

/**
 * Creates a proxy of an action factory which can be mocked.
 *
 * @param factory
 *
 * @category Factories
 * @experimental
 */
export default <C extends {}>(
  factory: ActionFactory<C>,
): ActionMockableFactory<C> => {
  const mockableFactory = (
    ...immediateEnhancers: (AnonymousEnhancer<any, any> | AnonymousRunner<any, any>)[]
  ) => (
    mockableFactory.$mock
      ? mockableFactory.$mock.make(...immediateEnhancers)
      : (mockableFactory.$real as any)(...immediateEnhancers)
  );

  mockableFactory.connectionId = factory.connectionId;
  mockableFactory.$mock = null as ActionFactoryMock<C> | null;
  mockableFactory.$real = factory;

  if (factory.connectionId === configuration.connections?.default?.connectionId) {
    configuration.connections.default = mockableFactory;
  }

  return mockableFactory;
};
