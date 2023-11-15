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
<a href="https://stackblitz.com/edit/foscia?file=playground.ts">
  Playground
</a>
</p>

## @foscia/http

HTTP adapter implementation for [Foscia](https://foscia.dev) actions.

## Usage

This package provides factories to create an HTTP client action factory.

```typescript
import { makeActionFactory } from '@foscia/core';
import { makeHttpAdapter } from '@foscia/http';

export default makeActionFactory({
  ...makeHttpAdapter({
    baseURL: '/api',
  }),
});
```

## License

`foscia` is an open-sourced software licensed under the
[MIT license](LICENSE).
