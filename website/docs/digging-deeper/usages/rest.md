---
sidebar_label: REST
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
[configure your REST adapter](/docs/digging-deeper/implementations/rest#makerestadapter)
to serialize relationships inclusion in every request.

If you need something specific, you can
[open a new issue on the repository](https://github.com/foscia-dev/foscia/issues/new/choose).

### Supporting polymorphism

If you want your Foscia deserialization process to support polymorphism,
your server should return a `type` key which match the Foscia model's type
in addition to other attributes (ID, etc.). Without this, Foscia
cannot precisely determine which record match which model.

```json
{
  "id": 1,
  // highlight.addition
  "type": "posts",
  "title": "Hello World"
}
```

It can be useful when you use polymorphic relations or when your use
non-standard endpoints returning multiple models' instances. In addition, you
can [set up a models registry](/docs/digging-deeper/actions/models-registration)
to map types and models, and support circular models relations.

### Non-standard requests

Just like with the HTTP adapter, you can run custom HTTP requests when your
data source provides non-standard features.
This provides many possibilities, such as retrieving models instances from
a global search endpoint. In combination with polymorphism implementation
on your data source, [`queryAs`](/docs/api/@foscia/core/functions/queryAs)
will help Foscia resolves your models.

```typescript
import { queryAs, all } from '@foscia/core';

const results = await action(
  // Notice the `queryAs` instead of `query`, this will
  // GET `/api/search` instead of `/api/posts/search`.
  queryAs([Post, Comment, User]),
  makeGet('search', { search: 'Hello' }),
  all(),
);

// `results` is an array Post, Comment or User instances.
console.log(results);
```

## Configuration recipes

Here are common configuration for `@foscia/rest` implementation. You can read
[the implementation and configuration guide](/docs/digging-deeper/implementations/rest)
for more details.

You can also take a look at
[HTTP usage and common configuration recipes](/docs/digging-deeper/usages/http#configuration-recipes), as
the REST adapter is based on HTTP adapter.

### Customizing include query

If your REST API supports eager loading relations, you can use
[`include`](/docs/api/@foscia/core/functions/include) to request relations
loading. This will define a query parameter such as `include=author,comments`.

To define a custom query parameter, use the
[`includeParamKey`](/docs/api/@foscia/rest/interfaces/RestAdapterConfig#includeparamkey)
option.

```typescript
import { makeRestAdapter } from '@foscia/rest';

const { adapter } = makeRestAdapter({
  includeParamKey: 'with',
});
```

### Changing content format

If your REST API interacts with another data type than JSON, such as XML, you
can configure this behavior as a default on your adapter:

```typescript
import { makeRestAdapter } from '@foscia/rest';
import { objectToXML, objectFromXML } from 'some-xml-library';

makeRestAdapter({
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
inside a `data` property), you can add
[`extractData`](/docs/api/@foscia/rest/interfaces/RestDeserializerConfig#extractdata) option which will extract
records data using the given transformation function.

```typescript
import { makeRestDeserializer } from '@foscia/rest';

makeRestDeserializer({
  extractData: (data: { data: any }) => ({ records: data.data }),
});
```

When your server change the serialization key of results depending on the
requested model (such as in [dummyJSON free API](https://dummyjson.com/)
used by Foscia examples), you can also provide more customized behavior:

```typescript
import { guessContextModel, consumeModel, consumeRelation } from '@foscia/core';
import { makeRestDeserializer } from '@foscia/rest';

makeRestDeserializer({
  extractData: async (data: any, context) => {
    // Detect targeted model with context.
    const model = await guessContextModel({
      model: consumeModel(context, null),
      relation: consumeRelation(context, null),
    });

    return { records: (model ? data[model.$type] : undefined) ?? data };
  },
});
```

In the example above, Foscia will try to identify the model targeted by the
current context. When a model is identified, it will search for the model's type
in the response body. Otherwise, it will use the whole responses body.

This behavior can also be easily implemented when
[nesting serialized data](#nesting-serialized-data).

### Nesting serialized data

If your REST API document expect record data to be nested (not at root, such as
inside a `data` property), you can add
[`createData`](/docs/api/@foscia/rest/interfaces/RestSerializerConfig#createdata)
option which will wrap
records data using the given transformation function.

```typescript
import { makeRestSerializer } from '@foscia/rest';

makeRestSerializer({
  createData: (records, context) => ({ data: records }),
});
```

### Changing endpoint case

By default, JSON:API use kebab case for models and relations endpoints (e.g.
`favorite-posts` for a `favoritePosts` relation). If you want to use another
case for endpoints, you can use
[`modelPathTransformer`](/docs/api/@foscia/rest/interfaces/RestAdapterConfig#modelpathtransformer)
and
[`relationPathTransformer`](/docs/api/@foscia/rest/interfaces/RestAdapterConfig#relationpathtransformer)
options.

```typescript
import { camelCase } from 'lodash-es';
import { makeRestAdapter } from '@foscia/rest';

makeRestAdapter({
  modelPathTransformer: (path) => camelCase(path),
  relationPathTransformer: (path) => camelCase(path),
});
```

### Changing serialization keys case

By default, serialized and deserialized attributes and relations keep keys
specified in the model. If you are using camel cased keys (e.g. `firstName`)
but want to exchange kebab cased keys (e.g. `first-name`) with your API,
you can use
[`serializeKey`](/docs/api/@foscia/rest/interfaces/RestSerializerConfig#serializekey)
and [`deserializeKey`](/docs/api/@foscia/rest/interfaces/RestDeserializerConfig#deserializekey)
options.

```typescript
import { kebabCase } from 'lodash-es';
import { makeRestSerializer, makeRestDeserializer } from '@foscia/rest';

makeRestSerializer({
  serializeKey: ({ key }) => kebabCase(key),
});

makeRestDeserializer({
  deserializeKey: ({ key }) => kebabCase(key),
});
```

:::tip

You can also change the key serialization globally using model's
[`guessAlias`](/docs/digging-deeper/models/models-configuration#guessalias)
configuration option.

:::

### Customizing relation serialized data

By default, REST implementation will only serialize the related IDs as the
serialized relation's data. You can customize this behavior using
[`serializeRelation`](/docs/api/@foscia/rest/interfaces/RestSerializerConfig#serializerelation)
option, which will provide the related instance snapshot.

#### Supporting polymorphism

Here is an example which will serialize ID and type to support polymorphic
relations:

```typescript
import { makeRestSerializer } from '@foscia/rest';

makeRestSerializer({
  serializeRelation: (_, related) => ({
    type: related.$instance.$model.$type,
    id: related.$values.id,
  }),
});
```

:::info

Be aware that the serializer is using instance snapshots (not instances), this
is why we are accessing the `id` property inside a `related.$values` object
instead of directly on the `related` object.
This allows locking the values during an action execution process.

:::

#### Deeply serializing instances

Here is another example where we serialize the whole related record. Since
related instances' snapshots are limited and only contain ID by default,
you must disable [`limitedSnapshots`](/docs/digging-deeper/models/models-configuration#limitedsnapshots)
to make it work.

```typescript
import { makeRestSerializer } from '@foscia/rest';

makeRestSerializer({
  serializeRelation: ({ context, serializer }, related, parents) => serializer
    .serializeInstance(related, context, parents)
});
```

:::tip

If you want to customize relations serialization behavior when writing
relations (e.g. using
[`attach`](/docs/api/@foscia/core/functions/attach),
[`associate`](/docs/api/@foscia/core/functions/associate), etc.), you can use the
[`serializeRelated`](/docs/api/@foscia/rest/interfaces/RestSerializerConfig#serializerelated)
option which have the same signature.

:::

### Parsing URL IDs

Some API implementation may serialize records IDs as the record endpoint's URL
(such as `https://example.com/api/posts/1` for post `1`). You can customize
the deserializer to support ID and type extraction from URL ID using
[`extractId`](/docs/api/@foscia/rest/interfaces/RestDeserializerConfig#extractid)
and [`extractType`](/docs/api/@foscia/rest/interfaces/RestDeserializerConfig#extracttype)
options.

```typescript
import { makeRestDeserializer } from '@foscia/rest';

makeRestDeserializer({
  // This will support IDs like `https://example.com/api/posts/1`, `/api/posts/1`, etc.
  extractId: (record) => String(record.id).split('/').reverse()[0],
  extractType: (record) => String(record.id).split('/').reverse()[1],
});
```

## Reference

- [Implementation and configuration guide](/docs/digging-deeper/implementations/rest)
