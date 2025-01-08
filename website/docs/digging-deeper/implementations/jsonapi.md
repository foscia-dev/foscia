---
sidebar_position: 100
description:
  Specificities of the JSON:API implementation and available configuration.
---

# JSON:API

## Introduction

[JSON:API](https://jsonapi.org) implementation provides multiple dependencies
implementations to support read/write interactions with
[JSON:API specification](https://jsonapi.org) based data source.

## Implementations

### `makeJsonApiAdapter`

[`makeJsonApiAdapter`](/docs/api/@foscia/jsonapi/functions/makeJsonApiAdapter)
provides a [`Adapter`](/docs/api/@foscia/core/type-aliases/Adapter)
implementation which will execute context through HTTP requests using the
[`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

`makeJsonApiAdapter` uses
[`makeRestAdapter`](/docs/digging-deeper/implementations/rest#makerestadapter).

#### Usage

```typescript
import { makeJsonApiAdapter } from '@foscia/jsonapi';

const { adapter } = makeJsonApiAdapter({
  /* ...configuration */
});

const response = await adapter.execute({
  /* ...context */
});
```

#### Configuration

- [`JsonApiAdapterConfig`](/docs/api/@foscia/jsonapi/type-aliases/JsonApiAdapterConfig)
- [`RestAdapterConfig`](/docs/api/@foscia/rest/type-aliases/RestAdapterConfig)
- [`HttpAdapterConfig`](/docs/api/@foscia/http/type-aliases/HttpAdapterConfig)

#### Defined in

- [`packages/jsonapi/src/makeJsonApiAdapter.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/jsonapi/src/makeJsonApiAdapter.ts)

### `makeJsonApiDeserializer`

[`makeJsonApiDeserializer`](/docs/api/@foscia/jsonapi/functions/makeJsonApiDeserializer)
provides a [`Deserializer`](/docs/api/@foscia/core/type-aliases/Deserializer)
implementation which will extract model instances from JSON:API documents.

`makeJsonApiDeserializer` uses
[`makeDeserializer`](/docs/digging-deeper/implementations/serialization#makedeserializer).

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

const { deserializer } = makeJsonApiDeserializer({
  /* ...configuration */
});

const { instances } = await deserializer.deserialize(data, {
  /* ...context */
});
```

#### Configuration

- [`JsonApiDeserializerConfig`](/docs/api/@foscia/jsonapi/type-aliases/JsonApiDeserializerConfig)
- [`DeserializerConfig`](/docs/api/@foscia/serialization/type-aliases/DeserializerConfig)

#### Defined in

- [`packages/jsonapi/src/makeJsonApiDeserializer.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/jsonapi/src/makeJsonApiDeserializer.ts)

### `makeJsonApiSerializer`

[`makeJsonApiSerializer`](/docs/api/@foscia/jsonapi/functions/makeJsonApiSerializer)
provides a [`Serializer`](/docs/api/@foscia/core/type-aliases/Serializer)
implementation which will create JSON:API documents from model instance
and relations.

`makeJsonApiSerializer` uses
[`makeSerializer`](/docs/digging-deeper/implementations/serialization#makeserializer).

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

const { serializer } = makeJsonApiSerializer({
  /* ...configuration */
});

const data = await serializer.serializeInstance(instance, {
  /* ...context */
});
```

#### Configuration

- [`JsonApiSerializerConfig`](/docs/api/@foscia/jsonapi/type-aliases/JsonApiSerializerConfig)
- [`SerializerConfig`](/docs/api/@foscia/serialization/type-aliases/SerializerConfig)

#### Defined in

- [`packages/jsonapi/src/makeJsonApiSerializer.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/jsonapi/src/makeJsonApiSerializer.ts)
