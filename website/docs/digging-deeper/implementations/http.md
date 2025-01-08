---
sidebar_position: 30
description:
  Specificities of the HTTP implementation and available configuration.
---

# HTTP

## Introduction

HTTP implementation provides
[`makeHttpAdapter`](/docs/api/@foscia/http/functions/makeHttpAdapter) and
multiple other features which help using Foscia as an HTTP client. It is also
the foundation of [JSON:API](/docs/digging-deeper/implementations/jsonapi) and
[REST](/docs/digging-deeper/implementations/rest) implementations.

## Implementations

### `makeHttpAdapter`


[`makeHttpAdapter`](/docs/api/@foscia/http/functions/makeHttpAdapter) provides a
[`Adapter`](/docs/api/@foscia/core/type-aliases/Adapter) implementation which
will execute context through HTTP requests using the
[`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

The adapter builds
[`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) objects
using the context, returns
[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) objects
as data and handles multiple use cases such as:

- Dynamic endpoint based on targeted models, IDs, etc.
- String or object query parameters using a customizable serializer.
- Various request body typologies.
- Requests cancellation through
  [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
- Errors handling through custom errors classes.
- Requests/responses/errors transformation.
- Defaults to JSON data for request/response bodies with appropriate headers.

#### Usage

```typescript
import { makeHttpAdapter } from '@foscia/http';

const { adapter } = makeHttpAdapter({
  /* ...configuration */
});

const response = await adapter.execute({
  /* ...context */
});
```

#### Configuration {#makehttpadapter-configuration}

- [`HttpAdapterConfig`](/docs/api/@foscia/http/type-aliases/HttpAdapterConfig)

#### Defined in

- [`packages/http/src/makeHttpAdapter.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/http/src/makeHttpAdapter.ts)
