<p align="center">
  <a href="https://foscia.netlify.app">
    <img width="180" src="https://foscia.netlify.app/img/icon.svg" alt="">
  </a>
</p>

<p align="center">
<a href="https://foscia.netlify.app">
  Website
</a>
•
<a href="https://foscia.netlify.app/docs/getting-started">
  Documentation
</a>
•
<a href="https://stackblitz.com/edit/foscia?file=playground.ts">
  Playground
</a>
</p>

## @foscia/rest

REST implementation for [Foscia](https://foscia.netlify.app) actions.

## Usage

This package provides factories to create a JSON REST API action factory.

```typescript
import { makeActionFactory } from '@foscia/core';
import { makeJsonRestAdapter, makeJsonRestDeserializer, makeJsonRestSerializer } from '@foscia/rest';

export default makeActionFactory({
  ...makeJsonRestDeserializer(),
  ...makeJsonRestSerializer(),
  ...makeJsonRestAdapter({
    baseURL: '/api',
  }),
});
```

## License

`foscia` is an open-sourced software licensed under the
[MIT license](LICENSE).
