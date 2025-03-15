---
sidebar_position: 10
description: Configuring a model behavior.
toc_max_heading_level: 4
---

# Configuring models

:::tip What you'll learn

- Configuring a model through its factory or with a custom factory
- Learning each available configuration option goal and usage

:::

## How to configure a model

You may configure your model when creating them through your factory
[`makeModel`](/docs/api/@foscia/core/functions/makeModel)
or when defining a custom factory such as described in the
[model composition guide](/docs/digging-deeper/models/models-composition#factory).

When using inside a model creation, the configuration will be
dedicated to this model. Configuration is the first argument and definition is
the second one:

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  type: 'posts',
  /* ...configuration */
}, {
  /* ...definition */
});
```

When using inside a model factory creation
(using [`makeModelFactory`](/docs/api/@foscia/core/functions/makeModelFactory)),
the configuration will be shared between all models created through this factory.
Configuration is the first argument and definition is the second one:

```typescript title="makeModel.ts"
import { attr, makeModelFactory, toDateTime } from '@foscia/core';

export default makeModelFactory({
  /* ...common configuration */
}, {
  /* ...common definition */
});
```

## Configuration options

:::info

All the following examples do not declare any model definition for readability
purpose.

:::

### Common

#### `type`

##### Description

When using the model factory
[`makeModel`](/docs/api/@foscia/core/functions/makeModel),
you have probably seen that the first argument of the function is a string.
This is the **type** of the current model.

It may be used for different purpose depending on the context:

- Concatenate in a URL to target an API specific resource
- Identify a record from an API/data source serialized data
- Guess a table name for a SQL database implementation
- Etc.

To define it, you should follow your data source convention. As an example, in a
JSON:API the resource types are defined in plural kebab case, such as
`blog-posts` or `comments`. In SQL, plural snake case is generally used,
such as `blog_posts`.

##### Example

You may define the type as the only configuration of the model or as a
configuration property (if you want to define other properties):

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel('posts');
// OR
makeModel({ type: 'posts' });
```

#### `guessAlias`

##### Description

**Default**: no transformation.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

`guessAlias` transform a model's property `key` to guess its `alias`.
The property `alias` is used instead of the default `key` to (de)serialize the
property.

##### Example

Here is an example of a path guesser using hypothetical `toKebabCase` function.
If your JSON:API record properties are using kebab cased keys but your models
are camel cased:

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  type: 'BlogPosts',
  guessAlias: (prop) => toKebabCase(prop.key),
});
```

#### `guessRelationType`

##### Description

**Default**: pluralize key for "to one" relation.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

To avoid defining types on all your relations even when necessary (for example
in some cases with REST implementation), you may configure a type guesser on
your models.

##### Example

Here is an example of a type guesser using hypothetical `toKebabCase` and
`pluralize` functions. For example, if a `Comment` model has a `blogPost`
relation, this would guess the type to `blog-posts`:

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  type: 'posts',
  guessRelationType: (prop) => pluralize(prop.key),
});
```

#### `guessRelationInverse`

##### Description

**Default**: singularize parent model type.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

To avoid manually defining inverse, you can configure a custom inverse
resolution function which will guess the inverse of a relation.

##### Example

Here is an example of an inverse guesser using hypothetical `toCamelCase` and
`singularize` functions. For example, if a `Post` model has a `comments`
relation, this would guess the inverse to `post`:

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  type: 'posts',
  guessRelationInverse: (prop) => toCamelCase(singularize(prop.parent.$type)),
});
```

#### `limitedSnapshots`

##### Description

**Default**: `true`.

Enable storing related records of a snapshot as
[`ModelLimitedSnapshot`](/docs/api/@foscia/core/interfaces/ModelLimitedSnapshot),
instead of [`ModelSnapshot`](/docs/api/@foscia/core/interfaces/ModelSnapshot),
to improve memory footprint and performance.

##### Example

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  limitedSnapshots: false,
});
```

#### `strict`

##### Description

**Default**: `undefined`.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

Globally enable all strict policies on model:

- [`strictProperties`](#strictproperties)
- [`strictReadOnly`](#strictreadonly)

:::info

If a specific strict policies is enabled/disabled, it supersedes the global
strict settings.

:::

##### Example

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  strict: true,
});
```

#### `strictProperties`

##### Description

**Default**: `false`.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

When enabled, getting a model's instance property value will throw an error if
the value was not retrieved from the store or if the relation is not loaded.

##### Example

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  strictReadOnly: true,
});
```

#### `strictReadOnly`

##### Description

**Default**: `true`.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

When enabled, setting a model's instance readonly property value will throw
an error.

##### Example

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  strictReadOnly: true,
});
```

#### `compareValues` and `cloneValue`

##### Description

**Default**: defaults implementations are available at
[`compareModelValues`](/docs/api/@foscia/core/functions/compareModelValues) and
[`cloneModelValue`](/docs/api/@foscia/core/functions/cloneModelValue).

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

You may have noticed that Foscia provide some model history features. Those
allow you to know which parts of a model instance changed since its retrieval
from the data source or interact with those changes, through
[some utilities functions](/docs/api/@foscia/core/#utilities):
[`changed`](/docs/api/@foscia/core/functions/changed),
[`restore`](/docs/api/@foscia/core/functions/restore), etc.

Those two configuration options allow you to customize how values are
compared and copied when taking a snapshot of an instance or comparing
two snapshots.

##### Example

The following model configuration is equivalent to the default behavior of
Foscia:

```typescript title="post.ts"
import { makeModel, compareModelValues, cloneModelValue } from '@foscia/core';

makeModel({
  type: 'posts',
  compareValue: compareModelValues,
  cloneValue: cloneModelValue,
});
```

:::tip

You may change those two functions to implement more flexible cloner and
comparator, for example supporting objects, map, etc. Keep in mind that:

- Values might be any value your instance could contain, including complex
  object and even other model instance
- Cloned values might be restored through
  [`restore`](/docs/api/@foscia/core/functions/restore) utility
- Making a real clone of a value without updating the comparator might break the
  history because of its default behavior

:::

### HTTP

The following configuration options are specific to HTTP models (when
interacting with JSON:API, JSON REST, etc.).

#### `baseURL`

##### Description

You may define a `baseURL` configuration option on your models. It will replace
the default base URL defined on the adapter.

##### Example

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  type: 'posts',
  baseURL: 'https://example.com/api/v2',
});
```

#### `path`

##### Description

**Default**: The model `type`.

The `path` is used to query the model. It defaults to the model's type.
In an HTTP API, it is used as the endpoint.

##### Example

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  type: 'posts',
  path: 'blog-posts',
});
```

#### `guessPath`

##### Description

**Default**: no transformation.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

`guessPath` transform a model's `type` to guess its `path`.

##### Example

Here is an example of a path guesser using hypothetical `toKebabCase` function.
If your JSON:API record types are using camel cased types but your endpoint are
kebab cased:

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  type: 'blogPosts',
  guessPath: (type) => toKebabCase(type),
});
```

#### `guessIdPath`

##### Description

**Default**: no transformation.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

`guessIdPath` transform a model's `id` to guess its `path` when querying.
This can be useful when you want to query records by given their endpoint as
their ID.

##### Example

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

// If `/api/posts/1` is given when querying Post, only `1` will be used
// as ID in requested endpoint.
makeModel({
  type: 'posts',
  guessIdPath: (id) => String(id).split('/').pop()!,
});
```

#### `guessRelationPath`

##### Description

**Default**: no transformation.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

`guessRelationPath` transform a model's relation to its "path". This is only
needed in specific implementation context (such as JSON:API when querying
related instances of a base model instance).

##### Example

Here is an example of a type guesser using hypothetical `toKebabCase` function.
If your JSON:API record properties are using kebab cased keys but your models
are camel cased:

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  type: 'posts',
  guessRelationPath: (prop: ModelRelation) => toKebabCase(prop.key),
});
```
