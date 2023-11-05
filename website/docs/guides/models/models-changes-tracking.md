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

## Taking a snapshot

You can take a snapshot of an instance at any time using `takeSnapshot`. This is
done automatically every time you send/fetch an instance to/form your data
source, and the created snapshot is saved into the `$original` properties of
your instance.

```typescript
import { takeSnapshot } from '@foscia/core';

const myPostSnapshot = takeSnapshot(myPost);
```

## Checking for changes

To check for changes between two snapshots, you can use `compareSnapshots`. To
check for changes between an instance and its original snapshot, you can use
`changed` (this will automatically take a new snapshot and compare against it).

```typescript
import { changed, compareSnapshots, takeSnapshot } from '@foscia/core';

// True if any properties changed or instance does exists now.
changed(myPost);
// False in the same case as above.
compareSnapshots(takeSnapshot(myPost), myPost.$original);

// True only if title has changed.
changed(myPost, ['title']);
// False in the same case as above.
compareSnapshots(takeSnapshot(myPost), myPost.$original, ['title']);
```

## Syncing changes

You can mark your instance as synced any time using `markSynced`. Just like
other helper functions, you can affect only specific properties.

```typescript
import { markSynced } from '@foscia/core';

// Mark all properties synced in $original snapshot.
markSynced(myPost);
// Mark the title synced on $original snapshot.
markSynced(myPost, ['title']);
```

## Restoring changes

You can restore a snapshot on your model as synced any time using `restore` and
`restoreSnapshot`. Just like other helper functions, you can affect only
specific properties.

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
