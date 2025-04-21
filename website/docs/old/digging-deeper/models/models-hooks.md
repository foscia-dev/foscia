---
sidebar_position: 30
description: Using hooks with models.
---

# Using hooks

:::tip What you'll learn

- Registering and unregistering hooks on models and instances

:::

## Usage

You can hook multiple events on model's instances using hook registration
functions, such as [`onCreating`](/docs/api/@foscia/core/functions/onCreating).

To hook on an event, use the dedicated hook registration function. Each
hook registration function will return a callback to unregister the hook.

```typescript
import { onCreating } from '@foscia/core';

// After this, the hook will run on each User instance saving.
const unregisterThisHook = onCreating(User, async (user) => {
  // TODO Do something (a)sync with user instance before saving.
});

// After this, this hook will never run again.
unregisterThisHook();
```

You can also use [`unregisterHook`](/docs/api/@foscia/core/functions/unregisterHook)
to remove a registered hook from a model.

```typescript
import { onCreating, unregisterHook } from '@foscia/core';

const myCreatingHook = async (user: User) => {
  // TODO Do something (a)sync with user instance before saving.
};

// After this, the hook will run on each User instance saving.
onCreating(User, myCreatingHook);

// After this, this hook will never run again.
unregisterHook(User, 'creating', myCreatingHook);
```

You can temporally disable hook execution for a given model by using the
[`withoutHooks`](/docs/api/@foscia/core/functions/withoutHooks) function.
[`withoutHooks`](/docs/api/@foscia/core/functions/withoutHooks) can receive
a sync or async callback: if an async callback is passed (e.g. returning a
`Promise`), it will also return a `Promise`.

```typescript
import { withoutHooks } from '@foscia/core';

const asyncResultOfYourCallback = await withoutHooks(User, async () => {
// TODO Do something async and return it.
});
```

:::warning

**Foscia may also register hooks internally** when using some features, such
as relations inverse, etc. Be careful when running a callback
without model's hooks, as those hooks will also be disabled.

:::

## Instances hooks

:::info

Most instances hooks callbacks can be asynchronous and are executed in a
sequential fashion (one by one, not parallelized). Only `init` is a sync
hook callback.

:::

You can hook on multiple events on instances:

- [`onInit`](/docs/api/@foscia/core/functions/onInit):
  instance was constructed by calling `new` on model class.
- [`onRetrieved`](/docs/api/@foscia/core/functions/onRetrieved):
  instance was deserialized from a backend response.
- [`onCreating`](/docs/api/@foscia/core/functions/onCreating):
  action to create instance will run soon.
- [`onCreated`](/docs/api/@foscia/core/functions/onCreated):
  action to create instance was ran successfully.
- [`onUpdating`](/docs/api/@foscia/core/functions/onUpdating):
  action to update instance will run soon.
- [`onUpdated`](/docs/api/@foscia/core/functions/onUpdated):
  action to update instance was ran successfully.
- [`onSaving`](/docs/api/@foscia/core/functions/onSaving):
  action to save (create or update) instance will run soon (always
  ran after `onCreating` and `onUpdating`).
- [`onSaved`](/docs/api/@foscia/core/functions/onSaved):
  action to save (create or update) instance was ran successfully
  (always ran after `onCreated` and `onUpdated`).
- [`onDestroying`](/docs/api/@foscia/core/functions/onDestroying):
  action to destroy instance will run soon.
- [`onDestroyed`](/docs/api/@foscia/core/functions/onDestroyed):
  action to destroy instance was ran successfully.

Each of these hooks callback will receive an instance as parameter:

```typescript
import { onCreating } from '@foscia/core';

onCreating(User, async (user) => {
});
```

## Models hooks

:::info

Models hooks callbacks are synchronous and are executed in
a sequential fashion (one by one, not parallelized).

:::

Only `boot` event can be hooked on a model class, using
[`onBoot`](/docs/api/@foscia/core/functions/onBoot).
It is like [`onInit`](/docs/api/@foscia/core/functions/onInit),
but will be called only once per model and will receive the model class.

```typescript
import { onBoot } from '@foscia/core';

onBoot(User, async (UserModel) => {
});
```

## Properties hooks

:::info

Instances properties hooks callbacks are synchronous and are executed in
a sequential fashion (one by one, not parallelized).

:::

You can hook on multiple events on instances' properties:

- [`onPropertyReading`](/docs/api/@foscia/core/functions/onPropertyReading):
  an instance property getter is called (ran before getting value).
- [`onPropertyRead`](/docs/api/@foscia/core/functions/onPropertyRead):
  an instance property getter is called (ran after getting value).
- [`onPropertyWriting`](/docs/api/@foscia/core/functions/onPropertyWriting):
  an instance property setter is called (ran before setting value).
- [`onPropertyWrite`](/docs/api/@foscia/core/functions/onPropertyWrite):
  an instance property setter is called (ran after setting value).

Reading hooks will receive the instance and property key, current value and definition:

```typescript
import { onPropertyReading, onPropertyRead } from '@foscia/core';

// Hook on specific property reading.
onPropertyReading(User, 'email', ({ instance, key, value, def }) => {
});
onPropertyRead(User, 'email', ({ instance, key, value, def }) => {
});

// Hook on any property reading.
onPropertyReading(User, ({ instance, key, value, def }) => {
});
onPropertyRead(User, ({ instance, key, value, def }) => {
});
```

Writing hooks will receive the instance and property key, previous value, next value and definition:

```typescript
import { onPropertyWriting, onPropertyWrite } from '@foscia/core';

// Hook on specific property reading.
onPropertyWriting(User, 'email', ({ instance, key, prev, next, def }) => {
});
onPropertyWrite(User, 'email', ({ instance, key, prev, next, def }) => {
});

// Hook on any property reading.
onPropertyWriting(User, ({ instance, key, prev, next, def }) => {
});
onPropertyWrite(User, ({ instance, key, prev, next, def }) => {
});
```

To unregister a property hook callback using
[`unregisterHook`](/docs/api/@foscia/core/functions/unregisterHook),
you should pass the event name with or without the property's key,
depending on if it is a specific property hook callback or not:

```typescript
import { unregisterHook } from '@foscia/core';

// Unregister specific property hook.
unregisterHook(User, 'property:reading:email', registeredCallback);
unregisterHook(User, 'property:read:email', registeredCallback);
unregisterHook(User, 'property:writing:email', registeredCallback);
unregisterHook(User, 'property:write:email', registeredCallback);

// Unregister non-specific properties hook.
unregisterHook(User, 'property:reading', registeredCallback);
unregisterHook(User, 'property:read', registeredCallback);
unregisterHook(User, 'property:writing', registeredCallback);
unregisterHook(User, 'property:write', registeredCallback);
```

## Using hooks with composition

All models, instances and properties hooks can be used on
[composables](/docs/digging-deeper/models/models-composition#composable-using-hooks)
and [models factories](/docs/digging-deeper/models/models-composition#factory-using-hooks).
