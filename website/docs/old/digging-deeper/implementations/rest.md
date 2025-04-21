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

### `makeRestAdapter`

[`makeRestAdapter`](/docs/api/@foscia/rest/functions/makeRestAdapter)
provides a [`Adapter`](/docs/api/@foscia/core/interfaces/Adapter)
implementation which will execute context through HTTP requests using the
[`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

`makeRestAdapter` use
[`makeHttpAdapter`](/docs/digging-deeper/implementations/http#makehttpadapter).

#### Usage

```typescript
import { makeRestAdapter } from '@foscia/rest';

const { adapter } = makeRestAdapter({
  /* ...configuration */
});

const response = await adapter.execute({
  /* ...context */
});
```

#### Configuration {#makerestadapter-configuration}

- [`RestAdapterConfig`](/docs/api/@foscia/rest/interfaces/RestAdapterConfig)

#### Defined in

- [`packages/rest/src/makeRestAdapter.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/rest/src/makeRestAdapter.ts)

### `makeRestDeserializer`

[`makeRestDeserializer`](/docs/api/@foscia/rest/functions/makeRestDeserializer)
provides a [`Deserializer`](/docs/api/@foscia/core/interfaces/Deserializer)
implementation which will extract model instances from object documents.

`makeRestDeserializer` uses
[`makeDeserializer`](/docs/digging-deeper/implementations/serialization#makedeserializer).

<details>

<summary>

Deserialized REST document example

</summary>

Here is an example of a REST document which `makeRestDeserializer` can deserialize
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
import { makeRestDeserializer } from '@foscia/rest';

const { deserializer } = makeRestDeserializer({
  /* ...configuration */
});

const { instances } = await deserializer.deserialize(data, {
  /* ...context */
});
```

#### Configuration

- [`RestDeserializerConfig`](/docs/api/@foscia/rest/interfaces/RestDeserializerConfig)

#### Defined in

- [`packages/rest/src/makeRestDeserializer.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/rest/src/makeRestDeserializer.ts)

### `makeRestSerializer`

[`makeRestSerializer`](/docs/api/@foscia/rest/functions/makeRestSerializer)
provides a [`Serializer`](/docs/api/@foscia/core/interfaces/Serializer)
implementation which will create REST object documents from
model instance and relations.

`makeRestSerializer` uses
[`makeSerializer`](/docs/digging-deeper/implementations/serialization#makeserializer).

<details>

<summary>

Serialized REST document example

</summary>

Here is an example of a REST document which `makeRestSerializer` can
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
import { makeRestSerializer } from '@foscia/rest';

const { serializer } = makeRestSerializer({
  /* ...configuration */
});

const data = await serializer.serializeInstance(instance, {
  /* ...context */
});
```

#### Configuration

- [`RestSerializerConfig`](/docs/api/@foscia/rest/interfaces/RestSerializerConfig)

#### Defined in

[`packages/rest/src/makeRestSerializer.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/rest/src/makeRestSerializer.ts)
