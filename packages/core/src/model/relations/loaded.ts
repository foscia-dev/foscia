import isInstance from '@foscia/core/model/checks/isInstance';
import { ModelInstance, ModelRelationDotKey } from '@foscia/core/model/types';
import { ArrayableVariadic, isNone, wrapVariadic } from '@foscia/shared';

export default function loaded<I extends ModelInstance>(
  instance: I,
  ...relations: ArrayableVariadic<ModelRelationDotKey<I>>
): boolean {
  return wrapVariadic(...relations).every((dotKey) => {
    const [currentKey, ...subKeys] = dotKey.split('.');
    if (!instance.$loaded[currentKey]) {
      return false;
    }

    const subDotKey = subKeys.join('.');
    if (isNone(subDotKey)) {
      return true;
    }

    const related = instance[currentKey];
    if (Array.isArray(related)) {
      return related.every((r) => loaded<ModelInstance>(r, subDotKey));
    }

    if (isInstance(related)) {
      return loaded<ModelInstance>(related, subDotKey);
    }

    return true;
  });
}
