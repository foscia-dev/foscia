---
sidebar_position: 0
---

# About

:::info

First stable version was released recently!
[**Give your feedback!**](https://github.com/foscia-dev/foscia/issues)

:::

## What is Foscia?

_Type safe, modular and intuitive API/data client._

**Foscia** is a simple, framework-agnostic, API/data client built with
functional programming in mind. It can integrate with any app using JavaScript
or TypeScript, and with any data source.

- Modular, highly extensible and fully tree-shakable thanks to functional
  programming
- Ready to use functions to integrate with any [JSON:API](https://jsonapi.org/)
  and JSON REST backends
- Type safe with generics typings on models, actions, etc.
- Framework-agnostic and dependency free (HTTP adapters are based on
  [`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API))
- Free and open-source under [MIT license](https://opensource.org/licenses/MIT)

## Starting point

You may start to discover Foscia from different point of view.

- [Install](/docs/installation) the package to use it immediately
- [Get started](/docs/getting-started) using our simple guide about interacting
  with a JSON:API or REST API
- [Live test through the Playground](https://stackblitz.com/edit/foscia?file=playground.ts)
  using a fake JSON REST API
- [Check out examples](/docs/category/examples) built with Foscia to know if the
  API fits your needs

## Available packages

- `@foscia/core`: core features of Foscia (models, actions, hooks, etc.)
- `@foscia/http`: HTTP adapter implementation
- `@foscia/jsonapi`: [JSON:API](https://jsonapi.org) implementation
- `@foscia/rest`: REST implementation
- `@foscia/serialization`: data serialization and deserialization
  partial implementation
- `@foscia/test`: testing utilities
