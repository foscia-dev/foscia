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

- [`Adapter`](/docs/api/@foscia/core/interfaces/Adapter)
  create the exchange between your actions' built context and your data
  source. As an example, it will _translate_ the context to an HTTP request when
  using JSON:API or REST implementations.
- [`Deserializer`](/docs/api/@foscia/core/interfaces/Deserializer)
  will deserialize records to instances. It might use the cache and
  registry internally.
- [`Serializer`](/docs/api/@foscia/core/interfaces/Serializer)
  will serialize instances' snapshots to the data source format.
- [`InstancesCache`](/docs/api/@foscia/core/interfaces/InstancesCache)
  will store already fetched models instances. It will avoid multiple
  instances of the same record coexisting and allows you to retrieve already
  fetched record without making further requests to your data source.
- [`ModelsRegistry`](/docs/api/@foscia/core/interfaces/ModelsRegistry)
  is a map of types and associated model. It is used by deserializer to
  identify which models should map to which types.

## Implementations

### Core

`@foscia/core` provides implementations for `InstancesCache` and `ModelsRegistry`. Those
implementations may be used for any Foscia usage (JSON:API, REST, etc.).

- [Cache through `makeCache`](/docs/digging-deeper/implementations/core#makecache)
- [Cache through `makeRefsCache`](/docs/digging-deeper/implementations/core#makerefscache)
- [Registry through `makeRegistry`](/docs/digging-deeper/implementations/core#makeregistry)
- [Registry through `makeMapRegistry`](/docs/digging-deeper/implementations/core#makemapregistry)

### HTTP

`@foscia/http` provides implementation of `Adapter` to interact with HTTP data
sources.

- [Adapter through `makeHttpAdapter`](/docs/digging-deeper/implementations/http#makehttpadapter)

### JSON:API

`@foscia/jsonapi` provides implementations of `Adapter`, `Serializer` and
`Deserializer` to interact with JSON:API data sources.

- [Adapter through `makeJsonApiAdapter`](/docs/digging-deeper/implementations/jsonapi#makejsonapiadapter)
- [Deserializer through `makeJsonApiDeserializer`](/docs/digging-deeper/implementations/jsonapi#makejsonapideserializer)
- [Serializer through `makeJsonApiSerializer`](/docs/digging-deeper/implementations/jsonapi#makejsonapiserializer)

### REST

`@foscia/rest` provides implementations of `Adapter`, `Serializer` and
`Deserializer` to interact with JSON REST HTTP data sources.

- [Adapter through `makeRestAdapter`](/docs/digging-deeper/implementations/rest#makerestadapter)
- [Deserializer through `makeRestDeserializer`](/docs/digging-deeper/implementations/rest#makerestdeserializer)
- [Serializer through `makeRestSerializer`](/docs/digging-deeper/implementations/rest#makerestserializer)

### Serialization

`@foscia/serialization` provides partial implementations of `Serializer` and
`Deserializer` to transform model instances to/from record generic records.

- [Deserializer through `makeDeserializer`](/docs/digging-deeper/implementations/serialization#makedeserializer)
- [Serializer through `makeSerializer`](/docs/digging-deeper/implementations/serialization#makeserializer)
