import {
  InstancesCache,
  makeActionFactory,
  makeCache,
  makeRegistry,
  ModelRegistry,
} from '@foscia/core';
import { expectTypeOf, test } from 'vitest';
import PostMock from '../mocks/models/post.mock';

test('Action factories are type safe', async () => {
  const actionFactory = makeActionFactory({
    registry: makeRegistry([PostMock]),
    ...makeCache(),
  });

  const action = actionFactory();
  const context = await action.useContext();

  expectTypeOf(context.registry).toEqualTypeOf<ModelRegistry>();
  expectTypeOf(context.cache).toEqualTypeOf<InstancesCache>();
});
