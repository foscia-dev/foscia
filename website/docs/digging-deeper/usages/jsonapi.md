---
sidebar_label: JSON:API
sidebar_position: 3000
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
import { query, all, include } from '@foscia/core';

const posts = await action(query(Post), include('author'), all());
```

### Filtering requests

You can filter your request using the
[`filterBy`](/docs/api/@foscia/jsonapi/functions/filterBy) enhancer. This function
both supports key-value or object parameters.

```typescript
import { query, all } from '@foscia/core';
import { filterBy } from '@foscia/jsonapi';

const posts = await action(
  query(Post),
  // Key-value pair.
  filterBy('published', true),
  // Object.
  filterBy({ published: true }),
  all(),
);
```

### Sorting results

You can sort results using multiple enhancers:
[`sortBy`](/docs/api/@foscia/jsonapi/functions/sortBy),
[`sortByAsc`](/docs/api/@foscia/jsonapi/functions/sortByAsc) and
[`sortByDesc`](/docs/api/@foscia/jsonapi/functions/sortByDesc).
`sortBy` supports both object and arrays parameters and will apply
ascending sorting by default.
`sortByAsc` and `sortByDesc` supports variadic keys parameter.

```typescript
import { query, all } from '@foscia/core';
import { sortBy, sortByAsc } from '@foscia/jsonapi';

const posts = await action(
  query(Post),
  // Ascending sorting.
  sortBy(['publishedAt', 'createdAt']),
  // Custom sorting.
  sortBy(['publishedAt', 'createdAt'], ['desc', 'asc']),
  sortBy({ publishedAt: 'desc', createdAt: 'asc' }),
  // Variadic keys.
  sortByAsc('publishedAt', 'createdAt'),
  all(),
);
```

### Sparse fieldsets

You can filter the record fields you will retrieve using
[`fields`](/docs/api/@foscia/jsonapi/functions/fields) and
[`fieldsFor`](/docs/api/@foscia/jsonapi/functions/fieldsFor) enhancers. Those are
strongly typed to your model's properties and will automatically query for
properties' aliases if they are set.

`fields` applies for the currently targeted model, whereas `fieldsFor` applies
for the given model.

```typescript
import { query, all, include } from '@foscia/core';
import { sortBy, sortByDesc } from '@foscia/jsonapi';

const posts = await action(
  query(Post),
  include('author'),
  fields('title', 'author'),
  fieldsFor(User, 'username'),
  all(),
);
```

### Paginating results

Pagination is agnostic when using JSON:API. That's why Foscia propose a
[`paginate`](/docs/api/@foscia/jsonapi/functions/paginate) enhancer in which you
can pass any object value. This provides support of all pagination style.

You can combine this with the
[`usingDocument`](/docs/api/@foscia/jsonapi/functions/usingDocument) utility
function to retrieve the whole JSON:API document (for example when your server
serialize pagination metadata in it).

```typescript
import { query, all } from '@foscia/core';
import { paginate, usingDocument } from '@foscia/jsonapi';

const data = await action(
  query(Post),
  // A standard pagination.
  paginate({ size: 10, number: 1 }),
  // A cursor pagination.
  paginate({ size: 10, after: 1 }),
  all(usingDocument),
);

// The `all` result.
console.log(data.instances);
// The JSON:API document.
console.log(data.document);
// Some pagination metadata your server gives you.
console.log(data.document.meta!.page.hasMore);
```

### Non-standard requests

Just like with the HTTP adapter, you can run custom HTTP requests when your
data source provides non-standard features.
This provides many possibilities, such as retrieving models instances from
a global search endpoint:

```typescript
import { queryAs, all } from '@foscia/core';
import { paginate, usingDocument } from '@foscia/jsonapi';

const results = await action(
  // Notice the `queryAs` instead of `query`, this will
  // GET `/api/v1/search` instead of `/api/v1/posts/search`.
  queryAs([Post, Comment, User]),
  makeGet('search', { search: 'Hello' }),
  all(),
);

// `results` is an array Post, Comment or User instances.
console.log(results);
```

## Configuration recipes

Here are common configuration for `@foscia/jsonapi` implementation. You can read
[the implementation and configuration guide](/docs/digging-deeper/implementations/jsonapi)
for more details.

You can also take a look at
[HTTP usage and common configuration recipes](/docs/digging-deeper/usages/http#configuration-recipes), as
the JSON:API adapter is based on HTTP adapter.

### Changing endpoint case

By default, JSON:API use kebab case for models and relations endpoints (e.g.
`favorite-posts` for a `favoritePosts` relation). If you want to use another
case for endpoints, you can use
[`modelPathTransformer`](/docs/api/@foscia/jsonapi/interfaces/JsonApiAdapterConfig#modelpathtransformer)
and
[`relationPathTransformer`](/docs/api/@foscia/jsonapi/interfaces/JsonApiAdapterConfig#relationpathtransformer)
options.

```typescript
import { camelCase } from 'lodash-es';
import { makeJsonApiAdapter } from '@foscia/jsonapi';

makeJsonApiAdapter({
  modelPathTransformer: (path) => camelCase(path),
  relationPathTransformer: (path) => camelCase(path),
});
```

### Changing serialization keys case

By default, serialized and deserialized attributes and relations keep keys
specified in the model. If you are using camel cased keys (e.g. `firstName`)
but want to exchange kebab cased keys (e.g. `first-name`) with your API,
you can use
[`serializeKey`](/docs/api/@foscia/jsonapi/interfaces/JsonApiSerializerConfig#serializekey)
and [`deserializeKey`](/docs/api/@foscia/jsonapi/interfaces/JsonApiDeserializerConfig#deserializekey)
options.

```typescript
import { kebabCase } from 'lodash-es';
import { makeJsonApiSerializer, makeJsonApiDeserializer } from '@foscia/jsonapi';

makeJsonApiSerializer({
  serializeKey: ({ key }) => kebabCase(key),
});

makeJsonApiDeserializer({
  deserializeKey: ({ key }) => kebabCase(key),
});
```

:::tip

You can also change the key serialization globally using model's
[`guessAlias`](/docs/digging-deeper/models/models-configuration#guessalias)
configuration option.

:::

### Parsing URL IDs

Some API implementation may serialize records IDs as the record endpoint's URL
(such as `https://example.com/api/posts/1` for post `1`). You can customize
the deserializer to support ID and type extraction from URL ID using
[`extractId`](/docs/api/@foscia/jsonapi/interfaces/JsonApiDeserializerConfig#extractid)
and [`extractType`](/docs/api/@foscia/jsonapi/interfaces/JsonApiDeserializerConfig#extracttype)
options.

```typescript
import { makeJsonApiDeserializer } from '@foscia/jsonapi';

makeJsonApiDeserializer({
  // This will support IDs like `https://example.com/api/posts/1`, `/api/posts/1`, etc.
  extractId: (record) => String(record.id).split('/').reverse()[0],
  extractType: (record) => String(record.id).split('/').reverse()[1],
});
```

:::tip

Notice that if your API follow JSON:API specification, `type` should already be
present in each record, so you do not need to use
[`extractType`](/docs/api/@foscia/jsonapi/interfaces/JsonApiDeserializerConfig#extracttype).

:::

## Reference

- [Dedicated enhancers API reference](/docs/api/@foscia/jsonapi/#enhancers)
- [Dedicated runners API reference](/docs/api/@foscia/jsonapi/#runners)
- [Implementation and configuration guide](/docs/digging-deeper/implementations/jsonapi)
