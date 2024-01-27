---
sidebar_position: 36
description: Loading relations on a model's instances.
---

# Loading models relations

:::tip What you'll learn

- Checking if relations are loaded
- Creating functions which will load your relations
- Configuring those functions to match your needs

:::

## Checking loading state

If you want to check if an instance's relations (or deep relations) are loaded,
you can use the `loaded` function.

`loaded` recursively inspect relations. This means it will only return `true` if
**all** relations of the instance (and sub-instances for deep relations) are
loaded.

```typescript
import { loaded } from '@foscia/core';

// True if comments is loaded.
loaded(myPost, 'comments');
// True if comments and each author of comments are loaded.
loaded(myPost, 'comments.author');
```

## Loading relations

Since Foscia uses a functional approach for your action, you are able to load a
relation using different ways depending on your data source implementation.

For this, Foscia provides multiple loader factories providing various options.

### Loading relation using refresh

This is the simplest way of loading relations if your data source implementation
provides an inclusion of relations and a way to filter models based on IDs (e.g.
JSON:API).

This loader will target the model index and include the requested relations. It
supports nested relations keys if your data source supports them.

Here is an example when using a JSON:API backend with an `ids` filter available.

```typescript title="loaders/refreshLoad.ts"
import { makeRefreshIncludeLoader } from '@foscia/core';
import { filterBy } from '@foscia/jsonapi';
import action from './action';

export default makeRefreshIncludeLoader(action, {
  prepare: (action, { instances }) =>
    action.use(filterBy({ ids: instances.map((i) => i.id) })),
});
```

You can now use the loader on any instance.

```typescript
import refreshLoad from './loaders/refreshLoad';

await refreshLoad(myPost, 'comments');
await refreshLoad(myPostsArray, ['comments', 'comments.author']);
```

:::info

This loader is recommended as it will only run one action for many models and
relations. But, be aware that you should implement an adapted `prepare` to
filter the fetched models (this will avoid overloading your data source with
useless records fetching).

:::

#### Options

`makeRefreshIncludeLoader` provides multiple options:

##### `chunk: (instances: ModelInstance[]): ModelInstance[][]`

A function to split the instances array to multiple arrays (e.g. to avoid
hitting pagination limit).

##### `prepare: (action: Action, context: { instances: ModelInstance[]; relations: string[] }): Awaitable<void>`

A function to execute before running action allowing you to prepare the refresh
action (e.g. to avoid fetching a full list of models by filtering on instances'
IDs).

### Loading relation using path

This method is best suited for one instance relation loading with
implementations providing relation reading through a dedicated endpoint/query,
such as JSON:API.

It does not support nested relations keys as it will be dangerously inefficient.

```typescript title="loaders/forRelationLoad.ts"
import { makeRefreshIncludeLoader } from '@foscia/core';
import action from './action';

export default makeForRelationLoader(action);
```

You can now use the loader on any instance.

```typescript
import forRelationLoad from './loaders/forRelationLoad';

await forRelationLoad(myPost, 'comments');
```

:::warning

Because this loader will run one action per instance and relation, it is only
recommended for one instance's relation loading, not many.

:::
