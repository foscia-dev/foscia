---
sidebar_position: 900
description: Understand Foscia internal environment and configure the logger.
---

# Environment

:::tip What you'll learn

- How Foscia detects and uses your environment
- How the logger works and how you can configure the behavior

:::

## Environment detection

Foscia tries to detect the current environment it runs in, between production,
development and testing. For this, it relies on the `process.env.NODE_ENV`
variable. When the environment detection fails, it defaults to production.

Environment is currently used in Foscia to known which messages
should be logged.

## Logger

Foscia uses a [`logger`](/docs/api/@foscia/core/variables/logger) object to output
messages to the console. The logger can be used to display many messages,
from action runs debug information to warning about attribute transformation
failure.

The logger allows two kind of configuration: minimum log level and output to
write messages on.

### Configuring minimum log level

You can configure the minimum log level by changing the
[`level`](/docs/api/@foscia/core/variables/logger#level) property
of the logger to any level in `error`, `warn`, `info` and `debug`.

Setting the property to `null` will totally disable logging.

```typescript
import { logger } from '@foscia/core';

logger.level = 'info';
```

:::info

Foscia will automatically define the minimum log level depending on your
environment (`error` in production, `warn` in development and `null` in testing).

:::

### Configuring output

You can also change the output of the logger. Default behavior is to output
messages to the `console`.

```typescript
import { logger } from '@foscia/core';

logger.output = {
  error: (message, ...args) => console.error(message, ...args),
  warn: (message, ...args) => console.warn(message, ...args),
  info: (message, ...args) => console.info(message, ...args),
  debug: (message, ...args) => console.debug(message, ...args),
};
```
