---
sidebar_position: 40
description: Using Foscia to interact with a JSON:API.
---

# REST

:::tip What you'll learn

- Using Foscia to interact with a REST API

:::

## Setup

Please follow the [getting started guide](/docs/getting-started) to set up your
REST action factory.

## Usage

Currently, REST implementations does not support additional features compared to
generic Foscia features.

If your REST API supports eager loading relations, you should
[configure your REST adapter](/docs/digging-deeper/implementations/rest#makejsonrestadapter)
to serialize relationships inclusion in every request.

If you need something specific, you can
[open a new issue on the repository](https://github.com/foscia-dev/foscia/issues/new/choose).

## Reference

- [Implementation and configuration guide](/docs/digging-deeper/implementations/rest)
