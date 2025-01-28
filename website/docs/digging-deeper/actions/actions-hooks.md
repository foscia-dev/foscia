---
sidebar_position: 20
description: Using hooks with actions.
---

# Using hooks

:::tip What you'll learn

- Registering and unregistering hooks on actions

:::

## Usage

You may hook on multiple events which occurs on action using the hook
registration function:

- [`onRunning`](/docs/api/@foscia/core/functions/onRunning):
  after context computation, before context runner execution.
- [`onSuccess`](/docs/api/@foscia/core/functions/onSuccess):
  after context runner successful execution (no error thrown).
- [`onError`](/docs/api/@foscia/core/functions/onError):
  after context runner failed execution (error thrown).
- [`onFinally`](/docs/api/@foscia/core/functions/onFinally):
  after context runner successful or failed execution.

To register a hook callback, you must use the registration enhancer on your
building action.

```typescript
import {
    onRunning,
    onSuccess,
    onError,
    onFinally,
} from '@foscia/core';

action().use(onRunning(({ action }) => /* ... */));
action().use(onSuccess(({ action, result }) => /* ... */));
action().use(onError(({ action, error }) => /* ... */));
action().use(onFinally(({ action }) => /* ... */));
```

:::info

Hooks' callbacks are async and executed in a sequential fashion (one by one, not
parallelized).

:::

You can temporally disable hook execution for a given action by using the
[`withoutHooks`](/docs/api/@foscia/core/functions/withoutHooks) function.
[`withoutHooks`](/docs/api/@foscia/core/functions/withoutHooks) can receive
a sync or async callback: if an async callback is passed (e.g. returning a
`Promise`), it will also return a `Promise`.

```typescript
import { query, all, withoutHooks } from '@foscia/core';

// Retrieve a list of User instances without action hooks running.
const users = await withoutHooks(action(), async (a) => {
  return await a.use(query(User)).run(all());
});
```

:::warning

**Foscia may also register hooks internally** when using some enhancers. Those
provide some library features
([**models hooks**](/docs/digging-deeper/models/models-hooks), etc.). Be careful running
actions without hooks, as those hooks will also be disable.

:::
