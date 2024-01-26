---
sidebar_position: 100
description:
  Specificities of the JSON:API implementation and available configuration.
---

# JSON:API

## Introduction

JSON:API implementation provides multiple dependencies implementations to
support read/write interactions with [JSON:API](https://jsonapi.org) based data
source.

## Implementations

### `makeJsonApiAdapter`

This implementation of the adapter will execute context through HTTP requests
using the
[`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

`makeJsonApiAdapter` uses
[`makeRestAdapterWith`](/docs/digging-deeper/implementations/rest#makejsonrestadapter).

#### Usage

```typescript
import { deepParamsSerializer } from '@foscia/http';
import { makeJsonApiAdapter } from '@foscia/jsonapi';

// Using blueprint (preconfigured with sensible defaults).
const adapter = makeJsonApiAdapter({
  /* ...configuration */
});

const response = await adapter.execute({
  /* ...context */
});
```

#### Configuration

`JsonApiAdapter` extends its configuration object from:

-  [`makeHttpAdapter`](/docs/digging-deeper/implementations/http#makehttpadapter-configuration)
-  [`makeRestAdapterWith`](/docs/digging-deeper/implementations/rest#makejsonrestadapter-configuration)

#### Defined in

- [`packages/jsonapi/src/blueprints/makeJsonApiAdapter.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/jsonapi/src/blueprints/makeJsonApiAdapter.ts)

### `JsonApiDeserializer`

This implementation of the deserializer extract model instances from HTTP
response objects containing JSON:API documents.

`JsonApiDeserializer` extends the
[`ObjectDeserializer`](/docs/digging-deeper/implementations/object#objectdeserializer).

<details>

<summary>

Deserialized JSON:API document example

</summary>

Here is an example of a JSON:API document which `JsonApiDeserializer` can
deserialize to model instances.

```json
{
  "data": [
    {
      "type": "posts",
      "id": "1",
      "attributes": {
        "title": "Foo",
        "body": "Foo Body",
        "publishedAt": "2023-10-24T10:00:00.000Z"
      },
      "relationships": {
        "comments": {
          "data": [
            {
              "type": "comments",
              "id": "1"
            },
            {
              "type": "comments",
              "id": "2"
            }
          ]
        }
      }
    },
    {
      "type": "posts",
      "id": "2",
      "attributes": {
        "title": "Bar",
        "body": "Bar Body",
        "publishedAt": null
      },
      "relationships": {
        "comments": {
          "data": []
        }
      }
    }
  ],
  "included": [
    {
      "type": "comments",
      "id": "1",
      "attributes": {
        "body": "Foo Comment"
      }
    },
    {
      "type": "comments",
      "id": "2",
      "attributes": {
        "body": "Bar Comment"
      }
    }
  ]
}
```

</details>

#### Usage

```typescript
import { JsonApiDeserializer, makeJsonApiDeserializer } from '@foscia/jsonapi';

// Using blueprint (preconfigured with sensible defaults).
const deserializer = makeJsonApiDeserializer({
  /* ...configuration */
});
// Using constructor (no default configuration provided).
const deserializer = new JsonApiDeserializer({
  /* ...configuration */
});

const data = await deserializer.deserialize(response, {
  /* ...context */
});
```

#### Configuration

`JsonApiDeserializer` extends its configuration object from:

- [ObjectDeserializer](/docs/digging-deeper/implementations/object#objectdeserializer-configuration)

#### Defined in

[`packages/jsonapi/src/jsonApiDeserializer.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/jsonapi/src/jsonApiDeserializer.ts)

### `JsonApiSerializer`

This implementation of the serializer creates a JSON:API document from a model's
instance.

`JsonApiSerializer` extends the
[`ObjectSerializer`](/docs/digging-deeper/implementations/object#objectserializer).

<details>

<summary>

Serialized JSON:API document example

</summary>

Here is an example of a JSON:API document which `JsonApiSerializer` can create
from a model instance.

```json
{
  "data": {
    "type": "posts",
    "id": "1",
    "attributes": {
      "title": "Foo",
      "body": "Foo Body",
      "publishedAt": "2023-10-24T10:00:00.000Z"
    },
    "relationships": {
      "comments": {
        "data": [
          {
            "type": "comments",
            "id": "1"
          },
          {
            "type": "comments",
            "id": "2"
          }
        ]
      }
    }
  }
}
```

</details>

#### Usage

```typescript
import { JsonApiSerializer, makeJsonApiSerializer } from '@foscia/jsonapi';

// Using blueprint (preconfigured with sensible defaults).
const serializer = makeJsonApiSerializer({
  /* ...configuration */
});
// Using constructor (no default configuration provided).
const serializer = new JsonApiSerializer({
  /* ...configuration */
});

const data = await serializer.serialize(instance, {
  /* ...context */
});
```

#### Configuration

`JsonApiSerializer` extends its configuration object from:

- [ObjectSerializer](/docs/digging-deeper/implementations/object#objectserializer-configuration)

#### Defined in

[`packages/jsonapi/src/jsonApiSerializer.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/jsonapi/src/jsonApiSerializer.ts)
