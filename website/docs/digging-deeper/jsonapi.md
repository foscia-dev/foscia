---
sidebar_position: 30
description: Using Foscia to interact with a JSON:API.
---

# JSON:API

:::tip What you'll learn

- Using Foscia to interact with a JSON:API

:::

## Setup

Please follow the [getting started guide](/docs/getting-started) to set up your
JSON:API action factory.

## Usage

### Eager loading relations

Foscia supports
[eager loading relations through `include`](/docs/core-concepts/actions#eager-loading-relations).
Internally, it will use the JSON:API relationships inclusion features.

```typescript
import { forModel, all, include } from '@foscia/core';

const posts = await action().use(forModel(Post), include('author')).run(all());
```

### Filtering requests

You can filter your request using the
[`filterBy`](/docs/reference/actions-enhancers#filterby) enhancer. This function
both supports key-value or object parameters.

```typescript
import { forModel, all } from '@foscia/core';
import { filterBy } from '@foscia/jsonapi';

const posts = await action()
  .use(
    forModel(Post),
    // Key-value pair.
    filterBy('published', true),
    // Object.
    filterBy({ published: true }),
  )
  .run(all());
```

### Sorting results

You can sort results using multiple enhancers:
[`sortBy`](/docs/reference/actions-enhancers#sortby),
[`sortByAsc`](/docs/reference/actions-enhancers#sortbyasc) and
[`sortByDesc`](/docs/reference/actions-enhancers#sortbydesc). `sortBy` supports
both object and arrays parameters and will apply ascending sorting by default.
`sortByAsc` and `sortByDesc` supports variadic keys parameter.

```typescript
import { forModel, all } from '@foscia/core';
import { sortBy, sortByDesc } from '@foscia/jsonapi';

const posts = await action()
  .use(
    forModel(Post),
    // Ascending sorting.
    sortBy(['publishedAt', 'createdAt']),
    // Custom sorting.
    sortBy(['publishedAt', 'createdAt'], ['desc', 'asc']),
    sortBy({ publishedAt: 'desc', createdAt: 'asc' }),
    // Variadic keys.
    sortByAsc('publishedAt', 'createdAt'),
  )
  .run(all());
```

### Sparse fieldsets

You can filter the record fields you will retrieve using
[`fields`](/docs/reference/actions-enhancers#fields) and
[`fieldsFor`](/docs/reference/actions-enhancers#fieldsfor) enhancers. Those are
strongly typed to your model's properties and will automatically query for
properties' aliases if they are set.

`fields` applies for the currently targeted model, whereas `fieldsFor` applies
for the given model.

```typescript
import { forModel, all, include } from '@foscia/core';
import { sortBy, sortByDesc } from '@foscia/jsonapi';

const posts = await action()
  .use(
    forModel(Post),
    include('author'),
    fields('title', 'author'),
    fieldsFor(User, 'username'),
  )
  .run(all());
```

### Paginating results

Pagination is agnostic when using JSON:API. That's why Foscia propose a
[`paginate`](/docs/reference/actions-enhancers#paginate) enhancer in which you
can pass any object value. This provides support of all pagination style.

You can combine this with the
[`usingDocument`](/docs/reference/actions-runners#usingdocument) utility
function to retrieve the whole JSON:API document (for example when your server
serialize pagination metadata in it).

```typescript
import { forModel, all } from '@foscia/core';
import { paginate, usingDocument } from '@foscia/jsonapi';

const data = await action()
  .use(
    forModel(Post),
    // A standard pagination.
    paginate({ size: 10, number: 1 }),
    // A cursor pagination.
    paginate({ size: 10, after: 1 }),
  )
  .run(all(usingDocument));

// The `all` result.
console.log(data.instances);
// The JSON:API document.
console.log(data.document);
// Some metadata your server gives you.
console.log(data.document.meta!.page.hasMore);
```

## Reference

- [Dedicated enhancers API](/docs/reference/actions-enhancers#fosciajsonapi)
- [Dedicated runners API](/docs/reference/actions-runners#fosciajsonapi)
- [Implementation and configuration guide](/docs/digging-deeper/implementations/jsonapi)
