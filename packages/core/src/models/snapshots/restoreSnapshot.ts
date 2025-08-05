/* eslint-disable no-param-reassign */
import FosciaError from '@foscia/core/errors/fosciaError';
import strictOf from '@foscia/core/models/internals/strictOf';
import isSnapshot from '@foscia/core/models/snapshots/isSnapshot';
import markSynced from '@foscia/core/models/snapshots/markSynced';
import { ModelInstance, ModelKey, ModelSnapshot } from '@foscia/core/models/types';
import isRelation from '@foscia/core/relations/checks/isRelation';
import { Arrayable, wrap } from '@foscia/shared';

/**
 * Restore a specific snapshot on instance.
 *
 * @param instance
 * @param snapshot
 * @param only
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { restoreSnapshot } from '@foscia/core';
 *
 * restoreSnapshot(post, veryOldSnapshot, ['title']);
 * ```
 */
export default function restoreSnapshot<I extends ModelInstance>(
  instance: I,
  snapshot: ModelSnapshot<I>,
  only?: Arrayable<ModelKey<I>>,
) {
  const keys = wrap(only);

  if (!keys.length) {
    instance.$exists = snapshot.exists;
    instance.$raw = snapshot.raw;
    instance.$loaded = new Set(snapshot.loaded);
  }

  strictOf(instance).$model.$schema.forEach((prop) => {
    if (keys.length && keys.indexOf(prop.key) === -1) {
      return;
    }

    if (snapshot.values.has(prop.key)) {
      const restoreInstance = (value: unknown) => {
        if (isSnapshot(value)) {
          return value.instance;
        }

        throw new FosciaError('Non-snapshot relation\'s value found in snapshot.');
      };

      const value = snapshot.values.get(prop.key);

      const restoreValue = () => {
        if (value && isRelation(prop)) {
          return Array.isArray(value)
            ? value.map((v) => restoreInstance(v))
            : restoreInstance(value);
        }

        return value;
      };

      prop.set(instance, restoreValue());
    } else {
      prop.unset(instance);
    }
  });

  markSynced(instance, only);

  return instance;
}
