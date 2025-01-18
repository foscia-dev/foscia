---
sidebar_position: 33
description: Tracking models states change (values, etc.).
---

# Tracking models changes

:::tip What you'll learn

- Tracking a model's instance changes
- Creating snapshots of a model's instance
- Restoring snapshots of a model's instance

:::

Foscia will track changes over your instances properties (IDs, attributes or
relations) throughout their existence.

Each time you send/fetch an instance to/from your data source, your instance's
properties will be synced in an "original" snapshot.

This original snapshot allows you to check if some properties have changed since
last synchronization.

:::info

Instance snapshot is a locked state of your record attributes and relations.
By default, related records are only stored inside a limited snapshot.
If you want to deeply store related records snapshots, you can disable
[`limitedSnapshots`](/docs/digging-deeper/models/models-configuration#limitedsnapshots)
on your models.

:::

## Taking a snapshot

You can take a snapshot of an instance at any time using
[`takeSnapshot`](/docs/api/@foscia/core/functions/takeSnapshot). This is
done automatically every time you send/fetch an instance to/form your data
source, and the created snapshot is saved into the
[`$original`](/docs/api/@foscia/core/type-aliases/ModelInstance#original) properties of
your instance.

```typescript
import { takeSnapshot } from '@foscia/core';

const myPostSnapshot = takeSnapshot(myPost);
```

## Checking for changes

To check for changes between two snapshots, you can use
[`isSameSnapshot`](/docs/api/@foscia/core/functions/isSameSnapshot). To
check for changes between an instance and its original snapshot, you can use
[`changed`](/docs/api/@foscia/core/functions/changed)
(this will automatically take a new snapshot and compare against it).

```typescript
import { changed, isSameSnapshot, takeSnapshot } from '@foscia/core';

// True if any properties changed or instance does exists now.
changed(myPost);
// False in the same case as above.
isSameSnapshot(takeSnapshot(myPost), myPost.$original);

// True only if title has changed.
changed(myPost, ['title']);
// False in the same case as above.
isSameSnapshot(takeSnapshot(myPost), myPost.$original, ['title']);
```

## Syncing changes

You can mark your instance as synced any time using
[`markSynced`](/docs/api/@foscia/core/functions/markSynced).
Just like other helper functions, you can affect only specific properties.

```typescript
import { markSynced } from '@foscia/core';

// Mark all properties synced in $original snapshot.
markSynced(myPost);
// Mark the title synced on $original snapshot.
markSynced(myPost, ['title']);
```

## Restoring changes

You can restore a snapshot on your model as synced any time using
[`restore`](/docs/api/@foscia/core/functions/restore) and
[`restoreSnapshot`](/docs/api/@foscia/core/functions/restoreSnapshot).
Just like other helper functions, you can affect only specific properties.

```typescript
import { restore, restoreSnapshot } from '@foscia/core';

// Restore whole state.
restore(myPost);
// Equivalent with `restoreSnapshot`
restoreSnapshot(myPost, myPost.$original);
// Restore title property only.
restore(myPost, ['title']);
// Equivalent with `restoreSnapshot`
restoreSnapshot(myPost, myPost.$original, ['title']);
```
