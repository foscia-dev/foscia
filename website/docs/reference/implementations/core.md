---
sidebar_position: 10
description:
  Specificities of the core implementations and available configuration.
---

# Core

## Introduction

Core implementations are implementations of actions' dependencies which can be
used when using Foscia for any purpose.

Since `Registry` and `Cache` can be agnostic of data source you are interacting
with, Foscia proposes core implementations of those dependencies.

## Implementations

### `makeMapRegistryWith`

This implementation of the registry stores a map of resolved models keyed by
their type. Resolvable models can be registered synchronously or asynchronously,
with or without specifying an explicit type.

When registering models asynchronously without specifying their type, the
registry will try to resolve each registered model to find the one matching the
searched type.

A type normalization function can be configured to normalize the type when
registering or resolving models. This can be useful when your models types are
different from the record types returned inside a JSON:API response.

:::tip

`makeMapRegistryWith` is used as the default registry factory in `makeRegistry`.
You can use it to
[**register your models**](/docs/digging-deeper/actions/models-registration)
when necessary.

:::

#### Usage

```typescript
import { makeMapRegistryWith, makeRegistry } from '@foscia/core';
import Post from './models/post';

// Using blueprint (preconfigured with sensible defaults).
const registry = makeRegistry(
  [Post, /* ...registered models */],
  { /* ...configuration */ },
);
// Using constructor (no default configuration provided).
const registry = makeMapRegistryWith({
  /* ...configuration */
});

// Register post synchronously.
registry.register([Post]);
// Register post asynchronously with explicit type.
registry.register({
  posts: async () => (await import('./models/post')).default,
});
registry.register([
  {
    type: 'posts',
    resolver: async () => (await import('./models/post')).default,
  },
]);
// Register post asynchronously without explicit type.
registry.register([async () => (await import('./models/post')).default]);
```

#### Configuration

| Name            | Type                                                | Description                                                |
| --------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| `normalizeType` | <code>((type: string) => string) &vert; null</code> | Normalize the type before registering or resolving models. |

#### Defined in

- [`packages/core/src/blueprints/makeRegistry.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/core/src/blueprints/makeRegistry.ts)
- [`packages/core/src/registry/makeMapRegistryWith.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/core/src/registry/makeMapRegistryWith.ts)

### `makeRefsCacheWith`

This implementation of the cache stores reference to model instance created by a
`RefManager`.

The `RefManager` is responsible to:

- Create a ref object for a cached instance.
- Retrieve value for this ref object (may return undefined if the ref has
  expired).

Foscia proposes a simple implementation of a `RefManager`, named
`weakRefManager`, which will store model instance as
[`WeakRef`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakRef).
With this implementation, only instance that are still stored in your
application memory (not garbage collected) remains in cache.

You can define another implementation of `RefManager`, for example based on an
expiration timeout.

#### Usage

```typescript
import { makeCache, makeRefsCacheWith, weakRefManager } from '@foscia/core';
import Post from './models/post';

// Using blueprint (preconfigured with sensible defaults).
const cache = makeCache({
  /* ...configuration */
});
// Using constructor (no default configuration provided).
const cache = makeRefsCacheWith({
  manager: weakRefManager,
});

const post = new Post();

// Store post.
cache.put('posts', '1', post);
// Retrieve post.
cache.find('posts', '1');
```

#### Configuration

| Name      | Type                                                               | Description                                                      |
| --------- | ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `manager` | [`RefManager`](/docs/reference/api/modules/foscia_core#refmanager) | Create refs to instances and retrieve/expire those refs' values. |

#### Defined in

- [`packages/core/src/blueprints/makeCache.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/core/src/blueprints/makeCache.ts)
- [`packages/core/src/cache/makeRefsCacheWith.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/core/src/cache/makeRefsCacheWith.ts)
