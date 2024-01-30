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
