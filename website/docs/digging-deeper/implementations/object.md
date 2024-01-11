---
sidebar_position: 40
description:
  Specificities of the "object" implementation and available configuration.
---

# Object

## Introduction

Object implementation provides abstract implementations for serializer and
deserializer dependencies.

## Implementations

### `ObjectDeserializer`

This **abstract** implementation of the deserializer will extract model
instances from a generic adapter data value.

It handles multiple features, such as:

- Deduplicate records by identifier to avoid deserializing the same record
  multiple times.
- Interact with the cache (if configured) to keep only one instance alive for
  one record.
- Resolve model to deserialize record to automatically from context, relations
  and configuration.
- Use model's properties aliases and value transformers.
- Run the models' `retrieved` hook for each deserialized instance.

#### Usage

```typescript
import { ObjectDeserializer } from '@foscia/object';

export default class RestDeserializer extends ObjectDeserializer<
  Record<string, any>
> {
  /* ...your implementation */
}
```

#### Configuration {#objectdeserializer-configuration}

`ObjectDeserializer` provides no configuration options for now.

#### Defined in

[`packages/object/src/objectDeserializer.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/object/src/objectDeserializer.ts)

### `ObjectSerializer`

This **abstract** implementation of the serializer will produce literal object
from a model instance.

- Only serialize instance's value which were changed since last sync.
- Use model's properties aliases and value transformers.

#### Usage

```typescript
import { ObjectSerializer } from '@foscia/object';

export default class RestSerializer extends ObjectSerializer<
  Record<string, any>
> {
  /* ...your implementation */
}
```

#### Configuration {#objectserializer-configuration}

`ObjectSerializer` provides no configuration options for now.

#### Defined in

[`packages/object/src/objectSerializer.ts`](https://github.com/foscia-dev/foscia/blob/main/packages/object/src/objectSerializer.ts)
