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

### `makeJsonApiDeserializer`

This implementation of the deserializer extract model instances from JSON:API
documents.

`makeJsonApiDeserializer` extends the
[`makeDeserializerWith`](/docs/digging-deeper/implementations/serialization#makedeserializerwith).

<details>

<summary>

Deserialized JSON:API document example

</summary>

Here is an example of a JSON:API document which `makeJsonApiDeserializer` can
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
import { makeJsonApiDeserializer } from '@foscia/jsonapi';

// Using blueprint (preconfigured with sensible defaults).
const deserializer = makeJsonApiDeserializer({
  /* ...configuration */
});

const { instances } = await deserializer.deserialize(data, {
  /* ...context */
});
```

#### Configuration

`makeJsonApiDeserializer` extends its configuration object from:

- [`makeDeserializerWith`](/docs/digging-deeper/implementations/serialization#makedeserializerwith-configuration)

#### Defined in

- [`packages/jsonapi/src/blueprints/makeJsonApiDeserializer.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/jsonapi/src/blueprints/makeJsonApiDeserializer.ts)

### `makeJsonApiSerializer`

This implementation of the serializer creates a JSON:API documents from model
instance and relations.

`makeJsonApiSerializer` extends the
[`makeSerializerWith`](/docs/digging-deeper/implementations/serialization#makeserializerwith).

<details>

<summary>

Serialized JSON:API document example

</summary>

Here is an example of a JSON:API document which `makeJsonApiSerializer` can
create from a model instance.

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
import { makeJsonApiSerializer } from '@foscia/jsonapi';

// Using blueprint (preconfigured with sensible defaults).
const serializer = makeJsonApiSerializer({
  /* ...configuration */
});

const data = await serializer.serializeInstance(instance, {
  /* ...context */
});
```

#### Configuration

`makeJsonApiSerializer` extends its configuration object from:

- [`makeSerializerWith`](/docs/digging-deeper/implementations/serialization#makeserializerwith-configuration)

#### Defined in

- [`packages/jsonapi/src/blueprints/makeJsonApiSerializer.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/jsonapi/src/blueprints/makeJsonApiSerializer.ts)
