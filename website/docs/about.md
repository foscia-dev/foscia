---
sidebar_position: 0
---

# About

## What is Foscia?

_Type safe, modular and intuitive API/data client._

**Foscia** is a simple, framework-agnostic, API/data client built with
functional programming in mind. It can integrate with any app using JavaScript
or TypeScript, and with any data source.

-   Modular, highly extensible and fully tree-shakable thanks to functional
    programming
-   Ready to use functions to integrate with any
    [JSON:API](https://jsonapi.org/) and JSON REST backends
-   Type safe with generics typings on models, actions, etc.
-   Framework-agnostic and dependency free (HTTP adapters are based on
    [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API))
-   Free and open-source under
    [MIT license](https://opensource.org/licenses/MIT)
-   _Coming soon:_ Fully tested and documented

:::info

Foscia v0.1.0 just released!
[**Please fill an issue to give your feedback.**](https://github.com/foscia-dev/foscia/issues)

:::

## Starting point

You may start to discover Foscia from different point of view.

-   [Install](/docs/installation) the package to use it immediately
-   [Get started](/docs/getting-started) using our simple guide about
    interacting with a JSON:API or REST API
-   [Live test through the Playground](https://stackblitz.com/edit/foscia?file=playground.ts)
    using a fake JSON REST API
-   [Check out examples](/docs/category/examples) built with Foscia to know if
    the API fits your needs

## Available packages

-   [`@foscia/core`](/docs/reference/api/modules/foscia_core): core features of
    Foscia (models, actions, hooks, etc.)
-   [`@foscia/http`](/docs/reference/api/modules/foscia_http): abstract HTTP
    adapter implementation
-   [`@foscia/object`](/docs/reference/api/modules/foscia_object): abstract raw
    objects (de)serializer implementations
-   [`@foscia/jsonapi`](/docs/reference/api/modules/foscia_jsonapi):
    [JSON:API](https://jsonapi.org) implementation
-   [`@foscia/rest`](/docs/reference/api/modules/foscia_rest): REST
    implementation
-   [`@foscia/test`](/docs/reference/api/modules/foscia_test): Test utilities
