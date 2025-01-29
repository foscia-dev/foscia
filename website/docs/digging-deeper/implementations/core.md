---
sidebar_position: 10
description:
  Specificities of the core implementations and available configuration.
---

# Core

## Introduction

Core implementations are implementations of actions' dependencies which can be
used when using Foscia for any purpose.

Since [`ModelsRegistry`](/docs/api/@foscia/core/interfaces/ModelsRegistry) and
[`InstancesCache`](/docs/api/@foscia/core/interfaces/InstancesCache) can be agnostic of
data source you are interacting with,
Foscia proposes core implementations of those dependencies.

## Implementations

### `makeCache`

[`makeCache`](/docs/api/@foscia/core/functions/makeCache) provides a
[`InstancesCache`](/docs/api/@foscia/core/interfaces/InstancesCache) implementation.

Currently, it uses [`makeRefsCache`](#makerefscache) with
[`makeWeakRefFactory`](/docs/api/@foscia/core/functions/makeWeakRefFactory).
This factory is agnostic of this implementation, so it may change in the future
if a better implementation exists. If you want to lock the used implementation,
prefer using [`makeRefsCache`](#makerefscache) directly.

#### Example

```typescript
import { makeCache } from '@foscia/core';

const { cache } = makeCache();

cache.put('posts', '1', post);
const cachedPost = cache.find('posts', '1');
```

#### Configuration

Since this factory is agnostic of implementation, no configuration is available.

#### Defined in

- [`packages/core/src/cache/makeCache.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/core/src/cache/makeCache.ts)

### `makeRefsCache`

[`makeRefsCache`](/docs/api/@foscia/core/functions/makeRefsCache) provides a
[`InstancesCache`](/docs/api/@foscia/core/interfaces/InstancesCache) implementation
which stores reference to instances created by a
[`RefFactory`](/docs/api/@foscia/core/type-aliases/RefFactory).

The [`RefFactory`](/docs/api/@foscia/core/type-aliases/RefFactory) creates
a value reference function which returns a value or `null` if the reference
is expired.

Foscia proposes two implementations of a
[`RefFactory`](/docs/api/@foscia/core/type-aliases/RefFactory):

- [`makeWeakRefFactory`](/docs/api/@foscia/core/functions/makeWeakRefFactory),
  which will store every instance as a
  [`WeakRef`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakRef).
  With this implementation, only instance that are still stored in your
  application memory (not garbage collected) remains in cache.
- [`makeTimedRefFactory`](/docs/api/@foscia/core/functions/makeTimedRefFactory),
  which will store every instance in a special object which expires after a
  configured timeout.

Type and ID normalization functions can be configured
when caching or retrieving instances. This can be useful when your models types
are different from the record types returned inside a JSON:API response.

#### Example

```typescript
import { makeRefsCache, makeWeakRefManager } from '@foscia/core';

const { cache } = makeRefsCache({
  manager: makeWeakRefManager(),
  // or...
  // manager: makeTimedRefFactory({ lifetime: 5 * 60 * 1000 }),
});

cache.put('posts', '1', post);
const cachedPost = cache.find('posts', '1');
```

#### Configuration

- [`RefsCacheConfig`](/docs/api/@foscia/core/interfaces/RefsCacheConfig)

#### Defined in

- [`packages/core/src/cache/makeRefsCache.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/core/src/cache/makeRefsCache.ts)

### `makeRegistry`

[`makeRegistry`](/docs/api/@foscia/core/functions/makeRegistry) provides a
[`ModelsRegistry`](/docs/api/@foscia/core/interfaces/ModelsRegistry) implementation.

Currently, it uses [`makeMapRegistry`](#makemapregistry). This factory is
agnostic of this implementation, so it may change in the future if a better
implementation exists. If you want to lock the used implementation, prefer
using [`makeMapRegistry`](#makemapregistry) directly.

#### Example

```typescript
import { makeRegistry } from '@foscia/core';

const { registry } = makeRegistry([User, Post, Comment]);

const PostModel = registry.modelFor('posts');
```

#### Configuration

Since this factory is agnostic of implementation, no configuration is available.

#### Defined in

- [`packages/core/src/registry/makeRegistry.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/core/src/registry/makeRegistry.ts)

### `makeMapRegistry`

[`makeRegistry`](/docs/api/@foscia/core/functions/makeRegistry) provides a
[`ModelsRegistry`](/docs/api/@foscia/core/interfaces/ModelsRegistry) implementation
which stores a map of models keyed by their type.

Type normalization function can be configured
when registering and resolving models. This can be useful when your models types
are different from the record types returned inside a JSON:API response.

#### Usage

```typescript
import { makeMapRegistry } from '@foscia/core';
import Post from './models/post';

const { registry } = makeRegistry({
  models: [User, Post, Comment],
});

const PostModel = registry.modelFor('posts');
```

#### Configuration

- [`MapRegistryConfig`](/docs/api/@foscia/core/interfaces/MapRegistryConfig)

#### Defined in

- [`packages/core/src/registry/makeMapRegistry.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/core/src/registry/makeMapRegistry.ts)
