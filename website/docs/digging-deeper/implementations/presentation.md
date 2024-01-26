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
interface RegistryI {
  modelFor(rawType: string): Promise<Model | null>;
}
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

type DeserializerI<Data extends DeserializedData> = {
  deserialize(data: any, context: {}): Awaitable<Data>;
};
```

### Adapter

Adapter create the exchange between your actions' built context and your data
source. As an example, it will _translate_ the context to an HTTP request when
using JSON:API or REST implementations.

```typescript
type AdapterResponseI<RawData, Data = any> = {
  raw: RawData;
  read: () => Promise<Data>;
};

type AdapterI<RawData> = {
  execute(context: {}): Awaitable<AdapterResponseI<RawData>>;
};
```

### Cache

Cache will store already fetched models instances. It will avoid multiple
instances of the same record coexisting and allows you to retrieve already
fetched record without making further requests to your data source.

```typescript
interface CacheI {
  find(type: string, id: ModelIdType): Promise<ModelInstance | null>;
  put(type: string, id: ModelIdType, instance: ModelInstance): Promise<void>;
  forget(type: string, id: ModelIdType): Promise<void>;
  forgetAll(type: string): Promise<void>;
  clear(): Promise<void>;
}
```

## Implementations

### Core

`@foscia/core` provides implementations for `CacheI` and `RegistryI`. Those
implementations may be used for any Foscia usage (JSON:API, REST, etc.).

- [Registry through `makeMapRegistryWith`](/docs/digging-deeper/implementations/core#makemapregistrywith)
- [Cache through `makeRefsCacheWith`](/docs/digging-deeper/implementations/core#makerefscachewith)

### HTTP

`@foscia/http` provides implementation of `AdapterI` to interact with HTTP data
sources.

- [Adapter through `makeHttpAdapter`](/docs/digging-deeper/implementations/http#makeHttpAdapter)

### Object

`@foscia/object` provides abstract implementations of `SerializerI` and
`DeserializerI` to transform model instances to/from JavaScript literal objects.

- [Serializer through `ObjectSerializer`](/docs/digging-deeper/implementations/object#objectserializer)
- [Deserializer through `ObjectDeserializer`](/docs/digging-deeper/implementations/object#objectdeserializer)

### JSON:API

`@foscia/jsonapi` provides implementations of `AdapterI`, `SerializerI` and
`DeserializerI` to interact with JSON:API data sources.

- [Adapter through `makeJsonApiAdapter`](/docs/digging-deeper/implementations/jsonapi#makejsonapiadapter)
- [Serializer through `JsonApiSerializer`](/docs/digging-deeper/implementations/jsonapi#jsonapiserializer)
- [Deserializer through `JsonApiDeserializer`](/docs/digging-deeper/implementations/jsonapi#jsonapideserializer)

### REST

`@foscia/rest` provides implementations of `AdapterI`, `SerializerI` and
`DeserializerI` to interact with JSON REST HTTP data sources.

- [Adapter through `makeJsonRestAdapter`](/docs/digging-deeper/implementations/rest#makejsonrestadapter)
- [Serializer through `RestSerializer`](/docs/digging-deeper/implementations/rest#restserializer)
- [Deserializer through `RestDeserializer`](/docs/digging-deeper/implementations/rest#restdeserializer)
