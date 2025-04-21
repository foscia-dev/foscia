import {
  InstancesCache,
  makeActionFactory,
  makeCache,
  makeRegistry,
  ModelsRegistry,
} from '@foscia/core/index';
import { expectTypeOf, test } from 'vitest';
import PostMock from '../mocks/models/post.mock';

test('Action factories are type safe', async () => {
  const actionFactory = makeActionFactory({
    registry: makeRegistry([PostMock] as const),
    ...makeCache(),
  });

  const action = actionFactory();
  const context = await action.useContext();

  expectTypeOf(context.registry).toEqualTypeOf<ModelsRegistry<readonly [typeof PostMock]>>();
  expectTypeOf(context.cache).toEqualTypeOf<InstancesCache>();
});
