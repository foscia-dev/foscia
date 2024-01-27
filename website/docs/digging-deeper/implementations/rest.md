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
[`makeHttpAdapterWith`](/docs/digging-deeper/implementations/http#makehttpadapter).

#### Usage

```typescript
import { paramsSerializer } from '@foscia/http';
import { makeRestAdapterWith, makeJsonRestAdapter } from '@foscia/rest';

// Using blueprint (preconfigured with sensible defaults).
const adapter = makeJsonRestAdapter({
  /* ...configuration */
});
// Using constructor (no default configuration provided).
const adapter = makeRestAdapterWith({
  serializeParams: paramsSerializer,
  /* ...configuration */
});

const response = await adapter.execute({
  /* ...context */
});
```

:::tip

If your REST API interacts with another data type than JSON, such as XML, you
can configure this behavior as a default on your adapter:

```typescript
import { objectToXML, objectFromXML } from 'some-xml-library';

makeRestAdapterWith({
  defaultBodyAs: (body) => objectToXML(body),
  defaultResponseReader: (response) => objectFromXML(body),
  defaultHeaders: {
    Accept: 'application/xml',
    'Content-Type': 'application/xml',
  },
});
```

:::

#### Configuration {#makejsonrestadapter-configuration}

`makeJsonRestAdapter` and `makeRestAdapterWith` extend its configuration object from:

-  [`makeHttpAdapter`](/docs/digging-deeper/implementations/http#makehttpadapter-configuration)

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
[`makeDeserializerWith`](/docs/digging-deeper/implementations/serialization#makedeserializerwith).

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
const deserializer = makeJsonRestDeserializer({
  /* ...configuration */
});

const { instances } = await deserializer.deserialize(data, {
  /* ...context */
});
```

:::tip

If your REST API document nest records inside the document (such as inside a
`data` property), you can add `extractData` option which will extract records
data using the given transformation function, such as:

```typescript
import { makeJsonRestDeserializer } from '@foscia/rest';

makeJsonRestSerializer({
  extractData: (data: { data: any }) => (data.data),
});
```

:::

#### Configuration

`makeJsonRestDeserializer` extends its configuration object from:

- [`makeDeserializerWith`](/docs/digging-deeper/implementations/serialization#makedeserializerwith-configuration)

#### Defined in

- [`packages/rest/src/blueprints/makeJsonRestDeserializer.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/rest/src/blueprints/makeJsonRestDeserializer.ts)

### `makeJsonRestSerializer`

This implementation of the serializer creates a REST documents from model
instance and relations.

`makeJsonRestSerializer` extends the
[`makeSerializerWith`](/docs/digging-deeper/implementations/serialization#makeserializerwith).

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
const serializer = makeJsonRestSerializer({
  /* ...configuration */
});

const data = await serializer.serializeInstance(instance, {
  /* ...context */
});
```

:::tip

If your REST API document expect record data to be nested (such as inside a
`data` property), you can add `createData` option which will wrap records data
using the given transformation function, such as:

```typescript
import { makeJsonRestSerializer } from '@foscia/rest';

makeJsonRestSerializer({
  createData: (records) => ({ data: records }),
});
```

:::

#### Configuration

`makeJsonRestSerializer` extends its configuration object from:

- [`makeSerializerWith`](/docs/digging-deeper/implementations/serialization#makeserializerwith-configuration)

| Name            | Type      | Description                                          |
|-----------------|-----------|------------------------------------------------------|
| `serializeType` | `boolean` | Append the instance `type` to the serialized object. |

#### Defined in

[`packages/rest/src/blueprints/makeJsonRestSerializer.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/rest/src/blueprints/makeJsonRestSerializer.ts)
