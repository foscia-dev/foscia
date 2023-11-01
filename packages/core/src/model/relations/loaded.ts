import logger from '@foscia/core/logger/logger';
import isInstance from '@foscia/core/model/checks/isInstance';
import isRelationDef from '@foscia/core/model/checks/isRelationDef';
import { ModelInstance, ModelRelationDotKey } from '@foscia/core/model/types';
import { ArrayableVariadic, isNone, wrapVariadic } from '@foscia/shared';

export default function loaded<I extends ModelInstance>(
  instance: I,
  ...relations: ArrayableVariadic<ModelRelationDotKey<I>>
): boolean {
  return wrapVariadic(...relations).every((dotKey) => {
    const [currentKey, ...subKeys] = dotKey.split('.');
    const def = instance.$model.$schema[currentKey];
    if (!isRelationDef(def)) {
      logger.warn(
        `Checking loaded state of non-relation \`${instance.$model.$type}.${currentKey}\`. Either this is not a relation or relation is not declared.`,
      );

      return false;
    }

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
