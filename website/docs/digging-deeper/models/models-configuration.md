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

You may configure your model when creating them through your factory `makeModel`
or when defining a custom factory such as described in the
[model composition guide](/docs/digging-deeper/models/models-composition#factory).

When using inside a model creation (`makeModel`), the configuration will be
dedicated to this model. Configuration is the first argument and definition is
the second one:

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel(
  {
    type: 'posts',
    /* ...configuration */
  },
  {
    /* ...definition */
  },
);
```

When using inside a model factory creation (`makeModelFactory`), the
configuration will be shared between all models created through this factory.
Configuration is the first argument and definition is the second one:

```typescript title="makeModel.ts"
import { attr, makeModelFactory, toDateTime } from '@foscia/core';

export default makeModelFactory(
  {
    /* ...common configuration */
  },
  {
    /* ...common definition */
  },
);
```

## Configuration options

:::info

All the following examples do not declare any model definition for readability
purpose.

:::

### Common

#### `type`

When using the model factory `makeModel`, you have probably seen that the first
argument of the function is a string. This is the **type** of the current model.

It may be used for different purpose depending on the context:

- Concatenate in a URL to target an API specific resource
- Identify a record from an API/data source serialized data
- Guess a table name for a SQL database implementation
- Etc.

To define it, you should follow your data source convention. As an example, in a
JSON:API the resource types are defined in plural kebab case, such as
`blog-posts` or `comments`.

You may define the type as the only configuration of the model or as a
configuration property (if you want to define other properties):

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel('posts');
// OR
makeModel({ type: 'posts' });
```

#### `path`

**Default**: The model `type`.

The `path` is used to query the model. It defaults to the model's type.

In an HTTP API, it is used as the endpoint. In a SQL database, it would be the
table.

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  type: 'posts',
  path: 'blog-posts',
});
```

#### `guessPath`

**Default**: no transformation.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

`guessPath` transform a model's `type` to guess its `path`.

Here is an example of a path guesser using hypothetical `toKebabCase` function.
If your JSON:API record types are using camel cased types but your endpoint are
kebab cased:

```typescript title="post.ts"
import { makeModel, isManyRelationDef } from '@foscia/core';

makeModel({
  type: 'blogPosts',
  guessPath: (type: string) => toKebabCase(type),
});
```

#### `guessAlias`

**Default**: no transformation.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

`guessAlias` transform a model's property `key` to guess its `alias`.

Here is an example of a path guesser using hypothetical `toKebabCase` function.
If your JSON:API record properties are using kebab cased keys but your models
are camel cased:

```typescript title="post.ts"
import { makeModel, isManyRelationDef } from '@foscia/core';

makeModel({
  type: 'BlogPosts',
  guessAlias: (key: string) => toKebabCase(key),
});
```

#### `guessRelationType`

**Default**: pluralize key for "to one" relation.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

To avoid defining types on all your relations even when necessary (for example
in some cases with REST implementation), you may configure a type guesser on
your models.

Here is an example of a type guesser using hypothetical `toKebabCase` and
`pluralize` functions. For example, if a `Comment` model has a `blogPost`
relation, this would guess the type to `blog-posts`;

```typescript title="post.ts"
import { makeModel, isPluralRelationDef, ModelRelation } from '@foscia/core';

makeModel({
  type: 'posts',
  guessRelationType: (def: ModelRelation) =>
    isPluralRelationDef(def) ? def.key : pluralize(def.key),
});
```

#### `guessRelationPath`

**Default**: no transformation.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

`guessRelationPath` transform a model's relation to its "path". This is only
needed in specific implementation context (such as JSON:API when querying
related instances of a base model instance).

Here is an example of a type guesser using hypothetical `toKebabCase` function.
If your JSON:API record properties are using kebab cased keys but your models
are camel cased:

```typescript title="post.ts"
import {
  makeModel,
  isManyRelationDef,
  ModelClass,
  ModelRelation,
} from '@foscia/core';

makeModel({
  type: 'posts',
  guessRelationPath: (def: ModelRelation) => toKebabCase(def.key),
});
```

#### `compareValue` and `cloneValue`

**Default**: compare will check for strict equality and clone will return the
base value.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

You may have noticed that Foscia provide some model history features. Those
allow you to know which parts of a model instance changed since its retrieval
from the data source or interact with those changes, through
[some utilities functions](/docs/reference/models-utilities): `changed`,
`reset`, and `syncOriginal`.

Currently, Foscia won't clone any value when syncing the instance values (on
save, etc.) and will do a strict equal comparison to known if the value changed.

The following model configuration is equivalent to the default behavior of
Foscia:

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  type: 'posts',
  compareValue: (newValue, prevValue) => nextValue === prevValue,
  cloneValue: (value) => value,
});
```

You may change those two functions to really clone values when syncing the
instance state. Keep in mind that:

- Values might be any value your instance could contain, including complex
  object and even other model instance
- Cloned values might be restored through `reset` utility
- Making a real clone of a value without updating the comparator will break the
  history because of its default behavior

#### `strict`

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

#### `strictProperties`

**Default**: `false`.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

When enabled, getting a model's instance property value will throw an error if
the value was not retrieved from the store or if the relation is not loaded.

#### `strictReadOnly`

**Default**: `true`.

**Recommandation**: use this configuration option inside a
[custom model factory](/docs/digging-deeper/models/models-composition#factory).

When enabled, setting a model's instance readonly property value will throw
an error.

### HTTP

The following configuration options are specific to HTTP models (when
interacting with JSON:API, JSON REST, etc.).

#### `baseURL`

You may define a `baseURL` configuration option on your models. It will replace
the default base URL define on the adapter.

```typescript title="post.ts"
import { makeModel } from '@foscia/core';

makeModel({
  type: 'posts',
  baseURL: 'https://example.com/api/v2',
});
```
