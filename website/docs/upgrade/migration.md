---
description: Upgrade guides for major versions.
toc_max_heading_level: 2
sidebar_position: 5
---

# Migration

## 0.12.x from 0.11.x

### Medium impacts changes

- [Models setups are replaced with hooks](#models-setups-are-replaced-with-hooks)

### Models setups are replaced with hooks

**Likelihood Of Impact: Medium**

Models, composables and models factories setup functions (`boot` and `init`)
are replaced by already implemented hook system. If you are using them,
you can remove the setup object and pass your callbacks to new `onBoot`
and `onInit` functions. This provides a full-featured and unified way to hook
on models events.

As a consequence, `setup` static method on model classes and typings
for models setup have been removed.

```typescript
import { makeComposable, onBoot } from '@foscia/core';

const publishable = makeComposable({
  /* ...definition */
// highlight.deletion
}, {
// highlight.deletion
  boot: (model) => {
// highlight.deletion
  }
});

// highlight.addition
onBoot(publishable, (model) => {
// highlight.addition
});

export default publishable;
```

## 0.11.x from 0.9.x

### Medium impacts changes

- [Actions extensions are now functions](#actions-extensions-are-now-functions)

### Actions extensions are now functions

**Likelihood Of Impact: Medium**

All actions enhancers (`query`, etc.) and runners (`all`, etc.) extensions
are now a function returning the extension instead of the extension object.
This is also applicable to extensions groups (`coreExtensions`,
`jsonApiStarterExtensions`, etc.).
This new behavior prevents creating the extension object if it is not used.

If you are using actions extensions, you must update their definition in your
action factory definition, such as in the following example:

```typescript
import { makeActionFactory, query, all } from '@foscia/core';
import { jsonApiStarterExtensions } from '@foscia/jsonapi';

export default makeActionFactory({
  // makeJsonRestAdapter(), ...etc.
}, {
// highlight.deletion
  ...jsonApiStarterExtensions,
// highlight.addition
  ...jsonApiStarterExtensions(),
// highlight.deletion
  ...query.extension,
// highlight.addition
  ...query.extension(),
// highlight.deletion
  ...all.extension,
// highlight.addition
  ...all.extension(),
});
```

## 0.9.x from 0.8.x

### Medium impacts changes

- [0.7.0 deprecated types and functions removed](#070-deprecated-types-and-functions-removed)
- [CLI commands signature changed](#cli-commands-signature-changed)

### 0.7.0 deprecated types and functions removed

**Likelihood Of Impact: Medium**

`v0.7.0` deprecated types and functions have been removed:

- [`forModel`, `forInstance`, `forRelation`, `forId` and `find` are removed](#formodel-forinstance-forrelation-forid-and-find-are-deprecated)
- [`makeForRelationLoader` is removed](#makeforrelationloader-is-deprecated)
- [`runHook` is removed](#runhook-is-deprecated)
- [`ModelHookCallback` type is removed](#modelhookcallback-type-is-deprecated)

### CLI commands signature changed

**Likelihood Of Impact: Medium**

All CLI commands signature changed. As an example, `foscia make:model post`
became `foscia make model post`.

## 0.8.x from 0.7.x

### High impacts changes

- [`@foscia/cli` requires Node >= 18](#fosciacli-requires-node--18)

### `@foscia/cli` requires Node >= 18

Minimal Node version to run `@foscia/cli` has been increased from 16 to 18.
You must ensure you are using Node 18+.

## 0.7.x from 0.6.x

### High impacts changes

- [`makeComposable` return value change](#makecomposable-return-value-change)
- [`forModel`, `forInstance`, `forRelation`, `forId` and `find` are deprecated](#formodel-forinstance-forrelation-forid-and-find-are-deprecated)

### Medium impacts changes

- [`makeForRelationLoader` is deprecated](#makeforrelationloader-is-deprecated)
- [`SerializerI.serializeRelation` signature change](#serializeriserializerelation-signature-change)

### Low impacts changes

- [`Model.configure` first argument is required](#modelconfigure-first-argument-is-required)
- [`runHook` is deprecated](#runhook-is-deprecated)
- [`ModelHookCallback` type is deprecated](#modelhookcallback-type-is-deprecated)

### `makeComposable` return value change

**Likelihood Of Impact: High**

`makeComposable` will now return a `ModelComposable` object instead of
a definition object. This improves composables capabilities and limit
TypeScript object spread type inference errors.

If you are using composables, you must remove the object spread used
inside your models' definition:

```typescript
const publishable = makeComposable();

export default class Post extends makeModel('posts', {
// highlight.deletion
  ...publishable,
// highlight.addition
  publishable,
}) {}
```

### `forModel`, `forInstance`, `forRelation`, `forId` and `find` are deprecated

**Likelihood Of Impact: High**

`forModel`, `forInstance`, `forRelation`, `forId` and `find` enhancers
have been deprecated and will be removed in a next major release, you should
use [`query` enhancer](/docs/reference/actions-enhancers#query) instead:

```typescript
// `forModel` replacement.
// highlight.deletion
action().use(forModel(Post))
// highlight.addition
action().use(query(Post))
// `find` replacement.
// highlight.deletion
action().use(find(Post, '123'))
// highlight.addition
action().use(query(Post, '123'))
// `forInstance` replacement.
// highlight.deletion
action().use(forInstance(myPost))
// highlight.addition
action().use(query(myPost))
// `forRelation` replacement.
// highlight.deletion
action().use(forRelation(myPost, 'comments'))
// highlight.addition
action().use(query(myPost, 'comments))
// `forId` replacement.
// highlight.deletion
action().use(forId('123'))
// highlight.addition
action().use(context({ id: '123' }))
```

### `makeForRelationLoader` is deprecated

**Likelihood Of Impact: Medium**

`makeForRelationLoader` relation loader has been deprecated and will be
removed in a next major release, you should use `makeQueryRelationLoader`
instead. `makeQueryRelationLoader` provides the same feature and
a new warning (which can be disabled) when using it in dangerous circumstances:

```typescript
// highlight.deletion
export default makeForRelationLoader(action());
// highlight.addition
export default makeQueryRelationLoader(action());
```

### `SerializerI.serializeRelation` signature change

**Likelihood Of Impact: Medium**

`SerializerI.serializeRelation` method signature changed to support
serializing custom values instead of always serializing the instance's
current value.

If you are defining your own implementation of the `SerializerI`,
you must update your implementation.

If you are using `serializeRelation` method, you must update the passed
argument to give the value to serialize:

```typescript
serializer.serializeRelation(
  instance,
  instance.$model.$schema[key],
// highlight.addition
  instance[key],
  context,
);
```

### `Model.configure` first argument is required

**Likelihood Of Impact: Low**

`Model.configure` has been updated and now require a configuration object as
its first argument (previously, it was optional).
You must ensure your `configure` calls are always passing a configuration
object:

```typescript
// highlight.deletion
makeModel().configure()
// highlight.addition
makeModel().configure({})
```

### `runHook` is deprecated

**Likelihood Of Impact: Low**

`runHook` function has been deprecated and will be
removed in a next major release, you should use `runHooks`
instead. `runHooks` function's signature is compatible with `runHook` signature:

```typescript
// highlight.deletion
runHook(instance.$model, 'creating', instance);
// highlight.addition
runHooks(instance.$model, 'creating', instance);
```

### `ModelHookCallback` type is deprecated

**Likelihood Of Impact: Low**

`ModelHookCallback` type has been deprecated and will be
removed in a next major release, you should use `ModelInstanceHookCallback`
instead.
