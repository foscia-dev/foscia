---
description: Common questions asked about Foscia.
---

# FAQ

If you have any questions, feel free to ask them on our
[GitHub Discussions page](https://github.com/foscia-dev/foscia/discussions).

## Why are we not using big `Model` and `Builder` classes?

In a lot of frameworks, modeling the data and building the query are done
through two main classes: the `Model` and the `Builder`.

The goal of Foscia is to provide a lot of simple functions to affect model
instances or their context. If all of those functions were included in classes,
it will be in your final production bundle even if you are not using them.
Thanks to the way Foscia works, **all unused models helpers or actions
enhancers/runners will be tree-shaken.**

But, Foscia is not a functional programming library: it is still using classes
or doing common tasks internally to provide common features inside a simple API.

## Is it type safe?

**Yes!** Foscia makes great use of Typescript generics to provide strongly typed
models objects and contexts changes.
Here are short examples of the capabilities within models and actions:

```typescript title="post.ts"
import { makeModel, attr, hasMany, toDateTime } from '@foscia/core';
import Comment from './comment';

class Post extends makeModel('posts', {
  title: attr({ default: '' }), // Infered to string.
  description: attr<string>(), // Custom types are also supported.
  createdAt: attr(toDateTime()), // Infered from transformers.
  publishedAt: attr(toDateTime(), { nullable: true }),
  comments: hasMany(() => Comment),
  // `this` context is available and strongly typed in definition methods.
  get isPublished() {
    return !!this.publishedAt;
  },
}) {
  // `this` context is also available and strongly typed in class methods.
  shortenDescription() {
    return this.description.substring(0, 50);
  }
}

const posts = await action(
  // We are telling the action context is now for the Post model.
  query(Post),
  // We can now use this action context to strongly type context enhancer params.
  // As an example, `include` is typed for deep dotted relations, such as:
  // "comments", "comments.author", "comments.author.favoritePosts", etc.
  include('comments'),
  // As another example, `fields` is typed for direct attributes or relations of the model.
  fields('title', 'description', 'comments'),
  all(),
);
```

## Why extending `makeModel`?

Extending the model created with `makeModel` provide a clear type definition
for the model (instead of the complex generic typing) and help avoiding
dependency cycles with TypeScript `import type` statements.

## What are the downsides of Foscia approach?

When declaring models, there are no clear downside of the attributes and
relations definition Foscia provide, as it is more consise as most other
libraries using TypeScript decorators, etc.
In addition, `this` context is still available in definition and classes
body.

But, since we are not building the action factory for you, you must initialize
this factory yourself with the things you need: an adapter, a serializer, etc.
Don't worry, the process is still pretty simple thanks to preconfigured
dependencies.

Finally, there is no method chaining within actions, which requires the
user of Foscia to known which functions to use for which usages.
That's why Foscia provides documentation for many use cases with
clear examples and a complete API documentation.

## Why is my IDE slow when using Foscia?

Due to generics usage and types inference, Foscia may require more types
computation for autocompletion than other librairies.
