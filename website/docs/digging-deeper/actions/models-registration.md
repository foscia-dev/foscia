---
sidebar_position: 40
description: Registering models.
---

# Registering models

:::tip What you'll learn

- Cases where you should add a models registry
- Adding a registry to your action factory
- Registering models

:::

## When should you use a registry?

A `Registry` is a simple object which will store your models classes and let
Foscia resolves models from their `type` string.

As stated in the
[models guide](/docs/core-concepts/models#explicit-type-when-having-circular-references),
you may need this object when your models contains circular references, because
you won't be able to import models when strictly following some code style (e.g.
ESLint AirBnB disallow dependency cycle).

## Adding a registry

Foscia provides a simple implementation for the registry through
[`makeRegistry`](/docs/digging-deeper/implementations/core#makemapregistrywith)
(providing using `makeRegistry` factory function).

```typescript title="action.ts"
import { makeActionFactory, makeRegistry } from '@foscia/core';
import Post from './post';
import User from './user';

// Here you should list your models.
const models = [Post, User];

export default makeActionFactory({
  // Add the registry to your action factory.
  ...makeRegistry(models),
  // ...
});
```

When adding the registry, you can also provide a type normalization function to
normalize local/data source models' types.

```typescript title="action.ts"
import { makeRegistry } from '@foscia/core';

makeRegistry(models, {
  normalizeType: (type: string) => pluralize(toCamelCase(type)),
});
```

## Registering models

Here are some suggestion on how you can register your models classes easily.

### Using an `array`

This is the most simple and common way of listing the models classes.

```typescript title="action.ts"
import Post from './post';
import User from './user';

const models = [Post, User];
```

### Using `import.meta.global`

This method can be used with some bundlers, such as ViteJS, and will provide you
an automatic registration if your models are in the same directory.

For this, we will assume all models classes are located in a `models` directory.

```typescript title="action.ts"
import { Model } from '@foscia/core';

const models = Object.values(
  import.meta.glob('./models/*.ts', {
    import: 'default',
    eager: true,
  }) as { [k: string]: Model },
);
```

### Using `require.context`

This method can be used with some bundlers, such as Webpack, and will provide
you an automatic registration if your models are in the same directory.

For this, we will assume all models classes are located in a `models` directory.

```typescript title="action.ts"
import { Model } from '@foscia/core';

const modelsRequireContext = require.context('./models', /\.ts/);
const models = modelsRequireContext
  .keys()
  .map((key) => modelsRequireContext(key).default as Model);
```
