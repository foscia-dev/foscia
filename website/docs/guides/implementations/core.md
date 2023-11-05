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

### `MapRegistry`

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

`MapRegistry` is provided by most of the Foscia action factory blueprints (e.g.
`makeJsonApi`, `makeJsonRest`, etc.). You can register your models using the
`models` configuration option of those action factory blueprints.

:::

#### Usage

```typescript
import { MapRegistry } from '@foscia/core';
import Post from './models/post';

const registry = new MapRegistry({
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

| Name            | Type                                                | Description                                                  |
| --------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| `normalizeType` | <code>((type: string) => string) &vert; null</code> | Normalization function when registering or resolving models. |

#### Defined in

[`packages/core/src/registry/mapRegistry.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/core/src/registry/mapRegistry.ts)

### `RefsCache`

<span className="chip chip--primary">Work in progress</span>

#### Defined in

[`packages/core/src/cache/refsCache.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/core/src/cache/refsCache.ts)
