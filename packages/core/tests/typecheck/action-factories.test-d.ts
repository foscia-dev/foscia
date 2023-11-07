import {
  all,
  makeActionFactory,
  makeCache,
  makeRegistry,
  MapRegistry,
  RefsCache,
} from '@foscia/core';
import { expectTypeOf, test } from 'vitest';

test('Action factories are type safe', async () => {
  const actionFactory = makeActionFactory({
    ...makeRegistry([]),
    ...makeCache(),
  }, {
    ...all.extension,
  });

  const action = actionFactory();
  const context = await action.useContext();

  expectTypeOf(action.all).toMatchTypeOf<Function>();
  expectTypeOf(context.registry).toMatchTypeOf<MapRegistry>();
  expectTypeOf(context.cache).toMatchTypeOf<RefsCache>();
});
