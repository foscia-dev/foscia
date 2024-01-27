---
sidebar_position: 4
description: Available actions extensions.
---

# Actions extensions

Foscia provides multiple extension packs, which contains many enhancers or
runners to integrate into your action to get
[builder pattern style calls](/docs/core-concepts/actions#extensions).

## `@foscia/core`

### `coreExtensions`

- [`when`](/docs/reference/actions-enhancers#when)
- [`forModel`](/docs/reference/actions-enhancers#formodel)
- [`forInstance`](/docs/reference/actions-enhancers#forinstance)
- [`forId`](/docs/reference/actions-enhancers#forid)
- [`find`](/docs/reference/actions-enhancers#find)
- [`include`](/docs/reference/actions-enhancers#include)
- [`context`](/docs/reference/actions-enhancers#context)

### `crudExtensions`

Combination of:

- [`readExtensions`](#readextensions)
- [`writeExtensions`](#writeextensions)

### `readExtensions`

- [`all`](/docs/reference/actions-runners#all)
- [`one`](/docs/reference/actions-runners#one)
- [`oneOrFail`](/docs/reference/actions-runners#oneorfail)
- [`oneOrCurrent`](/docs/reference/actions-runners#oneorcurrent)
- [`oneOr`](/docs/reference/actions-runners#oneor)
- [`none`](/docs/reference/actions-runners#none)
- [`raw`](/docs/reference/actions-runners#raw)
- [`cached`](/docs/reference/actions-runners#cached)
- [`cachedOrFail`](/docs/reference/actions-runners#cachedorfail)
- [`cachedOr`](/docs/reference/actions-runners#cachedor)

### `writeExtensions`

- [`create`](/docs/reference/actions-enhancers#create)
- [`update`](/docs/reference/actions-enhancers#update)
- [`save`](/docs/reference/actions-enhancers#save)
- [`destroy`](/docs/reference/actions-enhancers#destroy)
- [`instanceData`](/docs/reference/actions-enhancers#instancedata)

### `hooksExtensions`

- [`onRunning`](/docs/reference/actions-enhancers#onrunning)
- [`onSuccess`](/docs/reference/actions-enhancers#onsuccess)
- [`onError`](/docs/reference/actions-enhancers#onerror)
- [`onFinally`](/docs/reference/actions-enhancers#onfinally)

## `@foscia/http`

### `httpExtensions`

- [`makeGet`](/docs/reference/actions-enhancers#makeget)
- [`makePost`](/docs/reference/actions-enhancers#makepost)
- [`makePut`](/docs/reference/actions-enhancers#makeput)
- [`makePatch`](/docs/reference/actions-enhancers#makepatch)
- [`makeDelete`](/docs/reference/actions-enhancers#makedelete)
- [`makeRequest`](/docs/reference/actions-enhancers#makerequest)
- [`param`](/docs/reference/actions-enhancers#param)
- [`abortSignal`](/docs/reference/actions-enhancers#abortsignal)

## `@foscia/jsonapi`

### `jsonApiExtensions`

- [`filterBy`](/docs/reference/actions-enhancers#filterby)
- [`fields`](/docs/reference/actions-enhancers#fields)
- [`fieldsFor`](/docs/reference/actions-enhancers#fieldsfor)
- [`sortBy`](/docs/reference/actions-enhancers#sortby)
- [`sortByDesc`](/docs/reference/actions-enhancers#sortbydesc)
- [`paginate`](/docs/reference/actions-enhancers#paginate)

### `jsonApiStarterExtensions`

Combination of:

- [`coreExtensions`](#coreextensions)
- [`crudExtensions`](#crudextensions)
- [`hooksExtensions`](#hooksextensions)
- [`httpExtensions`](#httpextensions)
- [`jsonApiExtensions`](#jsonapiextensions)

## `@foscia/rest`

### `jsonRestExtensions`

No enhancers/runners available for now in this extension.

### `jsonRestStarterExtensions`

Combination of:

- [`coreExtensions`](#coreextensions)
- [`crudExtensions`](#crudextensions)
- [`hooksExtensions`](#hooksextensions)
- [`httpExtensions`](#httpextensions)
- [`jsonRestStarterExtensions`](#jsonreststarterextensions)
