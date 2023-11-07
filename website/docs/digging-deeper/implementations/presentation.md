---
sidebar_position: 1
description: Quick introduction on available implementations for Foscia.
---

# Presentation

## Introduction

Foscia actions might require one or many dependencies to work. Dependencies are
implementations of interfaces which are used in multiple parts of the actions
process.

There are 5 kinds of dependency:

- [Registry](#registry)
- [Serializer](#serializer)
- [Deserializer](#deserializer)
- [Adapter](#adapter)
- [Cache](#cache)

## Interfaces

### Registry

Registry is a map of types and associated model. It is used by deserializer to
identify which models should map to which types.

```typescript
type RegistryI = {
  modelFor(rawType: string): Promise<Model | null>;
};
```

### Serializer

Serializer will serialize instances to the data source format.

```typescript
type SerializerI<Data> = {
  serialize(instance: ModelInstance, context: {}): Awaitable<Data>;
};
```

### Deserializer

Deserializer will deserialize records to instances. It might use the cache and
registry internally.

```typescript
type DeserializedData<I extends ModelInstance = ModelInstance> = {
  instances: I[];
};

type DeserializerI<AdapterData, Data extends DeserializedData> = {
  deserialize(data: AdapterData, context: {}): Awaitable<Data>;
};
```

### Adapter

Adapter create the exchange between your actions' built context and your data
source. As an example, it will _translate_ the context to an HTTP request when
using JSON:API or REST implementations.

```typescript
type AdapterI<Data> = {
  execute(context: {}): Awaitable<Data>;
  isNotFound(error: unknown): Awaitable<boolean>;
};
```

### Cache

Cache will store already fetched models instances. It will avoid multiple
instances of the same record coexisting and allows you to retrieve already
fetched record without making further requests to your data source.

```typescript
type CacheI = {
  find(type: string, id: ModelIdType): Promise<ModelInstance | null>;
  put(type: string, id: ModelIdType, instance: ModelInstance): Promise<void>;
  forget(type: string, id: ModelIdType): Promise<void>;
  forgetAll(type: string): Promise<void>;
  clear(): Promise<void>;
};
```

## Implementations

### Core

`@foscia/core` provides implementations for `Cache` and `Registry`. Those
implementations may be used for any Foscia usage (JSON:API, REST, etc.).

- [Registry through `MapRegistry`](/docs/digging-deeper/implementations/core#mapregistry)
- [Cache through `RefsCache`](/docs/digging-deeper/implementations/core#refscache)

### HTTP

`@foscia/http` provides implementation of `Adapter` to interact with HTTP data
sources.

- [Adapter through `HttpAdapter`](/docs/digging-deeper/implementations/http#httpadapter)

### Object

`@foscia/object` provides abstract implementations of `Serializer` and
`Deserializer` to transform model instances to/from JavaScript literal objects.

- [Serializer through `ObjectSerializer`](/docs/digging-deeper/implementations/object#objectserializer)
- [Deserializer through `ObjectDeserializer`](/docs/digging-deeper/implementations/object#objectdeserializer)

### JSON:API

`@foscia/jsonapi` provides implementations of `Adapter`, `Serializer` and
`Deserializer` to interact with JSON:API HTTP data sources.

- [Adapter through `JsonApiAdapter`](/docs/digging-deeper/implementations/jsonapi#jsonapiadapter)
- [Serializer through `JsonApiSerializer`](/docs/digging-deeper/implementations/jsonapi#jsonapiserializer)
- [Deserializer through `JsonApiDeserializer`](/docs/digging-deeper/implementations/jsonapi#jsonapideserializer)

### REST

`@foscia/rest` provides implementations of `Adapter`, `Serializer` and
`Deserializer` to interact with JSON REST HTTP data sources.

- [Adapter through `RestAdapter`](/docs/digging-deeper/implementations/rest#restadapter)
- [Serializer through `RestSerializer`](/docs/digging-deeper/implementations/rest#restserializer)
- [Deserializer through `RestDeserializer`](/docs/digging-deeper/implementations/rest#restdeserializer)
