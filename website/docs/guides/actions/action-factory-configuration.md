---
sidebar_position: 40
description: Making your own action factory.
---

# Configuring action factory

:::tip What you'll learn

- Configuring your action factory dependencies

:::

You may need to configure your action factory implementation and dependencies to
match your data source needs.

You can customize the dependencies when
[using a blueprint action factory](/docs/getting-started#with-blueprints) or
when using a
[custom action factory](/docs/guides/actions/custom-action-factory).

In this guide, we will see how to customize dependencies configuration through
the REST blueprint action factory as an example. For this, each configurable
dependency have a `configure` method which will allow you to configure the
dependency.

```typescript title="action.js"
import { makeJsonRest } from '@foscia/jsonapi';
import Post from './models/post';

const { cache, registry, adapter, deserializer, serializer, action } =
  makeJsonRest({
    // Configure using action factory blueprint.
    models: [Post],
    http: {
      baseURL: 'https://example.com/api/v1',
    },
  });

// Configure over each dependency:
cache.configure({
  /* Cache configuration. */
});
adapter.configure({
  /* Adapter configuration. */
});
deserializer.configure({
  /* Deserializer configuration. */
});
serializer.configure({
  /* Serializer configuration. */
});

export default action;
```

:::info

To know which configuration options are available in a `configuration` method,
you should check out the method signature or
[**the dedicated implementations guides**](/docs/category/implementations).

:::
