import { ActionFactory, ContextEnhancer, ContextRunner } from '@foscia/core';
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
    ...immediateEnhancers: (ContextEnhancer<any, any> | ContextRunner<any, any>)[]
  ) => (
    mockableFactory.$mock
      ? mockableFactory.$mock.make(...immediateEnhancers)
      : (mockableFactory.$real as any)(...immediateEnhancers)
  );

  mockableFactory.$mock = null as ActionFactoryMock<C> | null;
  mockableFactory.$real = factory;

  return mockableFactory;
};
