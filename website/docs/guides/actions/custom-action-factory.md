---
sidebar_position: 70
description: Making your own action factory.
---

# Creating an action factory

:::tip What you'll learn

- Creating a custom action factory

:::

As mentioned in the
[implementations guide presentation](/docs/guides/implementations/presentation),
any action will require some dedicated features through dependencies.

When using an action factory blueprint, all those dependencies are initialized
automatically, and you may only configure it. This is quick and simple, but do
not fit custom implementations or full tree-shaking needs.

## Replacing some dependencies

Sometimes, you may need to only replace an overwritten dependency (such as a
customized version of the `RestDeserializer`). Admitting you have an extended
version of this deserializer like:

```typescript title="action/customDeserializer.js"
export default class CustomDeserializer extends RestDeserializer {
  // ...your overwrite...
}
```

You are able to keep using the default blueprint factory and only replace some
dependency by instantiating your action manually:

```typescript title="action.js"
import { makeJsonRest } from '@foscia/rest';
import { context } from '@foscia/core';
import CustomDeserializer from './action/customDeserializer';

// Note that we are not using the exported action function,
// but the raw Action class.
const { Action, cache, registry, adapter, serializer } = makeJsonRest({
  http: {
    baseURL: 'https://example.com/api/v1',
  },
});

const deserializer = new CustomDeserializer();

// We are now manually declaring our action factory
// with the proper dependencies injection.
export default function action() {
  return new Action().use(
    context({
      cache,
      registry,
      adapter,
      deserializer,
      serializer,
    }),
  );
}
```

## Writing your own factory

For more complex requirements, like with custom implementations, you should use
a custom action factory from scratch.

When using a custom action factory, all those dependencies are initialized and
attached to your actions manually. This gives you a lot of control over which
dependencies are imported, instantiated and attached, thus reducing your
production bundle if you are removing unused dependencies.

To write a custom action factory, you may inspire from Foscia official
blueprints factories :

- [`makeJsonApi`](https://github.com/foscia-dev/foscia/blob/main/packages/jsonapi/src/makeJsonApi.ts)
- [`makeJsonRest`](https://github.com/foscia-dev/foscia/blob/main/packages/rest/src/makeJsonRest.ts)

:::warning

When an action enhancer/runner requires a dependency, Foscia will throw an
exception if this dependency is not available in the context.

You can remove useless dependencies which you are not using for now.

**But, be careful!** Removing some dependencies may have an invisible impact! As
an example, absence of the cache may not throw an exception, but will allow
multiple instances of the same record to coexist.

:::
