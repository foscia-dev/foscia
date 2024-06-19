---
sidebar_label: Using REST
sidebar_position: 4000
description: Using Foscia to interact with a JSON:API.
---

# REST

:::tip What you'll learn

- Using Foscia to interact with a REST API
- Common configuration recipes

:::

## Setup

Please follow the [getting started guide](/docs/getting-started) to set up your
REST action factory.

## Usage

Currently, REST implementations does not support additional features compared to
generic Foscia features, because REST is not that much standardized about
filtering, sorting, etc.

If your REST API supports eager loading relations, you should
[configure your REST adapter](/docs/reference/implementations/rest#makejsonrestadapter)
to serialize relationships inclusion in every request.

If you need something specific, you can
[open a new issue on the repository](https://github.com/foscia-dev/foscia/issues/new/choose).

## Configuration recipes

Here are common configuration for `@foscia/rest` implementation. You can read
[the implementation and configuration guide](/docs/reference/implementations/rest)
for more details.

You can also take a look at
[HTTP usage and common configuration recipes](/docs/digging-deeper/http), as
the REST adapter is based on HTTP adapter.

### Customizing include query

If your REST API supports eager loading relations, you can use `include`
enhancer to request relations loading. This will define a query parameter
such as `include=author,comments`.

To define a custom query parameter, use the `includeParamKey` option.

```typescript
import { makeJsonRestAdapter } from '@foscia/http';

const { adapter } = makeJsonRestAdapter({
  includeParamKey: 'with',
});
```

### Changing content format

If your REST API interacts with another data type than JSON, such as XML, you
can configure this behavior as a default on your adapter:

```typescript
import { makeRestAdapterWith } from '@foscia/rest';
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

### Deserializing nested data

If your REST API document nest records inside the document (not at root, such as
inside a `data` property), you can add `extractData` option which will extract
records data using the given transformation function.

```typescript
import { makeJsonRestDeserializer } from '@foscia/rest';

makeJsonRestSerializer({
  extractData: (data: { data: any }) => ({ records: data.data }),
});
```

### Nesting serialized data

If your REST API document expect record data to be nested (not at root, such as
inside a `data` property), you can add `createData` option which will wrap
records data using the given transformation function.

```typescript
import { makeJsonRestSerializer } from '@foscia/rest';

makeJsonRestSerializer({
  createData: (records) => ({ data: records }),
});
```

### Parsing URL IDs

Some API implementation may serialize records IDs as URL to the record endpoint
(such as `https://example.com/api/posts/1` for post `1`). You can customize
the deserializer to support ID and type extraction from URL ID using the
`pullIdentifier` option.

```typescript
import { makeJsonRestDeserializer } from '@foscia/rest';

makeJsonRestDeserializer({
  pullIdentifier: (record) => {
    // This will support IDs like `https://example.com/api/posts/1`, `/api/posts/1`, etc.
    const [id, type] = String(record.id).split('/').reverse();

    return { id, type };
  },
});
```

## Reference

- [Implementation and configuration guide](/docs/reference/implementations/rest)
