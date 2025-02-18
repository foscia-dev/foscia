---
description: Upgrade guides for major versions.
toc_max_heading_level: 2
sidebar_position: 5
---

# Migration guides

## 0.13.x from 0.12.x

### High impacts changes

- [`oneOrCurrent` has been renamed to `current`](#oneorcurrent-has-been-renamed-to-current)
- [Builder pattern calls and actions extensions are removed](#builder-pattern-calls-and-actions-extensions-are-removed)
- [Dependencies types and other types have been renamed](#dependencies-types-and-other-types-have-been-renamed)
- [Dependencies factories functions signature changed](#dependencies-factories-functions-signature-changed)
- [HTTP transformers replaced with middlewares](#http-transformers-replaced-with-middlewares)

### Medium impacts changes

- [Action hooks events now provide action instead of context](#action-hooks-events-now-provide-action-instead-of-context)
- [Properties definition are now defined using factories](#properties-definition-are-now-defined-using-factories)
- [Internal APIs are now tagged and may have changed](#internal-apis-are-now-tagged-and-may-have-changed)
- [Relation `.config()` chained modifier is removed](#relation-config-chained-modifier-is-removed)

### Low impacts changes

- [Custom transformers must use `makeCustomTransformer`](#custom-transformers-must-use-makecustomtransformer)
- [`$model` property of snapshots is replaced by `$instance`](#model-property-of-snapshots-is-replaced-by-instance)

### `oneOrCurrent` has been renamed to `current`

**Likelihood Of Impact: High**

`oneOrCurrent` had an incorrect behavior of returning the current instance
on a not found error (such as 404 responses). This behavior has been corrected
and the runner has been renamed to `current` to avoid confusion with `one` and
other similar runners.

You must replace this runner's name:

```typescript
// highlight.deletion
import { oneOrCurrent, save } from '@foscia/core';
// highlight.addition
import { current, save } from '@foscia/core';

const post = await action(
  save(myPost),
// highlight.deletion
  oneOrCurrent(),
// highlight.addition
  current(),
);
```

### Builder pattern calls and actions extensions are removed

**Likelihood Of Impact: High**

Since its first release, Foscia provided the "builder pattern calls" through
actions' extensions. This feature allowed users to call enhancers and runners
directly on the action, without using `use` or `run`.

In this release, we are removing the extensions and this way of running
enhancers and runners. This change has two main reasons:

- TypeScript does not support higher kinded types (HKT), and extensions
  typing must be maintained aside from the function definition. This
  make maintaining enhancers and runners functions hard and error-prone.
- Extensions will increase the build size without that much benefit and are
  against Foscia functional programming approach.

You can replace those builder pattern calls by the functional programming
approach. Here is an example:

```typescript
// highlight.addition
import { query, all } from '@foscia/core';

const posts = await action()
  // highlight.deletion
  .query(Post).all();
// highlight.addition
  .run(query(Post), all());
```

If you are using some special types, such as `Action`,
`ContextEnhancer` (renamed `AnonymousEnhancer`) or
`ContextRunner` (renamed `AnonymousRunner`),
you should remove the extension generic type.

```typescript
// highlight.deletion
import { Action, ContextEnhancer, ConsumeModel } from '@foscia/core';
// highlight.addition
import { Action, AnonymousEnhancer, ConsumeModel } from '@foscia/core';
// highlight.deletion
type CustomAction = Action<ConsumeModel, {}>;
// highlight.addition
type CustomAction = Action<ConsumeModel>;
// highlight.deletion
type CustomEnhancer = ContextEnhancer<{}, any, ConsumeModel>;
// highlight.addition
type CustomEnhancer = AnonymousEnhancer<{}, ConsumeModel>;
```

> When TypeScript will provide higher kinded types, this feature will
> probably be restored.

### Dependencies types and other types have been renamed

**Likelihood Of Impact: High**

To unify Foscia types definition, main dependencies types names have changed.
If you are using those, you must use the new names:

- `RegistryI` to `ModelsRegistry`
- `CacheI` to `InstancesCache`
- `AdapterResponseI` to `AdapterResponse`
- `AdapterI` to `Adapter`
- `DeserializerI` to `Deserializer`
- `SerializerI` to `Serializer`

In addition, some other types have been renamed:

- `ContextEnhancer` to `AnonymousEnhancer`
- `ContextRunner` to `AnonymousRunner`

### Dependencies factories functions signature changed

**Likelihood Of Impact: High**

`makeCache` and `makeRegistry` are now returning agnostic objects
(`InstancesCache` and `ModelsRegistry`) instead of real implementations.

`weakRefManager` is now a factory function named `makeWeakRefManager`.

`makeMapRegistryWith` have been renamed to `makeMapRegistry` and some
functions signatures have been simplified with fewer features (no more
async model resolving and register method).

`makeHttpAdapter` now use a default query params serializer (the simple one).
As a consequence, `paramsSerializer` export have been removed.

In addition, multiple factories functions have been renamed:

- `makeRefsCacheWith` to `makeRefsCache`
- `makeHttpAdapterWith` and `makeHttpAdapter` merged to `makeHttpAdapter`
- `makeSerializerWith` to `makeSerializer`
- `makeDeserializerWith` to `makeDeserializer`
- `makeJsonRestAdapter` and `makeRestAdapterWith` merged to `makeRestAdapter`
- `makeJsonRestSerializer` to `makeRestSerializer`
- `makeJsonRestDeserializer` to `makeRestDeserializer`

### HTTP transformers replaced with middlewares

**Likelihood Of Impact: High**

To provide a simpler API and improve maintainability, HTTP adapter's and
request's transformers have been replaced by middlewares.
Instead of `requestTransformers`, `responseTransformers` and `errorTransformers`,
you should now use `middlewares`.

```typescript
import { onRunning } from '@foscia/core';

makeHttpAdapter({
// highlight.deletion
  requestTransformers: [(request) => {
// highlight.deletion
    // Transform request...
// highlight.deletion
    return request;
// highlight.deletion
  }],
// highlight.deletion
  responseTransformers: [(response) => {
// highlight.deletion
    // Transform response...
// highlight.deletion
    return response;
// highlight.deletion
  }],
// highlight.deletion
  errorTransformers: [(error) => {
// highlight.deletion
    // Transform error...
// highlight.deletion
    return error;
// highlight.deletion
  }],
// highlight.addition
  middlewares: [async (request, next) => {
// highlight.addition
    // Transform request...
// highlight.addition
    try {
// highlight.addition
      const response = await next(request);
// highlight.addition
      // Transform response...
// highlight.addition
      return response;
// highlight.addition
    } catch (error) {
// highlight.addition
      // Transform error...
// highlight.addition
      throw error;
// highlight.addition
    }
// highlight.addition
  }],
});
```

### Action hooks events now provide action instead of context

**Likelihood Of Impact: Medium**

Action hooks events now provide an action property instead of a context
property, because this might lead to outdated context values.

If your action hooks are using the context, you can still access it using
`useContext` on the action provided in the event:

```typescript
import { onRunning } from '@foscia/core';

action.use(onRunning(async (event) => {
// highlight.deletion
  console.log(event.context);
// highlight.addition
  console.log(await event.action.useContext());
}));
```

### Properties definition are now defined using factories

**Likelihood Of Impact: Medium**

Previous properties definition objects (such as `attr()`, etc.) have been
replaced by properties definition factories.
Instead of returning a direct object, those functions now return a factory
to create the final property definition. This will provide more polyvalent
model's properties in the future (such as memoized properties, etc.). As a
consequence, many internal types of Foscia changed.

In most usages of Foscia this will not have any impact, but if you are using
an internal API on properties definition, you may have to change your code.

### Internal APIs are now tagged and may have changed

**Likelihood Of Impact: Medium**

Since its release, lots of Foscia APIs were missing their documentation, even
important notes like `@internal` or `@experimental` features.
All packages have been revised and all types, functions or objects
are now correctly documented. Some internal or experimental types or functions
may have been renamed or removed.

If you are using an internal APIs, you should avoid using them or
[open an issue to request the API to be publicly maintained](https://github.com/foscia-dev/foscia/issues/new/choose).

### Relation `.config()` chained modifier is removed

**Likelihood Of Impact: Medium**

Thanks to the new relation factories signature, you can now define your
relations without calling `.config()` modifier, which has been removed.
You must now use the new call signature.

```typescript
export default class Post extends makeModel('posts', {
// highlight.deletion
  comments: hasMany<Comment[]>().config('comments'),
// highlight.addition
  comments: hasMany<Comment[]>('comments'),
// highlight.deletion
  author: hasOne(() => User).config({ path: 'author' }),
// highlight.addition
  author: hasOne(() => User, { path: 'author' }),
}) {}
```

### Custom transformers must use `makeCustomTransformer`

**Likelihood Of Impact: Low**

To improve attributes and relations factories' parameters typologies,
transformers are now special Foscia objects, like models, instances, etc.
This has no impact to transformer created using `makeTransformer`, but you
must now use a factory when defining totally custom transformers.
This is made possible with `makeCustomTransformer`:

```typescript
// highlight.addition
import { makeCustomTransformer } from '@foscia/core';

// highlight.deletion
export default {
// highlight.deletion
  deserialize: (value: string | null) => {
// highlight.addition
export default makeCustomTransformer(
// highlight.addition
  (value: string | null) => {
    if (value === null) {
      return null;
    }

    const date = new Date();
    date.setTime(Date.parse(value));

    return date;
  },
// highlight.addition
  (value: Date | null) => (value ? value.toISOString() : null),
// highlight.addition
);
// highlight.deletion
  serialize: (value: Date | null) => (value ? value.toISOString() : null),
// highlight.deletion
};
```

### `makeRefsCache` manager is replaced by references factories

To simplify the code for reference holding inside the cache, the `manager`
config option of `makeRefsCache` have been replaced by a `makeRef` option.
In addition, `makeWeakRefManager` is replaced by `makeWeakRefFactory`.

```typescript
// highlight.deletion
import { makeWeakRefManager } from '@foscia/core';
// highlight.addition
import { makeWeakRefFactory } from '@foscia/core';

makeRefsCache({
// highlight.deletion
  manager: makeWeakRefManager(),
// highlight.addition
  makeRef: makeWeakRefFactory(),
});
```

### Serializer functions signature changed to use snapshots

**Likelihood Of Impact: Low**

`makeSerializer` and all associated functions or types are now serializing
instances' snapshots instead of instances. This provides a more consistent
attributes and relations serialization and operation in time-critic systems.

If you are directly using the serializer, you should use the new call signature
and provide snapshots instead of instances. If you are using a custom
serializer, you must change your implementation to match the signature
requirements.

```typescript
// highlight.deletion
serializer.serializeInstance(instance, context)
// highlight.addition
serializer.serializeToRecords(takeSnapshot(instance), context)
```

### `$model` property of snapshots is replaced by `$instance`

**Likelihood Of Impact: Low**

To better represent where a snapshot is coming from, the `$model` property
have been replaced by an `$instance` property. If you are using this property
on a snapshot, you can just access the `$model` of the `$instance`.

```typescript
import { takeSnapshot } from '@foscia/core';

const snapshot = takeSnapshot(post);

// highlight.deletion
console.log(snapshot.$model);
// highlight.addition
console.log(snapshot.$instance.$model);
```

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
  // makeRestAdapter(), ...etc.
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

- [`forModel`, `forInstance`, `forRelation`, `forId` and
  `find` are removed](#formodel-forinstance-forrelation-forid-and-find-are-deprecated)
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
- [`forModel`, `forInstance`, `forRelation`, `forId` and
  `find` are deprecated](#formodel-forinstance-forrelation-forid-and-find-are-deprecated)

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
}) {
}
```

### `forModel`, `forInstance`, `forRelation`, `forId` and `find` are deprecated

**Likelihood Of Impact: High**

`forModel`, `forInstance`, `forRelation`, `forId` and `find` enhancers
have been deprecated and will be removed in a next major release, you should
use [`query` enhancer](/docs/api/@foscia/core/functions/query) instead:

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
