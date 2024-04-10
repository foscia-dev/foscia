---
sidebar_position: 20
description: Sharing common features across your models.
---

# Composing models

:::tip What you'll learn

- Creating composables to share features across some of your models
- Creating your own model factory with predefined features for all of your
  models

:::

Sometimes, you may want to share common features across your models. To solve
this, you may use one of the two solutions proposed by Foscia:

- [Composition](#composition), to share features across some of your models
- [Factory](#factory), to share features across all of your models

## Composition

When you need to share features across **some** of your models, you should use
composition.

### Defining a composable

The first step is to create a composable with the features you want to share.
This is done through `makeComposable` and uses the same syntax as `makeModel`.

The created composable will get its custom properties (e.g. `published` below)
rewritten to protect their descriptor. This allows using spread syntax when
using composable in other models' definition.

```typescript title="composables/publishable.ts"
import { attr, makeComposable, toDateTime } from '@foscia/core';

export default makeComposable({
  publishedAt: attr(toDateTime()).nullable(),
  get published() {
    return !!this.publishedAt;
  },
});
```

### Using a composable

The easiest way to use your composable is to object-spread it inside your
model's definition.

```typescript title="models/post.ts"
import { makeModel } from '@foscia/core';
import publishable from '../composables/publishable';

export default class Post extends makeModel('posts', {
  publishable,
  /** post definition */
}) {}
```

You may also use the model `extend` method as follows:

```typescript title="models/post.ts"
import { makeModel } from '@foscia/core';
import publishable from '../composables/publishable';

export default class Post extends makeModel('posts').extend({ publishable }) {}
```

### Defining setup tasks

Just like [models setup](/docs/core-concepts/models#setup), composables
can also provide setup behaviors for models and their instances by passing
a second argument to `makeComposable`.

```typescript title="composables/uuidID.ts"
import { attr, makeComposable, onCreating } from '@foscia/core';
import { v4 as uuidV4 } from 'uuid';

export default makeComposable({
  id: attr<string | null>(),
}, {
  boot: (model) => {
    onCreating(model, (instance) => {
      instance.id = instance.id ?? uuidV4();
    });
  },
});
```

### Typechecking composables

You can easily typecheck for models or instances using some of your composables
by defining type aliases. You can also use `isModelUsing` or `isInstanceUsing`
functions to check for composition existing on a model or instance:

```typescript title="composables/publishable.ts"
import { attr, makeComposable, toDateTime, isInstanceUsing, isModelUsing, ModelInstanceUsing, ModelUsing } from '@foscia/core';

const publishable = makeComposable({
  publishedAt: attr(toDateTime()).nullable(),
});

// Defining type aliases for your composable.
export type PublishableInstance = ModelInstanceUsing<typeof publishable>;
export type PublishableModel = ModelUsing<typeof publishable>;

export default publishable;

// Use type aliases for your function.
function somethingRequiringAPublishable(instance: PublishableInstance) {
  console.log(instance.publishedAt);
}

// Checking if a model/instance is implementing a composable.
isInstanceUsing(someInstance, publishable); // `someInstance` extends `publishable`.
isModelUsing(SomeModel, publishable); // `SomeModel` extends `publishable`.
```

:::warning

`isInstanceUsing` and `isModelUsing` will only check that the model definition
contain *at some time* the composable, but won't guaranty that the composable
properties are not overwritten afterward.

:::

## Factory

When you need to share features across **all** of your models, you should use a
custom model factory. It will replace the Foscia's `makeModel` function.

```typescript title="makeModel.ts"
import { attr, makeModelFactory, toDateTime } from '@foscia/core';

export default makeModelFactory({
  /* ...common configuration */
}, {
  createdAt: attr(toDateTime()),
  updatedAt: attr(toDateTime()),
  get wasChangedSinceCreation() {
    return this.createdAt.getTime() === this.updatedAt.getTime();
  },
}, {
  /* ...common setup */
});
```

Once your factory is ready, you can use it in replacement of the default
`makeModel` provided by Foscia.

```typescript
import makeModel from './makeModel';

export default class Post extends makeModel('posts', {
  /* definition */
}) {}
```
