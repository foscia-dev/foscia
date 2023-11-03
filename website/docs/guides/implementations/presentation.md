---
sidebar_position: 1
description: Quick introduction on available implementations for Foscia.
---

# Presentation

## Introduction

Foscia actions might require one or many dependencies to work:

-   **Cache** will store already fetched models instances. It will avoid
    multiple instances of the same record coexisting and allows you to retrieve
    already fetched record without making further requests to your data source.
-   **Registry** is a map of types and associated model. It is used by
    deserializer to identify which models should map to which types.
-   **Serializer** will serialize instances to the data source format.
-   **Deserializer** will deserialize records to instances. It might use the
    cache and registry internally.
-   **Adapter** create the exchange between your actions' built context and your
    data source. As an example, it will _translate_ the context to an HTTP
    request when using JSON:API or REST implementations.

Some dependencies have a common implementation through the core and some may
have a specific implementation (HTTP, JSON:API, etc.).

## Core implementation

Foscia propose core implementation for the `Cache` and `Registry` actions'
dependencies. Both classes are available through `@foscia/core` namespace.

Those dependencies may be used with any implementations.

-   [Cache through `RefsCache`](/docs/guides/implementations/cache)
-   [Registry through `MapRegistry`](/docs/guides/implementations/registry)

## JSON:API implementation

The JSON:API implementation is built on a common base for HTTP interaction and
objects (de)serialization. It is described in depth inside the
[JSON:API implementation guide](/docs/guides/implementations/jsonapi).

## REST implementation

The REST implementation is built on a common base for HTTP interaction and raw
objects (de)serialization. It is described in depth inside the
[REST implementation guide](/docs/guides/implementations/rest).
