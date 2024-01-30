<p align="center">
  <a href="https://foscia.dev">
    <img width="180" src="https://foscia.dev/img/icon.svg" alt="">
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
•
<a href="https://codesandbox.io/p/sandbox/boring-hoover-9n3ylg?file=%2Fsrc%2Fplayground.ts%3A11%2C42">
  Playground
</a>
</p>

## @foscia/jsonapi

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

`foscia` is an open-sourced software licensed under the
[MIT license](LICENSE).
