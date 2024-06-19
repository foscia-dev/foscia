---
sidebar_position: 110
description:
  Specificities of the REST implementation and available configuration.
---

# REST

## Introduction

REST implementation provides multiple dependencies implementations to support
read/write interactions with JSON REST data sources.

## Implementations

### `makeJsonRestAdapter`

This implementation of the adapter will execute context through HTTP requests
using the
[`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

`makeJsonRestAdapter` and `makeRestAdapterWith` use
[`makeHttpAdapterWith`](/docs/reference/implementations/http#makehttpadapter).

#### Usage

```typescript
import { paramsSerializer } from '@foscia/http';
import { makeRestAdapterWith, makeJsonRestAdapter } from '@foscia/rest';

// Using blueprint (preconfigured with sensible defaults).
const { adapter } = makeJsonRestAdapter({
  /* ...configuration */
});
// Using constructor (no default configuration provided).
const { adapter } = makeRestAdapterWith({
  serializeParams: paramsSerializer,
  /* ...configuration */
});

const response = await adapter.execute({
  /* ...context */
});
```

#### Configuration {#makejsonrestadapter-configuration}

`makeJsonRestAdapter` and `makeRestAdapterWith` extend its configuration object from:

-  [`makeHttpAdapter`](/docs/reference/implementations/http#makehttpadapter-configuration)

| Name              | Type                            | Description                                                                                                             |
|-------------------| ------------------------------- |-------------------------------------------------------------------------------------------------------------------------|
| `includeParamKey` | <code>string &vert; null</code> | Define the query parameter to append when relationships inclusion is requested through `include`. Default to `include`. |

#### Defined in

- [`packages/rest/src/blueprints/makeJsonRestAdapter.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/rest/src/blueprints/makeJsonRestAdapter.ts)
- [`packages/rest/src/makeRestAdapterWith.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/rest/src/makeRestAdapterWith.ts)

### `makeJsonRestDeserializer`

This implementation of the deserializer extract model instances from object
documents.

`makeJsonRestDeserializer` extends the
[`makeDeserializerWith`](/docs/reference/implementations/serialization#makedeserializerwith).

<details>

<summary>

Deserialized REST document example

</summary>

Here is an example of a REST document which `makeJsonRestDeserializer` can deserialize
to model instances.

```json
[
  {
    "id": "1",
    "title": "Foo",
    "body": "Foo Body",
    "publishedAt": "2023-10-24T10:00:00.000Z",
    "comments": [
      {
        "id": "1",
        "body": "Foo Comment"
      },
      {
        "id": "2",
        "body": "Bar Comment"
      }
    ]
  },
  {
    "type": "posts",
    "id": "2",
    "title": "Bar",
    "body": "Bar Body",
    "publishedAt": null,
    "comments": []
  }
]
```

</details>

#### Usage

```typescript
import { makeJsonRestDeserializer } from '@foscia/rest';

// Using blueprint (preconfigured with sensible defaults).
const { deserializer } = makeJsonRestDeserializer({
  /* ...configuration */
});

const { instances } = await deserializer.deserialize(data, {
  /* ...context */
});
```

#### Configuration

`makeJsonRestDeserializer` extends its configuration object from:

- [`makeDeserializerWith`](/docs/reference/implementations/serialization#makedeserializerwith-configuration)

| Name             | Type                                                                                                                                                       | Description                                   |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|
| `pullIdentifier` | `(record: Record, context: {}) => Awaitable<DeserializerRecordIdentifier>`                                                                                 | Extract identifier (type and ID) from record. |
| `pullAttribute`  | `(record: Record, deserializerContext: DeserializerContext, extract: Extract) => Awaitable<unknown>`                                                       | Extract raw attribute value from record.      |
| `pullAttribute`  | <code>(record: Record, deserializerContext: DeserializerContext, extract: Extract) => Awaitable\<Arrayable\<Record\> &vert; null &vert; undefined\></code> | Extract raw relation value from record.       |

#### Defined in

- [`packages/rest/src/blueprints/makeJsonRestDeserializer.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/rest/src/blueprints/makeJsonRestDeserializer.ts)

### `makeJsonRestSerializer`

This implementation of the serializer creates a REST documents from model
instance and relations.

`makeJsonRestSerializer` extends the
[`makeSerializerWith`](/docs/reference/implementations/serialization#makeserializerwith).

<details>

<summary>

Serialized REST document example

</summary>

Here is an example of a REST document which `makeJsonRestSerializer` can
create from a model instance.

```json
{
  "id": "1",
  "title": "Foo",
  "body": "Foo Body",
  "publishedAt": "2023-10-24T10:00:00.000Z",
  "comments": ["1", "2"]
}
```

</details>

#### Usage

```typescript
import { makeJsonRestSerializer } from '@foscia/rest';

// Using blueprint (preconfigured with sensible defaults).
const { serializer } = makeJsonRestSerializer({
  /* ...configuration */
});

const data = await serializer.serializeInstance(instance, {
  /* ...context */
});
```

#### Configuration

`makeJsonRestSerializer` extends its configuration object from:

- [`makeSerializerWith`](/docs/reference/implementations/serialization#makeserializerwith-configuration)

| Name            | Type      | Description                                          |
|-----------------|-----------|------------------------------------------------------|
| `serializeType` | `boolean` | Append the instance `type` to the serialized object. |

#### Defined in

[`packages/rest/src/blueprints/makeJsonRestSerializer.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/rest/src/blueprints/makeJsonRestSerializer.ts)
