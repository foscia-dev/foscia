import { InstancesCache, makeActionFactory, makeCache, makeRegistry, ModelsRegistry } from '@foscia/core';
import { expectTypeOf, test } from 'vitest';

test('Action factories are type safe', async () => {
  const actionFactory = makeActionFactory({
    ...makeRegistry([]),
    ...makeCache(),
  });

  const action = actionFactory();
  const context = await action.useContext();

  expectTypeOf(context.registry).toMatchTypeOf<ModelsRegistry>();
  expectTypeOf(context.cache).toMatchTypeOf<InstancesCache>();
});
