---
description: Upgrade guides for major versions.
toc_max_heading_level: 2
sidebar_position: 5
---

# Migration

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

```diff
const publishable = makeComposable();

export default class Post extends makeModel('posts', {
- ...publishable,
+ publishable,
}) {}
```

### `forModel`, `forInstance`, `forRelation`, `forId` and `find` are deprecated

**Likelihood Of Impact: High**

`forModel`, `forInstance`, `forRelation`, `forId` and `find` enhancers
have been deprecated and will be removed in a next major release, you should
use [`query` enhancer](/docs/reference/actions-enhancers#query) instead:

```diff
// `forModel` replacement.
-action().use(forModel(Post))
+action().use(query(Post))
// `find` replacement.
-action().use(find(Post, '123'))
+action().use(query(Post, '123'))
// `forInstance` replacement.
-action().use(forInstance(myPost))
+action().use(query(myPost))
// `forRelation` replacement.
-action().use(forRelation(myPost, 'comments'))
+action().use(query(myPost, 'comments))
// `forId` replacement.
-action().use(forId('123'))
+action().use(context({ id: '123' }))
```

### `makeForRelationLoader` is deprecated

**Likelihood Of Impact: Medium**

`makeForRelationLoader` relation loader has been deprecated and will be
removed in a next major release, you should use `makeQueryRelationLoader`
instead. `makeQueryRelationLoader` provides the same feature and
a new warning (which can be disabled) when using it in dangerous circumstances:

```diff
-export default makeForRelationLoader(action());
+export default makeQueryRelationLoader(action());
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

```diff
serializer.serializeRelation(
  instance,
  instance.$model.$schema[key],
+ instance[key],
  context,
);
```

### `Model.configure` first argument is required

**Likelihood Of Impact: Low**

`Model.configure` has been updated and now require a configuration object as
its first argument (previously, it was optional).
You must ensure your `configure` calls are always passing a configuration
object:

```diff
-makeModel().configure()
+makeModel().configure({})
```

### `runHook` is deprecated

**Likelihood Of Impact: Low**

`runHook` function has been deprecated and will be
removed in a next major release, you should use `runHooks`
instead. `runHooks` function's signature is compatible with `runHook` signature:

```diff
-runHook(instance.$model, 'creating', instance);
+runHooks(instance.$model, 'creating', instance);
```

### `ModelHookCallback` type is deprecated

**Likelihood Of Impact: Low**

`ModelHookCallback` type has been deprecated and will be
removed in a next major release, you should use `ModelInstanceHookCallback`
instead.
