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

- [Adapter](#adapter)
- [Deserializer](#deserializer)
- [Serializer](#serializer)
- [Cache](#cache)
- [Registry](#registry)

## Interfaces

### Adapter

Adapter create the exchange between your actions' built context and your data
source. As an example, it will _translate_ the context to an HTTP request when
using JSON:API or REST implementations.

```typescript
/**
 * Adapter response data wrapper object.
 *
 * @typeParam RawData Adapter's original response its implementation
 * (e.g. a Response object for HTTP adapter using fetch).
 * @typeParam Data Content of the adapter's original response.
 */
export interface AdapterResponseI<RawData, Data = unknown> {
  /**
   * The raw original data (e.g. a Response object for HttpAdapter).
   */
  readonly raw: RawData;

  /**
   * Read the original response data.
   * This will be used to deserialize instances from data.
   * This method may not support to be called multiple times,
   * prefer calling it only once and reusing returned value.
   */
  read(): Promise<Data>;
}

/**
 * Adapter interacting with the data source.
 *
 * @typeParam RawData Adapter's original response its implementation
 * (e.g. a Response object for HTTP adapter using fetch).
 * @typeParam Data Content of the adapter's original response.
 */
export interface AdapterI<RawData, Data = any> {
  /**
   * Execute a given context to retrieve a raw data response.
   * Context data will already be serialized using serializer if available.
   *
   * @param context
   */
  execute(context: {}): Awaitable<AdapterResponseI<RawData, Data>>;
}
```

### Deserializer

Deserializer will deserialize records to instances. It might use the cache and
registry internally.

```typescript
/**
 * Base deserialized data which must contain at least an instances set.
 */
export interface DeserializedData<I extends ModelInstance = ModelInstance> {
  instances: I[];
}

/**
 * Deserializer converting adapter data to a deserialized set of instances.
 *
 * @typeParam Data Content of the adapter's original response.
 * @typeParam Deserialized Object containing deserialized instances and other
 * relevant deserialized data (e.g. the document for a JSON:API response).
 */
export interface DeserializerI<Data, Deserialized extends DeserializedData = DeserializedData> {
  /**
   * Deserialize adapter data to a deserialized set of instances.
   *
   * @param data
   * @param context
   */
  deserialize(data: Data, context: {}): Awaitable<Deserialized>;
}
```

### Serializer

Serializer will serialize instances to the data source format.

```typescript
/**
 * Serializer converting model instances to adapter data source format.
 *
 * @typeParam Record Serialized value for an instance.
 * @typeParam Related Serialized value for a related instance.
 * @typeParam Data Serialized value for one/many/none instances.
 */
export interface SerializerI<Record, Related, Data> {
  /**
   * Serialize a given instance.
   *
   * @param instance
   * @param context
   */
  serializeInstance(instance: ModelInstance, context: {}): Awaitable<Record>;

  /**
   * Serialize a given instance's relation.
   *
   * @param instance
   * @param def
   * @param context
   */
  serializeRelation(
    instance: ModelInstance,
    def: ModelRelation,
    context: {},
  ): Awaitable<Arrayable<Related> | null>;

  /**
   * Serialize a set of already serialized records.
   * This can be used to "wrap" records.
   *
   * @param records
   * @param context
   */
  serialize(records: Arrayable<Record | Related> | null, context: {}): Awaitable<Data>;
}
```

### Cache

Cache will store already fetched models instances. It will avoid multiple
instances of the same record coexisting and allows you to retrieve already
fetched record without making further requests to your data source.

```typescript
/**
 * Cache containing already synced models instances.
 */
export interface CacheI {
  /**
   * Retrieve a model instance from cache.
   *
   * @param type
   * @param id
   */
  find(type: string, id: ModelIdType): Promise<ModelInstance | null>;

  /**
   * Put a model instance inside cache.
   *
   * @param type
   * @param id
   * @param instance
   */
  put(type: string, id: ModelIdType, instance: ModelInstance): Promise<void>;

  /**
   * Forget a model's instance.
   *
   * @param type
   * @param id
   */
  forget(type: string, id: ModelIdType): Promise<void>;

  /**
   * Forget all model's instances.
   *
   * @param type
   */
  forgetAll(type: string): Promise<void>;

  /**
   * Forget all models' instances.
   */
  clear(): Promise<void>;
}
```

### Registry

Registry is a map of types and associated model. It is used by deserializer to
identify which models should map to which types.

```typescript
/**
 * Registry containing available models for actions.
 */
export interface RegistryI {
  /**
   * Resolve a registered model by its type.
   * Type may be normalized for easier resolve.
   *
   * @param rawType
   */
  modelFor(rawType: string): Promise<Model | null>;
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

- [Adapter through `makeHttpAdapter`](/docs/digging-deeper/implementations/http#makehttpadapter)

### JSON:API

`@foscia/jsonapi` provides implementations of `AdapterI`, `SerializerI` and
`DeserializerI` to interact with JSON:API data sources.

- [Adapter through `makeJsonApiAdapter`](/docs/digging-deeper/implementations/jsonapi#makejsonapiadapter)
- [Serializer through `makeJsonApiSerializer`](/docs/digging-deeper/implementations/jsonapi#makejsonapiserializer)
- [Deserializer through `makeJsonApiDeserializer`](/docs/digging-deeper/implementations/jsonapi#makejsonapideserializer)

### REST

`@foscia/rest` provides implementations of `AdapterI`, `SerializerI` and
`DeserializerI` to interact with JSON REST HTTP data sources.

- [Adapter through `makeJsonRestAdapter`](/docs/digging-deeper/implementations/rest#makejsonrestadapter)
- [Serializer through `makeJsonRestSerializer`](/docs/digging-deeper/implementations/rest#makejsonrestserializer)
- [Deserializer through `makeJsonRestDeserializer`](/docs/digging-deeper/implementations/rest#makejsonrestdeserializer)

### Serialization

`@foscia/serialization` provides partial implementations of `SerializerI` and
`DeserializerI` to transform model instances to/from record generic values.

- [Serializer through `makeSerializerWith`](/docs/digging-deeper/implementations/serialization#makeserializerwith)
- [Deserializer through `makeDeserializerWith`](/docs/digging-deeper/implementations/serialization#makedeserializerwith)
