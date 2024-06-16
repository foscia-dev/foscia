<p align="center">
  <a href="https://foscia.dev">
    <img width="250" src="https://foscia.dev/img/logo.svg" alt="Foscia">
  </a>
</p>

<p align="center">
<a href="https://foscia.dev">
  Website
</a>
•
<a href="https://foscia.dev/docs/getting-started">
  Documentation
</a>
</p>

# @foscia/jsonapi

JSON:API implementation for [Foscia](https://foscia.dev) actions.

## Usage

This package provides factories to create a JSON:API action factory.

```typescript
import { makeActionFactory } from '@foscia/core';
import { makeJsonApiAdapter, makeJsonApiDeserializer, makeJsonApiSerializer } from '@foscia/jsonapi';

export default makeActionFactory({
  ...makeJsonApiDeserializer(),
  ...makeJsonApiSerializer(),
  ...makeJsonApiAdapter({
    baseURL: '/api/v1',
  }),
});
```

## License

`@foscia/jsonapi` is an open-sourced software licensed under the MIT license.
