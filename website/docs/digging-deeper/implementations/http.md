---
sidebar_position: 30
description:
  Specificities of the HTTP implementation and available configuration.
---

# HTTP

## Introduction

HTTP implementation provides an `HttpAdapter` and multiple other features which
help using Foscia as an HTTP client. It is also the foundation of
[JSON:API](/docs/digging-deeper/implementations/jsonapi) and
[REST](/docs/digging-deeper/implementations/rest) implementations.

## Implementations

### `HttpAdapter`

This implementation of the adapter will execute context through HTTP requests
using the
[`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

The adapter returns `fetch` `Response` objects as data.

It will build `fetch` `Request` objects using the context, and handles multiple
use cases such as:

- Dynamic endpoint based on targeted models, IDs, etc.
- String or object query parameters using a serializer.
- Various request body typologies.
- Requests cancellation through
  [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
- Errors handling through custom errors classes.
- Requests/responses/errors transformation.

#### Usage

```typescript
import { HttpAdapter, makeHttpAdapter, paramsSerializer } from '@foscia/http';

// Using blueprint (preconfigured with sensible defaults).
const adapter = makeHttpAdapter({
  /* ...configuration */
});
// Using constructor (no default configuration provided).
const adapter = new HttpAdapter({
  serializeParams: paramsSerializer,
  /* ...configuration */
});

const response = await adapter.execute({
  /* ...context */
});
```

:::tip

`@foscia/http` provides two params serializer:

- `paramsSerializer` (default for `makeHttpAdapter`) which serialize a params
  object using `URLSearchParams`.
- `deepParamsSerializer` which deeply serialize a params object (handle deep
  array or object, because `URLSearchParams` won't).

:::

#### Configuration {#httpadapter-configuration}

| Name                   | Type                                                                                               | Description                                                                                 |
|------------------------|----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| `fetch`                | `fetch`                                                                                            | `fetch` implementation to use.                                                              |
| `baseURL`              | <code>string &vert; null</code>                                                                    | Base URL to merge with path when building the request endpoint.                             |
| `serializeParams`      | <code>(params: Dictionary) => string &vert; undefined</code>                                       | Function to serialize a query param object.                                                 |
| `responseReader`       | <code>(response: Response) => any &vert; undefined</code>                                          | Function to read the response's data before passing to deserializer (default to `.json()`). |
| `defaultHeaders`       | `Dictionary<string>`                                                                               | Default headers to use in the request.                                                      |
| `defaultBodyAs`        | <code>((body: unknown, headers: Dictionary\<string\>) => Awaitable\<BodyInit\>) &vert; null</code> | Default body transformation. If set to null, body won't be transformed.                     |
| `requestTransformers`  | `((request: Request) => Awaitable<Request>)[]`                                                     | Functions to transform a request object before sending.                                     |
| `responseTransformers` | `((response: Response) => Awaitable<Response>)[]`                                                  | Functions to transform a response object after a successful request.                        |
| `errorTransformers`    | `((error: unknown) => Awaitable<unknown>)[]`                                                       | Functions to transform an error after a `fetch` error or an unsuccessful request.           |

#### Defined in

[`packages/http/src/httpAdapter.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/http/src/httpAdapter.ts)
