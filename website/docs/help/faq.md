---
description: Common questions asked about Foscia.
---

# FAQ

If you have any questions, feel free to ask them on our
[GitHub Issues page](https://github.com/foscia-dev/foscia/issues).

## Why are we not using big `Model` and `Builder` classes?

In a lot of frameworks, modeling the data and building the query are done
through two main classes: the `Model` and the `Builder`.

The goal of Foscia is to provide a lot of simple function to affect model
instances or their context. If all of those functions were included in classes,
it will be in your final production bundle even if you are not using them.
Thanks to the way Foscia works, **all unused models helpers or actions
enhancers/runners can be tree-shaken.**

## Is it type safe?

**Yes!** Foscia makes great use of Typescript generics to provide strongly typed
models objects and contexts changes.

Here are a short example of the capabilities reusing the previous examples:

```typescript title="post.ts"
import { makeModel, attr, hasMany, toDateTime } from '@foscia/core';
import Comment from './comment';

class Post extends makeModel('posts', {
  title: attr({ default: '' }), // Infered to string.
  description: attr<string>(), // Custom types are also supported.
  createdAt: attr(toDateTime()), // Infered from transformers.
  publishedAt: attr(toDateTime()).nullable(),
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
```

Type safe models are used by context enhancers to provide strongly typed
parameters.

```typescript
const posts = await action()
  // We are telling the action context is now for the Post model.
  .use(forModel(Post))
  // We can now use this action context to strongly type context enhancer params.
  // As an example, `include` is typed for deep dotted relations, such as:
  // "comments", "comments.author", "comments.author.favoritePosts", etc.
  .use(include('comments'))
  // As another example, `fields` is typed for direct attributes or relations of the model.
  .use(fields('title', 'description', 'comments'))
  .run(all());
```

## Why extending models' classes?

Mainly because **it prevents dependency cycles** when using TypeScript.

This is clearly explained in the
[Models guide](/docs/core-concepts/models#note-on-exported-value).

## What are the downsides of Foscia approach?

When declaring models, there are no clear downside of the functional
programming, as `this` context is still available in definition and classes
body.

But, since we are not building the action factory for you, you must initialize
this factory yourself with the things you need: an adapter, a serializer, etc.
Don't worry, the process is still pretty simple thanks to blueprints.

In addition, you will need a supplementary step to be able to use
`action().forModel(Post).all()`, because those functions must be imported to be
used. This is possible through actions' extensions, which will plug functions to
your action instance and allow you to use a builder pattern call style.

## Why is my IDE slow when using Foscia?

Due to generics usage and types inference, Foscia may require more types
computation for autocompletion than other librairies.

- **JetBrains's IDEs** seems to currently have a problem with TypeScript types
  evaluation performance:
  [you should check out this meta issue tracking CPU overwhelm when using TypeScript to get updates](https://youtrack.jetbrains.com/issue/WEB-52943/Meta-High-CPU-usage-on-resolve-or-types-evaluation-in-TypeScript).
- **VSCode** looks to quickly provide autocompletion without any problem.
